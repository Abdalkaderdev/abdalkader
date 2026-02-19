import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './Header.module.scss';

export default function Header() {
  return (
    <motion.header
      className={styles.header}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>A</span>
          <span className={styles.logoText}>blog.abdalkader.dev</span>
        </Link>

        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>Home</Link>
          <Link href="/categories" className={styles.navLink}>Categories</Link>
          <Link href="https://abdalkader.dev" target="_blank" rel="noopener noreferrer" className={styles.portfolioLink}>
            Portfolio
          </Link>
        </nav>
      </div>
    </motion.header>
  );
}
