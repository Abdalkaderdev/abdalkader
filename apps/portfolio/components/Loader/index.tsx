import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { gsap } from "@/libs/gsap";
import { CircularProgress } from "@abdalkader/ui";

export default function Loader() {
    const percentageRef = useRef<HTMLSpanElement>(null);
    const router = useRouter();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const counter = { count: 0 };

        const tl = gsap.timeline({
            defaults: { ease: "power1.out" },
            onUpdate: () => {
                const currentProgress = Math.floor(counter.count);
                if (percentageRef.current) {
                    percentageRef.current.textContent = `${currentProgress}`;
                }
                setProgress(currentProgress);
            },
            onComplete: () => {
                tl.to(".counter span", {
                    y: "-110%",
                    duration: 1.2,
                    ease: "power4.inOut",
                })
                    .to(".intro", {
                        y: "-100%",
                        duration: 1.5,
                        ease: "power4.inOut",
                        onComplete: () => {
                            document.querySelector(".intro")?.classList.add("hidden");
                        },
                    }, "-=0.5")
            },
        });

        tl.to(counter, {
            count: 100,
            duration: 6,
        });

        const handlePageLoad = () => {
            if (counter.count === 100) {
                tl.play();
            }
        };

        window.addEventListener("load", handlePageLoad);

        return () => {
            window.removeEventListener("load", handlePageLoad);
            tl.kill();
            gsap.killTweensOf(".intro");
        };
    }, [router.events]);

    return (
        <section className="intro">
            <div className="loader-content">
                <div className="counter">
                    <span ref={percentageRef}>0</span>
                </div>
                <CircularProgress 
                    value={progress} 
                    size="lg" 
                    showLabel={false}
                    className="loader-progress"
                />
            </div>
        </section>
    );
}