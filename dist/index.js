'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * use-scroll-animate - Animation Presets
 * Defines keyframes for all built-in animation presets
 */
const PRESETS = {
    'fade-in': {
        from: { opacity: 0 },
        to: { opacity: 1 },
    },
    'fade-in-up': {
        from: { opacity: 0, transform: 'translateY(40px)' },
        to: { opacity: 1, transform: 'translateY(0)' },
    },
    'fade-in-down': {
        from: { opacity: 0, transform: 'translateY(-40px)' },
        to: { opacity: 1, transform: 'translateY(0)' },
    },
    'fade-in-left': {
        from: { opacity: 0, transform: 'translateX(-40px)' },
        to: { opacity: 1, transform: 'translateX(0)' },
    },
    'fade-in-right': {
        from: { opacity: 0, transform: 'translateX(40px)' },
        to: { opacity: 1, transform: 'translateX(0)' },
    },
    'zoom-in': {
        from: { opacity: 0, transform: 'scale(0.8)' },
        to: { opacity: 1, transform: 'scale(1)' },
    },
    'zoom-out': {
        from: { opacity: 0, transform: 'scale(1.2)' },
        to: { opacity: 1, transform: 'scale(1)' },
    },
    'flip-x': {
        from: { opacity: 0, transform: 'rotateX(-90deg)' },
        to: { opacity: 1, transform: 'rotateX(0)' },
    },
    'flip-y': {
        from: { opacity: 0, transform: 'rotateY(-90deg)' },
        to: { opacity: 1, transform: 'rotateY(0)' },
    },
    'slide-up': {
        from: { transform: 'translateY(100%)' },
        to: { transform: 'translateY(0)' },
    },
    'slide-down': {
        from: { transform: 'translateY(-100%)' },
        to: { transform: 'translateY(0)' },
    },
    'slide-left': {
        from: { transform: 'translateX(-100%)' },
        to: { transform: 'translateX(0)' },
    },
    'slide-right': {
        from: { transform: 'translateX(100%)' },
        to: { transform: 'translateX(0)' },
    },
    'bounce': {
        from: { opacity: 0, transform: 'translateY(-60px)' },
        to: { opacity: 1, transform: 'translateY(0)' },
    },
    'rotate-in': {
        from: { opacity: 0, transform: 'rotate(-180deg) scale(0.5)' },
        to: { opacity: 1, transform: 'rotate(0deg) scale(1)' },
    },
    'blur-in': {
        from: { opacity: 0, filter: 'blur(12px)' },
        to: { opacity: 1, filter: 'blur(0px)' },
    },
};
function resolvePreset(animation) {
    var _a;
    if (typeof animation === 'string') {
        return (_a = PRESETS[animation]) !== null && _a !== void 0 ? _a : PRESETS['fade-in-up'];
    }
    return animation;
}
/** Easing to CSS cubic-bezier mapping */
const EASING_MAP = {
    linear: 'linear',
    ease: 'ease',
    'ease-in': 'ease-in',
    'ease-out': 'ease-out',
    'ease-in-out': 'ease-in-out',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
};
function resolveEasing(easing) {
    var _a;
    return (_a = EASING_MAP[easing]) !== null && _a !== void 0 ? _a : easing;
}

/**
 * use-scroll-animate - Core Implementation
 * Uses IntersectionObserver + Web Animations API for zero-dependency,
 * high-performance scroll-triggered animations.
 */
const DEFAULT_CONFIG = {
    defaultAnimation: 'fade-in-up',
    defaultDuration: 600,
    defaultDelay: 0,
    defaultEasing: 'ease',
    defaultThreshold: 0.1,
    defaultRootMargin: '0px',
    defaultRepeat: false,
    hiddenClass: 'sa-hidden',
    visibleClass: 'sa-visible',
    useClassNames: false,
    disabled: false,
    root: null,
};
const DEFAULT_OPTIONS = {
    stagger: 0,
    onStart: () => undefined,
    onComplete: () => undefined,
    onEnter: () => undefined,
    onLeave: () => undefined,
};
function parseDataAttributes(el, config) {
    const dataset = el.dataset;
    const opts = {};
    if (dataset.saAnimation)
        opts.animation = dataset.saAnimation;
    if (dataset.saDuration)
        opts.duration = parseInt(dataset.saDuration, 10);
    if (dataset.saDelay)
        opts.delay = parseInt(dataset.saDelay, 10);
    if (dataset.saEasing)
        opts.easing = dataset.saEasing;
    if (dataset.saThreshold)
        opts.threshold = parseFloat(dataset.saThreshold);
    if (dataset.saRootMargin)
        opts.rootMargin = dataset.saRootMargin;
    if (dataset.saRepeat !== undefined)
        opts.repeat = dataset.saRepeat !== 'false';
    if (dataset.saStagger)
        opts.stagger = parseInt(dataset.saStagger, 10);
    return mergeOptions(opts, config);
}
function mergeOptions(opts, config) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    return {
        animation: (_a = opts.animation) !== null && _a !== void 0 ? _a : config.defaultAnimation,
        duration: (_b = opts.duration) !== null && _b !== void 0 ? _b : config.defaultDuration,
        delay: (_c = opts.delay) !== null && _c !== void 0 ? _c : config.defaultDelay,
        easing: (_d = opts.easing) !== null && _d !== void 0 ? _d : config.defaultEasing,
        threshold: (_e = opts.threshold) !== null && _e !== void 0 ? _e : config.defaultThreshold,
        rootMargin: (_f = opts.rootMargin) !== null && _f !== void 0 ? _f : config.defaultRootMargin,
        repeat: (_g = opts.repeat) !== null && _g !== void 0 ? _g : config.defaultRepeat,
        stagger: (_h = opts.stagger) !== null && _h !== void 0 ? _h : DEFAULT_OPTIONS.stagger,
        onStart: (_j = opts.onStart) !== null && _j !== void 0 ? _j : DEFAULT_OPTIONS.onStart,
        onComplete: (_k = opts.onComplete) !== null && _k !== void 0 ? _k : DEFAULT_OPTIONS.onComplete,
        onEnter: (_l = opts.onEnter) !== null && _l !== void 0 ? _l : DEFAULT_OPTIONS.onEnter,
        onLeave: (_m = opts.onLeave) !== null && _m !== void 0 ? _m : DEFAULT_OPTIONS.onLeave,
    };
}
function resolveTargets(target) {
    if (typeof target === 'string') {
        return Array.from(document.querySelectorAll(target));
    }
    if (target instanceof Element) {
        return [target];
    }
    if (target instanceof NodeList) {
        return Array.from(target);
    }
    if (Array.isArray(target)) {
        return target;
    }
    return [];
}
function prefersReducedMotion() {
    var _a, _b;
    return (_b = (_a = window.matchMedia) === null || _a === void 0 ? void 0 : _a.call(window, '(prefers-reduced-motion: reduce)').matches) !== null && _b !== void 0 ? _b : false;
}
function runAnimation(el, opts, config, staggerIndex = 0) {
    const { animation, duration, delay, easing, stagger, onStart, onComplete } = opts;
    const totalDelay = delay + staggerIndex * stagger;
    const preset = resolvePreset(animation);
    const easingValue = resolveEasing(easing);
    if (config.useClassNames) {
        // CSS class-based mode
        if (totalDelay > 0) {
            el.style.animationDelay = `${totalDelay}ms`;
        }
        el.classList.remove(config.hiddenClass);
        el.classList.add(config.visibleClass);
        onStart(el);
        setTimeout(() => onComplete(el), duration + totalDelay);
        return;
    }
    // Web Animations API mode
    const keyframes = [
        preset.from,
        preset.to,
    ];
    const timing = {
        duration,
        delay: totalDelay,
        easing: easingValue,
        fill: 'both',
    };
    // Special bounce easing
    if (animation === 'bounce') {
        timing.easing = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
    }
    const anim = el.animate(keyframes, timing);
    onStart(el);
    anim.onfinish = () => onComplete(el);
}
function hideElement(el, config) {
    if (config.useClassNames) {
        el.classList.add(config.hiddenClass);
        el.classList.remove(config.visibleClass);
    }
    else {
        el.style.opacity = '0';
    }
}
function createScrollAnimate(userConfig = {}) {
    let config = { ...DEFAULT_CONFIG, ...userConfig };
    const registry = new Map();
    function createObserver(opts) {
        return new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const record = registry.get(entry.target);
                if (!record)
                    return;
                if (entry.isIntersecting) {
                    opts.onEnter(entry.target);
                    if (!record.animated || opts.repeat) {
                        // Determine stagger index among siblings
                        const parent = entry.target.parentElement;
                        let staggerIndex = 0;
                        if (parent && opts.stagger > 0) {
                            const siblings = Array.from(parent.children).filter((c) => registry.has(c));
                            staggerIndex = siblings.indexOf(entry.target);
                        }
                        if (!config.disabled && !prefersReducedMotion()) {
                            runAnimation(entry.target, opts, config, staggerIndex);
                        }
                        else {
                            // Skip animation but still show element
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = '';
                        }
                        record.animated = true;
                        if (!opts.repeat) {
                            record.observer.unobserve(entry.target);
                        }
                    }
                }
                else {
                    opts.onLeave(entry.target);
                    if (opts.repeat && record.animated) {
                        hideElement(entry.target, config);
                        record.animated = false;
                    }
                }
            });
        }, {
            threshold: opts.threshold,
            rootMargin: opts.rootMargin,
            root: config.root,
        });
    }
    function observeElement(el, opts) {
        if (registry.has(el))
            return;
        if (!config.useClassNames) {
            hideElement(el, config);
        }
        const observer = createObserver(opts);
        observer.observe(el);
        registry.set(el, { element: el, options: opts, observer, animated: false });
    }
    const instance = {
        observe(target, options = {}) {
            const elements = resolveTargets(target);
            const opts = mergeOptions(options, config);
            elements.forEach((el) => observeElement(el, opts));
        },
        unobserve(target) {
            const elements = resolveTargets(target);
            elements.forEach((el) => {
                const record = registry.get(el);
                if (record) {
                    record.observer.unobserve(el);
                    registry.delete(el);
                }
            });
        },
        init(rootElement = document) {
            const elements = rootElement.querySelectorAll('[data-sa]');
            elements.forEach((el) => {
                const opts = parseDataAttributes(el, config);
                observeElement(el, opts);
            });
        },
        destroy() {
            registry.forEach((record) => {
                record.observer.disconnect();
            });
            registry.clear();
        },
        refresh() {
            const entries = Array.from(registry.entries());
            instance.destroy();
            entries.forEach(([el, record]) => {
                observeElement(el, record.options);
            });
        },
        animate(target, options = {}) {
            const elements = resolveTargets(target);
            const opts = mergeOptions(options, config);
            elements.forEach((el) => {
                runAnimation(el, opts, config, 0);
            });
        },
        getObservedElements() {
            return Array.from(registry.values());
        },
        configure(newConfig) {
            config = { ...config, ...newConfig };
        },
    };
    return instance;
}

/**
 * use-scroll-animate - React Integration
 * Provides useScrollAnimate and useScrollRef hooks for React applications.
 *
 * Note: This file uses a soft dependency on React.
 * Import from 'use-scroll-animate/react' in your React project.
 */
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
function createReactHooks(React) {
    function useScrollAnimate(options = {}) {
        const ref = React.useRef(null);
        React.useEffect(() => {
            const el = ref.current;
            if (!el)
                return;
            const { animation = 'fade-in-up', duration = 600, delay = 0, easing = 'ease', threshold = 0.1, rootMargin = '0px', repeat = false, onStart, onComplete, onEnter, onLeave, } = options;
            const preset = resolvePreset(animation);
            const easingValue = resolveEasing(easing);
            let animated = false;
            // Set initial hidden state
            el.style.opacity = '0';
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        onEnter === null || onEnter === void 0 ? void 0 : onEnter(el);
                        if (!animated || repeat) {
                            const keyframes = [
                                preset.from,
                                preset.to,
                            ];
                            const anim = el.animate(keyframes, {
                                duration,
                                delay,
                                easing: animation === 'bounce' ? 'cubic-bezier(0.34, 1.56, 0.64, 1)' : easingValue,
                                fill: 'both',
                            });
                            onStart === null || onStart === void 0 ? void 0 : onStart(el);
                            anim.onfinish = () => onComplete === null || onComplete === void 0 ? void 0 : onComplete(el);
                            animated = true;
                            if (!repeat)
                                observer.unobserve(el);
                        }
                    }
                    else {
                        onLeave === null || onLeave === void 0 ? void 0 : onLeave(el);
                        if (repeat && animated) {
                            el.style.opacity = '0';
                            animated = false;
                        }
                    }
                });
            }, { threshold, rootMargin });
            observer.observe(el);
            return () => observer.disconnect();
        }, []);
        return ref;
    }
    /**
     * useScrollStagger - Staggered animation for list items
     *
     * @example
     * ```tsx
     * import { createReactHooks } from 'use-scroll-animate/react';
     * const { useScrollStagger } = createReactHooks(React);
     *
     * function List({ items }) {
     *   const containerRef = useScrollStagger({ stagger: 100, animation: 'fade-in-up' });
     *   return (
     *     <ul ref={containerRef}>
     *       {items.map(item => <li key={item.id}>{item.name}</li>)}
     *     </ul>
     *   );
     * }
     * ```
     */
    function useScrollStagger(options = {}) {
        const ref = React.useRef(null);
        React.useEffect(() => {
            const container = ref.current;
            if (!container)
                return;
            const { animation = 'fade-in-up', duration = 600, delay = 0, easing = 'ease', threshold = 0.1, rootMargin = '0px', stagger = 80, } = options;
            const children = Array.from(container.children);
            const preset = resolvePreset(animation);
            const easingValue = resolveEasing(easing);
            children.forEach((child) => {
                child.style.opacity = '0';
            });
            let animated = false;
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !animated) {
                        animated = true;
                        children.forEach((child, i) => {
                            child.animate([preset.from, preset.to], {
                                duration,
                                delay: delay + i * stagger,
                                easing: easingValue,
                                fill: 'both',
                            });
                        });
                        observer.unobserve(container);
                    }
                });
            }, { threshold, rootMargin });
            observer.observe(container);
            return () => observer.disconnect();
        }, []);
        return ref;
    }
    return { useScrollAnimate, useScrollStagger };
}

/**
 * use-scroll-animate - Vue 3 Integration
 * Provides useScrollAnimate composable for Vue 3 applications.
 *
 * Note: This file uses a soft dependency on Vue 3.
 * Import from 'use-scroll-animate/vue' in your Vue project.
 */
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
function createVueComposables(Vue) {
    /**
     * useScrollAnimate - Vue 3 Composable
     *
     * @example
     * ```vue
     * <template>
     *   <div :ref="el => animateRef = el">Hello World</div>
     * </template>
     *
     * <script setup>
     * import { ref, onMounted, onUnmounted } from 'vue';
     * import { createVueComposables } from 'use-scroll-animate/vue';
     *
     * const { useScrollAnimate } = createVueComposables({ ref, onMounted, onUnmounted });
     * const { animateRef } = useScrollAnimate({ animation: 'fade-in-up' });
     * </script>
     * ```
     */
    function useScrollAnimate(options = {}) {
        const animateRef = Vue.ref(null);
        let observer = null;
        Vue.onMounted(() => {
            const el = animateRef.value;
            if (!el)
                return;
            const { animation = 'fade-in-up', duration = 600, delay = 0, easing = 'ease', threshold = 0.1, rootMargin = '0px', repeat = false, onStart, onComplete, onEnter, onLeave, } = options;
            const preset = resolvePreset(animation);
            const easingValue = resolveEasing(easing);
            let animated = false;
            el.style.opacity = '0';
            observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        onEnter === null || onEnter === void 0 ? void 0 : onEnter(el);
                        if (!animated || repeat) {
                            const anim = el.animate([preset.from, preset.to], {
                                duration,
                                delay,
                                easing: animation === 'bounce' ? 'cubic-bezier(0.34, 1.56, 0.64, 1)' : easingValue,
                                fill: 'both',
                            });
                            onStart === null || onStart === void 0 ? void 0 : onStart(el);
                            anim.onfinish = () => onComplete === null || onComplete === void 0 ? void 0 : onComplete(el);
                            animated = true;
                            if (!repeat)
                                observer === null || observer === void 0 ? void 0 : observer.unobserve(el);
                        }
                    }
                    else {
                        onLeave === null || onLeave === void 0 ? void 0 : onLeave(el);
                        if (repeat && animated) {
                            el.style.opacity = '0';
                            animated = false;
                        }
                    }
                });
            }, { threshold, rootMargin });
            observer.observe(el);
        });
        Vue.onUnmounted(() => {
            observer === null || observer === void 0 ? void 0 : observer.disconnect();
        });
        return { animateRef };
    }
    return { useScrollAnimate };
}

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

exports.EASING_MAP = EASING_MAP;
exports.PRESETS = PRESETS;
exports.createReactHooks = createReactHooks;
exports.createScrollAnimate = createScrollAnimate;
exports.createVueComposables = createVueComposables;
exports.default = ScrollAnimate;
exports.resolveEasing = resolveEasing;
exports.resolvePreset = resolvePreset;
//# sourceMappingURL=index.js.map
