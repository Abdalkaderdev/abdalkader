import { useState, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';
import { faqItems } from '@/data/faqData';
import styles from './FAQSection.module.scss';

/**
 * Visible FAQ, rendered from the same `faqItems` source that feeds
 * `faqPageJsonLd()`.
 *
 * This exists for a concrete reason: the homepage was emitting FAQPage
 * structured data for questions that appeared nowhere on the site. Google
 * requires the declared content to be visible on the page, so the schema was
 * describing something that did not exist. Rendering from one shared source is
 * what keeps the two from drifting again.
 *
 * Accordion state is plain React — no animation library needed for a height
 * transition, and the site already carries four of them.
 */
export default function FAQSection() {
    const [activeIndex, setActiveIndex] = useState<number | null>(0);

    const toggle = useCallback((index: number) => {
        setActiveIndex((current) => (current === index ? null : index));
    }, []);

    return (
        <section className={styles.faq} aria-labelledby="faq-heading">
            <div className={styles.container}>
                <h2 id="faq-heading" className={styles.heading}>
                    Questions
                </h2>

                <ul className={styles.list}>
                    {faqItems.map((item, index) => {
                        const isOpen = activeIndex === index;
                        const panelId = `faq-panel-${index}`;
                        const buttonId = `faq-button-${index}`;

                        return (
                            <li
                                key={item.question}
                                className={`${styles.item} ${isOpen ? styles.itemOpen : ''}`}
                            >
                                <h3 className={styles.questionWrap}>
                                    <button
                                        type="button"
                                        id={buttonId}
                                        className={styles.question}
                                        aria-expanded={isOpen}
                                        aria-controls={panelId}
                                        onClick={() => toggle(index)}
                                    >
                                        <span className={styles.questionText}>{item.question}</span>
                                        <ChevronDown
                                            className={styles.chevron}
                                            size={20}
                                            strokeWidth={1.5}
                                            aria-hidden="true"
                                        />
                                    </button>
                                </h3>

                                <div
                                    id={panelId}
                                    role="region"
                                    aria-labelledby={buttonId}
                                    className={styles.panel}
                                    hidden={!isOpen}
                                >
                                    <p className={styles.answer}>{item.answer}</p>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
}
