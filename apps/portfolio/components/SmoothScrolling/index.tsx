"use client";
import { ReactLenis } from "@studio-freight/react-lenis";
import { ReactNode } from "react";

// Define props type for children
interface SmoothScrollingProps {
    children: ReactNode;
}

export default function SmoothScrolling({ children }: SmoothScrollingProps) {
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Disable Lenis if user prefers reduced motion
    if (prefersReducedMotion) {
        return <>{children}</>;
    }

    return (
        <ReactLenis root options={{ lerp: 0.15, duration: 1.5 }}>
            {children}
        </ReactLenis>
    );
}
