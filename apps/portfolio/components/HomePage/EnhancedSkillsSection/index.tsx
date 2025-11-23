import { useEffect, useRef } from 'react';
import styles from './EnhancedSkillsSection.module.scss';
import { splitText } from '@/utils/textUtils';
import { gsap, ScrollTrigger } from '@/libs/gsap';
import Tag from '@/components/Tag';
import { isReducedMotion } from '@/utils/motion';
import { skillsCategories, getLevelColor, getLevelPercentage } from '@/data/skillsData';

// Setup Animation for all text
const animateText = (ref: React.RefObject<HTMLElement>, startOffset: string = '70%', yValue: string = '115%', stagger: number = 0.003) => {
    const elements = ref.current?.querySelectorAll('span span');
    if (!elements) return;

    gsap.from(elements, {
        scrollTrigger: {
            trigger: ref.current,
            start: `top ${startOffset}`,
            once: true,
        },
        y: yValue,
        stagger: stagger,
    });
};

export default function EnhancedSkillsSection() {
    const headingRef = useRef<HTMLDivElement | null>(null);
    const categoryRefs = useRef<(HTMLDivElement | null)[]>([]);
    const taglineRefs = useRef<(HTMLDivElement | null)[]>([]);
    const skillBarRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        if (isReducedMotion()) return;

        // Animate heading
        if (headingRef.current) animateText(headingRef);

        // Animate each category
        skillsCategories.forEach((_, categoryIndex) => {
            // Animate tagline
            const tagline = taglineRefs.current[categoryIndex];
            if (tagline) {
                gsap.from(tagline, {
                    scrollTrigger: {
                        trigger: tagline,
                        start: 'top 80%',
                        once: true,
                    },
                    opacity: 0,
                    y: 50,
                    delay: categoryIndex * 0.1,
                });
            }

            // Animate skills text
            const categoryRef = categoryRefs.current[categoryIndex];
            if (categoryRef) {
                // Create a temporary ref object for the animation
                const tempRef = { current: categoryRef };
                animateText(tempRef, '80%', '100%', 0.005);
            }

            // Animate skill bars
            const skillBars = skillBarRefs.current;
            skillBars.forEach((bar, index) => {
                if (bar) {
                    const barLevel = bar.getAttribute('data-level');
                    const percentage = getLevelPercentage(barLevel || 'Intermediate');
                    
                    gsap.fromTo(bar, 
                        { width: '0%' },
                        { 
                            width: `${percentage}%`,
                            duration: 1.2,
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: bar,
                                start: 'top 85%',
                                once: true,
                            },
                            delay: categoryIndex * 0.1 + index * 0.05,
                        }
                    );
                }
            });
        });

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    const getSkillLevelDots = (level: string) => {
        const dotCount = level === 'Expert' ? 3 : level === 'Advanced' ? 2 : 1;
        const color = getLevelColor(level);
        
        return (
            <div className={styles.skillDots}>
                {[...Array(3)].map((_, index) => (
                    <div 
                        key={index}
                        className={`${styles.skillDot} ${index < dotCount ? styles.filled : ''}`}
                        style={{ 
                            backgroundColor: index < dotCount ? color : 'transparent',
                            borderColor: color
                        }}
                    />
                ))}
            </div>
        );
    };

    return (
        <section className={styles.enhancedSkills}>
            <div className={styles.container}>
                <div className={styles.heading} ref={headingRef}>
                    {splitText("Technical expertise across the full stack, from AI-powered applications to pixel-perfect interfaces. Each skill represents years of hands-on experience and real-world project implementation.")}
                </div>

                {skillsCategories.map((category, categoryIndex) => (
                    <div key={category.title} className={styles.skillCategory}>
                        <div className={styles.tagline} ref={el => { taglineRefs.current[categoryIndex] = el; }}>
                            <Tag text={category.title} />
                            <span className={styles.categoryIcon}>{category.icon}</span>
                        </div>
                        
                        <div className={styles.skillsGrid} ref={el => { categoryRefs.current[categoryIndex] = el; }}>
                            {category.skills.map((skill, skillIndex) => (
                                <div key={skill.name} className={styles.skillItem}>
                                    <div className={styles.skillHeader}>
                                        <h4 className={styles.skillName}>{splitText(skill.name)}</h4>
                                        <div className={styles.skillMeta}>
                                            {getSkillLevelDots(skill.level)}
                                            <span className={styles.skillLevel} style={{ color: getLevelColor(skill.level) }}>
                                                {skill.level}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className={styles.skillBarContainer}>
                                        <div 
                                            className={styles.skillBar}
                                            ref={el => {
                                                if (el) {
                                                    const globalIndex = category.skills.slice(0, skillIndex).reduce((acc, _, idx) => 
                                                        acc + skillsCategories.slice(0, categoryIndex).reduce((sum, cat) => sum + cat.skills.length, 0) + idx, 0
                                                    ) + skillIndex;
                                                    skillBarRefs.current[globalIndex] = el;
                                                }
                                            }}
                                            data-level={skill.level}
                                            style={{ backgroundColor: getLevelColor(skill.level) }}
                                        />
                                    </div>
                                    
                                    <div className={styles.skillDetails}>
                                        {skill.yearsOfExperience && (
                                            <span className={styles.experience}>
                                                {skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? 'year' : 'years'}
                                            </span>
                                        )}
                                        {skill.projectsCount && (
                                            <span className={styles.projects}>
                                                {skill.projectsCount} {skill.projectsCount === 1 ? 'project' : 'projects'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
