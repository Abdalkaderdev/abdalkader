import { useEffect, useRef } from 'react';
import styles from './ProcessSection.module.scss';
import { gsap } from '@/libs/gsap';
import Tag from '@/components/Tag';

const steps = ['Research', 'Design', 'Code', 'Test', 'Deploy'];

export default function ProcessSection() {
    const sectionRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!sectionRef.current) return;
        const items = sectionRef.current.querySelectorAll(`.${styles.step}`);
        gsap.from(items, { opacity: 0, y: 20, duration: 0.6, stagger: 0.15, ease: 'power2.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } });
    }, []);

    return (
        <section className={styles.process} ref={sectionRef}>
            <div className={styles.header}>
                <Tag text="Process" />
                <h2>How I Work</h2>
                <p>My typical workflow from idea to production.</p>
            </div>
            <ol className={styles.timeline}>
                {steps.map((step) => (
                    <li key={step} className={styles.step}>
                        <span className={styles.bullet} />
                        <h3>{step}</h3>
                    </li>
                ))}
            </ol>

            <div className={styles.comparisons}>
                <div className={styles.compareCard}>
                    <div className={styles.compareHeader}>Before</div>
                    <div className={styles.compareBody}>
                        <p>Legacy marketing page with poor performance and layout shifts.</p>
                    </div>
                </div>
                <div className={styles.compareCard}>
                    <div className={styles.compareHeader}>After</div>
                    <div className={styles.compareBody}>
                        <p>Modern Next.js page, optimized assets, GSAP animations, and improved Core Web Vitals.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

