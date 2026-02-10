import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './BibleVerse.module.scss';

interface Verse {
    text: string;
    ref: string;
}

const verses: Verse[] = [
    // Work & Purpose
    { text: "Whatever you do, work at it with all your heart, as working for the Lord", ref: "Colossians 3:23" },
    { text: "Commit to the Lord whatever you do, and he will establish your plans", ref: "Proverbs 16:3" },
    { text: "For we are God's handiwork, created in Christ Jesus to do good works", ref: "Ephesians 2:10" },

    // Strength & Guidance
    { text: "I can do all things through Christ who strengthens me", ref: "Philippians 4:13" },
    { text: "The Lord will guide you always", ref: "Isaiah 58:11" },
    { text: "Be strong and courageous. Do not be afraid; do not be discouraged", ref: "Joshua 1:9" },
    { text: "Trust in the Lord with all your heart and lean not on your own understanding", ref: "Proverbs 3:5" },

    // Faith & Hope
    { text: "Faith is the substance of things hoped for, the evidence of things not seen", ref: "Hebrews 11:1" },
    { text: "For I know the plans I have for you, plans to prosper you and not to harm you", ref: "Jeremiah 29:11" },
    { text: "The Lord is my shepherd; I shall not want", ref: "Psalm 23:1" },

    // Wisdom & Excellence
    { text: "If any of you lacks wisdom, let him ask God, who gives generously to all", ref: "James 1:5" },
    { text: "Whatever is true, whatever is noble, whatever is right, think about such things", ref: "Philippians 4:8" },
    { text: "Do not conform to the pattern of this world, but be transformed by the renewing of your mind", ref: "Romans 12:2" },

    // Peace & Rest
    { text: "Peace I leave with you; my peace I give you", ref: "John 14:27" },
    { text: "Come to me, all you who are weary and burdened, and I will give you rest", ref: "Matthew 11:28" },
];

interface BibleVerseProps {
    interval?: number;
    className?: string;
}

export default function BibleVerse({ interval = 12000, className = '' }: BibleVerseProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % verses.length);
        }, interval);

        return () => clearInterval(timer);
    }, [interval]);

    const currentVerse = verses[currentIndex];

    return (
        <div className={`${styles.bibleVerse} ${className}`}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className={styles.verseContainer}
                >
                    <p className={styles.verseText}>&ldquo;{currentVerse.text}&rdquo;</p>
                    <span className={styles.verseRef}>&mdash; {currentVerse.ref}</span>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
