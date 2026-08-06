import { useCallback, useEffect, useRef, useState } from 'react';

const EASE = 0.1; // matches the MotionSites reference

/**
 * Tracks the pointer inside an element and writes eased `--mx` / `--my` custom
 * properties, for a CSS radial-gradient mask to follow.
 *
 * Deliberately avoids the reference implementation's canvas + `toDataURL()` per
 * frame: that forces a canvas readback, a base64 encode, and a CSS mask re-parse
 * on every frame. Two custom properties cost effectively nothing, which matters
 * on a page already running GSAP, Framer Motion and Lenis.
 *
 * Inert when the user prefers reduced motion, and on coarse pointers where
 * there is no cursor to follow.
 */
export default function useSpotlight<T extends HTMLElement = HTMLDivElement>() {
    const ref = useRef<T>(null);
    const [active, setActive] = useState(false);

    const target = useRef({ x: 0, y: 0 });
    const smooth = useRef({ x: 0, y: 0 });
    const raf = useRef<number | null>(null);
    const enabled = useRef(true);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
        const coarse = window.matchMedia('(pointer: coarse)');
        const sync = () => {
            enabled.current = !motion.matches && !coarse.matches;
        };
        sync();
        motion.addEventListener('change', sync);
        coarse.addEventListener('change', sync);
        return () => {
            motion.removeEventListener('change', sync);
            coarse.removeEventListener('change', sync);
        };
    }, []);

    const tick = useCallback(() => {
        const el = ref.current;
        if (!el) return;
        smooth.current.x += (target.current.x - smooth.current.x) * EASE;
        smooth.current.y += (target.current.y - smooth.current.y) * EASE;
        el.style.setProperty('--mx', `${smooth.current.x}px`);
        el.style.setProperty('--my', `${smooth.current.y}px`);
        raf.current = requestAnimationFrame(tick);
    }, []);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const onEnter = (e: PointerEvent) => {
            if (!enabled.current) return;
            // Seed the spotlight at the entry point and paint it immediately, so
            // the first visible frame is already correct rather than easing in
            // from wherever the pointer last was.
            const r = el.getBoundingClientRect();
            const p = { x: e.clientX - r.left, y: e.clientY - r.top };
            target.current = p;
            smooth.current = { ...p };
            el.style.setProperty('--mx', `${p.x}px`);
            el.style.setProperty('--my', `${p.y}px`);
            setActive(true);
            if (raf.current === null) raf.current = requestAnimationFrame(tick);
        };
        const onMove = (e: PointerEvent) => {
            if (!enabled.current) return;
            const r = el.getBoundingClientRect();
            target.current = { x: e.clientX - r.left, y: e.clientY - r.top };
        };
        const onLeave = () => {
            setActive(false);
            if (raf.current !== null) {
                cancelAnimationFrame(raf.current);
                raf.current = null;
            }
        };

        el.addEventListener('pointerenter', onEnter);
        el.addEventListener('pointermove', onMove);
        el.addEventListener('pointerleave', onLeave);
        return () => {
            el.removeEventListener('pointerenter', onEnter);
            el.removeEventListener('pointermove', onMove);
            el.removeEventListener('pointerleave', onLeave);
            if (raf.current !== null) {
                cancelAnimationFrame(raf.current);
                raf.current = null;
            }
        };
    }, [tick]);

    return { ref, active };
}
