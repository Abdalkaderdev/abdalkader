'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/libs/gsap';
import styles from './MagneticCursor.module.scss';

export default function MagneticCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const cursorDotRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const [cursorText, setCursorText] = useState('');

    useEffect(() => {
        // Check for touch device or reduced motion
        if (typeof window === 'undefined') return;
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (isTouchDevice || prefersReducedMotion) return;

        const cursor = cursorRef.current;
        const dot = cursorDotRef.current;
        if (!cursor || !dot) return;

        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;

        // Smooth cursor following
        const animateCursor = () => {
            const dx = mouseX - cursorX;
            const dy = mouseY - cursorY;

            cursorX += dx * 0.15;
            cursorY += dy * 0.15;

            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
            dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;

            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        // Mouse move handler
        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        // Handle interactive elements
        const handleMouseEnter = (e: Event) => {
            const target = e.target as HTMLElement;
            setIsHovering(true);

            // Check for cursor text
            const text = target.dataset.cursorText;
            if (text) {
                setCursorText(text);
            }

            // Magnetic effect for buttons/links
            if (target.matches('a, button, [data-magnetic]')) {
                gsap.to(cursor, {
                    scale: 2.5,
                    duration: 0.3,
                    ease: 'power2.out',
                });
            }
        };

        const handleMouseLeave = () => {
            setIsHovering(false);
            setCursorText('');

            gsap.to(cursor, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out',
            });
        };

        // Click effects
        const handleMouseDown = () => {
            setIsClicking(true);
            gsap.to(cursor, {
                scale: 0.8,
                duration: 0.1,
            });
        };

        const handleMouseUp = () => {
            setIsClicking(false);
            gsap.to(cursor, {
                scale: isHovering ? 2.5 : 1,
                duration: 0.2,
                ease: 'back.out(1.7)',
            });
        };

        // Add event listeners
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);

        // Add hover listeners to interactive elements
        const interactiveElements = document.querySelectorAll('a, button, [data-magnetic], [data-cursor-text]');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', handleMouseEnter);
            el.addEventListener('mouseleave', handleMouseLeave);
        });

        // MutationObserver to handle dynamically added elements
        const observer = new MutationObserver(() => {
            const newElements = document.querySelectorAll('a, button, [data-magnetic], [data-cursor-text]');
            newElements.forEach(el => {
                el.removeEventListener('mouseenter', handleMouseEnter);
                el.removeEventListener('mouseleave', handleMouseLeave);
                el.addEventListener('mouseenter', handleMouseEnter);
                el.addEventListener('mouseleave', handleMouseLeave);
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);
            interactiveElements.forEach(el => {
                el.removeEventListener('mouseenter', handleMouseEnter);
                el.removeEventListener('mouseleave', handleMouseLeave);
            });
            observer.disconnect();
        };
    }, [isHovering]);

    return (
        <>
            <div
                ref={cursorRef}
                className={`${styles.cursor} ${isHovering ? styles.hovering : ''} ${isClicking ? styles.clicking : ''}`}
            >
                {cursorText && <span className={styles.cursorText}>{cursorText}</span>}
            </div>
            <div ref={cursorDotRef} className={styles.cursorDot} />
        </>
    );
}
