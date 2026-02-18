import { useEffect, useRef } from 'react';
import { gsap } from '@/libs/gsap';
import { isReducedMotion } from '@/utils/motion';
import styles from './TestimonialsSection.module.scss';
import Tag from '@/components/Tag';
import GlassCard from '@/components/GlassCard';

// Testimonial data interface
interface Testimonial {
    id: number;
    quote: string;
    authorName: string;
    authorRole: string;
    authorCompany: string;
    avatarInitials: string;
}

// Placeholder testimonial data
const testimonials: Testimonial[] = [
    {
        id: 1,
        quote: "Working with Abdalkader was fantastic. He delivered our AI-powered web application ahead of schedule with exceptional attention to detail. His expertise in both frontend and machine learning is truly impressive.",
        authorName: "Sarah Mitchell",
        authorRole: "Product Manager",
        authorCompany: "TechFlow Solutions",
        avatarInitials: "SM",
    },
    {
        id: 2,
        quote: "Abdalkader transformed our outdated website into a modern, responsive masterpiece. His understanding of user experience and clean code practices made the collaboration seamless and enjoyable.",
        authorName: "Michael Chen",
        authorRole: "CEO",
        authorCompany: "Innovate Labs",
        avatarInitials: "MC",
    },
    {
        id: 3,
        quote: "The AI integration Abdalkader built for our platform exceeded all expectations. He explained complex technical concepts clearly and was always responsive to feedback. Highly recommended!",
        authorName: "Emily Rodriguez",
        authorRole: "Technical Director",
        authorCompany: "DataDriven Inc",
        avatarInitials: "ER",
    },
    {
        id: 4,
        quote: "From concept to deployment, Abdalkader demonstrated exceptional skill and professionalism. Our e-commerce conversion rate increased by 40% after his redesign. A true expert in his craft.",
        authorName: "James Wilson",
        authorRole: "Founder",
        authorCompany: "NextGen Commerce",
        avatarInitials: "JW",
    },
];

export default function TestimonialsSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const taglineRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const cardsRef = useRef<HTMLDivElement[]>([]);

    useEffect(() => {
        // Skip animations for users who prefer reduced motion
        if (isReducedMotion()) {
            return;
        }

        const ctx = gsap.context(() => {
            // Create main timeline
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 70%',
                    once: true,
                },
            });

            // Animate tagline
            if (taglineRef.current) {
                tl.from(taglineRef.current, {
                    y: 30,
                    opacity: 0,
                    duration: 0.6,
                    ease: 'power2.out',
                }, 0);
            }

            // Animate heading
            if (headingRef.current) {
                tl.from(headingRef.current, {
                    y: 40,
                    opacity: 0,
                    duration: 0.7,
                    ease: 'power2.out',
                }, 0.2);
            }

            // Animate testimonial cards with stagger
            if (cardsRef.current.length > 0) {
                tl.from(cardsRef.current, {
                    y: 60,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: 'power2.out',
                }, 0.4);
            }
        });

        return () => ctx.revert();
    }, []);

    return (
        <section
            className={styles.testimonials}
            ref={sectionRef}
            aria-labelledby="testimonials-heading"
        >
            <div className={styles.header}>
                <div ref={taglineRef}>
                    <Tag text="Testimonials" />
                </div>
                <h2 id="testimonials-heading" className={styles.heading} ref={headingRef}>
                    What Clients Say
                </h2>
            </div>

            <div className={styles.grid} role="list">
                {testimonials.map((testimonial, index) => (
                    <GlassCard
                        key={testimonial.id}
                        ref={(el) => {
                            if (el) cardsRef.current[index] = el;
                        }}
                        variant="default"
                        hoverEffect
                        glowOnHover
                        className={styles.card}
                        disableAnimations
                    >
                        {/* Review Schema Microdata */}
                        <div
                            itemScope
                            itemType="https://schema.org/Review"
                            role="listitem"
                        >
                            <meta itemProp="reviewRating" content="5" />
                            <div className={styles.quoteIcon}>
                                <svg
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                </svg>
                            </div>
                            <blockquote className={styles.quote} itemProp="reviewBody">
                                {testimonial.quote}
                            </blockquote>
                            <div
                                className={styles.author}
                                itemProp="author"
                                itemScope
                                itemType="https://schema.org/Person"
                            >
                                <div className={styles.avatar} aria-hidden="true">
                                    {testimonial.avatarInitials}
                                </div>
                                <div className={styles.authorInfo}>
                                    <cite className={styles.authorName} itemProp="name">
                                        {testimonial.authorName}
                                    </cite>
                                    <span className={styles.authorRole}>
                                        <span itemProp="jobTitle">{testimonial.authorRole}</span>
                                        {' at '}
                                        <span
                                            itemProp="worksFor"
                                            itemScope
                                            itemType="https://schema.org/Organization"
                                        >
                                            <span itemProp="name">{testimonial.authorCompany}</span>
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                ))}
            </div>
        </section>
    );
}
