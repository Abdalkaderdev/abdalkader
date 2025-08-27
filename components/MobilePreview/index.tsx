import { useState } from 'react';
import styles from './MobilePreview.module.scss';

interface PreviewProps {
    url: string;
    title?: string;
}

const DEVICES = [
    { name: 'Phone', width: 390, height: 844 },
    { name: 'Tablet', width: 820, height: 1180 },
    { name: 'Desktop', width: 1280, height: 800 },
];

export default function MobilePreview({ url, title }: PreviewProps) {
    const [device, setDevice] = useState(DEVICES[0]);

    return (
        <div className={styles.preview}>
            <div className={styles.controls}>
                <span className={styles.title}>{title || 'Preview'}</span>
                <div className={styles.buttons}>
                    {DEVICES.map((d) => (
                        <button
                            key={d.name}
                            className={device.name === d.name ? styles.active : ''}
                            onClick={() => setDevice(d)}
                            type="button"
                        >
                            {d.name}
                        </button>
                    ))}
                </div>
            </div>
            <div className={styles.device} style={{ width: device.width, height: device.height }}>
                <iframe src={url} title={title} loading="lazy" sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms allow-popups" />
            </div>
        </div>
    );
}

