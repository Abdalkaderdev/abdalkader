import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

// Guard plugin registration to client-side only to avoid SSR/window reference issues
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
