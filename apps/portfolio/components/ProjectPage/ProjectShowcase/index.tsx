import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap, ScrollTrigger } from '@/libs/gsap';
import { useLenis } from '@studio-freight/react-lenis';
import styles from './ProjectShowcase.module.scss';

interface ShowcaseProject {
    number: string;
    title: string;
    type: string;
    description: string;
    techStack: string[];
    features: string[];
    liveUrl?: string;
    caseStudyUrl?: string;
    backgroundImage: string;
}

const SHOWCASE_PROJECTS: ShowcaseProject[] = [
    {
        number: "01",
        title: "DiscipleOne Platform",
        type: "Full Stack Development",
        description: "A 501(c)(3) nonprofit platform equipping churches with free discipleship tools and dashboards for monitoring spiritual development.",
        techStack: ["React", "Node.js", "TypeScript", "Cloud Services"],
        features: [
            "50+ partner churches in beta",
            "1,000+ active users",
            "10,000+ completed quiet times",
            "Church leadership dashboards"
        ],
        liveUrl: "https://discipleone.life/",
        caseStudyUrl: "/projects/discipleone-platform",
        backgroundImage: "/images/cards/card-layered-archway.jpg",
    },
    {
        number: "02",
        title: "SoapBox Super App",
        type: "AI Engineering & SaaS",
        description: "Comprehensive faith community platform with AI-powered content creation and multi-channel communication for churches of all sizes.",
        techStack: ["React", "Node.js", "AI/ML", "TypeScript"],
        features: [
            "AI-powered content creation",
            "Multi-channel communication",
            "Multi-campus support",
            "Real-time attendance tracking"
        ],
        liveUrl: "https://soapboxsuperapp.com/",
        caseStudyUrl: "/projects/soapbox-super-app",
        backgroundImage: "/images/cards/card-modern-chapel.jpg",
    },
    {
        number: "03",
        title: "ParsaLink AI CRM",
        type: "AI Engineering & SaaS",
        description: "AI-powered CRM eliminating manual work in sales processes with intelligent lead capture and personalized email generation.",
        techStack: ["React", "Node.js", "AI/ML", "CRM"],
        features: [
            "AI-powered lead capture chatbot",
            "Multi-language email generation",
            "Natural language sales analytics",
            "Minutes-to-setup onboarding"
        ],
        liveUrl: "https://parsalink.io/",
        caseStudyUrl: "/projects/parsalink-ai-crm",
        backgroundImage: "/images/cards/card-black-marble.jpg",
    },
    {
        number: "04",
        title: "VIA Discipleship App",
        type: "Mobile Development",
        description: "Free cross-platform companion app for spiritual growth with daily quiet time guidance and disciple partner matching.",
        techStack: ["React Native", "Node.js", "TypeScript", "iOS", "Android"],
        features: [
            "Cross-platform sync",
            "Disciple partner matching",
            "Prayer journal tracking",
            "100% free access"
        ],
        liveUrl: "https://viaapp.life/",
        caseStudyUrl: "/projects/via-discipleship-app",
        backgroundImage: "/images/cards/card-gothic-arch.jpg",
    },
    {
        number: "05",
        title: "Quantum Animation",
        type: "Interactive Physics",
        description: "Innovative interactive platform demonstrating quantum physics through UI animations and real-time physics simulations.",
        techStack: ["Next.js 15", "Three.js", "Framer Motion", "GSAP"],
        features: [
            "95% user satisfaction rate",
            "60fps on all devices",
            "15,000+ interactive sessions",
            "Educational partnerships"
        ],
        liveUrl: "https://quantumanim.abdalkader.dev/",
        caseStudyUrl: "/projects/quantum-animation-system",
        backgroundImage: "/images/cards/card-sacred-geometry.jpg",
    },
    {
        number: "06",
        title: "VirtualView",
        type: "Web VR Platform",
        description: "Web-based virtual reality platform enabling immersive 3D exploration without specialized hardware requirements.",
        techStack: ["Three.js", "WebGL", "Next.js"],
        features: [
            "80% reduction in VR hardware needs",
            "45,000+ virtual tours",
            "25+ virtual environments",
            "60% engagement increase"
        ],
        liveUrl: "https://virtualview.vercel.app/",
        caseStudyUrl: "/projects/virtualview",
        backgroundImage: "/images/cards/card-black-marble.jpg",
    },
];

export default function ProjectShowcase() {
    const containerRef = useRef<HTMLElement>(null);
    const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const detailRefs = useRef<(HTMLDivElement | null)[]>([]);
    const stackRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [flippedCard, setFlippedCard] = useState<number | null>(null);
    const [isInShowcase, setIsInShowcase] = useState(false);

    // Connect Lenis smooth scroll to GSAP ScrollTrigger
    useLenis(({ scroll }) => {
        ScrollTrigger.update();
    });

    const handleCardClick = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setFlippedCard(flippedCard === index ? null : index);
    };

    const handleCloseCard = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFlippedCard(null);
    };

    // Reset flip state when active card changes
    const resetFlipState = useCallback(() => {
        setFlippedCard(null);
    }, []);

    // Helper to get responsive card offset
    const getCardOffset = useCallback(() => {
        if (typeof window === 'undefined') return '25vw';
        return window.innerWidth <= 768 ? '0' : '25vw';
    }, []);

    // Helper to get stack offset (for remaining cards)
    const getStackOffset = useCallback(() => {
        if (typeof window === 'undefined') return '25vw';
        return window.innerWidth <= 768 ? '0' : '25vw';
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        const stack = stackRef.current;
        const progress = progressRef.current;
        if (!container || !stack) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // For reduced motion, show all details immediately and skip animations
        if (prefersReducedMotion) {
            detailRefs.current.forEach((detail) => {
                if (detail) {
                    gsap.set(detail, { opacity: 1, x: 0 });
                }
            });
            if (stack) gsap.set(stack, { opacity: 0 });
            return;
        }

        const projectCount = SHOWCASE_PROJECTS.length;

        const ctx = gsap.context(() => {
            // Initial stack setup - hidden below viewport until showcase section
            gsap.set(stack, {
                opacity: 0,
                y: 200,
            });

            // Hide progress bar initially
            if (progress) {
                gsap.set(progress, { opacity: 0 });
            }

            cardRefs.current.forEach((card, index) => {
                if (!card) return;
                gsap.set(card, {
                    x: index * 6,
                    y: index * -10,
                    rotation: (index - 2) * 4,
                    scale: 1 - index * 0.03,
                    zIndex: projectCount - index,
                });
            });

            // Reveal stack when showcase section comes into view
            ScrollTrigger.create({
                trigger: container,
                start: 'top 80%',
                end: 'bottom 20%',
                onEnter: () => {
                    setIsInShowcase(true);
                    gsap.to(stack, {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: 'power3.out',
                    });
                    if (progress) {
                        gsap.to(progress, {
                            opacity: 1,
                            duration: 0.5,
                            delay: 0.3,
                        });
                    }
                },
                onLeave: () => {
                    // Hide stack and progress when scrolling past showcase
                    setIsInShowcase(false);
                    gsap.to(stack, {
                        opacity: 0,
                        y: -100,
                        duration: 0.5,
                        ease: 'power2.in',
                    });
                    if (progress) {
                        gsap.to(progress, {
                            opacity: 0,
                            duration: 0.3,
                        });
                    }
                    resetFlipState();
                },
                onEnterBack: () => {
                    // Show stack again when scrolling back up
                    setIsInShowcase(true);
                    setActiveIndex(projectCount - 1);
                    gsap.to(stack, {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        ease: 'power2.out',
                    });
                    if (progress) {
                        gsap.to(progress, {
                            opacity: 1,
                            duration: 0.3,
                        });
                    }
                },
                onLeaveBack: () => {
                    setIsInShowcase(false);
                    gsap.to(stack, {
                        opacity: 0,
                        y: 200,
                        duration: 0.5,
                        ease: 'power2.in',
                    });
                    if (progress) {
                        gsap.to(progress, {
                            opacity: 0,
                            duration: 0.3,
                        });
                    }
                    resetFlipState();
                },
            });

            // For each section, animate the card leaving the stack
            SHOWCASE_PROJECTS.forEach((_, index) => {
                const section = sectionRefs.current[index];
                const card = cardRefs.current[index];
                const detail = detailRefs.current[index];

                if (!section || !card || !detail) return;

                const isOdd = index % 2 === 0; // 0, 2, 4 go RIGHT; 1, 3, 5 go LEFT

                // Set initial detail state
                gsap.set(detail, { opacity: 0, x: isOdd ? 80 : -80 });

                // Create scroll trigger for this section
                ScrollTrigger.create({
                    trigger: section,
                    start: 'top 60%',
                    end: 'bottom 40%',
                    onEnter: () => {
                        setActiveIndex(index);
                        resetFlipState(); // Reset flip when changing cards

                        const cardOffset = getCardOffset();
                        const stackOffset = getStackOffset();

                        // Animate the card leaving the stack
                        gsap.to(card, {
                            x: isOdd ? cardOffset : `-${cardOffset}`.replace('--', '-'),
                            y: 0,
                            rotation: isOdd ? 6 : -6,
                            scale: 1,
                            zIndex: 30 + index,
                            duration: 0.8,
                            ease: 'power3.out',
                        });

                        // Animate details in
                        gsap.to(detail, {
                            opacity: 1,
                            x: 0,
                            duration: 0.6,
                            delay: 0.2,
                            ease: 'power2.out',
                        });

                        // Move remaining stack below details
                        const remainingCards = cardRefs.current.slice(index + 1);
                        remainingCards.forEach((remainingCard, i) => {
                            if (!remainingCard) return;
                            gsap.to(remainingCard, {
                                x: isOdd ? `-${stackOffset}`.replace('--', '-') : stackOffset,
                                y: 180 + i * -8,
                                rotation: (i - 1) * 3,
                                scale: 0.45 - i * 0.02,
                                opacity: 1,
                                duration: 0.7,
                                delay: 0.1,
                                ease: 'power2.out',
                            });
                        });

                        // Completely hide previous cards (not just fade)
                        cardRefs.current.slice(0, index).forEach((prevCard) => {
                            if (!prevCard) return;
                            gsap.to(prevCard, {
                                opacity: 0,
                                scale: 0.6,
                                duration: 0.4,
                                ease: 'power2.in',
                            });
                        });
                    },
                    onEnterBack: () => {
                        setActiveIndex(index);
                        resetFlipState();

                        const cardOffset = getCardOffset();
                        const stackOffset = getStackOffset();

                        // Bring card back to position
                        gsap.to(card, {
                            x: isOdd ? cardOffset : `-${cardOffset}`.replace('--', '-'),
                            y: 0,
                            rotation: isOdd ? 6 : -6,
                            scale: 1,
                            opacity: 1,
                            zIndex: 30 + index,
                            duration: 0.6,
                            ease: 'power2.out',
                        });

                        // Show details
                        gsap.to(detail, {
                            opacity: 1,
                            x: 0,
                            duration: 0.5,
                            ease: 'power2.out',
                        });

                        // Bring back cards that were ahead (they should return to stack position)
                        cardRefs.current.slice(index + 1).forEach((nextCard, i) => {
                            if (!nextCard) return;
                            gsap.to(nextCard, {
                                x: isOdd ? `-${stackOffset}`.replace('--', '-') : stackOffset,
                                y: 180 + i * -8,
                                rotation: (i - 1) * 3,
                                scale: 0.45 - i * 0.02,
                                opacity: 1,
                                duration: 0.5,
                                ease: 'power2.out',
                            });
                        });
                    },
                    onLeave: () => {
                        resetFlipState();
                        // Hide details when scrolling to next section
                        gsap.to(detail, {
                            opacity: 0,
                            x: isOdd ? -50 : 50,
                            duration: 0.4,
                            ease: 'power2.in',
                        });
                    },
                    onLeaveBack: () => {
                        resetFlipState();
                        const isFirstCard = index === 0;
                        const prevIsOdd = (index - 1) % 2 === 0;

                        // Return this card to stack position
                        gsap.to(card, {
                            x: isFirstCard ? index * 6 : (prevIsOdd ? `-${getStackOffset()}`.replace('--', '-') : getStackOffset()),
                            y: isFirstCard ? index * -10 : 180,
                            rotation: isFirstCard ? (index - 2) * 4 : 0,
                            scale: isFirstCard ? 1 - index * 0.03 : 0.45,
                            opacity: 1,
                            zIndex: isFirstCard ? projectCount - index : 20,
                            duration: 0.6,
                            ease: 'power2.out',
                        });

                        // Hide details
                        gsap.to(detail, {
                            opacity: 0,
                            x: isOdd ? 80 : -80,
                            duration: 0.4,
                            ease: 'power2.in',
                        });

                        // If scrolling back from card 1 to before card 0, restore all cards to stack
                        if (index === 0) {
                            cardRefs.current.forEach((stackCard, i) => {
                                if (!stackCard) return;
                                gsap.to(stackCard, {
                                    x: i * 6,
                                    y: i * -10,
                                    rotation: (i - 2) * 4,
                                    scale: 1 - i * 0.03,
                                    opacity: 1,
                                    zIndex: projectCount - i,
                                    duration: 0.6,
                                    ease: 'power2.out',
                                });
                            });
                        }
                    },
                });
            });
        }, container);

        return () => ctx.revert();
    }, [resetFlipState, getCardOffset, getStackOffset]);

    const activeProject = activeIndex >= 0 ? SHOWCASE_PROJECTS[activeIndex] : null;
    const remainingCount = activeIndex >= 0 ? SHOWCASE_PROJECTS.length - activeIndex - 1 : SHOWCASE_PROJECTS.length;

    return (
        <section ref={containerRef} className={styles.showcase}>
            {/* Traveling Card Stack */}
            <div ref={stackRef} className={styles.cardStack}>
                {SHOWCASE_PROJECTS.map((project, index) => (
                    <div
                        key={project.number}
                        ref={(el) => { cardRefs.current[index] = el; }}
                        className={`${styles.stackCard} ${flippedCard === index ? styles.flipped : ''}`}
                        onClick={(e) => handleCardClick(index, e)}
                    >
                        <div className={styles.cardInner}>
                            {/* Front Face */}
                            <div className={styles.cardFront}>
                                <Image
                                    src={project.backgroundImage}
                                    alt={`${project.title} card`}
                                    fill
                                    className={styles.stackCardImage}
                                    sizes="(max-width: 768px) 70vw, 320px"
                                />
                                <div className={styles.stackCardOverlay}>
                                    <span className={styles.stackCardNumber}>{project.number}</span>
                                </div>
                                <span className={styles.flipHint}>Click to flip</span>
                            </div>

                            {/* Back Face */}
                            <div className={styles.cardBack}>
                                <div className={styles.cardBackHeader}>
                                    <span className={styles.cardBackNumber}>{project.number}</span>
                                    <button
                                        className={styles.cardBackClose}
                                        onClick={handleCloseCard}
                                        aria-label="Close card"
                                    >
                                        ×
                                    </button>
                                </div>
                                <h3 className={styles.cardBackTitle}>{project.title}</h3>
                                <p className={styles.cardBackType}>{project.type}</p>
                                <div className={styles.cardBackTech}>
                                    {project.techStack.map((tech) => (
                                        <span key={tech} className={styles.techPill}>{tech}</span>
                                    ))}
                                </div>
                                <div className={styles.cardBackActions}>
                                    {project.liveUrl && (
                                        <Link
                                            href={project.liveUrl}
                                            className={`${styles.cardBackBtn} ${styles.primary}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            View Live
                                        </Link>
                                    )}
                                    {project.caseStudyUrl && (
                                        <Link
                                            href={project.caseStudyUrl}
                                            className={`${styles.cardBackBtn} ${styles.secondary}`}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            Case Study
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Project Sections */}
            {SHOWCASE_PROJECTS.map((project, index) => {
                const isOdd = index % 2 === 0;

                return (
                    <div
                        key={project.number}
                        ref={(el) => { sectionRefs.current[index] = el; }}
                        className={`${styles.projectSection} ${isOdd ? styles.cardRight : styles.cardLeft}`}
                    >
                        {/* Project Details */}
                        <div
                            ref={(el) => { detailRefs.current[index] = el; }}
                            className={styles.details}
                        >
                            <span className={styles.detailsNumber}>{project.number}</span>
                            <h2 className={styles.detailsTitle}>{project.title}</h2>
                            <p className={styles.detailsType}>{project.type}</p>
                            <p className={styles.detailsDescription}>{project.description}</p>

                            <ul className={styles.features}>
                                {project.features.map((feature, i) => (
                                    <li key={i}>{feature}</li>
                                ))}
                            </ul>

                            <div className={styles.actions}>
                                {project.liveUrl && (
                                    <Link href={project.liveUrl} className={styles.primaryBtn} target="_blank" rel="noopener noreferrer">
                                        View Live
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2"/>
                                        </svg>
                                    </Link>
                                )}
                                {project.caseStudyUrl && (
                                    <Link href={project.caseStudyUrl} className={styles.secondaryBtn}>
                                        Case Study
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2"/>
                                        </svg>
                                    </Link>
                                )}
                            </div>

                            {/* Remaining count indicator */}
                            {SHOWCASE_PROJECTS.length - index - 1 > 0 && (
                                <div className={styles.remainingIndicator}>
                                    <span>{SHOWCASE_PROJECTS.length - index - 1} more below</span>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}

            {/* Progress Indicator */}
            <div ref={progressRef} className={styles.progressBar}>
                {SHOWCASE_PROJECTS.map((_, index) => (
                    <div
                        key={index}
                        className={`${styles.progressDot} ${index <= activeIndex ? styles.active : ''}`}
                    />
                ))}
            </div>
        </section>
    );
}
