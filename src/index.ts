/**
 * use-scroll-animate
 *
 * A lightweight (~4KB gzipped), dependency-free scroll animation library
 * for modern web applications. Built with TypeScript, powered by
 * IntersectionObserver and the Web Animations API.
 *
 * @version 1.0.0
 * @license MIT
 * @see https://github.com/use-scroll-animate/use-scroll-animate
 */

export { createScrollAnimate } from './core';
export { PRESETS, resolvePreset, resolveEasing, EASING_MAP } from './presets';
export { createReactHooks } from './react';
export { createVueComposables } from './vue';

export type {
  AnimationPreset,
  EasingType,
  AnimationKeyframe,
  CustomAnimation,
  AnimateOptions,
  ScrollAnimateConfig,
  AnimatedElement,
  ScrollAnimateInstance,
} from './types';

// Default export: a ready-to-use singleton instance
import { createScrollAnimate } from './core';

/**
 * Default singleton instance of ScrollAnimate.
 * Ready to use out of the box with sensible defaults.
 *
 * @example
 * ```js
 * import ScrollAnimate from 'use-scroll-animate';
 *
 * // Auto-initialize all elements with data-sa attribute
 * ScrollAnimate.init();
 *
 * // Or manually observe elements
 * ScrollAnimate.observe('.my-element', { animation: 'fade-in-up' });
 * ```
 */
const ScrollAnimate = createScrollAnimate();
export default ScrollAnimate;
