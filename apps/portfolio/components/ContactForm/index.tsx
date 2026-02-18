import { useState, FormEvent, useId } from 'react';
import styles from './ContactForm.module.scss';

interface ContactFormProps {
    variant?: 'default' | 'compact';
    title?: string;
    showTitle?: boolean;
    className?: string;
}

export default function ContactForm({
    variant = 'default',
    title = "Get in touch",
    showTitle = true,
    className = ''
}: ContactFormProps) {
    const formId = useId();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        // Clear error when user starts typing
        if (error) setError(null);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                setSubmitted(true);
                setFormData({ name: '', email: '', message: '' });
            } else {
                setError(data.message || 'Something went wrong. Please try again.');
            }
        } catch (err) {
            console.error('Form submission error:', err);
            setError('Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const variantClass = variant === 'compact' ? styles.compact : '';

    if (submitted) {
        return (
            <div className={`${styles.contactForm} ${variantClass} ${className}`}>
                <div className={styles.successMessage}>
                    <span className={styles.checkmark}>&#10003;</span>
                    <p>Thanks for reaching out! I&apos;ll get back to you soon.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`${styles.contactForm} ${variantClass} ${className}`}>
            {showTitle && (
                <div className={styles.formHeader}>
                    <h3>{title}</h3>
                </div>
            )}

            {error && (
                <div className={styles.errorMessage} role="alert">
                    <span className={styles.errorIcon}>!</span>
                    <p>{error}</p>
                </div>
            )}

            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formRow}>
                    <div className={styles.inputGroup}>
                        <label htmlFor={`${formId}-name`} className={styles.label}>
                            Name
                        </label>
                        <input
                            type="text"
                            id={`${formId}-name`}
                            name="name"
                            placeholder="Your name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className={styles.input}
                            autoComplete="name"
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor={`${formId}-email`} className={styles.label}>
                            Email
                        </label>
                        <input
                            type="email"
                            id={`${formId}-email`}
                            name="email"
                            placeholder="your@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className={styles.input}
                            autoComplete="email"
                        />
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor={`${formId}-message`} className={styles.label}>
                        Message
                    </label>
                    <textarea
                        id={`${formId}-message`}
                        name="message"
                        placeholder="Tell me about your project or idea..."
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className={styles.textarea}
                    />
                </div>

                <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                    <span className={styles.arrow} aria-hidden="true">&#10148;</span>
                </button>
            </form>
        </div>
    );
}
