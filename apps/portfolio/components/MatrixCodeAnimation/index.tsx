import { useEffect, useRef, useState } from 'react';
import styles from './MatrixCodeAnimation.module.scss';

interface MatrixCodeAnimationProps {
    variant?: 'orange' | 'gold' | 'blue' | 'green';
    speed?: 'slow' | 'normal' | 'fast';
    density?: 'sparse' | 'normal' | 'dense';
    text?: string;
}

const COLORS = {
    orange: { primary: '#ff6b35', secondary: '#ffffff', dim: '#331507' },
    gold: { primary: '#d4af37', secondary: '#ffffff', dim: '#2a220b' },
    blue: { primary: '#3b82f6', secondary: '#ffffff', dim: '#0c1929' },
    green: { primary: '#22c55e', secondary: '#ffffff', dim: '#052e16' },
};

// Code snippets for Matrix rain - real programming content
const CODE_SNIPPETS = [
    // Functions & Methods
    'getData()', 'fetch()', 'render()', 'init()', 'parse()',
    'async', 'await', 'return', 'export', 'import',
    'console.log()', 'setTimeout()', 'Promise.all()',
    // API & HTTP
    'POST /api', 'GET /users', 'PUT /data', 'DELETE',
    'res.json()', 'req.body', 'status: 200', 'headers',
    'Authorization', 'Bearer token', 'Content-Type',
    // React & Hooks
    'useState()', 'useEffect()', 'useRef()', 'useMemo()',
    '<Component />', 'props', 'children', 'onClick',
    'className', 'setState()', 'dispatch()', 'reducer',
    // TypeScript
    'interface', 'type', ': string', ': number', ': boolean',
    'extends', 'implements', 'generic<T>', 'readonly',
    // Variables & Keywords
    'const data =', 'let result', 'function()', '=>',
    'if (true)', 'else {', 'for (i++)', 'while',
    'try {', 'catch (e)', 'finally', 'throw new',
    // Objects & Arrays
    '{ key: val }', '[ ...arr ]', 'map()', 'filter()',
    'reduce()', 'forEach()', 'find()', 'includes()',
    // Database
    'SELECT *', 'FROM users', 'WHERE id', 'JOIN',
    'INSERT INTO', 'UPDATE SET', 'CREATE TABLE',
    'mongoose', 'prisma', 'query()', 'mutation',
    // Modern JS
    'async/await', 'Promise', 'Observable', 'subscribe',
    'import from', 'export default', 'module.exports',
    '?.optional', '??=', '...spread', 'destructure',
    // DevOps & Config
    'npm install', 'yarn add', 'docker run', 'git push',
    'env.PORT', 'process.env', 'config.json', 'package',
    // Numbers & Symbols
    '0x1F4A9', '127.0.0.1', ':3000', 'localhost',
    '===', '!==', '&&', '||', '++', '--', '**',
    'null', 'undefined', 'NaN', 'true', 'false',
];

// Text scramble hook for project name
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
            initGrid();
        };

        const colors = COLORS[variant];
        // Font size for code text
        const fontSize = density === 'sparse' ? 14 : density === 'dense' ? 10 : 12;
        const lineHeight = fontSize * 1.4;

        // Calculate column width based on average code snippet length
        const avgSnippetWidth = 12; // Average characters per snippet
        const columnWidth = fontSize * 0.6 * avgSnippetWidth;

        // Each row has a code snippet and brightness
        interface CodeLine {
            code: string;
            brightness: number;
        }

        interface Column {
            lines: CodeLine[];
            headY: number;
            speed: number;
            delay: number;
        }

        let columns: Column[] = [];
        let numCols = 0;
        let numRows = 0;

        const getRandomSnippet = () => CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];

        const initGrid = () => {
            numCols = Math.max(3, Math.floor(canvas.width / columnWidth));
            numRows = Math.floor(canvas.height / lineHeight) + 5;

            columns = [];
            for (let c = 0; c < numCols; c++) {
                const lines: CodeLine[] = [];
                for (let r = 0; r < numRows; r++) {
                    lines.push({
                        code: getRandomSnippet(),
                        brightness: 0
                    });
                }
                columns.push({
                    lines,
                    headY: Math.random() * -canvas.height * 0.5,
                    speed: Math.random() * 1.2 + 0.8,
                    delay: Math.random() * 80
                });
            }
        };

        resizeCanvas();

        const speedMultiplier = speed === 'slow' ? 0.5 : speed === 'fast' ? 1.5 : 1;

        let animationId: number;

        const draw = () => {
            // Clear with solid black
            ctx.fillStyle = '#0a0a0a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.font = `${fontSize}px "JetBrains Mono", "Fira Code", "Consolas", monospace`;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';

            for (let c = 0; c < columns.length; c++) {
                const col = columns[c];
                const x = c * columnWidth + 10;

                if (col.delay > 0) {
                    col.delay--;
                    continue;
                }

                col.headY += col.speed * speedMultiplier;
                const headRow = Math.floor(col.headY / lineHeight);

                for (let r = 0; r < col.lines.length; r++) {
                    const line = col.lines[r];
                    const y = r * lineHeight;

                    // Randomly change code snippet (less frequently)
                    if (Math.random() < 0.005) {
                        line.code = getRandomSnippet();
                    }

                    const distFromHead = headRow - r;

                    if (distFromHead < 0) {
                        line.brightness = 0;
                    } else if (distFromHead === 0) {
                        line.brightness = 1.2;
                    } else if (distFromHead < 15) {
                        line.brightness = Math.max(0, 1 - (distFromHead / 15));
                    } else {
                        line.brightness = Math.max(0, 0.2 - (distFromHead - 15) * 0.008);
                    }

                    if (line.brightness > 0) {
                        if (line.brightness >= 1.2) {
                            ctx.fillStyle = '#ffffff';
                        } else if (line.brightness > 0.6) {
                            ctx.fillStyle = colors.primary;
                        } else {
                            const red = parseInt(colors.primary.slice(1, 3), 16);
                            const green = parseInt(colors.primary.slice(3, 5), 16);
                            const blue = parseInt(colors.primary.slice(5, 7), 16);
                            ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${Math.max(0.3, line.brightness)})`;
                        }
                        ctx.fillText(line.code, x, y);
                    }
                }

                if (col.headY > canvas.height + lineHeight * 20) {
                    col.headY = -Math.random() * 150 - 50;
                    col.speed = Math.random() * 1.2 + 0.8;
                    for (let r = 0; r < col.lines.length; r++) {
                        if (Math.random() < 0.4) {
                            col.lines[r].code = getRandomSnippet();
                        }
                    }
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
