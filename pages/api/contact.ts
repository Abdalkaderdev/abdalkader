import type { NextApiRequest, NextApiResponse } from 'next';

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

	// Here you could integrate with an email service or CRM.
	// For now, respond with success.
	return res.status(200).json({ success: true, message: 'Your message has been sent successfully.' });
}

