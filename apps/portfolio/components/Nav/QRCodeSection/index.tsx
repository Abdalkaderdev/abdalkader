import { useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useRemoteControl } from '@/contexts/RemoteControlContext';
import styles from './QRCodeSection.module.scss';

interface QRCodeSectionProps {
  isVisible: boolean;
}

export default function QRCodeSection({ isVisible }: QRCodeSectionProps) {
  const {
    session,
    isPhoneConnected,
    isConnecting,
    error,
    createSession,
    getControllerUrl,
    timeRemaining,
  } = useRemoteControl();

  // Create session when section becomes visible
  useEffect(() => {
    if (isVisible && !session && !isConnecting) {
      createSession();
    }
  }, [isVisible, session, isConnecting, createSession]);

  // Format time remaining
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!isVisible) return null;

  return (
    <div className={styles.qrSection}>
      <div className={styles.header} data-scatter="qr-header">
        <span className={styles.title}>Phone Remote</span>
      </div>

      {isConnecting && (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <span>Creating session...</span>
        </div>
      )}

      {error && (
        <div className={styles.error}>
          <span>{error}</span>
          <button onClick={createSession} className={styles.retryBtn}>
            Retry
          </button>
        </div>
      )}

      {session && !isConnecting && (
        <>
          <div className={styles.qrContainer} data-scatter="qr-code">
            <QRCodeSVG
              value={getControllerUrl()}
              size={140}
              bgColor="transparent"
              fgColor="#ffffff"
              level="M"
              includeMargin={false}
            />
          </div>

          <div className={styles.sessionId} data-scatter="qr-session">
            <span className={styles.label}>Session:</span>
            <span className={styles.code}>{session.id}</span>
          </div>

          <div className={styles.status} data-scatter="qr-status">
            <span
              className={`${styles.indicator} ${
                isPhoneConnected ? styles.connected : styles.waiting
              }`}
            />
            <span className={styles.statusText}>
              {isPhoneConnected ? 'Phone Connected' : 'Waiting for phone...'}
            </span>
          </div>

          <div className={styles.timer} data-scatter="qr-timer">
            <span className={styles.timerLabel}>Expires in:</span>
            <span className={styles.timerValue}>{formatTime(timeRemaining)}</span>
          </div>

          <p className={styles.instructions} data-scatter="qr-instructions">
            Scan with your phone camera to control this site remotely
          </p>
        </>
      )}
    </div>
  );
}
