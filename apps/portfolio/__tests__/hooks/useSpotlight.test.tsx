import { render, act } from '@testing-library/react';
import useSpotlight from '@/hooks/useSpotlight';

type MQ = Partial<MediaQueryList> & { matches: boolean };

const mockMatchMedia = (matcher: (q: string) => boolean) => {
    window.matchMedia = jest.fn().mockImplementation((q: string): MQ => ({
        matches: matcher(q),
        media: q,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
        dispatchEvent: jest.fn(),
    }));
};

/** jsdom has no PointerEvent; the hook only reads clientX/clientY. */
const pointerEvent = (type: string, x = 0, y = 0) => {
    const e = new Event(type, { bubbles: false });
    Object.assign(e, { clientX: x, clientY: y });
    return e;
};

/**
 * Renders the hook against a real element so React attaches the ref before
 * effects run — which is what happens in production, and what renderHook
 * cannot reproduce when the element is assigned after mount.
 */
function Probe({ onState }: { onState: (active: boolean) => void }) {
    const { ref, active } = useSpotlight<HTMLDivElement>();
    onState(active);
    return <div ref={ref} data-testid="target" />;
}

const setup = () => {
    let active = false;
    const { getByTestId, unmount } = render(<Probe onState={(a) => { active = a; }} />);
    const el = getByTestId('target');
    jest.spyOn(el, 'getBoundingClientRect').mockReturnValue({
        left: 100, top: 50, width: 300, height: 200,
        right: 400, bottom: 250, x: 100, y: 50, toJSON: () => ({}),
    } as DOMRect);
    return { el, unmount, isActive: () => active };
};

describe('useSpotlight', () => {
    beforeEach(() => {
        mockMatchMedia(() => false);
        jest.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 1);
        jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => undefined);
    });

    afterEach(() => jest.restoreAllMocks());

    it('starts inactive', () => {
        const { isActive } = setup();
        expect(isActive()).toBe(false);
    });

    it('activates on pointerenter and deactivates on pointerleave', () => {
        const { el, isActive } = setup();

        act(() => { el.dispatchEvent(pointerEvent('pointerenter', 160, 90)); });
        expect(isActive()).toBe(true);

        act(() => { el.dispatchEvent(pointerEvent('pointerleave')); });
        expect(isActive()).toBe(false);
    });

    it('seeds --mx/--my from the entry point, offset by the element rect', () => {
        const { el } = setup();
        act(() => { el.dispatchEvent(pointerEvent('pointerenter', 160, 90)); });
        // 160-100 = 60, 90-50 = 40
        expect(el.style.getPropertyValue('--mx')).toBe('60px');
        expect(el.style.getPropertyValue('--my')).toBe('40px');
    });

    it('stays inactive when the user prefers reduced motion', () => {
        mockMatchMedia((q) => q.includes('reduced-motion'));
        const { el, isActive } = setup();
        act(() => { el.dispatchEvent(pointerEvent('pointerenter', 160, 90)); });
        expect(isActive()).toBe(false);
    });

    it('stays inactive on coarse pointers', () => {
        mockMatchMedia((q) => q.includes('coarse'));
        const { el, isActive } = setup();
        act(() => { el.dispatchEvent(pointerEvent('pointerenter', 160, 90)); });
        expect(isActive()).toBe(false);
    });

    it('requests animation frames only while hovered', () => {
        const { el } = setup();
        expect(window.requestAnimationFrame).not.toHaveBeenCalled();
        act(() => { el.dispatchEvent(pointerEvent('pointerenter', 160, 90)); });
        expect(window.requestAnimationFrame).toHaveBeenCalled();
        act(() => { el.dispatchEvent(pointerEvent('pointerleave')); });
        expect(window.cancelAnimationFrame).toHaveBeenCalled();
    });

    it('cancels its animation frame on unmount', () => {
        const { el, unmount } = setup();
        act(() => { el.dispatchEvent(pointerEvent('pointerenter', 160, 90)); });
        unmount();
        expect(window.cancelAnimationFrame).toHaveBeenCalled();
    });
});
