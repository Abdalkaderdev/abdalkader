import Link from 'next/link';
import styles from './Footer.module.scss';

// address
const contactInfo = (
    <p>
        Erbil, Iraq
    </p>
);

// Navigation links
const navigationLinks = [
    { text: 'Home', href: '/' },
    { text: 'About', href: '/about' },
    { text: 'Projects', href: '/projects' },
    { text: 'Contact', href: '/contact' },
].map(({ text, href }) => (
    <Link key={text} href={href}>{text}</Link>
));

// Cross-app links
const crossAppLinks = [
    { text: 'Blog', href: 'https://blog.abdalkader.dev', external: true },
    { text: 'Docs', href: 'https://docs.abdalkader.dev', external: true },
    { text: 'Components', href: 'https://storybook.abdalkader.dev', external: true },
    { text: 'Programming Museum', href: 'https://history.abdalkader.dev', external: true },
].map(({ text, href, external }) => (
    <a key={text} href={href} target={external ? "_blank" : "_self"} rel={external ? "noopener noreferrer" : undefined}>{text}</a>
));

// Ecosystem links with icons
const ecosystemLinks = [
    { text: 'Portfolio', href: 'https://abdalkader.dev', icon: '👨‍💻' },
    { text: 'Storybook', href: 'https://storybook.abdalkader.dev', icon: '📚' },
    { text: 'Documentation', href: 'https://docs.abdalkader.dev', icon: '📖' },
    { text: 'Blog', href: 'https://blog.abdalkader.dev', icon: '✍️' },
    { text: 'Programming Museum', href: 'https://history.abdalkader.dev', icon: '🏛️' },
].map(({ text, href, icon }) => (
    <a key={text} href={href} target="_blank" rel="noopener noreferrer">
        <span style={{ marginRight: '0.5rem' }}>{icon}</span>
        {text}
    </a>
));

// Social links (Connect section)
const socialLinks = [
    { text: 'GitHub', href: 'https://github.com/abdalkaderdev' },
    { text: 'LinkedIn', href: 'https://www.linkedin.com/in/abdalkaderdev' },
    { text: 'Twitter', href: 'https://twitter.com/abdalkaderdev' },
    { text: 'Email', href: 'mailto:hello@abdalkader.dev' },
].map(({ text, href }) => (
    <Link key={text} href={href} target={href.startsWith('http') ? "_blank" : undefined} rel={href.startsWith('http') ? "noopener noreferrer" : undefined}>{text}</Link>
));

const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.wrapper}>
                    <div className={styles.col}>
                        {contactInfo}
                        <Link href='mailto:hello@abdalkader.dev'>hello@abdalkader.dev</Link>
                    </div>
                    <div className={styles.linksCol}>
                        {navigationLinks}
                    </div>
                    <div className={styles.linksCol}>
                        <h3>Apps</h3>
                        {crossAppLinks}
                    </div>
                    <div className={styles.linksCol}>
                        <h3>Ecosystem</h3>
                        {ecosystemLinks}
                    </div>
                    <div className={styles.linksCol}>
                        <h3>Connect</h3>
                        {socialLinks}
                    </div>
                </div>
                <div className={styles.border} />
                <div className={styles.copyrights}>
                    <div className={styles.col}>
                        <p>Building the future, one project at a time.</p>
                        <p style={{ marginTop: '0.5rem' }}>© All rights reserved / {new Date().getFullYear()}</p>
                    </div>
                </div>
            </div>
                            <h2 className={styles.bigText}>Abdalkader Alhamoud</h2>
        </footer>
    );
};

export default Footer;