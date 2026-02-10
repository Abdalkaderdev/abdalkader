'use client';

import styles from './GodIsGreater.module.scss';

interface GodIsGreaterProps {
    className?: string;
}

export default function GodIsGreater({ className = '' }: GodIsGreaterProps) {
    return (
        <div className={`${styles.container} ${className}`}>
            <svg
                viewBox="0 0 220 300"
                className={styles.svg}
                aria-label="God is Greater than the Highs and Lows - Romans 8:28"
            >
                {/* Cross - simple clean minimalist design */}
                <g className={styles.cross}>
                    {/* Vertical beam */}
                    <line
                        x1="140"
                        y1="20"
                        x2="140"
                        y2="280"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="square"
                        className={styles.crossLine}
                    />
                    {/* Horizontal beam */}
                    <line
                        x1="85"
                        y1="70"
                        x2="195"
                        y2="70"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="square"
                        className={styles.crossLine}
                    />
                </g>

                {/* Romans 8:28 reference - top right */}
                <text className={styles.reference}>
                    <tspan x="155" y="45">Romans</tspan>
                    <tspan x="155" y="60">8:28</tspan>
                </text>

                {/* G > ^ v symbols stacked vertically on the left of the cross */}
                <g className={styles.symbols}>
                    {/* G - stylized letter */}
                    <path
                        d="M25 100 L55 100 M25 100 L25 130 L55 130 L55 118 L40 118"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="square"
                        strokeLinejoin="miter"
                        className={styles.symbol}
                    />

                    {/* > (Greater than) */}
                    <path
                        d="M25 145 L55 162 L25 180"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="square"
                        strokeLinejoin="miter"
                        className={styles.symbol}
                    />

                    {/* ^ (Up/High - caret pointing up) */}
                    <path
                        d="M25 225 L40 195 L55 225"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="square"
                        strokeLinejoin="miter"
                        className={styles.symbol}
                    />

                    {/* v (Down/Low - caret pointing down) */}
                    <path
                        d="M25 235 L40 265 L55 235"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="square"
                        strokeLinejoin="miter"
                        className={styles.symbol}
                    />
                </g>

                {/* "God is Greater than the Highs and Lows" - diagonal cursive text */}
                <text
                    className={styles.messageText}
                    transform="rotate(-75, 145, 180)"
                >
                    <tspan x="145" y="180">God is Greater than the Highs and Lows</tspan>
                </text>
            </svg>
        </div>
    );
}
