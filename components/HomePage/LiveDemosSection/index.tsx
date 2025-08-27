import { useEffect, useRef } from 'react';
import styles from './LiveDemosSection.module.scss';
import { gsap } from '@/libs/gsap';
import Tag from '@/components/Tag';

interface DemoItem {
    title: string;
    src: string;
    href?: string;
}

const demos: DemoItem[] = [
    { title: 'Apple TV Clone', src: 'https://apple-tv-clone-demo.example.com', href: '/projects/apple-tv-clone' },
    { title: 'VirtualView', src: 'https://virtualview-demo.example.com', href: '/projects/virtualview' },
];

export default function LiveDemosSection() {
    const sectionRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!sectionRef.current) return;
        const cards = sectionRef.current.querySelectorAll(`.${styles.card}`);
        gsap.from(cards, { opacity: 0, y: 30, duration: 0.8, stagger: 0.15, ease: 'power2.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } });
    }, []);

    return (
        <section className={styles.liveDemos} ref={sectionRef}>
            <div className={styles.header}>
                <Tag text="Live Demos" />
                <h2>Interactive Previews</h2>
                <p>Explore live, interactive previews of selected projects.</p>
            </div>
            <div className={styles.grid}>
                {demos.map((demo) => (
                    <article className={styles.card} key={demo.title}>
                        <div className={styles.frameWrap}>
                            <iframe
                                title={demo.title}
                                src={demo.src}
                                loading="lazy"
                                sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms allow-popups"
                                referrerPolicy="no-referrer"
                            />
                        </div>
                        <div className={styles.cardFooter}>
                            <h3>{demo.title}</h3>
                            {demo.href && (
                                <a href={demo.href} className={styles.link}>
                                    View Project
                                </a>
                            )}
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}

