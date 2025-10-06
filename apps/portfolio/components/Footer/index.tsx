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

// Social links
const socialLinks = [
    { text: 'GitHub', href: 'https://github.com/abdalkaderdev' },
    { text: 'LinkedIn', href: 'https://linkedin.com/in/abdalkaderdev' },
    { text: 'Instagram', href: 'https://www.instagram.com/abdalkader.dev' },
].map(({ text, href }) => (
    <Link key={text} href={href} target="_blank" rel="noopener noreferrer">{text}</Link>
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
                </div>
                <div className={styles.border} />
                <div className={styles.copyrights}>
                    <div className={styles.col}>
                        <p>© All rights reserved / 2024</p>
                    </div>
                    <div className={styles.linksCol}>
                        {socialLinks}
                    </div>
                </div>
            </div>
                            <h2 className={styles.bigText}>Abdalkader Alhamoud</h2>
        </footer>
    );
};

export default Footer;