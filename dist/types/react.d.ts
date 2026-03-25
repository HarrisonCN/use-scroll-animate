/**
 * use-scroll-animate - React Integration
 * Provides useScrollAnimate and useScrollRef hooks for React applications.
 */
import type { AnimateOptions } from './types';
type ReactRef<T> = {
    current: T | null;
};
export declare function createReactHooks(React: {
    useRef: <T>(initial: T | null) => ReactRef<T>;
    useEffect: (effect: () => (() => void) | void, deps?: unknown[]) => void;
}): {
    useScrollAnimate: (options?: AnimateOptions) => ReactRef<Element>;
    useScrollStagger: (options?: AnimateOptions & {
        stagger?: number;
    }) => ReactRef<Element>;
};
export {};
