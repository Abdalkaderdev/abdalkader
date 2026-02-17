import { useRouter } from 'next/router';
import { useState, useRef, useCallback } from 'react';
import Head from 'next/head';
import { usePhoneController } from '@/hooks/usePhoneController';
import { NAVIGATION_LINKS } from '@/types/remote-control';
import styles from '@/styles/controller.module.scss';

import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';

const ControllerPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { sessionId } = router.query;

  const {
    isConnected,
    isConnecting,
    error,
    currentRoute,
    menuOpen,
    sendCommand,
  } = usePhoneController({
    sessionId: sessionId as string,
  });

  // Swipe handling
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
    setIsSwiping(true);
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const touch = e.changedTouches[0];
    const deltaY = touch.clientY - touchStartRef.current.y;
    const deltaTime = Date.now() - touchStartRef.current.time;

    // Calculate velocity (pixels per ms)
    const velocity = Math.abs(deltaY) / deltaTime;

    // Minimum swipe distance
    if (Math.abs(deltaY) > 30) {
      const direction = deltaY < 0 ? 'up' : 'down';
      sendCommand('SWIPE', {
        swipeDirection: direction,
        swipeVelocity: Math.min(velocity * 3, 3), // Cap velocity multiplier
      });
    }

    touchStartRef.current = null;
    setIsSwiping(false);
  }, [sendCommand]);

  const handleNavigate = useCallback((path: string) => {
    sendCommand('NAVIGATE', { path });
  }, [sendCommand]);

  const handleToggleMenu = useCallback(() => {
    sendCommand('TOGGLE_MENU');
  }, [sendCommand]);

  const handleScroll = useCallback((direction: 'up' | 'down') => {
    sendCommand('SCROLL', { direction, delta: 400 });
  }, [sendCommand]);

  if (!sessionId) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Invalid session</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Remote Control | Abdalkader Portfolio</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.connectionStatus}>
            <span
              className={`${styles.statusDot} ${
                isConnected ? styles.connected : isConnecting ? styles.connecting : styles.disconnected
              }`}
            />
            <span className={styles.statusText}>
              {isConnecting ? 'Connecting...' : isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <div className={styles.currentRoute}>{currentRoute}</div>
        </header>

        {error && (
          <div className={styles.errorBanner}>
            {error}
          </div>
        )}

        {/* Swipe Touchpad */}
        <div
          className={`${styles.touchpad} ${isSwiping ? styles.swiping : ''}`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className={styles.touchpadContent}>
            <span className={styles.touchpadIcon}>↕</span>
            <span className={styles.touchpadText}>Swipe to scroll</span>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className={styles.quickNav}>
          {NAVIGATION_LINKS.map(({ name, path }) => (
            <button
              key={path}
              className={`${styles.navButton} ${currentRoute === path ? styles.active : ''}`}
              onClick={() => handleNavigate(path)}
              disabled={!isConnected}
            >
              {name}
            </button>
          ))}
        </div>

        {/* Menu Toggle */}
        <button
          className={`${styles.menuButton} ${menuOpen ? styles.menuOpen : ''}`}
          onClick={handleToggleMenu}
          disabled={!isConnected}
        >
          {menuOpen ? 'Close Menu' : 'Toggle Menu'}
        </button>

        {/* Scroll Buttons */}
        <div className={styles.scrollButtons}>
          <button
            className={styles.scrollButton}
            onClick={() => handleScroll('up')}
            disabled={!isConnected}
          >
            <span className={styles.scrollIcon}>↑</span>
            Scroll Up
          </button>
          <button
            className={styles.scrollButton}
            onClick={() => handleScroll('down')}
            disabled={!isConnected}
          >
            <span className={styles.scrollIcon}>↓</span>
            Scroll Down
          </button>
        </div>

        {/* Footer */}
        <footer className={styles.footer}>
          <span className={styles.sessionId}>Session: {sessionId}</span>
        </footer>
      </div>
    </>
  );
};

// Use empty layout - no Nav, Footer, or other layout components
ControllerPage.getLayout = (page: ReactElement) => page;

export default ControllerPage;
