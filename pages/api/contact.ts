import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

type ContactRequestBody = {
	name?: string;
	email?: string;
	message?: string;
	company?: string; // honeypot
};

type ContactResponse =
	| { success: true; message: string }
	| { success: false; errors: Record<string, string> };

function isValidEmail(email: string): boolean {
	// Basic RFC 5322 compliant-ish email regex for simple validation
	return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ContactResponse>
) {
	if (req.method !== 'POST') {
		res.setHeader('Allow', 'POST');
		return res.status(405).json({ success: false, errors: { form: 'Method not allowed' } });
	}

	const { name, email, message, company } = (req.body || {}) as ContactRequestBody;

	// Honeypot check
	if (company && company.trim() !== '') {
		return res.status(200).json({ success: true, message: 'Thanks!' });
	}

	const errors: Record<string, string> = {};
	if (!name || name.trim().length < 2) {
		errors.name = 'Please enter your full name.';
	}
	if (!email || !isValidEmail(email)) {
		errors.email = 'Please enter a valid email address.';
	}
	if (!message || message.trim().length < 10) {
		errors.message = 'Please enter a message of at least 10 characters.';
	}

	if (Object.keys(errors).length > 0) {
		return res.status(400).json({ success: false, errors });
	}

	try {
		const {
			SMTP_HOST,
			SMTP_PORT,
			SMTP_USER,
			SMTP_PASS,
			CONTACT_TO,
			CONTACT_FROM
		} = process.env as Record<string, string | undefined>;

		if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !CONTACT_TO) {
			return res.status(500).json({ success: false, errors: { form: 'Email service is not configured.' } });
		}

		const transporter = nodemailer.createTransport({
			host: SMTP_HOST,
			port: Number(SMTP_PORT) || 587,
			secure: Number(SMTP_PORT) === 465,
			auth: {
				user: SMTP_USER,
				pass: SMTP_PASS
			}
		});

		const fromAddress = CONTACT_FROM || SMTP_USER;
		const html = `
			<div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;">
				<h2>New Contact Form Submission</h2>
				<p><strong>Name:</strong> ${name}</p>
				<p><strong>Email:</strong> ${email}</p>
				<p><strong>Message:</strong></p>
				<p style="white-space: pre-wrap">${message}</p>
			</div>
		`;

		await transporter.sendMail({
			from: fromAddress as string,
			to: CONTACT_TO,
			subject: `New message from ${name}`,
			replyTo: email,
			text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
			html
		});

		return res.status(200).json({ success: true, message: 'Your message has been sent successfully.' });
	} catch (error) {
		return res.status(500).json({ success: false, errors: { form: 'Failed to send your message. Please try again later.' } });
	}
}

