import { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './ProjectCard.module.scss';

interface ProjectCardProps {
    number: string;
    title: string;
    type: string;
    description: string;
    thumbnail?: string;
    techStack: string[];
    features: string[];
    liveUrl?: string;
    caseStudyUrl?: string;
    customBgImage?: string; // AI-generated background
}

export default function ProjectCard({
    number,
    title,
    type,
    description,
    thumbnail,
    techStack,
    features,
    liveUrl,
    caseStudyUrl,
    customBgImage,
}: ProjectCardProps) {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = useCallback(() => {
        setIsFlipped((prev) => !prev);
    }, []);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleFlip();
        }
    }, [handleFlip]);

    return (
        <div
            className={`${styles.cardContainer} ${customBgImage ? styles.hasCustomBg : ''}`}
            onClick={handleFlip}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label={`${title} project card. Press to flip and see details.`}
        >
            <div className={`${styles.card} ${isFlipped ? styles.flipped : ''}`}>
                {/* ═══════════════════════════════════════════════════════ */}
                {/* FRONT FACE */}
                {/* ═══════════════════════════════════════════════════════ */}
                <div className={styles.cardFace + ' ' + styles.cardFront}>
                    {/* Custom AI-generated background */}
                    {customBgImage && (
                        <>
                            <Image
                                src={customBgImage}
                                alt=""
                                fill
                                className={styles.customBgImage}
                                priority
                            />
                            <div className={styles.bgOverlay} />
                        </>
                    )}

                    {/* Geometric pattern */}
                    <div className={styles.geometricPattern} aria-hidden="true" />

                    <div className={styles.frontContent}>
                        {/* Project number */}
                        <span className={styles.projectNumber}>{number}</span>

                        {/* Thumbnail area */}
                        {thumbnail && (
                            <div className={styles.thumbnailArea}>
                                <Image
                                    src={thumbnail}
                                    alt={`${title} preview`}
                                    width={300}
                                    height={180}
                                    className={styles.thumbnail}
                                />
                            </div>
                        )}

                        {/* Project info */}
                        <div className={styles.projectInfo}>
                            <h3 className={styles.projectTitle}>{title}</h3>
                            <p className={styles.projectType}>{type}</p>

                            {/* Tech stack pills */}
                            <div className={styles.techStack}>
                                {techStack.slice(0, 4).map((tech) => (
                                    <span key={tech} className={styles.techPill}>
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Flip hint */}
                        <div className={styles.flipHint} aria-hidden="true">
                            <span>Details</span>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════ */}
                {/* BACK FACE */}
                {/* ═══════════════════════════════════════════════════════ */}
                <div className={styles.cardFace + ' ' + styles.cardBack}>
                    <div className={styles.backContent}>
                        <div className={styles.backHeader}>
                            <h3 className={styles.backTitle}>{title}</h3>
                            <span className={styles.closeHint}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M19 12H5M12 19l-7-7 7-7" />
                                </svg>
                                Back
                            </span>
                        </div>

                        <p className={styles.description}>{description}</p>

                        {/* Features list */}
                        <ul className={styles.features}>
                            {features.slice(0, 4).map((feature, index) => (
                                <li key={index} className={styles.feature}>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        {/* Action buttons */}
                        <div className={styles.actions}>
                            {liveUrl && (
                                <Link
                                    href={liveUrl}
                                    className={`${styles.actionBtn} ${styles.primary}`}
                                    onClick={(e) => e.stopPropagation()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View Live
                                </Link>
                            )}
                            {caseStudyUrl && (
                                <Link
                                    href={caseStudyUrl}
                                    className={`${styles.actionBtn} ${styles.secondary}`}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    Case Study
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
