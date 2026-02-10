import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './MusicPlayer.module.scss';

interface MusicPlayerProps {
    isEnabled: boolean;
    audioSrc?: string;
}

const MUSIC_PLAYING_KEY = 'portfolio-music-playing';
const VOLUME_KEY = 'portfolio-music-volume';

export default function MusicPlayer({
    isEnabled,
    audioSrc = '/audio/worship-ambient.mp3'
}: MusicPlayerProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showVolumeControl, setShowVolumeControl] = useState(false);
    const [volume, setVolume] = useState(0.3);
    const [isLoaded, setIsLoaded] = useState(false);

    // Initialize audio and restore state
    useEffect(() => {
        if (!isEnabled) return;

        const audio = new Audio(audioSrc);
        audio.loop = true;
        audio.preload = 'auto';
        audioRef.current = audio;

        // Restore volume from localStorage
        const savedVolume = localStorage.getItem(VOLUME_KEY);
        const initialVolume = savedVolume ? parseFloat(savedVolume) : 0.3;
        setVolume(initialVolume);
        audio.volume = initialVolume;

        // Check if music was playing before OR if just enabled from welcome modal
        const wasPlaying = localStorage.getItem(MUSIC_PLAYING_KEY) === 'true';
        const justEnabled = localStorage.getItem('portfolio-music-enabled') === 'true';

        audio.addEventListener('canplaythrough', () => {
            setIsLoaded(true);
            // Auto-play if was playing OR if just enabled from welcome modal
            if (wasPlaying || justEnabled) {
                audio.play().then(() => {
                    setIsPlaying(true);
                    localStorage.setItem(MUSIC_PLAYING_KEY, 'true');
                }).catch(() => {
                    // Autoplay was prevented
                    setIsPlaying(false);
                });
            }
        });

        audio.addEventListener('error', () => {
            setIsLoaded(false);
        });

        return () => {
            audio.pause();
            audio.src = '';
            audioRef.current = null;
        };
    }, [isEnabled, audioSrc]);

    // Update volume when changed
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
            localStorage.setItem(VOLUME_KEY, volume.toString());
        }
    }, [volume]);

    const togglePlay = useCallback(async () => {
        if (!audioRef.current || !isLoaded) return;

        try {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
                localStorage.setItem(MUSIC_PLAYING_KEY, 'false');
            } else {
                await audioRef.current.play();
                setIsPlaying(true);
                localStorage.setItem(MUSIC_PLAYING_KEY, 'true');
            }
        } catch (error) {
            console.error('Audio playback error:', error);
        }
    }, [isPlaying, isLoaded]);

    const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
    }, []);

    if (!isEnabled) return null;

    return (
        <div
            className={styles.musicPlayer}
            onMouseEnter={() => setShowVolumeControl(true)}
            onMouseLeave={() => setShowVolumeControl(false)}
        >
            <AnimatePresence>
                {showVolumeControl && (
                    <motion.div
                        className={styles.volumeControl}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={volume}
                            onChange={handleVolumeChange}
                            className={styles.volumeSlider}
                            aria-label="Volume control"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                type="button"
                className={`${styles.playButton} ${isPlaying ? styles.playing : ''}`}
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause music' : 'Play music'}
                disabled={!isLoaded}
            >
                {!isLoaded ? (
                    <span className={styles.loadingIcon}>&#8987;</span>
                ) : isPlaying ? (
                    <span className={styles.pauseIcon}>
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                            <rect x="6" y="4" width="4" height="16" rx="1" />
                            <rect x="14" y="4" width="4" height="16" rx="1" />
                        </svg>
                    </span>
                ) : (
                    <span className={styles.playIcon}>
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </span>
                )}
                <span className={styles.musicNote} aria-hidden="true">&#9835;</span>
            </button>
        </div>
    );
}
