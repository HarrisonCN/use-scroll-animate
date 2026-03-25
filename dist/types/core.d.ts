/**
 * use-scroll-animate - Core Implementation
 * Uses IntersectionObserver + Web Animations API for zero-dependency,
 * high-performance scroll-triggered animations.
 */
import type { ScrollAnimateConfig, ScrollAnimateInstance } from './types';
export declare function createScrollAnimate(userConfig?: ScrollAnimateConfig): ScrollAnimateInstance;
