'use client';

import styles from './RootedInChrist.module.scss';

interface RootedInChristProps {
    className?: string;
}

export default function RootedInChrist({ className = '' }: RootedInChristProps) {
    return (
        <div className={`${styles.rootedContainer} ${className}`}>
            <svg
                viewBox="0 0 300 380"
                className={styles.rootedSvg}
                aria-label="Rooted in Christ - Cross with roots"
            >
                <defs>
                    {/* Rough texture filter for brushstroke effect */}
                    <filter id="roughBrush" x="-5%" y="-5%" width="110%" height="110%">
                        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
                    </filter>
                </defs>

                {/* Cross with brushstroke style and jagged pointed top */}
                <g className={styles.cross}>
                    {/* Jagged pointed top - rough torn wood appearance */}
                    <path
                        d="M150 5
                           C148 8 146 6 145 10
                           C143 7 141 12 140 8
                           C138 14 136 10 135 16
                           C134 12 132 18 131 14
                           C130 20 128 16 128 24
                           L127 32
                           C126 28 124 34 125 38
                           C123 36 122 42 124 46
                           L126 55
                           L128 65
                           C130 62 132 68 133 64
                           L135 72
                           L137 65
                           C138 68 140 64 142 67
                           L143 60
                           L145 68
                           C146 64 148 70 149 66
                           L150 58
                           L151 66
                           C152 70 154 64 155 68
                           L157 60
                           L158 67
                           C160 64 162 68 163 65
                           L165 72
                           L167 64
                           C168 68 170 62 172 65
                           L174 55
                           L176 46
                           C178 42 177 36 175 38
                           L173 32
                           L172 24
                           C172 16 170 20 169 14
                           C168 18 166 12 165 16
                           C164 10 162 14 160 8
                           C159 12 157 7 155 10
                           C154 6 152 8 150 5 Z"
                        fill="currentColor"
                        className={styles.crossTop}
                    />

                    {/* Vertical beam - organic brushstroke with texture */}
                    <path
                        d="M127 55
                           Q124 60 126 70
                           Q123 80 125 90
                           L124 105
                           Q122 115 125 125
                           L126 140
                           Q124 150 126 160
                           L125 175
                           Q123 185 126 195
                           L127 210
                           Q125 220 128 230
                           L130 245
                           Q133 250 140 248
                           Q145 252 150 248
                           Q155 252 160 248
                           Q167 250 170 245
                           L172 230
                           Q175 220 173 210
                           L174 195
                           Q177 185 174 175
                           L175 160
                           Q177 150 174 140
                           L175 125
                           Q178 115 176 105
                           L175 90
                           Q177 80 174 70
                           Q176 60 173 55
                           Q168 50 160 54
                           Q155 50 150 54
                           Q145 50 140 54
                           Q132 50 127 55 Z"
                        fill="currentColor"
                        className={styles.crossVertical}
                    />

                    {/* Horizontal beam - brushstroke style crossbar */}
                    <path
                        d="M45 118
                           C40 115 35 120 38 125
                           C35 128 42 132 48 130
                           L65 131
                           Q80 133 95 130
                           L110 129
                           Q120 127 130 129
                           L150 130
                           L170 129
                           Q180 127 190 129
                           L205 130
                           Q220 133 235 131
                           L252 130
                           C258 132 265 128 262 125
                           C265 120 260 115 255 118
                           L235 120
                           Q220 118 205 120
                           L190 121
                           Q180 119 170 121
                           L150 120
                           L130 121
                           Q120 119 110 121
                           L95 120
                           Q80 118 65 120
                           L45 118 Z"
                        fill="currentColor"
                        className={styles.crossHorizontal}
                    />
                </g>

                {/* Text: ROO on left of cross, ED on right - cross IS the T */}
                <g className={styles.rootedTextGroup}>
                    {/* R */}
                    <text x="15" y="195" className={styles.rootedLetter}>R</text>
                    {/* O */}
                    <text x="50" y="195" className={styles.rootedLetter}>O</text>
                    {/* O */}
                    <text x="85" y="195" className={styles.rootedLetter}>O</text>
                    {/* T is the CROSS - gap here from ~115 to ~185 */}
                    {/* E */}
                    <text x="185" y="195" className={styles.rootedLetter}>E</text>
                    {/* D */}
                    <text x="220" y="195" className={styles.rootedLetter}>D</text>
                </g>

                {/* IN CHRIST text below */}
                <text x="150" y="230" className={styles.inChristText} textAnchor="middle">
                    IN CHRIST
                </text>

                {/* Organic tree roots extending from cross bottom */}
                <g className={styles.roots}>
                    {/* Main center root - goes straight down */}
                    <path
                        d="M150 248 Q150 280 148 310 Q146 340 150 370"
                        stroke="currentColor"
                        strokeWidth="5"
                        fill="none"
                        strokeLinecap="round"
                        className={styles.rootMain}
                    />

                    {/* Primary roots - thick, organic curves */}
                    {/* Left side main roots */}
                    <path
                        d="M140 250 Q120 270 95 290 Q65 315 30 340 Q15 350 5 360"
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="none"
                        strokeLinecap="round"
                        className={styles.rootPrimary}
                    />
                    <path
                        d="M135 252 Q110 280 80 310 Q55 340 40 370"
                        stroke="currentColor"
                        strokeWidth="5"
                        fill="none"
                        strokeLinecap="round"
                        className={styles.rootPrimary}
                    />
                    <path
                        d="M142 255 Q125 285 105 325 Q90 355 85 380"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                        className={styles.rootPrimary}
                    />

                    {/* Right side main roots */}
                    <path
                        d="M160 250 Q180 270 205 290 Q235 315 270 340 Q285 350 295 360"
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="none"
                        strokeLinecap="round"
                        className={styles.rootPrimary}
                    />
                    <path
                        d="M165 252 Q190 280 220 310 Q245 340 260 370"
                        stroke="currentColor"
                        strokeWidth="5"
                        fill="none"
                        strokeLinecap="round"
                        className={styles.rootPrimary}
                    />
                    <path
                        d="M158 255 Q175 285 195 325 Q210 355 215 380"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                        className={styles.rootPrimary}
                    />

                    {/* Secondary branching roots - left */}
                    <path
                        d="M95 290 Q75 300 50 305 Q30 310 10 315"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        className={styles.rootSecondary}
                    />
                    <path
                        d="M80 310 Q60 320 35 325"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        fill="none"
                        strokeLinecap="round"
                        className={styles.rootSecondary}
                    />
                    <path
                        d="M65 315 Q50 330 30 340"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        className={styles.rootSecondary}
                    />
                    <path
                        d="M30 340 Q20 350 5 355"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        fill="none"
                        strokeLinecap="round"
                        className={styles.rootTendril}
                    />
                    <path
                        d="M105 325 Q85 340 60 350"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        className={styles.rootSecondary}
                    />
                    <path
                        d="M40 370 Q25 375 10 372"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        fill="none"
                        strokeLinecap="round"
                        className={styles.rootTendril}
                    />

                    {/* Secondary branching roots - right */}
                    <path
                        d="M205 290 Q225 300 250 305 Q270 310 290 315"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        className={styles.rootSecondary}
                    />
                    <path
                        d="M220 310 Q240 320 265 325"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        fill="none"
                        strokeLinecap="round"
                        className={styles.rootSecondary}
                    />
                    <path
                        d="M235 315 Q250 330 270 340"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        className={styles.rootSecondary}
                    />
                    <path
                        d="M270 340 Q280 350 295 355"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        fill="none"
                        strokeLinecap="round"
                        className={styles.rootTendril}
                    />
                    <path
                        d="M195 325 Q215 340 240 350"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        className={styles.rootSecondary}
                    />
                    <path
                        d="M260 370 Q275 375 290 372"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        fill="none"
                        strokeLinecap="round"
                        className={styles.rootTendril}
                    />

                    {/* Small wispy tendrils for organic detail */}
                    <path d="M50 305 Q40 312 25 310" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" className={styles.rootTendril} />
                    <path d="M250 305 Q260 312 275 310" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" className={styles.rootTendril} />
                    <path d="M35 325 Q25 332 12 328" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" className={styles.rootTendril} />
                    <path d="M265 325 Q275 332 288 328" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" className={styles.rootTendril} />
                    <path d="M60 350 Q48 358 35 355" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" className={styles.rootTendril} />
                    <path d="M240 350 Q252 358 265 355" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" className={styles.rootTendril} />
                    <path d="M85 380 Q70 378 60 382" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" className={styles.rootTendril} />
                    <path d="M215 380 Q230 378 240 382" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" className={styles.rootTendril} />
                    <path d="M148 370 Q135 375 125 372" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" className={styles.rootTendril} />
                    <path d="M152 370 Q165 375 175 372" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" className={styles.rootTendril} />

                    {/* Extra fine root details */}
                    <path d="M10 315 Q5 322 0 320" stroke="currentColor" strokeWidth="0.8" fill="none" strokeLinecap="round" className={styles.rootFine} />
                    <path d="M290 315 Q295 322 300 320" stroke="currentColor" strokeWidth="0.8" fill="none" strokeLinecap="round" className={styles.rootFine} />
                    <path d="M5 360 Q0 365 -5 362" stroke="currentColor" strokeWidth="0.8" fill="none" strokeLinecap="round" className={styles.rootFine} />
                    <path d="M295 360 Q300 365 305 362" stroke="currentColor" strokeWidth="0.8" fill="none" strokeLinecap="round" className={styles.rootFine} />
                </g>
            </svg>
        </div>
    );
}
