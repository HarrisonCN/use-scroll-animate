/**
 * use-scroll-animate - Vue 3 Integration
 * Provides useScrollAnimate composable for Vue 3 applications.
 */
import type { AnimateOptions } from './types';
export declare function createVueComposables(Vue: {
    ref: <T>(value: T | null) => {
        value: T | null;
    };
    onMounted: (fn: () => void) => void;
    onUnmounted: (fn: () => void) => void;
}): {
    useScrollAnimate: (options?: AnimateOptions) => {
        animateRef: {
            value: Element | null;
        };
    };
};
