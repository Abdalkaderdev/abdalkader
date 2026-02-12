import { useEffect, useRef, useState } from 'react';
import styles from './MatrixCodeAnimation.module.scss';

interface MatrixCodeAnimationProps {
    variant?: 'orange' | 'gold' | 'blue' | 'green';
    speed?: 'slow' | 'normal' | 'fast';
    density?: 'sparse' | 'normal' | 'dense';
    text?: string;
}

const COLORS = {
    orange: { primary: '#ff6b35', secondary: '#ff8c5a', dim: 'rgba(255, 107, 53, 0.3)' },
    gold: { primary: '#d4af37', secondary: '#f5d76e', dim: 'rgba(212, 175, 55, 0.3)' },
    blue: { primary: '#3b82f6', secondary: '#60a5fa', dim: 'rgba(59, 130, 246, 0.3)' },
    green: { primary: '#22c55e', secondary: '#4ade80', dim: 'rgba(34, 197, 94, 0.3)' },
};

const CODE_CHARS = '01アイウエオカキクケコ<>{}[]=/\\|;:!@#$%^&*';

// Text scramble hook
function useTextScramble(finalText: string, duration: number = 2000) {
    const [displayText, setDisplayText] = useState('');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';

    useEffect(() => {
        if (!finalText) return;

        let iteration = 0;
        const totalIterations = 30;
        const intervalTime = duration / totalIterations;

        const interval = setInterval(() => {
            setDisplayText(
                finalText
                    .split('')
                    .map((char, index) => {
                        if (char === ' ') return ' ';
                        if (index < iteration) {
                            return finalText[index];
                        }
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('')
            );

            iteration += 1 / 3;

            if (iteration >= finalText.length) {
                clearInterval(interval);
                setDisplayText(finalText);
            }
        }, intervalTime);

        return () => clearInterval(interval);
    }, [finalText, duration]);

    return displayText;
}

export default function MatrixCodeAnimation({
    variant = 'orange',
    speed = 'normal',
    density = 'normal',
    text = ''
}: MatrixCodeAnimationProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const scrambledText = useTextScramble(text, 2500);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const resizeCanvas = () => {
            const rect = container.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
        };
        resizeCanvas();

        const colors = COLORS[variant];
        const fontSize = 14;
        const columnWidth = density === 'sparse' ? 30 : density === 'dense' ? 18 : 24;
        const columns = Math.floor(canvas.width / columnWidth);

        // Track y position for each column
        const drops: number[] = Array(columns).fill(0).map(() => Math.random() * -100);
        const speeds: number[] = Array(columns).fill(0).map(() => Math.random() * 0.8 + 0.4);

        // Speed multiplier
        const speedMultiplier = speed === 'slow' ? 0.5 : speed === 'fast' ? 1.5 : 1;

        let animationId: number;
        let lastTime = 0;
        const frameInterval = 45 / speedMultiplier;

        const draw = (currentTime: number) => {
            if (currentTime - lastTime < frameInterval) {
                animationId = requestAnimationFrame(draw);
                return;
            }
            lastTime = currentTime;

            // Fade effect
            ctx.fillStyle = 'rgba(10, 10, 10, 0.08)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

            for (let i = 0; i < drops.length; i++) {
                const x = i * columnWidth + columnWidth / 2;
                const y = drops[i] * fontSize;

                // Draw trailing characters
                for (let j = 0; j < 12; j++) {
                    const trailY = y - (j * fontSize);
                    if (trailY > 0 && trailY < canvas.height) {
                        const opacity = 1 - (j / 12);
                        const char = CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];

                        if (j === 0) {
                            // Head character - brightest
                            ctx.fillStyle = colors.secondary;
                        } else {
                            ctx.fillStyle = `rgba(${
                                variant === 'orange' ? '255, 107, 53' :
                                variant === 'gold' ? '212, 175, 55' :
                                variant === 'blue' ? '59, 130, 246' : '34, 197, 94'
                            }, ${opacity * 0.6})`;
                        }
                        ctx.fillText(char, x, trailY);
                    }
                }

                // Move drop down
                drops[i] += speeds[i];

                // Reset when reaching bottom
                if (y > canvas.height + 100) {
                    drops[i] = Math.random() * -20;
                    speeds[i] = Math.random() * 0.8 + 0.4;
                }
            }

            animationId = requestAnimationFrame(draw);
        };

        animationId = requestAnimationFrame(draw);

        // Handle resize
        const resizeObserver = new ResizeObserver(resizeCanvas);
        resizeObserver.observe(container);

        return () => {
            cancelAnimationFrame(animationId);
            resizeObserver.disconnect();
        };
    }, [variant, speed, density]);

    const colors = COLORS[variant];

    return (
        <div ref={containerRef} className={styles.container}>
            <canvas ref={canvasRef} className={styles.canvas} />
            <div className={styles.overlay} />
            {text && (
                <div className={styles.textOverlay}>
                    <span
                        className={styles.scrambleText}
                        style={{ color: colors.primary }}
                    >
                        {scrambledText}
                    </span>
                </div>
            )}
        </div>
    );
}
