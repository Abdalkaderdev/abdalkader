import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

/**
 * jsdom 23 does not implement PointerEvent. Framer Motion's press gesture
 * (enabled by whileTap) synthesises one on keydown via fireSyntheticPointerEvent,
 * so any keyboard interaction with a motion element throws
 * `ReferenceError: PointerEvent is not defined` — an unhandled error that fails
 * the run even when every assertion passes.
 *
 * Minimal shim: MouseEvent plus the pointer fields Framer Motion reads.
 */
if (typeof window !== 'undefined' && typeof window.PointerEvent === 'undefined') {
    class PointerEventShim extends MouseEvent {
        readonly pointerId: number;
        readonly width: number;
        readonly height: number;
        readonly pressure: number;
        readonly tangentialPressure: number;
        readonly tiltX: number;
        readonly tiltY: number;
        readonly twist: number;
        readonly pointerType: string;
        readonly isPrimary: boolean;

        constructor(type: string, params: PointerEventInit = {}) {
            super(type, params);
            this.pointerId = params.pointerId ?? 0;
            this.width = params.width ?? 1;
            this.height = params.height ?? 1;
            this.pressure = params.pressure ?? 0;
            this.tangentialPressure = params.tangentialPressure ?? 0;
            this.tiltX = params.tiltX ?? 0;
            this.tiltY = params.tiltY ?? 0;
            this.twist = params.twist ?? 0;
            this.pointerType = params.pointerType ?? 'mouse';
            this.isPrimary = params.isPrimary ?? true;
        }
    }

    window.PointerEvent = PointerEventShim as unknown as typeof window.PointerEvent;
    globalThis.PointerEvent = PointerEventShim as unknown as typeof globalThis.PointerEvent;
}

afterEach(() => {
    cleanup();
});
