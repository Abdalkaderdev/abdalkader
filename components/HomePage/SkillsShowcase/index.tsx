import { useEffect, useRef } from 'react';
import styles from './SkillsShowcase.module.scss';
import { gsap } from '@/libs/gsap';
import Tag from '@/components/Tag';
import Link from 'next/link';

interface SkillItem {
    name: string;
    level: number; // 0-100
    example: { title: string; href: string };
}

const skills: SkillItem[] = [
    { name: 'React', level: 95, example: { title: 'Apple TV Clone', href: '/projects/apple-tv-clone' } },
    { name: 'Next.js', level: 92, example: { title: 'VirtualView', href: '/projects/virtualview' } },
    { name: 'TypeScript', level: 90, example: { title: 'Jegr Jalal Company', href: '/projects/jegr-jalal-company' } },
    { name: 'GSAP', level: 88, example: { title: 'Portfolio Animations', href: '/' } },
];

export default function SkillsShowcase() {
    const sectionRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!sectionRef.current) return;
        const bars = sectionRef.current.querySelectorAll(`.${styles.fill}`);
        bars.forEach((bar) => {
            const target = Number((bar as HTMLElement).dataset.level || 0);
            gsap.fromTo(bar, { width: '0%' }, {
                width: `${target}%`, duration: 1.2, ease: 'power2.out',
                scrollTrigger: { trigger: bar, start: 'top 85%' }
            });
        });
    }, []);

    return (
        <section className={styles.skills} ref={sectionRef}>
            <div className={styles.header}>
                <Tag text="Skills" />
                <h2>Skills Showcase</h2>
                <p>Technologies I use with real examples.</p>
            </div>
            <div className={styles.list}>
                {skills.map((skill) => (
                    <div key={skill.name} className={styles.item}>
                        <div className={styles.row}>
                            <span className={styles.name}>{skill.name}</span>
                            <span className={styles.value}>{skill.level}%</span>
                        </div>
                        <div className={styles.bar}>
                            <div className={styles.fill} data-level={skill.level} />
                        </div>
                        <div className={styles.example}>
                            Example: <Link href={skill.example.href} className={styles.link}>{skill.example.title}</Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

