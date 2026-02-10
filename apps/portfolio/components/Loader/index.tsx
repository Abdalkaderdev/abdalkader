import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { gsap } from "@/libs/gsap";
import { isReducedMotion } from "@/utils/motion";

export default function Loader() {
    const crossRef = useRef<SVGSVGElement>(null);
    const percentageRef = useRef<HTMLSpanElement>(null);
    const router = useRouter();
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        // Skip animations for users who prefer reduced motion
        if (isReducedMotion()) {
            if (percentageRef.current) {
                percentageRef.current.textContent = '100';
            }
            document.querySelector(".intro")?.classList.add("hidden");
            return;
        }

        const verticalLine = crossRef.current?.querySelector('.cross-vertical') as SVGLineElement;
        const horizontalLine = crossRef.current?.querySelector('.cross-horizontal') as SVGLineElement;

        if (!verticalLine || !horizontalLine) return;

        // Calculate path lengths
        const verticalLength = verticalLine.getTotalLength();
        const horizontalLength = horizontalLine.getTotalLength();

        // Set initial state - lines hidden
        gsap.set(verticalLine, {
            strokeDasharray: verticalLength,
            strokeDashoffset: verticalLength,
        });
        gsap.set(horizontalLine, {
            strokeDasharray: horizontalLength,
            strokeDashoffset: horizontalLength,
        });

        const counter = { count: 0 };

        const tl = gsap.timeline({
            defaults: { ease: "power2.inOut" },
            onUpdate: () => {
                const currentProgress = Math.floor(counter.count);
                if (percentageRef.current) {
                    percentageRef.current.textContent = `${currentProgress}`;
                }
            },
            onComplete: () => {
                setIsComplete(true);
                // Add glow effect when complete
                gsap.to(crossRef.current, {
                    filter: "drop-shadow(0 0 25px rgba(245, 245, 220, 0.9))",
                    duration: 0.5,
                });

                // Fade out sequence
                gsap.timeline()
                    .to(".counter span", {
                        y: "-110%",
                        duration: 1.2,
                        ease: "power4.inOut",
                    })
                    .to(crossRef.current, {
                        scale: 1.2,
                        opacity: 0,
                        duration: 0.8,
                        ease: "power4.inOut",
                    }, "-=0.8")
                    .to(".intro", {
                        y: "-100%",
                        duration: 1.5,
                        ease: "power4.inOut",
                        onComplete: () => {
                            document.querySelector(".intro")?.classList.add("hidden");
                        },
                    }, "-=0.5");
            },
        });

        // Animate counter and cross simultaneously
        tl.to(counter, {
            count: 100,
            duration: 6,
            ease: "power1.out",
        }, 0);

        // Draw vertical line synced with counter
        tl.to(verticalLine, {
            strokeDashoffset: 0,
            duration: 4,
            ease: "power1.inOut",
        }, 0.5);

        // Draw horizontal line
        tl.to(horizontalLine, {
            strokeDashoffset: 0,
            duration: 3,
            ease: "power1.inOut",
        }, 2);

        const handlePageLoad = () => {
            tl.play();
        };

        // Check if page is already loaded, otherwise wait for load event
        if (document.readyState === 'complete') {
            // Small delay to ensure DOM is fully ready
            setTimeout(() => tl.play(), 50);
        } else {
            window.addEventListener("load", handlePageLoad);
        }

        // Store ref value for cleanup
        const crossElement = crossRef.current;

        return () => {
            window.removeEventListener("load", handlePageLoad);
            tl.kill();
            gsap.killTweensOf(".intro");
            gsap.killTweensOf(".counter span");
            if (crossElement) {
                gsap.killTweensOf(crossElement);
            }
        };
    }, [router.events]);

    return (
        <section className="intro">
            {/* Centered Cross */}
            <div className="loader-cross-container">
                <svg
                    ref={crossRef}
                    className={`loader-cross ${isComplete ? 'complete' : ''}`}
                    viewBox="0 0 100 100"
                    width="150"
                    height="150"
                >
                    {/* Vertical line of the cross */}
                    <line
                        className="cross-vertical"
                        x1="50"
                        y1="10"
                        x2="50"
                        y2="90"
                        stroke="#f5f5dc"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    />
                    {/* Horizontal line of the cross */}
                    <line
                        className="cross-horizontal"
                        x1="20"
                        y1="35"
                        x2="80"
                        y2="35"
                        stroke="#f5f5dc"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    />
                </svg>
            </div>

            {/* Counter in bottom-right (original position) */}
            <div className="counter">
                <span ref={percentageRef}>0</span>
            </div>
        </section>
    );
}