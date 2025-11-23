'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';

interface HeaderProps {
  appName?: string;
  internalLinks?: Array<{ name: string; path: string }>;
  externalLinks?: Array<{ name: string; path: string }>;
}

const defaultInternalLinks = [
  { name: 'Home', path: '/' },
];

const defaultExternalLinks = [
  { name: 'Portfolio', path: 'https://abdalkader.dev' },
  { name: 'Blog', path: 'https://blog.abdalkader.dev' },
  { name: 'Docs', path: 'https://docs.abdalkader.dev' },
  { name: 'Components', path: 'https://storybook.abdalkader.dev' },
];

export function Header({
  appName = 'Programming Museum',
  internalLinks = defaultInternalLinks,
  externalLinks = defaultExternalLinks,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigationMenuRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Menu Animation with Framer Motion equivalent (CSS-based for simplicity)
  useEffect(() => {
    if (navigationMenuRef.current) {
      if (menuOpen) {
        navigationMenuRef.current.style.clipPath = 'inset(0% 0% 0% 0%)';
        navigationMenuRef.current.style.visibility = 'visible';
      } else {
        navigationMenuRef.current.style.clipPath = 'inset(0% 0% 100% 0%)';
        navigationMenuRef.current.style.visibility = 'hidden';
      }
    }
  }, [menuOpen]);

  // Accessibility: focus trap, ESC to close
  useEffect(() => {
    if (menuOpen) {
      previousFocusRef.current = (document.activeElement as HTMLElement) || null;
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
      previousFocusRef.current?.focus?.();
    }
  }, [menuOpen]);

  return (
    <>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          <span>{appName}</span>
        </Link>
        <button
          type="button"
          className={styles.menu_Toggle}
          aria-haspopup="true"
          aria-expanded={menuOpen}
          aria-controls="site-navigation-menu"
          onClick={() => {
            setMenuOpen((prev) => !prev);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setMenuOpen((prev) => !prev);
            }
          }}
        >
          <div className={styles.bar}></div>
          <span>{menuOpen ? 'CLOSE' : 'MENU'}</span>
        </button>
      </nav>
      <div
        ref={navigationMenuRef}
        className={styles.navigationMenu}
        role="dialog"
        aria-modal="true"
        aria-labelledby="site-navigation-menu-heading"
        onClick={(e) => {
          if (e.target === navigationMenuRef.current) setMenuOpen(false);
        }}
      >
        <h2 id="site-navigation-menu-heading" style={{ position: 'absolute', left: '-9999px' }}>
          Main navigation
        </h2>
        <ul id="site-navigation-menu" ref={linksRef}>
          {internalLinks.map(({ name, path }, index) => (
            <li key={name}>
              <Link href={path} ref={index === 0 ? firstLinkRef : undefined}>
                {name}
              </Link>
            </li>
          ))}
          <li className={styles.divider}></li>
          {externalLinks.map(({ name, path }) => (
            <li key={name}>
              <a href={path} target="_blank" rel="noopener noreferrer">
                {name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
