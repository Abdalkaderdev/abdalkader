import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import gsap from 'gsap';
import { MagneticLink } from '@/components/MagneticLink';
import QRCodeSection from './QRCodeSection';
import { useRemoteControl } from '@/contexts/RemoteControlContext';
import styles from './Nav.module.scss';

// Define your links and paths
const links = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Guidance', path: '/guidance' },
    { name: 'Prayer', path: '/prayer' },
    { name: 'Contact', path: '/contact' },
];

export default function Nav() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isScattering, setIsScattering] = useState(false);
    const menuItemsRef = useRef<(HTMLLIElement | null)[]>([]);
    const menuFooterRef = useRef<HTMLDivElement>(null);
    const qrSectionRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { setMenuOpen: setRemoteMenuOpen, isPhoneConnected } = useRemoteControl();

    // Scatter animation on menu close - Anyflow style: gravity + drift + rotation
    const playScatterAnimation = useCallback(() => {
        const items = menuItemsRef.current.filter(Boolean) as HTMLLIElement[];
        const footer = menuFooterRef.current;
        const menuContainer = document.querySelector(`.${styles.navigationMenu}`) as HTMLElement;

        if (items.length === 0) return;

        setIsScattering(true);

        // Screen bottom + extra to ensure items fully exit
        const screenBottom = window.innerHeight + 200;

        // Make the blurry background card ALSO fall and scatter
        if (menuContainer) {
            // First remove blur/backdrop so items show clearly as they scatter
            gsap.to(menuContainer, {
                backdropFilter: 'blur(0px)',
                webkitBackdropFilter: 'blur(0px)',
                duration: 0.1,
            });

            // Then make the card itself fall (slightly delayed, falls behind items)
            gsap.to(menuContainer, {
                y: screenBottom,
                x: -150,
                rotation: -25,
                scale: 0.4,
                opacity: 0,
                duration: 0.85,
                delay: 0.08,
                ease: 'power2.in',
            });
        }

        // ═══════════════════════════════════════════════════════════════════════
        // ANYFLOW SCATTER - One smooth motion: fall + drift + rotate + scale
        // ═══════════════════════════════════════════════════════════════════════
        const scatterItem = (
            el: HTMLElement,
            delay: number,
            driftX: number,      // Horizontal drift (negative = left, positive = right)
            rotation: number,    // Final rotation
            duration: number = 0.7
        ) => {
            gsap.to(el, {
                y: screenBottom,
                x: driftX,
                rotation: rotation,
                scale: 0.3,
                opacity: 0,
                duration: duration,
                delay: delay,
                ease: 'power2.in', // Accelerating fall (gravity)
            });
        };

        // Menu items - staggered, alternating left/right
        // HOME - drift LEFT
        if (items[0]) scatterItem(items[0], 0, -280, -35, 0.65);
        // ABOUT - drift RIGHT
        if (items[1]) scatterItem(items[1], 0.03, 320, 42, 0.68);
        // PROJECTS - drift LEFT
        if (items[2]) scatterItem(items[2], 0.06, -350, -48, 0.7);
        // GUIDANCE - drift RIGHT
        if (items[3]) scatterItem(items[3], 0.09, 290, 38, 0.65);
        // PRAYER - drift LEFT
        if (items[4]) scatterItem(items[4], 0.12, -310, -42, 0.68);
        // CONTACT - drift RIGHT
        if (items[5]) scatterItem(items[5], 0.15, 340, 45, 0.7);

        // Footer - drift LEFT
        if (footer) scatterItem(footer, 0.08, -250, -30, 0.65);

        // QR Section pieces - all drift RIGHT (opposite side)
        const qrHeader = document.querySelector('[data-scatter="qr-header"]') as HTMLElement;
        const qrCode = document.querySelector('[data-scatter="qr-code"]') as HTMLElement;
        const qrSession = document.querySelector('[data-scatter="qr-session"]') as HTMLElement;
        const qrStatus = document.querySelector('[data-scatter="qr-status"]') as HTMLElement;
        const qrTimer = document.querySelector('[data-scatter="qr-timer"]') as HTMLElement;
        const qrInstructions = document.querySelector('[data-scatter="qr-instructions"]') as HTMLElement;

        if (qrHeader) scatterItem(qrHeader, 0.02, 260, 28, 0.62);
        if (qrCode) scatterItem(qrCode, 0.0, 300, 22, 0.7);  // QR code is heavier, falls first
        if (qrSession) scatterItem(qrSession, 0.05, 240, 32, 0.65);
        if (qrStatus) scatterItem(qrStatus, 0.08, 280, 35, 0.68);
        if (qrTimer) scatterItem(qrTimer, 0.11, 250, 30, 0.65);
        if (qrInstructions) scatterItem(qrInstructions, 0.14, 220, 38, 0.7);

        // ═══════════════════════════════════════════════════════════════════════
        // CLEANUP - Close menu immediately, reset elements much later
        // ═══════════════════════════════════════════════════════════════════════
        setTimeout(() => {
            // Close the menu state - CSS will handle hiding
            setIsScattering(false);
            setMenuOpen(false);
        }, 850); // After scatter animation finishes

        // Reset elements much later when menu is definitely hidden
        setTimeout(() => {
            const allElements = [
                ...items,
                footer,
                qrHeader,
                qrCode,
                qrSession,
                qrStatus,
                qrTimer,
                qrInstructions,
            ].filter(Boolean);

            allElements.forEach(el => {
                gsap.set(el, { x: 0, y: 0, rotation: 0, opacity: 1, scale: 1 });
            });

            // Reset menu container transform (but NOT opacity - let CSS handle that)
            if (menuContainer) {
                gsap.set(menuContainer, {
                    x: 0,
                    y: 0,
                    rotation: 0,
                    scale: 1,
                    backdropFilter: '',
                    webkitBackdropFilter: '',
                    backgroundColor: '',
                    borderColor: '',
                    boxShadow: '',
                });
            }
        }, 2000); // Much later - menu is definitely hidden by now
    }, []);

    const handleMenuToggle = useCallback(() => {
        if (menuOpen) {
            // Play scatter animation before closing
            playScatterAnimation();
        } else {
            setMenuOpen(true);
        }
        setRemoteMenuOpen(!menuOpen);
    }, [menuOpen, playScatterAnimation, setRemoteMenuOpen]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (menuOpen || isScattering) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [menuOpen, isScattering]);

    // Accessibility: ESC to close
    useEffect(() => {
        if (menuOpen) {
            const handleKeyDown = (event: KeyboardEvent) => {
                if (event.key === 'Escape') {
                    handleMenuToggle();
                }
            };
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [menuOpen, handleMenuToggle]);

    // Close menu on route change
    useEffect(() => {
        const handleRouteChange = () => {
            setMenuOpen(false);
            setRemoteMenuOpen(false);
        };
        router.events.on('routeChangeStart', handleRouteChange);
        return () => router.events.off('routeChangeStart', handleRouteChange);
    }, [router.events, setRemoteMenuOpen]);

    return (
        <>
            {/* Backdrop */}
            <div
                className={`${styles.backdrop} ${menuOpen || isScattering ? styles.open : ''}`}
                onClick={handleMenuToggle}
            />

            {/* Popup Menu - Above navbar */}
            <div
                className={`${styles.navigationMenu} ${menuOpen || isScattering ? styles.open : ''}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="site-navigation-menu-heading"
            >
                <h2 id="site-navigation-menu-heading" className={styles.srOnly}>
                    Main navigation
                </h2>

                {/* Two-column layout: Tabs left, QR right */}
                <div className={styles.menuContent}>
                    {/* Left side: Navigation tabs */}
                    <div className={styles.menuLeft}>
                        <ul id="site-navigation-menu" className={styles.menuList}>
                            {links.map(({ name, path }, index) => (
                                <li
                                    key={name}
                                    className={styles.menuItem}
                                    ref={el => { menuItemsRef.current[index] = el; }}
                                >
                                    <MagneticLink
                                        href={path}
                                        className={styles.menuLink}
                                        magneticStrength={0.1}
                                    >
                                        <span className={styles.linkText}>{name}</span>
                                    </MagneticLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right side: QR Code Section */}
                    <div className={styles.menuRight} ref={qrSectionRef}>
                        <QRCodeSection isVisible={menuOpen} />

                        {/* Phone connection indicator */}
                        {isPhoneConnected && (
                            <div className={styles.phoneConnected}>
                                <span className={styles.phoneIcon}>📱</span>
                                <span>Phone Connected</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer info in menu */}
                <div className={styles.menuFooter} ref={menuFooterRef}>
                    <p>Building digital solutions with purpose</p>
                </div>
            </div>

            {/* Bottom-Center Floating Navigation */}
            <nav className={styles.nav}>
                {/* Left: Hamburger Menu */}
                <button
                    type="button"
                    className={styles.menuToggle}
                    aria-haspopup="true"
                    aria-expanded={menuOpen}
                    aria-controls="site-navigation-menu"
                    onClick={handleMenuToggle}
                >
                    <div className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <span className={styles.menuText}>{menuOpen ? 'Close' : 'Menu'}</span>
                </button>

                {/* Center: Brand with flip animation */}
                <Link href="/" className={styles.brand}>
                    <span className={styles.crossIcon}>&#10013;&#xFE0E;</span>
                    <span className={styles.brandFlip}>
                        <span className={styles.brandFront}>Abd</span>
                        <span className={styles.brandBack}>Abd</span>
                    </span>
                </Link>

                {/* Right: Contact CTA */}
                <Link href="/contact" className={styles.contactBtn}>
                    Contact
                </Link>
            </nav>
        </>
    );
}
