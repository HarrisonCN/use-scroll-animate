/**
 * use-scroll-animate - Vue 3 Integration
 * Provides useScrollAnimate composable for Vue 3 applications.
 *
 * Note: This file uses a soft dependency on Vue 3.
 * Import from 'use-scroll-animate/vue' in your Vue project.
 */
import type { AnimateOptions } from './types';
/**
 * Factory function for Vue 3 composables.
 * Pass Vue's ref and onMounted/onUnmounted to create the composables.
 *
 * @example
 * ```ts
 * // In your Vue project:
 * import { ref, onMounted, onUnmounted } from 'vue';
 * import { createVueComposables } from 'use-scroll-animate/vue';
 *
 * const { useScrollAnimate } = createVueComposables({ ref, onMounted, onUnmounted });
 * ```
 */
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
