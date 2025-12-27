import { useEffect, useRef } from 'react';
import ServiceCard from './card';
import styles from './ServiceSection.module.scss';
import { gsap, ScrollTrigger } from '@/libs/gsap';
import { isReducedMotion } from '@/utils/motion';
import Tag from '@/components/Tag';
import Button from '@/components/Button';
import { splitText } from '@/utils/textUtils';

// Animation and layout constants
const CARD_POSITIONS = [13, 37.7, 62.4, 87];
const CARD_ROTATIONS = [-15, -7.5, 7.5, 15];
const SCROLL_PIN_MULTIPLIER = 3; // totalScrollHeight = window.innerHeight * SCROLL_PIN_MULTIPLIER
const HEADING_START_OFFSET = 0.4; // seconds in the timeline for heading
const TAGLINE_FROM_Y = 50;
const BUTTON_FROM_Y = 50;
const HEADING_STAGGER = 0.01;
const HEADING_FROM_Y = '110%';
const CARD_STAGGER_STEP = 0.05;
const CARD_ANIMATION_SEGMENT = 1 / 3; // third of the scroll progress
const FRONT_ROTATION_DEGREES = -180; // multiplied by animation progress
const BACK_ROTATION_DEGREES = 180; // 180 - 180 * progress

// Define the Service interface
interface Service {
    title: string;
    numbering: string;
    listItems: string[];
}

// Define the services data
const services: Service[] = [
    {
        title: "AI & Machine Learning",
        numbering: "01",
        listItems: ["OpenAI API", "Gemini / Vertex AI", "Amazon Bedrock", "LangChain", "Vector Databases", "LLMOps", "Responsible AI"],
    },
    {
        title: "Frontend Development",
        numbering: "02",
        listItems: ["React", "Next.js", "Three.js", "HTML/CSS/SCSS", "Tailwind CSS", "JavaScript", "Framer"],
    },
    {
        title: "Backend Development",
        numbering: "03",
        listItems: ["Python", "Node.js", "Express.js", "MongoDB", "SQL/MySQL", "REST APIs", "GraphQL"],
    },
    {
        title: "Tools & Platforms",
        numbering: "04",
        listItems: ["AWS Generative AI", "Docker", "Git & GitHub", "Vercel/Netlify", "WordPress", "Shopify", "CMS Systems"],
    },
];

// Define the ServiceSection component
export default function ServiceSection() {
    const container = useRef<HTMLElement>(null);
    const cardRefs = useRef<HTMLDivElement[]>([]);
    const headingRef = useRef<HTMLDivElement | null>(null);
    const taglineRef = useRef<HTMLDivElement | null>(null);
    const btnWrapperRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        // Skip animations for users who prefer reduced motion
        if (isReducedMotion()) {
            return;
        }

        // Heading animation timeline
        const headingTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: `.${styles.services} .${styles.heading}`,
                start: 'top 70%',
            },
        });

        // Tagline animation
        if (taglineRef.current) {
            headingTimeline.from(taglineRef.current, { y: TAGLINE_FROM_Y, opacity: 0, duration: 0.8 }, 0);
        }

        // Heading text animation
        if (headingRef.current) {
            const headingSpans = headingRef.current.querySelectorAll('span span');
            headingTimeline.from(headingSpans, { y: HEADING_FROM_Y, duration: 0.6, stagger: HEADING_STAGGER }, HEADING_START_OFFSET);
        }

        // Button wrapper animation
        if (btnWrapperRef.current) {
            headingTimeline.from(btnWrapperRef.current, { y: BUTTON_FROM_Y, opacity: 0, duration: 0.8 }, 0.8);
        }

        // Cards animations
        const positions = CARD_POSITIONS;
        const rotations = CARD_ROTATIONS;
        const totalScrollHeight = window.innerHeight * SCROLL_PIN_MULTIPLIER;

        const cardTriggers = cardRefs.current.map((card, index) => {
            if (card) {
                // Spread and rotate cards
                gsap.to(card, {
                    left: `${positions[index]}%`,
                    top: '50%',
                    yPercent: -50,
                    rotation: rotations[index],
                    ease: 'none',
                    scrollTrigger: {
                        trigger: container.current,
                        start: 'top top',
                        end: () => `+=${window.innerHeight}`,
                        scrub: 1,
                    },
                });

                // Flip card animation
                const frontEl = card.querySelector('.flipCardFrontA');
                const backEl = card.querySelector('.flipCardBackB');
                if (frontEl && backEl) {
                    const staggerOffset = index * CARD_STAGGER_STEP;
                    const startOffset = CARD_ANIMATION_SEGMENT + staggerOffset;
                    const endOffset = 2 * CARD_ANIMATION_SEGMENT + staggerOffset;

                    return ScrollTrigger.create({
                        trigger: container.current,
                        start: 'top top',
                        end: () => `+=${totalScrollHeight}`,
                        scrub: 1,
                        onUpdate: (self) => {
                            const progress = self.progress;
                            if (progress >= startOffset && progress <= endOffset) {
                                const animationProgress = (progress - startOffset) / CARD_ANIMATION_SEGMENT;
                                const frontRotation = FRONT_ROTATION_DEGREES * animationProgress;
                                const backRotation = BACK_ROTATION_DEGREES - BACK_ROTATION_DEGREES * animationProgress;

                                gsap.to(frontEl, { rotateY: frontRotation, ease: 'power1.out' });
                                gsap.to(backEl, { rotateY: backRotation, ease: 'power1.out' });
                                gsap.to(card, {
                                    rotate: rotations[index] * (1 - animationProgress),
                                    yPercent: -50,
                                    top: '50%',
                                    ease: 'none',
                                });
                            }

                            // Ensure card is straight when animation completes
                            if (progress >= endOffset) {
                                gsap.to(card, { rotate: 0, ease: 'none' });
                            }
                        },
                    });
                }
            }
        });

        // Pin section during scroll
        ScrollTrigger.create({
            trigger: container.current,
            start: 'top top',
            end: () => `+=${totalScrollHeight}`,
            pin: true,
            pinSpacing: true,
        });

        // Cleanup on unmount
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
            cardTriggers.forEach(trigger => trigger?.kill()); // Clean up only specific triggers
        };
    }, []);

    return (
        <section className={styles.services}>
            {/* heading */}
            <div className={styles.heading}>
                <div ref={taglineRef}>
                    <Tag text='capabilities' />
                </div>
                <div className={styles.headingWrapper}>
                    <h1 ref={headingRef}>
                        {splitText("Tailored Solutions for Your Unique Vision")}
                    </h1>
                    <div ref={btnWrapperRef}>
                        <Button text="Get in touch" href="/contact" />
                    </div>
                </div>
            </div>

            {/* Services cards */}
            <section className={styles.wrapper} ref={container}>
                {services.map((service, index) => (
                    <ServiceCard
                        key={index}
                        ref={(el) => {
                            if (el) cardRefs.current[index] = el; // Ensure ref is set correctly
                        }}
                        title={service.title}
                        numbering={service.numbering}
                        listItems={service.listItems}
                    />
                ))}
            </section>

            {/* Services cards for small devices */}
            <div className={styles.mobileWrapper}>
                {services.map((service) => (
                    <div className={styles.card} key={service.numbering}>
                        <h3 className={styles.title}>{service.title}</h3>
                        <ul>
                            {service.listItems.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                        <h2 className={styles.numbering}>{service.numbering}</h2>
                    </div>
                ))}
            </div>
        </section>
    );
}
