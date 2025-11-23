import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router'; // Import useRouter
import { gsap } from '@/libs/gsap';
import styles from './Nav.module.scss';

// Define your links and paths
const links = [
    { name: 'Home', path: '/' },
    { name: 'About me', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Contact', path: '/contact' },
];

// Cross-app navigation links
const crossAppLinks = [
    { name: 'Blog', path: 'https://blog.abdalkader.dev', external: true },
    { name: 'Docs', path: 'https://docs.abdalkader.dev', external: true },
    { name: 'Components', path: 'https://storybook.abdalkader.dev', external: true },
    { name: 'Programming Museum', path: 'https://history.abdalkader.dev', external: true },
];

export default function Nav() {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigationMenuRef = useRef<HTMLDivElement>(null);
    const linksRef = useRef<HTMLUListElement>(null);
    const firstLinkRef = useRef<HTMLAnchorElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);
    const router = useRouter(); // Get the router instance

    // Menu Animation
    useEffect(() => {
        const links = linksRef.current?.children;

        // Create a GSAP timeline
        const timeline = gsap.timeline();

        if (menuOpen) {
            // Open menu animation
            timeline
                .to(navigationMenuRef.current, {
                    clipPath: 'inset(0% 0% 0% 0%)',
                    duration: 0.8,
                    ease: 'power4.inOut',
                    autoAlpha: 1,
                })
                .fromTo(
                    links ? Array.from(links).map(link => link.firstChild) : [], // Safely handle undefined
                    { y: '-100%' }, // Start from below and invisible
                    {
                        y: '0%', // Move to original position
                        duration: 0.8,
                        stagger: 0.05,
                        ease: 'power4.inOut',
                    },
                    '-=0.3' // Start the link animation 0.5 seconds earlier
                );
        } else {
            // Close menu animation
            timeline
                .to(
                    links ? Array.from(links).map(link => link.firstChild) : [], // Safely handle undefined
                    {
                        y: '-100%', // Move up
                        duration: 0.8,
                        stagger: 0.05,
                        ease: 'power4.inOut',
                    }
                )
                .to(navigationMenuRef.current, {
                    clipPath: 'inset(0% 0% 100% 0%)', // Hide menu
                    duration: 0.8,
                    ease: 'power4.inOut',
                }, '-=0.3'); // Start the menu hiding 0.5 seconds after link animation starts
        }

        // Cleanup function to kill the timeline on unmount
        return () => {
            timeline.kill();
        };
    }, [menuOpen]);

    // Accessibility: focus trap, ESC to close, restore focus
    useEffect(() => {
        if (menuOpen) {
            previousFocusRef.current = (document.activeElement as HTMLElement) || null;
            // Focus first link when menu opens
            const firstLink = linksRef.current?.querySelector('a') as HTMLAnchorElement | null;
            if (firstLink) {
                firstLink.focus();
            }

            const handleKeyDown = (event: KeyboardEvent) => {
                if (event.key === 'Escape') {
                    setMenuOpen(false);
                    event.stopPropagation();
                }

                if (event.key === 'Tab') {
                    const focusable = linksRef.current?.querySelectorAll<HTMLElement>('a');
                    if (!focusable || focusable.length === 0) return;
                    const focusArray = Array.from(focusable);
                    const first = focusArray[0];
                    const last = focusArray[focusArray.length - 1];

                    if (event.shiftKey && document.activeElement === first) {
                        last.focus();
                        event.preventDefault();
                    } else if (!event.shiftKey && document.activeElement === last) {
                        first.focus();
                        event.preventDefault();
                    }
                }
            };

            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        } else {
            // Restore focus to the element that triggered the menu
            previousFocusRef.current?.focus?.();
        }
    }, [menuOpen]);

    // Close menu on route change
    useEffect(() => {
        const handleRouteChange = () => {
            setMenuOpen(false); // Close the menu when navigating to a new page
        };

        // Listen for route changes
        router.events.on('routeChangeStart', handleRouteChange);

        // Cleanup the event listener on unmount
        return () => {
            router.events.off('routeChangeStart', handleRouteChange);
        };
    }, [router.events]);

    return (
        <>
            <nav className={styles.nav}>
                <Link href='/' className={styles.logo}>
                    <span>Abdalkader Alhamoud</span>
                </Link>
                <button
                    type="button"
                    className={styles.menu_Toggle}
                    aria-haspopup="true"
                    aria-expanded={menuOpen}
                    aria-controls="site-navigation-menu"
                    onClick={() => {
                        setMenuOpen(prev => !prev);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setMenuOpen(prev => !prev);
                        }
                    }}
                >
                    <div className={styles.bar}></div>
                    <span>{menuOpen ? 'CLOSE' : 'MENU'}</span>
                </button>
                <Link href='/contact' className={styles.link}>
                    <span>Contact</span>
                </Link>
            </nav>
            <div
                ref={navigationMenuRef}
                className={styles.navigationMenu}
                role="dialog"
                aria-modal="true"
                aria-labelledby="site-navigation-menu-heading"
                onClick={(e) => {
                    // Close when clicking outside the list (backdrop)
                    if (e.target === navigationMenuRef.current) setMenuOpen(false);
                }}
                style={{ 
                    visibility: menuOpen ? 'visible' : 'hidden',
                    pointerEvents: menuOpen ? 'auto' : 'none'
                }}
            >
                <h2 id="site-navigation-menu-heading" style={{ position: 'absolute', left: '-9999px' }}>
                    Main navigation
                </h2>
                <ul id="site-navigation-menu" ref={linksRef}>
                    {links.map(({ name, path }, index) => (
                        <li key={name}>
                            <Link href={path} ref={index === 0 ? firstLinkRef : undefined}>{name}</Link>
                        </li>
                    ))}
                    <li className={styles.divider}></li>
                    {crossAppLinks.map(({ name, path, external }) => (
                        <li key={name}>
                            <a 
                                href={path} 
                                target={external ? "_blank" : "_self"}
                                rel={external ? "noopener noreferrer" : undefined}
                            >
                                {name}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}