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

// Code snippets that will fall
const CODE_SNIPPETS = [
    'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while',
    'class', 'import', 'export', 'async', 'await', 'Promise', 'useState',
    'useEffect', 'React', 'Next.js', 'TypeScript', '=> {', '};', '()', '[]',
    '<div>', '</>', 'props', 'state', 'render', 'fetch', 'API', 'JSON',
    'true', 'false', 'null', 'npm', 'yarn', 'git', 'push', 'commit',
    '===', '!==', '&&', '||', '=>', '...', '{}', 'map()', 'filter()',
    '.tsx', '.ts', '.js', 'node', 'build', 'deploy', 'test', 'lint',
    'interface', 'type', 'string', 'number', 'boolean', 'void', 'any',
    'onClick', 'onChange', 'onSubmit', 'event', 'target', 'value',
    'GSAP', 'Framer', 'CSS', 'SCSS', 'flex', 'grid', 'animate',
    'http://', 'https://', 'localhost', ':3000', 'vercel', 'deploy',
    'SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'JOIN',
];

// Text scramble hook
function useTextScramble(finalText: string, duration: number = 2000) {
    const [displayText, setDisplayText] = useState('');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>/';

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
        const fontSize = 12;
        const columnWidth = density === 'sparse' ? 80 : density === 'dense' ? 50 : 65;
        const columns = Math.floor(canvas.width / columnWidth);

        // Track each column's state
        interface ColumnState {
            y: number;
            speed: number;
            snippet: string;
            charIndex: number;
        }

        const columnStates: ColumnState[] = Array(columns).fill(null).map(() => ({
            y: Math.random() * -500,
            speed: Math.random() * 1.5 + 0.8,
            snippet: CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)],
            charIndex: 0
        }));

        // Speed multiplier
        const speedMultiplier = speed === 'slow' ? 0.5 : speed === 'fast' ? 1.5 : 1;

        let animationId: number;
        let lastTime = 0;
        const frameInterval = 50 / speedMultiplier;

        const draw = (currentTime: number) => {
            if (currentTime - lastTime < frameInterval) {
                animationId = requestAnimationFrame(draw);
                return;
            }
            lastTime = currentTime;

            // Fade effect
            ctx.fillStyle = 'rgba(10, 10, 10, 0.06)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.font = `${fontSize}px 'JetBrains Mono', 'SF Mono', monospace`;

            for (let i = 0; i < columnStates.length; i++) {
                const col = columnStates[i];
                const x = i * columnWidth + 10;

                // Draw the current snippet character by character going down
                for (let j = 0; j < col.snippet.length; j++) {
                    const charY = col.y + (j * fontSize * 1.2);

                    if (charY > 0 && charY < canvas.height) {
                        const isHead = j === col.snippet.length - 1;
                        const opacity = 1 - (j / (col.snippet.length + 5));

                        if (isHead) {
                            ctx.fillStyle = colors.secondary;
                            ctx.shadowColor = colors.primary;
                            ctx.shadowBlur = 10;
                        } else {
                            ctx.shadowBlur = 0;
                            ctx.fillStyle = `rgba(${
                                variant === 'orange' ? '255, 107, 53' :
                                variant === 'gold' ? '212, 175, 55' :
                                variant === 'blue' ? '59, 130, 246' : '34, 197, 94'
                            }, ${Math.max(0.2, opacity * 0.7)})`;
                        }

                        ctx.fillText(col.snippet[j], x, charY);
                    }
                }

                // Move column down
                col.y += col.speed * 2;

                // Reset when off screen
                if (col.y > canvas.height + 100) {
                    col.y = Math.random() * -200 - 50;
                    col.speed = Math.random() * 1.5 + 0.8;
                    col.snippet = CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
                }
            }

            ctx.shadowBlur = 0;
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
