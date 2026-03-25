/**
 * use-scroll-animate - Core Type Definitions
 * A lightweight, high-performance scroll animation library
 */
/** Built-in animation presets */
export type AnimationPreset = 'fade-in' | 'fade-in-up' | 'fade-in-down' | 'fade-in-left' | 'fade-in-right' | 'zoom-in' | 'zoom-out' | 'flip-x' | 'flip-y' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'bounce' | 'rotate-in' | 'blur-in';
/** Easing function types */
export type EasingType = 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'spring' | string;
/** Keyframe definition for custom animations */
export interface AnimationKeyframe {
    [property: string]: string | number;
}
/** Custom animation definition */
export interface CustomAnimation {
    from: AnimationKeyframe;
    to: AnimationKeyframe;
}
/** Per-element animation options */
export interface AnimateOptions {
    /** Animation preset name or custom animation object */
    animation?: AnimationPreset | CustomAnimation;
    /** Duration in milliseconds (default: 600) */
    duration?: number;
    /** Delay in milliseconds (default: 0) */
    delay?: number;
    /** Easing function (default: 'ease') */
    easing?: EasingType;
    /** Intersection threshold 0-1 (default: 0.1) */
    threshold?: number;
    /** Root margin for IntersectionObserver (default: '0px') */
    rootMargin?: string;
    /** Whether to replay animation each time element enters viewport (default: false) */
    repeat?: boolean;
    /** Stagger delay for child elements in ms (default: 0) */
    stagger?: number;
    /** Callback fired when animation starts */
    onStart?: (element: Element) => void;
    /** Callback fired when animation completes */
    onComplete?: (element: Element) => void;
    /** Callback fired when element enters viewport */
    onEnter?: (element: Element) => void;
    /** Callback fired when element leaves viewport */
    onLeave?: (element: Element) => void;
}
/** Global configuration for ScrollAnimate instance */
export interface ScrollAnimateConfig {
    /** Default animation preset (default: 'fade-in-up') */
    defaultAnimation?: AnimationPreset | CustomAnimation;
    /** Default duration in ms (default: 600) */
    defaultDuration?: number;
    /** Default delay in ms (default: 0) */
    defaultDelay?: number;
    /** Default easing (default: 'ease') */
    defaultEasing?: EasingType;
    /** Default threshold (default: 0.1) */
    defaultThreshold?: number;
    /** Default root margin (default: '0px') */
    defaultRootMargin?: string;
    /** Whether animations replay by default (default: false) */
    defaultRepeat?: boolean;
    /** CSS class added before animation (default: 'sa-hidden') */
    hiddenClass?: string;
    /** CSS class added when element is visible (default: 'sa-visible') */
    visibleClass?: string;
    /** Whether to use CSS class-based animation instead of Web Animations API */
    useClassNames?: boolean;
    /** Disable all animations (useful for reduced-motion preference) */
    disabled?: boolean;
    /** Custom IntersectionObserver root element */
    root?: Element | null;
}
/** Registered element entry */
export interface AnimatedElement {
    element: Element;
    options: Required<AnimateOptions>;
    observer: IntersectionObserver;
    animated: boolean;
}
/** ScrollAnimate public API */
export interface ScrollAnimateInstance {
    /** Observe a single element or CSS selector */
    observe(target: string | Element | NodeList | Element[], options?: AnimateOptions): void;
    /** Stop observing a single element or CSS selector */
    unobserve(target: string | Element | NodeList | Element[]): void;
    /** Observe all elements matching the data-sa attribute */
    init(rootElement?: Element | Document): void;
    /** Destroy the instance and clean up all observers */
    destroy(): void;
    /** Refresh all observers (useful after DOM changes) */
    refresh(): void;
    /** Manually trigger animation on an element */
    animate(target: string | Element, options?: AnimateOptions): void;
    /** Get all currently observed elements */
    getObservedElements(): AnimatedElement[];
    /** Update global configuration */
    configure(config: Partial<ScrollAnimateConfig>): void;
}
