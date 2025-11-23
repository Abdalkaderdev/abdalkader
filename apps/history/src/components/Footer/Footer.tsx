'use client';

import Link from 'next/link';
import styles from './Footer.module.css';

interface FooterLink {
  text: string;
  href: string;
  external?: boolean;
}

interface FooterProps {
  contactInfo?: string;
  email?: string;
  internalLinks?: FooterLink[];
  externalLinks?: FooterLink[];
  socialLinks?: FooterLink[];
  companyName?: string;
  year?: number;
}

const defaultInternalLinks = [
  { text: 'Home', href: '/' },
];

const defaultExternalLinks = [
  { text: 'Portfolio', href: 'https://abdalkader.dev', external: true },
  { text: 'Blog', href: 'https://blog.abdalkader.dev', external: true },
  { text: 'Docs', href: 'https://docs.abdalkader.dev', external: true },
  { text: 'Components', href: 'https://storybook.abdalkader.dev', external: true },
];

const defaultSocialLinks = [
  { text: 'GitHub', href: 'https://github.com/abdalkaderdev', external: true },
  { text: 'LinkedIn', href: 'https://www.linkedin.com/in/abdalkaderdev', external: true },
  { text: 'Instagram', href: 'https://www.instagram.com/abdalkader.dev', external: true },
];

export function Footer({
  contactInfo = 'Erbil, Iraq',
  email = 'hello@abdalkader.dev',
  internalLinks = defaultInternalLinks,
  externalLinks = defaultExternalLinks,
  socialLinks = defaultSocialLinks,
  companyName = 'Programming Museum',
  year = new Date().getFullYear(),
}: FooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.col}>
            <p>{contactInfo}</p>
            <Link href={`mailto:${email}`}>{email}</Link>
          </div>
          <div className={styles.linksCol}>
            {internalLinks.map(({ text, href }) => (
              <Link key={text} href={href}>
                {text}
              </Link>
            ))}
          </div>
          <div className={styles.linksCol}>
            <h3>Apps</h3>
            {externalLinks.map(({ text, href, external }) => (
              <a
                key={text}
                href={href}
                target={external ? '_blank' : '_self'}
                rel={external ? 'noopener noreferrer' : undefined}
              >
                {text}
              </a>
            ))}
          </div>
        </div>
        <div className={styles.border} />
        <div className={styles.copyrights}>
          <div className={styles.col}>
            <p>© All rights reserved / {year}</p>
          </div>
          <div className={styles.linksCol}>
            {socialLinks.map(({ text, href, external }) => (
              <a
                key={text}
                href={href}
                target={external ? '_blank' : '_self'}
                rel={external ? 'noopener noreferrer' : undefined}
              >
                {text}
              </a>
            ))}
          </div>
        </div>
      </div>
      <h2 className={styles.bigText}>{companyName}</h2>
    </footer>
  );
}
