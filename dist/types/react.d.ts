/**
 * use-scroll-animate - React Integration
 * Provides useScrollAnimate and useScrollRef hooks for React applications.
 *
 * Note: This file uses a soft dependency on React.
 * Import from 'use-scroll-animate/react' in your React project.
 */
import type { AnimateOptions } from './types';
type ReactRef<T> = {
    current: T | null;
};
/**
 * useScrollAnimate - React Hook
 *
 * Returns a ref to attach to a DOM element. When the element enters the viewport,
 * the specified animation will be triggered.
 *
 * @example
 * ```tsx
 * import { useScrollAnimate } from 'use-scroll-animate/react';
 *
 * function MyComponent() {
 *   const ref = useScrollAnimate({ animation: 'fade-in-up', duration: 800 });
 *   return <div ref={ref}>Hello World</div>;
 * }
 * ```
 */
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
