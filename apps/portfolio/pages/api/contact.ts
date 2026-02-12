import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

type ResponseData = {
    success: boolean;
    message: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email address' });
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

        // Email content
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: 'hello@abdalkader.dev',
            replyTo: email,
            subject: `Portfolio Contact: ${name}`,
            text: `
Name: ${name}
Email: ${email}

Message:
${message}
            `,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #f44e00;">New Contact Form Submission</h2>
                    <hr style="border: 1px solid #eee;">
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                    <hr style="border: 1px solid #eee;">
                    <h3>Message:</h3>
                    <p style="white-space: pre-wrap;">${message}</p>
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
