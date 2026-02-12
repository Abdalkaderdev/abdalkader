import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './MiniSignpost.module.scss';

interface MiniVerse {
    text: string;
    reference: string;
}

// Categorized encouraging verses
const encouragingVerses: Record<string, MiniVerse[]> = {
    general: [
        { text: "You are wonderfully made", reference: "Psalm 139:14" },
        { text: "Joy comes in the morning", reference: "Psalm 30:5" },
        { text: "God's love never fails", reference: "1 Cor 13:8" },
        { text: "You are more than conquerors", reference: "Romans 8:37" },
        { text: "His grace is sufficient", reference: "2 Cor 12:9" },
    ],
    work: [
        { text: "Work as unto the Lord", reference: "Col 3:23" },
        { text: "Excellence honors God", reference: "Prov 22:29" },
        { text: "Commit your work to the Lord", reference: "Prov 16:3" },
        { text: "God establishes your plans", reference: "Prov 16:3" },
        { text: "Created for good works", reference: "Eph 2:10" },
    ],
    strength: [
        { text: "I can do all things", reference: "Phil 4:13" },
        { text: "Be strong and courageous", reference: "Josh 1:9" },
        { text: "The Lord is my strength", reference: "Psalm 28:7" },
        { text: "God fights for you", reference: "Deut 3:22" },
        { text: "Nothing is impossible", reference: "Luke 1:37" },
    ],
    peace: [
        { text: "Peace I leave with you", reference: "John 14:27" },
        { text: "Cast your cares on Him", reference: "1 Peter 5:7" },
        { text: "Be anxious for nothing", reference: "Phil 4:6" },
        { text: "His peace guards your heart", reference: "Phil 4:7" },
        { text: "Rest in the Lord", reference: "Psalm 37:7" },
    ],
    hope: [
        { text: "Hope does not disappoint", reference: "Romans 5:5" },
        { text: "He has plans to prosper you", reference: "Jer 29:11" },
        { text: "New mercies every morning", reference: "Lam 3:23" },
        { text: "Your future is bright", reference: "Prov 23:18" },
        { text: "God is with you always", reference: "Matt 28:20" },
    ],
    love: [
        { text: "You are deeply loved", reference: "Romans 5:8" },
        { text: "Nothing separates you from His love", reference: "Romans 8:39" },
        { text: "He loved you first", reference: "1 John 4:19" },
        { text: "His love is everlasting", reference: "Jer 31:3" },
        { text: "Love never fails", reference: "1 Cor 13:8" },
    ],
};

interface MiniSignpostProps {
    category?: keyof typeof encouragingVerses;
    autoRotate?: boolean;
    rotateInterval?: number;
    className?: string;
}

export default function MiniSignpost({
    category = 'general',
    autoRotate = true,
    rotateInterval = 20000, // 20 seconds - give users time to read
    className = '',
}: MiniSignpostProps) {
    const verses = encouragingVerses[category] || encouragingVerses.general;
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentVerse = verses[currentIndex];

    useEffect(() => {
        if (!autoRotate) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % verses.length);
        }, rotateInterval);

        return () => clearInterval(timer);
    }, [autoRotate, rotateInterval, verses.length]);

    return (
        <div className={`${styles.miniSignpost} ${className}`}>
            {/* Small cross accent */}
            <div className={styles.crossAccent}>✝</div>

            {/* Verse card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    className={styles.verseCard}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                    <span className={styles.verseText}>{currentVerse.text}</span>
                    <span className={styles.reference}>{currentVerse.reference}</span>
                </motion.div>
            </AnimatePresence>

        </div>
    );
}

// Export verse categories for external use
export { encouragingVerses };
export type { MiniVerse };
