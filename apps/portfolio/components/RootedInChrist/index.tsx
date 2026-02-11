'use client';

import Image from 'next/image';
import styles from './RootedInChrist.module.scss';

interface RootedInChristProps {
    className?: string;
}

export default function RootedInChrist({ className = '' }: RootedInChristProps) {
    return (
        <div className={`${styles.rootedContainer} ${className}`}>
            <Image
                src="/images/rooted-in-christ.jpg"
                alt="Rooted in Christ"
                width={200}
                height={200}
                className={styles.rootedImage}
            />
        </div>
    );
}
