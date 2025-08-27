import { useEffect, useRef, useState } from 'react';
import styles from './ContactPage.module.scss';
import { splitText } from '@/utils/textUtils';
import { gsap } from '@/libs/gsap';

export default function ContactSection() {
    const bannerHeadingRef = useRef<HTMLDivElement | null>(null);
    const textRef = useRef<HTMLDivElement | null>(null);
    const formRef = useRef<HTMLFormElement | null>(null);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [company, setCompany] = useState(''); // honeypot
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    useEffect(() => {
        const tl = gsap.timeline({ paused: true });

        // Animate the banner heading
        if (bannerHeadingRef.current) {
            const headingSpans = bannerHeadingRef.current.querySelectorAll('span span');
            tl.from(headingSpans, { y: "105%", duration: 0.6, stagger: 0.1 }, 0.4);
        }

        // Animate the text before links
        if (textRef.current) {
            const headingSpans = textRef.current.querySelectorAll('span span');
            tl.from(headingSpans, { y: "115%", duration: 0.6, stagger: 0.001 }, 0.4);
        }

        // Animate form fields one by one using `fromTo`
        if (formRef.current) {
            const fields = formRef.current.querySelectorAll('input, textarea, button');
            if (fields.length) {
                tl.fromTo(
                    fields,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power3.out", delay: "-.9" }
                );
            }
        }

        // Play the animation
        tl.play();

        // Cleanup function to kill the timeline
        return () => {
            tl.kill();
        };
    }, []); // Empty dependency array to run once

    function validate(): boolean {
        const nextErrors: Record<string, string> = {};
        if (!name || name.trim().length < 2) nextErrors.name = 'Please enter your full name.';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        if (!email || !emailRegex.test(email)) nextErrors.email = 'Please enter a valid email address.';
        if (!message || message.trim().length < 10) nextErrors.message = 'Please enter at least 10 characters.';
        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!validate()) return;
        setStatus('submitting');
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message, company })
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                setErrors(data.errors || { form: 'Something went wrong. Please try again.' });
                setStatus('error');
                return;
            }
            setStatus('success');
            setName('');
            setEmail('');
            setMessage('');
            setCompany('');
            setErrors({});
        } catch (err) {
            setStatus('error');
            setErrors({ form: 'Network error. Please try again.' });
        }
    }

    return (
        <>
            <section className={styles.contact}>
                <h1 ref={bannerHeadingRef}>{splitText("Contact")}</h1>
            </section>

            <section className={styles.linkSection}>
                <p ref={textRef}>{splitText("Send me a message")}</p>
                <form ref={formRef} className={styles.form} onSubmit={handleSubmit} noValidate>
                    {/* Honeypot field */}
                    <div className={styles.hiddenField} aria-hidden="true">
                        <label htmlFor="company">Company</label>
                        <input id="company" name="company" autoComplete="off" value={company} onChange={(e) => setCompany(e.target.value)} tabIndex={-1} />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="name">Name</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            aria-invalid={!!errors.name}
                            aria-describedby={errors.name ? 'name-error' : undefined}
                        />
                        {errors.name && <span id="name-error" className={styles.error}>{errors.name}</span>}
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            aria-invalid={!!errors.email}
                            aria-describedby={errors.email ? 'email-error' : undefined}
                        />
                        {errors.email && <span id="email-error" className={styles.error}>{errors.email}</span>}
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            rows={6}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            aria-invalid={!!errors.message}
                            aria-describedby={errors.message ? 'message-error' : undefined}
                        />
                        {errors.message && <span id="message-error" className={styles.error}>{errors.message}</span>}
                    </div>

                    {errors.form && <div className={styles.status} role="alert">{errors.form}</div>}
                    {status === 'success' && <div className={styles.status} role="status">Thanks! Your message has been sent.</div>}

                    <div className={styles.actions}>
                        <button type="submit" className={styles.submitBtn} disabled={status === 'submitting'}>
                            {status === 'submitting' ? 'Sending…' : 'Send message'}
                        </button>
                    </div>
                </form>
            </section>
        </>
    );
}