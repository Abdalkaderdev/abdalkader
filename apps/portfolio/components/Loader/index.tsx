import { useEffect, useRef, useState } from "react";
import { gsap } from "@/libs/gsap";
import { isReducedMotion } from "@/utils/motion";
import VideoBackground from '@/components/VideoBackground';

export default function Loader() {
    const percentageRef = useRef<HTMLSpanElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
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

                // Play the whoosh sound effect
                if (audioRef.current) {
                    audioRef.current.volume = 0.4;
                    audioRef.current.play().catch(() => {});
                }

                // Fade out sequence - cross scales UP big, then screen slides up (faster)
                gsap.timeline()
                    .to(".counter span", {
                        y: "-110%",
                        duration: 0.4,
                        ease: "power4.inOut",
                    })
                    .to(".cross-loader", {
                        scale: 1.5,
                        duration: 0.3,
                        ease: "power2.out",
                    }, "-=0.3")
                    .to(".cross-loader", {
                        scale: 3,
                        opacity: 0,
                        duration: 0.5,
                        ease: "power2.inOut",
                    })
                    .to(".intro", {
                        y: "-100%",
                        duration: 0.6,
                        ease: "power4.inOut",
                        onComplete: () => {
                            document.querySelector(".intro")?.classList.add("hidden");
                        },
                    }, "-=0.3");
            },
        });

        // Animate counter - slower and more immersive
        tl.to(counter, {
            count: 100,
            duration: 2,
            ease: "power1.out",
        }, 0);

        const handlePageLoad = () => {
            tl.play();
        };

        // Check if page is already loaded, otherwise wait for load event
        if (document.readyState === 'complete') {
            setTimeout(() => tl.play(), 50);
        } else {
            window.addEventListener("load", handlePageLoad);
        }

        return () => {
            window.removeEventListener("load", handlePageLoad);
            tl.kill();
            gsap.killTweensOf(".intro");
            gsap.killTweensOf(".counter span");
            gsap.killTweensOf(".cross-loader");
        };
    }, []);

    return (
        <section className="intro">
            {/* Video Background */}
            <VideoBackground
                src="/videos/loader-bg.mp4"
                opacity={0.3}
                overlay={false}
            />

            {/* Sound effect for cross scale */}
            <audio ref={audioRef} src="/audio/whoosh.mp3" preload="auto" />

            {/* Animated Cross Loader */}
            <div className="loader-main">
                <div className={`cross-loader ${isComplete ? 'complete' : ''}`}>
                    <div className="loading-wide">
                        {/* Main cross bars */}
                        <div className="l1 color" />
                        <div className="l2 color" />
                        {/* Decorative elements */}
                        <div className="e1 color animation-effect-light" />
                        <div className="e2 color animation-effect-light-d" />
                        <div className="e3">✝</div>
                        <div className="e4 color animation-effect-light" />
                        <div className="e5 color animation-effect-light-d" />
                        <div className="e6 animation-effect-scale">✦</div>
                        <div className="e7 color" />
                        <div className="e8 color" />
                    </div>
                </div>

                {/* Counter */}
                <div className="counter">
                    <span ref={percentageRef}>0</span>
                </div>
            </div>

            {/* Subtle message at bottom */}
            <div className="loader-message">
                <span>Crafted with faith</span>
            </div>
        </section>
    );
}
