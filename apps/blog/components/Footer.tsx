import Link from 'next/link';
import styles from './Footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.left}>
          <p>&copy; {new Date().getFullYear()} Abdalkader Alhamoud</p>
        </div>
        <div className={styles.right}>
          <Link href="https://abdalkader.dev" target="_blank" rel="noopener noreferrer">
            Portfolio
          </Link>
          <Link href="https://cv.abdalkader.dev" target="_blank" rel="noopener noreferrer">
            CV
          </Link>
          <Link href="mailto:hello@abdalkader.dev">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
