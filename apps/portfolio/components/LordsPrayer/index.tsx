import { useState, useEffect, useCallback, useRef } from 'react';
import { gsap } from '@/libs/gsap';
import styles from './LordsPrayer.module.scss';
import { isReducedMotion } from '@/utils/motion';

interface Prayer {
    title: string;
    lines: string[];
    ending?: string;
    category: string;
}

const prayers: Prayer[] = [
    // === TRADITIONAL PRAYERS ===
    {
        category: "Traditional",
        title: "The Lord's Prayer",
        lines: [
            "Our Father, who art in Heaven,",
            "hallowed be Thy name,",
            "Thy Kingdom come,",
            "Thy will be done,",
            "on Earth as it is in Heaven.",
            "Give us this day our daily bread.",
            "And forgive us our trespasses,",
            "as we forgive those who trespass against us.",
            "And lead us not into temptation,",
            "but deliver us from evil."
        ],
        ending: "Amen."
    },
    {
        category: "Traditional",
        title: "The Apostles' Creed",
        lines: [
            "I believe in God, the Father Almighty,",
            "Creator of heaven and earth.",
            "And in Jesus Christ, His only Son, our Lord,",
            "who was conceived by the Holy Spirit,",
            "born of the Virgin Mary,",
            "suffered under Pontius Pilate,",
            "was crucified, died, and was buried.",
            "On the third day He rose again.",
            "He ascended into heaven",
            "and is seated at the right hand of the Father."
        ],
        ending: "Amen."
    },
    {
        category: "Psalms",
        title: "Psalm 23",
        lines: [
            "The Lord is my shepherd,",
            "I shall not want.",
            "He makes me lie down in green pastures.",
            "He leads me beside still waters.",
            "He restores my soul.",
            "He guides me in paths of righteousness",
            "for His name's sake.",
            "Even though I walk through the valley",
            "of the shadow of death,",
            "I will fear no evil, for You are with me."
        ],
        ending: "Amen."
    },
    {
        category: "Peace",
        title: "Prayer of St. Francis",
        lines: [
            "Lord, make me an instrument of Your peace.",
            "Where there is hatred, let me sow love;",
            "where there is injury, pardon;",
            "where there is doubt, faith;",
            "where there is despair, hope;",
            "where there is darkness, light;",
            "where there is sadness, joy."
        ],
        ending: "Amen."
    },
    {
        category: "Guidance",
        title: "Serenity Prayer",
        lines: [
            "God, grant me the serenity",
            "to accept the things I cannot change,",
            "the courage to change the things I can,",
            "and the wisdom to know the difference."
        ],
        ending: "Amen."
    },
    {
        category: "Saints",
        title: "St. Patrick's Breastplate",
        lines: [
            "Christ with me, Christ before me,",
            "Christ behind me, Christ in me,",
            "Christ beneath me, Christ above me,",
            "Christ on my right, Christ on my left,",
            "Christ when I lie down,",
            "Christ when I sit down,",
            "Christ when I arise."
        ],
        ending: "Amen."
    },
    {
        category: "Saints",
        title: "St. Teresa's Bookmark",
        lines: [
            "Let nothing disturb you,",
            "let nothing frighten you.",
            "All things are passing;",
            "God never changes.",
            "Patience obtains all things.",
            "Whoever has God lacks nothing.",
            "God alone suffices."
        ],
        ending: "Amen."
    },
    {
        category: "Benediction",
        title: "The Aaronic Blessing",
        lines: [
            "The Lord bless you and keep you;",
            "the Lord make His face shine upon you",
            "and be gracious to you;",
            "the Lord turn His face toward you",
            "and give you peace."
        ],
        ending: "Amen."
    },
    {
        category: "Psalms",
        title: "Psalm 91:1-2",
        lines: [
            "He who dwells in the shelter of the Most High",
            "will rest in the shadow of the Almighty.",
            "I will say of the Lord,",
            "He is my refuge and my fortress,",
            "my God, in whom I trust."
        ],
        ending: "Amen."
    },
    {
        category: "Traditional",
        title: "Glory Be",
        lines: [
            "Glory be to the Father,",
            "and to the Son,",
            "and to the Holy Spirit.",
            "As it was in the beginning,",
            "is now, and ever shall be,",
            "world without end."
        ],
        ending: "Amen."
    },
    {
        category: "Marian",
        title: "Hail Mary",
        lines: [
            "Hail Mary, full of grace,",
            "the Lord is with thee.",
            "Blessed art thou among women,",
            "and blessed is the fruit of thy womb, Jesus.",
            "Holy Mary, Mother of God,",
            "pray for us sinners,",
            "now and at the hour of our death."
        ],
        ending: "Amen."
    },
    {
        category: "Benediction",
        title: "Irish Blessing",
        lines: [
            "May the road rise up to meet you.",
            "May the wind be always at your back.",
            "May the sun shine warm upon your face,",
            "the rains fall soft upon your fields,",
            "and until we meet again,",
            "may God hold you in the palm of His hand."
        ],
        ending: "Amen."
    }
];

export default function LordsPrayer() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const prayerRef = useRef<HTMLDivElement>(null);

    const currentPrayer = prayers[currentIndex];

    const goToNext = useCallback(() => {
        if (isReducedMotion()) {
            setCurrentIndex((prev) => (prev + 1) % prayers.length);
            return;
        }

        const prayer = prayerRef.current;
        if (!prayer) {
            setCurrentIndex((prev) => (prev + 1) % prayers.length);
            return;
        }

        gsap.to(prayer, {
            opacity: 0,
            x: -50,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                setCurrentIndex((prev) => (prev + 1) % prayers.length);
                gsap.fromTo(prayer,
                    { opacity: 0, x: 50 },
                    { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }
                );
            }
        });
    }, []);

    const goToPrev = useCallback(() => {
        if (isReducedMotion()) {
            setCurrentIndex((prev) => (prev - 1 + prayers.length) % prayers.length);
            return;
        }

        const prayer = prayerRef.current;
        if (!prayer) {
            setCurrentIndex((prev) => (prev - 1 + prayers.length) % prayers.length);
            return;
        }

        gsap.to(prayer, {
            opacity: 0,
            x: 50,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                setCurrentIndex((prev) => (prev - 1 + prayers.length) % prayers.length);
                gsap.fromTo(prayer,
                    { opacity: 0, x: -50 },
                    { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }
                );
            }
        });
    }, []);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                goToNext();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                goToPrev();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [goToNext, goToPrev]);

    // Auto-advance every 60 seconds
    useEffect(() => {
        const timer = setInterval(goToNext, 60000);
        return () => clearInterval(timer);
    }, [goToNext]);

    return (
        <div ref={containerRef} className={styles.prayerSection}>
            {/* Blueprint Grid Lines */}
            <div className={styles.gridLines}>
                {[...Array(13)].map((_, i) => (
                    <div key={i} className={styles.gridLine} />
                ))}
            </div>

            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerMeta}>
                    <span>SACRED PRAYERS</span>
                    <span>{prayers.length} PRAYERS</span>
                </div>
                <h1 className={styles.headerTitle}>PRAYERS</h1>
                <p className={styles.headerSub}>
                    A moment of peace and reflection
                </p>
            </div>

            {/* Prayer Card */}
            <div className={styles.prayerCard}>
                <div ref={prayerRef} className={styles.prayerContent}>
                    {/* Cross */}
                    <div className={styles.cross}>✝</div>

                    {/* Category */}
                    <span className={styles.category}>{currentPrayer.category.toUpperCase()}</span>

                    {/* Title */}
                    <h2 className={styles.prayerTitle}>{currentPrayer.title}</h2>

                    {/* Prayer Lines */}
                    <div className={styles.prayerText}>
                        {currentPrayer.lines.map((line, index) => (
                            <p key={index}>{line}</p>
                        ))}
                        {currentPrayer.ending && (
                            <p className={styles.ending}>{currentPrayer.ending}</p>
                        )}
                    </div>
                </div>

                {/* Large Index Number */}
                <div className={styles.indexNumber}>
                    {String(currentIndex + 1).padStart(2, '0')}
                </div>
            </div>

            {/* Navigation */}
            <div className={styles.navigation}>
                <button
                    onClick={goToPrev}
                    className={styles.navButton}
                    aria-label="Previous prayer"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>

                <div className={styles.prayerCount}>
                    <span className={styles.currentNum}>{String(currentIndex + 1).padStart(2, '0')}</span>
                    <span className={styles.separator}>/</span>
                    <span className={styles.totalNum}>{String(prayers.length).padStart(2, '0')}</span>
                </div>

                <button
                    onClick={goToNext}
                    className={styles.navButton}
                    aria-label="Next prayer"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>

            {/* Instructions */}
            <p className={styles.instructions}>
                Use arrow keys or tap to navigate
            </p>
        </div>
    );
}
