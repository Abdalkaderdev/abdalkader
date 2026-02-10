'use client';

import { MagneticLink } from '@/components/MagneticLink';
import MiniSignpost from '@/components/MiniSignpost';
import RootedInChrist from '@/components/RootedInChrist';
import styles from './Footer.module.scss';

// Navigation links
const navigationLinks = [
    { text: 'Home', href: '/' },
    { text: 'About', href: '/about' },
    { text: 'Projects', href: '/projects' },
    { text: 'Contact', href: '/contact' },
];

// Ecosystem apps
const ecosystemLinks = [
    { text: 'Blog', href: 'https://blog.abdalkader.dev' },
    { text: 'Documentation', href: 'https://docs.abdalkader.dev' },
    { text: 'Components', href: 'https://storybook.abdalkader.dev' },
    { text: 'Programming Museum', href: 'https://history.abdalkader.dev' },
];

// Social links
const socialLinks = [
    { text: 'GitHub', href: 'https://github.com/abdalkaderdev' },
    { text: 'LinkedIn', href: 'https://www.linkedin.com/in/abdalkaderdev' },
    { text: 'Twitter', href: 'https://twitter.com/abdalkaderdev' },
    { text: 'Instagram', href: 'https://www.instagram.com/abdalkader.dev' },
];

const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
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
                    <div className={styles.signpostWrapper}>
                        <MiniSignpost
                            category="peace"
                            direction="right"
                            rotateInterval={10000}
                            className={styles.footerSignpost}
                        />
                    </div>
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
