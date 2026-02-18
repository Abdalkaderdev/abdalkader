import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import DOMPurify from 'isomorphic-dompurify';

type ResponseData = {
    success: boolean;
    message: string;
};

// ============================================
// Rate Limiting (in-memory for Vercel/Next.js)
// For production at scale, consider @upstash/ratelimit
// ============================================
const rateLimitMap = new Map<string, number[]>();

function rateLimit(ip: string): boolean {
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutes
    const maxRequests = 5; // Max 5 requests per 15 minutes

    const requests = rateLimitMap.get(ip) || [];
    const recentRequests = requests.filter((time: number) => now - time < windowMs);

    if (recentRequests.length >= maxRequests) {
        return false; // Rate limited
    }

    recentRequests.push(now);
    rateLimitMap.set(ip, recentRequests);
    return true;
}

// Clean up old entries periodically to prevent memory leaks
setInterval(() => {
    const now = Date.now();
    const windowMs = 15 * 60 * 1000;
    rateLimitMap.forEach((requests, ip) => {
        const recentRequests = requests.filter((time) => now - time < windowMs);
        if (recentRequests.length === 0) {
            rateLimitMap.delete(ip);
        } else {
            rateLimitMap.set(ip, recentRequests);
        }
    });
}, 60 * 1000); // Clean up every minute

// ============================================
// Validation Constants
// ============================================
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254; // RFC 5321
const MAX_MESSAGE_LENGTH = 5000;

// Stricter email regex (RFC 5322 simplified)
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// ============================================
// Helper Functions
// ============================================
function getClientIp(req: NextApiRequest): string {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
        return forwarded.split(',')[0].trim();
    }
    if (Array.isArray(forwarded)) {
        return forwarded[0];
    }
    return req.socket?.remoteAddress || 'unknown';
}

function validateOrigin(req: NextApiRequest): boolean {
    const origin = req.headers.origin;
    const referer = req.headers.referer;

    // Allow requests from the same origin (basic CSRF protection)
    const allowedOrigins = [
        'https://abdalkader.dev',
        'https://www.abdalkader.dev',
        process.env.NEXT_PUBLIC_SITE_URL,
    ].filter(Boolean);

    // In development, allow localhost
    if (process.env.NODE_ENV === 'development') {
        allowedOrigins.push('http://localhost:3000', 'http://localhost:3001');
    }

    if (origin && allowedOrigins.includes(origin)) {
        return true;
    }

    // Check referer as fallback
    if (referer) {
        return allowedOrigins.some(allowed => allowed && referer.startsWith(allowed));
    }

    // If no origin/referer, this might be a server-side request or direct API call
    // For a contact form, we should be strict and require origin
    return false;
}

function escapeHtml(text: string): string {
    const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (char) => map[char]);
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    // ============================================
    // Method Check
    // ============================================
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    // ============================================
    // CSRF Protection - Validate Origin
    // ============================================
    if (!validateOrigin(req)) {
        return res.status(403).json({ success: false, message: 'Forbidden - Invalid origin' });
    }

    // ============================================
    // Rate Limiting
    // ============================================
    const clientIp = getClientIp(req);
    if (!rateLimit(clientIp)) {
        return res.status(429).json({
            success: false,
            message: 'Too many requests. Please try again later.'
        });
    }

    // ============================================
    // Extract and Validate Input
    // ============================================
    const { name, email, message } = req.body;

    // Check required fields
    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Type validation
    if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
        return res.status(400).json({ success: false, message: 'Invalid input types' });
    }

    // Length validation
    if (name.length > MAX_NAME_LENGTH) {
        return res.status(400).json({
            success: false,
            message: `Name must be ${MAX_NAME_LENGTH} characters or less`
        });
    }

    if (email.length > MAX_EMAIL_LENGTH) {
        return res.status(400).json({
            success: false,
            message: 'Invalid email address'
        });
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
        return res.status(400).json({
            success: false,
            message: `Message must be ${MAX_MESSAGE_LENGTH} characters or less`
        });
    }

    // Stricter email validation
    if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email address' });
    }

    // ============================================
    // Input Sanitization
    // ============================================
    const sanitizedName = DOMPurify.sanitize(name.trim());
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedMessage = DOMPurify.sanitize(message.trim());

    // Additional HTML escaping for email content
    const escapedName = escapeHtml(sanitizedName);
    const escapedEmail = escapeHtml(sanitizedEmail);
    const escapedMessage = escapeHtml(sanitizedMessage);

    // Check if sanitization removed all content
    if (!sanitizedName || !sanitizedMessage) {
        return res.status(400).json({ success: false, message: 'Invalid input content' });
    }

    try {
        // Namecheap Private Email SMTP settings
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'mail.privateemail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // Email content with sanitized and escaped values
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: 'hello@abdalkader.dev',
            replyTo: sanitizedEmail,
            subject: `Portfolio Contact: ${sanitizedName}`,
            text: `
Name: ${sanitizedName}
Email: ${sanitizedEmail}

Message:
${sanitizedMessage}

---
IP: ${clientIp}
Sent at: ${new Date().toISOString()}
            `,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #f44e00;">New Contact Form Submission</h2>
                    <hr style="border: 1px solid #eee;">
                    <p><strong>Name:</strong> ${escapedName}</p>
                    <p><strong>Email:</strong> <a href="mailto:${escapedEmail}">${escapedEmail}</a></p>
                    <hr style="border: 1px solid #eee;">
                    <h3>Message:</h3>
                    <p style="white-space: pre-wrap;">${escapedMessage}</p>
                    <hr style="border: 1px solid #eee;">
                    <p style="font-size: 12px; color: #666;">
                        IP: ${escapeHtml(clientIp)}<br>
                        Sent at: ${new Date().toISOString()}
                    </p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error('Email error:', error);
        return res.status(500).json({ success: false, message: 'Failed to send email' });
    }
}
