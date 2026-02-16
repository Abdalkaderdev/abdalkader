'use client';

import { MagneticLink } from '@/components/MagneticLink';
import RootedInChrist from '@/components/RootedInChrist';
import VideoBackground from '@/components/VideoBackground';
import styles from './Footer.module.scss';

// Navigation links
const navigationLinks = [
    { text: 'Home', href: '/' },
    { text: 'About', href: '/about' },
    { text: 'Projects', href: '/projects' },
    { text: 'Guidance', href: '/guidance' },
    { text: 'Prayer', href: '/prayer' },
    { text: 'Contact', href: '/contact' },
];

// Ecosystem apps
const ecosystemLinks = [
    { text: 'Documentation', href: 'https://docs.abdalkader.dev' },
];

// Social links
const socialLinks = [
    { text: 'GitHub', href: 'https://github.com/abdalkaderdev' },
    { text: 'LinkedIn', href: 'https://www.linkedin.com/in/abdalkaderdev' },
    { text: 'Instagram', href: 'https://www.instagram.com/abdalkader.dev' },
];

const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            {/* Video Background - Reusing home hero video */}
            <VideoBackground
                src="/videos/home-hero-bg.mp4"
                opacity={0.15}
                overlay
                overlayDirection="top"
            />

            <div className={styles.container}>
                <div className={styles.wrapper}>
                    <div className={styles.col}>
                        <p>Erbil, Iraq</p>
                        <MagneticLink
                            href="mailto:hello@abdalkader.dev"
                            magneticStrength={0.2}
                            showScale={false}
                        >
                            hello@abdalkader.dev
                        </MagneticLink>
                    </div>
                    <div className={styles.linksCol}>
                        <h3>Navigation</h3>
                        {navigationLinks.map(({ text, href }) => (
                            <MagneticLink
                                key={text}
                                href={href}
                                magneticStrength={0.2}
                            >
                                {text}
                            </MagneticLink>
                        ))}
                    </div>
                    <div className={styles.linksCol}>
                        <h3>Ecosystem</h3>
                        {ecosystemLinks.map(({ text, href }) => (
                            <MagneticLink
                                key={text}
                                href={href}
                                external
                                magneticStrength={0.2}
                            >
                                {text}
                            </MagneticLink>
                        ))}
                    </div>
                    <div className={styles.linksCol}>
                        <h3>Connect</h3>
                        {socialLinks.map(({ text, href }) => (
                            <MagneticLink
                                key={text}
                                href={href}
                                external
                                magneticStrength={0.2}
                            >
                                {text}
                            </MagneticLink>
                        ))}
                    </div>
                </div>
                <div className={styles.border} />
                <div className={styles.spiritualSection}>
                    <div className={styles.rootedWrapper}>
                        <RootedInChrist className={styles.footerRooted} />
                    </div>
                </div>
                <div className={styles.copyrights}>
                    <div className={styles.col}>
                        <p>Building the future, one project at a time.</p>
                        <p style={{ marginTop: '0.5rem' }}>© {new Date().getFullYear()} Abdalkader Alhamoud. All rights reserved.</p>
                    </div>
                </div>
            </div>
            <h2 className={styles.bigText}>Abdalkader Alhamoud</h2>
        </footer>
    );
};

export default Footer;
