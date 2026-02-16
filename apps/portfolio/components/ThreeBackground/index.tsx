'use client';

import { useEffect, useRef } from 'react';
import type * as THREE from 'three';
import styles from './ThreeBackground.module.scss';
import { isReducedMotion } from '@/utils/motion';

export type ThreeBackgroundVariant = 'spheres' | 'particles' | 'blobs';

interface ThreeBackgroundProps {
    /** Visual style variant */
    variant?: ThreeBackgroundVariant;
    /** Primary color (hex) */
    primaryColor?: string;
    /** Secondary color (hex) */
    secondaryColor?: string;
    /** Opacity of the background */
    opacity?: number;
    /** Animation speed multiplier */
    speed?: number;
    /** Number of objects */
    count?: number;
    /** Enable mouse interaction */
    interactive?: boolean;
    /** Additional className */
    className?: string;
}

export default function ThreeBackground({
    variant = 'spheres',
    primaryColor = '#f44e00',
    secondaryColor = '#d4af37',
    opacity = 0.3,
    speed = 1,
    count = 15,
    interactive = true,
    className = '',
}: ThreeBackgroundProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number | null>(null);
    const cleanupRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        // Skip if reduced motion preferred
        if (isReducedMotion()) {
            return;
        }

        const container = containerRef.current;
        if (!container) return;

        // Dynamically import Three.js
        const initThree = async () => {
            try {
                const THREE = await import('three');

                // Setup
                const scene = new THREE.Scene();
                const camera = new THREE.PerspectiveCamera(
                    75,
                    container.clientWidth / container.clientHeight,
                    0.1,
                    1000
                );

                const renderer = new THREE.WebGLRenderer({
                    alpha: true,
                    antialias: true,
                    powerPreference: 'high-performance',
                });

                renderer.setSize(container.clientWidth, container.clientHeight);
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                container.appendChild(renderer.domElement);

                // Convert hex to Three.js color
                const primary = new THREE.Color(primaryColor);
                const secondary = new THREE.Color(secondaryColor);

                // Objects array for animation
                const objects: THREE.Object3D[] = [];

                // Create objects based on variant
                if (variant === 'spheres') {
                    const geometry = new THREE.SphereGeometry(1, 32, 32);

                    for (let i = 0; i < count; i++) {
                        const material = new THREE.MeshStandardMaterial({
                            color: i % 2 === 0 ? primary : secondary,
                            roughness: 0.5,
                            metalness: 0.3,
                            transparent: true,
                            opacity: 0.6,
                        });

                        const sphere = new THREE.Mesh(geometry, material);
                        sphere.position.set(
                            (Math.random() - 0.5) * 30,
                            (Math.random() - 0.5) * 30,
                            (Math.random() - 0.5) * 30
                        );
                        sphere.scale.setScalar(Math.random() * 0.8 + 0.2);
                        scene.add(sphere);
                        objects.push(sphere);
                    }
                } else if (variant === 'particles') {
                    const geometry = new THREE.BufferGeometry();
                    const positions = new Float32Array(count * 100 * 3);
                    const colors = new Float32Array(count * 100 * 3);

                    for (let i = 0; i < count * 100; i++) {
                        positions[i * 3] = (Math.random() - 0.5) * 50;
                        positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
                        positions[i * 3 + 2] = (Math.random() - 0.5) * 50;

                        const color = i % 2 === 0 ? primary : secondary;
                        colors[i * 3] = color.r;
                        colors[i * 3 + 1] = color.g;
                        colors[i * 3 + 2] = color.b;
                    }

                    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

                    const material = new THREE.PointsMaterial({
                        size: 0.1,
                        vertexColors: true,
                        transparent: true,
                        opacity: 0.8,
                    });

                    const particles = new THREE.Points(geometry, material);
                    scene.add(particles);
                    objects.push(particles);
                } else if (variant === 'blobs') {
                    const geometry = new THREE.IcosahedronGeometry(1, 3);

                    for (let i = 0; i < count; i++) {
                        const material = new THREE.MeshStandardMaterial({
                            color: i % 2 === 0 ? primary : secondary,
                            roughness: 0.2,
                            metalness: 0.5,
                            transparent: true,
                            opacity: 0.7,
                            wireframe: i % 3 === 0,
                        });

                        const blob = new THREE.Mesh(geometry, material);
                        blob.position.set(
                            (Math.random() - 0.5) * 25,
                            (Math.random() - 0.5) * 25,
                            (Math.random() - 0.5) * 25
                        );
                        blob.scale.setScalar(Math.random() * 1.5 + 0.5);
                        scene.add(blob);
                        objects.push(blob);
                    }
                }

                // Lighting
                const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
                const pointLight1 = new THREE.PointLight(primary, 1, 100);
                const pointLight2 = new THREE.PointLight(secondary, 0.8, 100);
                pointLight1.position.set(10, 10, 10);
                pointLight2.position.set(-10, -10, 10);
                scene.add(ambientLight, pointLight1, pointLight2);

                camera.position.z = 20;

                // Mouse tracking for interactivity
                const mouse = { x: 0, y: 0 };
                let mouseMoveHandler: ((e: MouseEvent) => void) | null = null;

                if (interactive) {
                    mouseMoveHandler = (e: MouseEvent) => {
                        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
                        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
                    };
                    window.addEventListener('mousemove', mouseMoveHandler);
                }

                // Animation
                const clock = new THREE.Clock();

                const animate = () => {
                    animationRef.current = requestAnimationFrame(animate);
                    const elapsed = clock.getElapsedTime() * speed;

                    objects.forEach((obj, i) => {
                        if (variant === 'particles') {
                            obj.rotation.y = elapsed * 0.1;
                            obj.rotation.x = elapsed * 0.05;
                        } else {
                            obj.rotation.x = elapsed * 0.1 * (i % 2 === 0 ? 1 : -1);
                            obj.rotation.y = elapsed * 0.15 * (i % 3 === 0 ? 1 : -1);
                            obj.position.y += Math.sin(elapsed + i) * 0.003;
                        }
                    });

                    // Camera responds to mouse
                    if (interactive) {
                        camera.position.x += (mouse.x * 2 - camera.position.x) * 0.02;
                        camera.position.y += (mouse.y * 2 - camera.position.y) * 0.02;
                        camera.lookAt(scene.position);
                    }

                    renderer.render(scene, camera);
                };

                animate();

                // Resize handler
                const handleResize = () => {
                    if (!container) return;
                    camera.aspect = container.clientWidth / container.clientHeight;
                    camera.updateProjectionMatrix();
                    renderer.setSize(container.clientWidth, container.clientHeight);
                };

                window.addEventListener('resize', handleResize);

                // Store cleanup function
                cleanupRef.current = () => {
                    window.removeEventListener('resize', handleResize);
                    if (mouseMoveHandler) {
                        window.removeEventListener('mousemove', mouseMoveHandler);
                    }
                    if (animationRef.current) {
                        cancelAnimationFrame(animationRef.current);
                    }
                    if (renderer.domElement.parentNode) {
                        renderer.domElement.parentNode.removeChild(renderer.domElement);
                    }
                    renderer.dispose();
                };
            } catch (error) {
                console.warn('Three.js not available:', error);
            }
        };

        initThree();

        return () => {
            if (cleanupRef.current) {
                cleanupRef.current();
            }
        };
    }, [variant, primaryColor, secondaryColor, speed, count, interactive]);

    const containerClasses = [styles.threeBackground, className].filter(Boolean).join(' ');

    return (
        <div
            ref={containerRef}
            className={containerClasses}
            style={{ opacity }}
            aria-hidden="true"
        />
    );
}

export { ThreeBackground };
