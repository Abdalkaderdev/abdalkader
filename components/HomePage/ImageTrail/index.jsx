import { useEffect, useRef } from "react";
import Image from "next/image";
import styles from './ImageTrail.module.scss';

const lerp = (a, b, n) => (1 - n) * a + n * b;
const map = (x, a, b, c, d) => ((x - a) * (d - c)) / (b - a) + c;

export default function ImageTrail() {
    const trailRef = useRef(null);
    const cursor = useRef({ x: 0, y: 0 });
    const winsize = useRef({ width: 0, height: 0 });

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            return; // Do not initialize trail effect
        }
        const getCursorPos = (ev) => {
            const nx = ev.clientX;
            const ny = ev.clientY;
            // Only update and trigger if cursor actually moved
            if (nx !== cursor.current.x || ny !== cursor.current.y) {
                cursor.current = { x: nx, y: ny };
                // Kick the render loop if not already running
                if (imageTrailEffect && imageTrailEffect.rafId === null) {
                    imageTrailEffect.rafId = requestAnimationFrame(() => imageTrailEffect.render());
                }
            }
        };

        const handleResize = () => {
            winsize.current = { width: window.innerWidth, height: window.innerHeight };
        };

        winsize.current = { width: window.innerWidth, height: window.innerHeight };
        window.addEventListener("mousemove", getCursorPos);
        window.addEventListener("resize", handleResize);

        class ImageTrailEffect {
            constructor(el) {
                this.DOM = { el };
                this.totalTrailElements = 9;
                // Initialize imgTransforms as a plain array
                this.imgTransforms = Array.from({ length: this.totalTrailElements }, () => ({ x: 0, y: 0, rx: 0, ry: 0, rz: 0 }));
                this.lastCursor = { x: NaN, y: NaN };
                this.rafId = null;
                this.layout();
                // Do not start a continuous loop; wait for first input
            }

            layout() {
                const bgImage = /(?:\(['"]?)(.*?)(?:['"]?\))/.exec(this.DOM.el.style.backgroundImage)[1];
                this.DOM.el.style.backgroundImage = 'none';
                this.DOM.el.innerHTML = Array.from({ length: this.totalTrailElements }, (_, i) => {
                    const opacityVal = i === this.totalTrailElements - 1 ? 1 : (i + 1) / this.totalTrailElements;
                    return `<img class="trail__img" src="${bgImage}" style="opacity: ${opacityVal}"/>`;
                }).join('');
                this.DOM.trailElems = this.DOM.el.querySelectorAll('.trail__img');
            }

            render() {
                const targetX = map(cursor.current.x, 0, winsize.current.width, -200, 200);
                const targetY = map(cursor.current.y, 0, winsize.current.height, -70, 70);
                const targetRz = map(cursor.current.x, 0, winsize.current.width, -10, 10);

                let maxDelta = 0;
                this.imgTransforms.forEach((transform, i) => {
                    const amt = 0.02 * i + 0.05;
                    const nx = lerp(transform.x, targetX, amt);
                    const ny = lerp(transform.y, targetY, amt);
                    const nrz = lerp(transform.rz, targetRz, amt);
                    maxDelta = Math.max(maxDelta, Math.abs(nx - transform.x), Math.abs(ny - transform.y), Math.abs(nrz - transform.rz));
                    transform.x = nx;
                    transform.y = ny;
                    transform.rz = nrz;
                    this.DOM.trailElems[i].style.transform = `translate(${transform.x}px, ${transform.y}px) rotateZ(${transform.rz}deg)`;
                });

                // Determine if we should continue animating
                const cursorMoved = (this.lastCursor.x !== cursor.current.x) || (this.lastCursor.y !== cursor.current.y);
                this.lastCursor = { ...cursor.current };

                const stillSettling = maxDelta > 0.05; // threshold for motion settling

                if (cursorMoved || stillSettling) {
                    this.rafId = requestAnimationFrame(() => this.render());
                } else {
                    // Stop the loop until next cursor movement
                    this.rafId = null;
                }
            }
        }

        let imageTrailEffect = new ImageTrailEffect(trailRef.current);

        return () => {
            window.removeEventListener("mousemove", getCursorPos);
            window.removeEventListener("resize", handleResize);
            if (imageTrailEffect && imageTrailEffect.rafId) {
                cancelAnimationFrame(imageTrailEffect.rafId);
                imageTrailEffect.rafId = null;
            }
        };
    }, []);

    return (
        <>
            <div className={styles.content}>
                <div ref={trailRef} className={styles.trail} style={{ backgroundImage: 'url(/images/about2.png)' }} />
                {/* Static fallback for reduced motion users (hidden when JS trail is active) */}
                <noscript>
                    <Image src="/images/about2.png" width={800} height={600} alt="Decorative" />
                </noscript>
            </div>
        </>
    );
}