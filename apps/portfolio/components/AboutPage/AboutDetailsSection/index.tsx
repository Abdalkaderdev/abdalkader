import { useEffect, useRef } from 'react';
import styles from './AboutDetailsSection.module.scss';
import { splitText } from '@/utils/textUtils';
import { gsap, ScrollTrigger } from '@/libs/gsap';
import Tag from '@/components/Tag';
import { isReducedMotion } from '@/utils/motion';

// Setup Animation for all text
const animateText = (ref: React.RefObject<HTMLElement>, startOffset: string = '70%', yValue: string = '115%', stagger: number = 0.003) => {
    const elements = ref.current?.querySelectorAll('span span');
    if (!elements) return;

    gsap.from(elements, {
        scrollTrigger: {
            trigger: ref.current,
            start: `top ${startOffset}`,
            once: true, // Ensures ScrollTrigger is killed once the animation has occurred.
        },
        y: yValue,
        stagger: stagger,
    });
};

// Prepare data for rendering
const skillsCategories = [
    {
        title: "AI & Machine Learning",
        skills: ['OpenAI API', 'Gemini / Vertex AI', 'Amazon Bedrock', 'LangChain', 'Vector Databases (e.g., Pinecone, Weaviate)', 'LLMOps', 'Responsible AI Principles', 'AWS Generative AI Tools', 'Machine Learning Foundations', 'Introduction to Responsible AI', 'Python for AI/ML']
    },
    {
        title: "Frontend Development",
        skills: ['HTML, CSS, SCSS', 'Tailwind CSS', 'JavaScript', 'React', 'Next.js', 'Three.js']
    },
    {
        title: "Backend Development & Programming",
        skills: ['Python', 'Node.js', 'Express.js', 'MongoDB', 'SQL / MySQL', 'REST APIs & GraphQL', 'JWT / OAuth Authentication']
    },
    {
        title: "Design & Motion (Basic)",
        skills: ['Figma', 'Framer']
    },
    {
        title: "Tools & Platforms",
        skills: ['WordPress', 'Shopify', 'CMS (Custom + Headless CMS)', 'CRM Systems (e.g., Perfex, Homely)', 'HMS (Hospital Management Systems)', 'GitHub Actions (CI/CD)', 'cPanel / WHM', 'Vercel / Netlify / Namecheap Hosting', 'Git & GitHub', 'Docker', 'Linux / Bash']
    }
];
const experiences = [
    {
        position: "Full Stack AI Engineer",
        company: "at SoapBox Super App",
        period: "2024 - Present"
    },
    {
        position: "Full Stack Software Engineer",
        company: "at DiscipleOne (Nonprofit) & VIA App",
        period: "2024 - Present"
    },
    {
        position: "Full Stack Software Developer",
        company: "at ParsaLink",
        period: "2024 - Present"
    },
    {
        position: "IT Specialist",
        company: "at Real House Real Estate",
        period: "Jan 2025 - Present"
    },
    {
        position: "IT Specialist (Freelancer)",
        company: "at Headquarter Realestate & Innovations Department",
        period: "Nov 2024 - Jan 2025"
    },
    {
        position: "IT Manager",
        company: "at Hamilton Iraq",
        period: "Nov 2023 - Nov 2024"
    },
    {
        position: "E-commerce Web Developer (Freelancer)",
        company: "at Minime Iraq",
        period: "Nov 2023 - Nov 2024"
    }
];

const courses = [
    {
        title: "Introduction to Machine Learning: Art of the Possible",
        status: "✅ Completed"
    },
    {
        title: "AWS ML Engineer Associate Curriculum Overview",
        status: "✅ Completed"
    },
    {
        title: "Amazon Q Developer Getting Started",
        status: "✅ Completed"
    },
    {
        title: "Introducing Generative AI with AWS",
        status: "✅ Completed"
    },
    {
        title: "Responsible AI: Applying AI Principles with Google Cloud",
        status: "✅ Completed"
    },
    {
        title: "LLMOps: Building Real-World Applications With Large Language Models",
        status: "✅ Completed"
    },
    {
        title: "Introduction to Responsible AI",
        status: "✅ Completed"
    },
    {
        title: "Machine Learning Foundations",
        status: "✅ Completed"
    },
    {
        title: "AWS ML Engineer Associate Learning Plan (includes labs)",
        status: "⏳ In Progress"
    }
];

export default function AboutDetailsSection() {
    const headingRef = useRef<HTMLDivElement | null>(null);
    const toolRef = useRef<HTMLDivElement | null>(null);
    const taglineRef = useRef<HTMLDivElement | null>(null);
    const experienceRef = useRef<HTMLDivElement | null>(null);
    const experienceTaglineRef = useRef<HTMLDivElement | null>(null); // Reference for experience tagline
    const coursesRef = useRef<HTMLDivElement | null>(null);
    const coursesTaglineRef = useRef<HTMLDivElement | null>(null); // Reference for courses tagline
    
    // Refs for skill sections
    const frontendRef = useRef<HTMLDivElement | null>(null);
    const frontendTaglineRef = useRef<HTMLDivElement | null>(null);
    const backendRef = useRef<HTMLDivElement | null>(null);
    const backendTaglineRef = useRef<HTMLDivElement | null>(null);
    const designRef = useRef<HTMLDivElement | null>(null);
    const designTaglineRef = useRef<HTMLDivElement | null>(null);
    const toolsRef = useRef<HTMLDivElement | null>(null);
    const toolsTaglineRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (isReducedMotion()) return; // Respect reduced motion
        // Animate heading text
        if (headingRef.current) animateText(headingRef);

        // Animate tagline text for Tools
        const tagline = taglineRef.current;
        if (tagline) {
            gsap.from(tagline, {
                scrollTrigger: {
                    trigger: tagline,
                    start: 'top 80%',
                    once: true, // Ensures this animation triggers only once
                },
                opacity: 0,
                y: 50,
            });
        }

        // Animate all tool text
        if (toolRef.current) animateText(toolRef, '80%');

        // Animate experience tagline
        const experienceTagline = experienceTaglineRef.current;
        if (experienceTagline) {
            gsap.from(experienceTagline, {
                scrollTrigger: {
                    trigger: experienceTagline,
                    start: 'top 80%',
                    once: true, // Ensures this animation triggers only once
                },
                opacity: 0,
                y: 50,
            });
        }

        // Animate experience section with splitText
        if (experienceRef.current) animateText(experienceRef, '80%');

        // Animate courses tagline
        const coursesTagline = coursesTaglineRef.current;
        if (coursesTagline) {
            gsap.from(coursesTagline, {
                scrollTrigger: {
                    trigger: coursesTagline,
                    start: 'top 80%',
                    once: true, // Ensures this animation triggers only once
                },
                opacity: 0,
                y: 50,
            });
        }

        // Animate courses section with splitText
        if (coursesRef.current) animateText(coursesRef, '80%');

        // Animate Frontend Development section
        const frontendTagline = frontendTaglineRef.current;
        if (frontendTagline) {
            gsap.from(frontendTagline, {
                scrollTrigger: {
                    trigger: frontendTagline,
                    start: 'top 80%',
                    once: true,
                },
                opacity: 0,
                y: 50,
            });
        }
        if (frontendRef.current) animateText(frontendRef, '80%');

        // Animate Backend Development section
        const backendTagline = backendTaglineRef.current;
        if (backendTagline) {
            gsap.from(backendTagline, {
                scrollTrigger: {
                    trigger: backendTagline,
                    start: 'top 80%',
                    once: true,
                },
                opacity: 0,
                y: 50,
            });
        }
        if (backendRef.current) animateText(backendRef, '80%');

        // Animate Design & Motion section
        const designTagline = designTaglineRef.current;
        if (designTagline) {
            gsap.from(designTagline, {
                scrollTrigger: {
                    trigger: designTagline,
                    start: 'top 80%',
                    once: true,
                },
                opacity: 0,
                y: 50,
            });
        }
        if (designRef.current) animateText(designRef, '80%');

        // Animate Tools & Platforms section
        const toolsTagline = toolsTaglineRef.current;
        if (toolsTagline) {
            gsap.from(toolsTagline, {
                scrollTrigger: {
                    trigger: toolsTagline,
                    start: 'top 80%',
                    once: true,
                },
                opacity: 0,
                y: 50,
            });
        }
        if (toolsRef.current) animateText(toolsRef, '80%');

        // Cleanup ScrollTriggers when component unmounts
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill()); // Kill all scroll triggers
        };
    }, []);

    return (
        <section className={styles.aboutDetails}>
            <h2 ref={headingRef}>
                {splitText("I focus on understanding your goals to create a visually stunning, user-friendly website that performs flawlessly. Combining creative design and cutting-edge technology, I deliver results that make an impact from day one.")}
            </h2>

            {/* AI & Machine Learning */}
            <div className={styles.AIML}>
                <div className={styles.tagline} ref={taglineRef}>
                    <Tag text="AI & Machine Learning" />
                </div>
                <div className={styles.wrapper} ref={toolRef}>
                    {skillsCategories[0].skills.map((skill, idx) => (
                        <h3 key={idx}>{splitText(skill)}</h3>
                    ))}
                </div>
            </div>

            {/* Frontend Development */}
            <div className={styles.Frontend} ref={frontendRef}>
                <div className={styles.tagline} ref={frontendTaglineRef}>
                    <Tag text="Frontend Development" />
                </div>
                <div className={styles.wrapper}>
                    {skillsCategories[1].skills.map((skill, idx) => (
                        <h3 key={idx}>{splitText(skill)}</h3>
                    ))}
                </div>
            </div>

            {/* Backend Development */}
            <div className={styles.Backend} ref={backendRef}>
                <div className={styles.tagline} ref={backendTaglineRef}>
                    <Tag text="Backend Development & Programming" />
                </div>
                <div className={styles.wrapper}>
                    {skillsCategories[2].skills.map((skill, idx) => (
                        <h3 key={idx}>{splitText(skill)}</h3>
                    ))}
                </div>
            </div>

            {/* Design & Motion */}
            <div className={styles.Design} ref={designRef}>
                <div className={styles.tagline} ref={designTaglineRef}>
                    <Tag text="Design & Motion (Basic)" />
                </div>
                <div className={styles.wrapper}>
                    {skillsCategories[3].skills.map((skill, idx) => (
                        <h3 key={idx}>{splitText(skill)}</h3>
                    ))}
                </div>
            </div>

            {/* Tools & Platforms */}
            <div className={styles.Tools} ref={toolsRef}>
                <div className={styles.tagline} ref={toolsTaglineRef}>
                    <Tag text="Tools & Platforms" />
                </div>
                <div className={styles.wrapper}>
                    {skillsCategories[4].skills.map((skill, idx) => (
                        <h3 key={idx}>{splitText(skill)}</h3>
                    ))}
                </div>
            </div>

            {/* Experience */}
            <div className={styles.Experience} ref={experienceRef}>
                <div className={styles.tagline} ref={experienceTaglineRef}>
                    <Tag text="Experience" />
                </div>
                <div className={styles.wrapper}>
                    {experiences.map((exp, idx) => (
                        <div key={idx}>
                            <h3>{splitText(exp.position)}</h3>
                            <h4>{splitText(exp.company)}</h4>
                            <h4>{splitText(exp.period)}</h4>
                        </div>
                    ))}
                </div>
            </div>

            {/* Courses */}
            <div className={styles.Courses} ref={coursesRef}>
                <div className={styles.tagline} ref={coursesTaglineRef}>
                    <Tag text="AI & Machine Learning Courses" />
                </div>
                <div className={styles.wrapper}>
                    {courses.map((course, idx) => (
                        <div key={idx} className={styles.courseItem}>
                            <h3>{splitText(course.title)}</h3>
                            <h4 className={styles.courseStatus}>{splitText(course.status)}</h4>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
