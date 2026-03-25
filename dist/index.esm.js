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
    'skew-in': {
        from: { opacity: 0, transform: 'skewX(20deg) translateX(30px)' },
        to: { opacity: 1, transform: 'skewX(0deg) translateX(0)' },
    },
    'scale-x': {
        from: { transform: 'scaleX(0)' },
        to: { transform: 'scaleX(1)' },
    },
    'scale-y': {
        from: { transform: 'scaleY(0)' },
        to: { transform: 'scaleY(1)' },
    },
};
function resolvePreset(animation) {
    var _a;
    if (typeof animation === 'string') {
        return (_a = PRESETS[animation]) !== null && _a !== void 0 ? _a : PRESETS['fade-in-up'];
    }
    if (Array.isArray(animation)) {
        const combined = { from: {}, to: {} };
        animation.forEach(name => {
            const preset = PRESETS[name];
            if (preset) {
                // Merge from properties
                Object.entries(preset.from).forEach(([key, val]) => {
                    if (key === 'transform' && combined.from[key]) {
                        combined.from[key] = `${combined.from[key]} ${val}`;
                    }
                    else {
                        combined.from[key] = val;
                    }
                });
                // Merge to properties
                Object.entries(preset.to).forEach(([key, val]) => {
                    if (key === 'transform' && combined.to[key]) {
                        combined.to[key] = `${combined.to[key]} ${val}`;
                    }
                    else {
                        combined.to[key] = val;
                    }
                });
            }
        });
        return combined;
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
    parallax: {},
    onStart: () => undefined,
    onComplete: () => undefined,
    onEnter: () => undefined,
    onLeave: () => undefined,
    onProgress: () => undefined,
};
function parseDataAttributes(el, config) {
    const dataset = el.dataset;
    const opts = {};
    if (dataset.saAnimation) {
        const anim = dataset.saAnimation;
        opts.animation = anim.includes(',')
            ? anim.split(',').map(s => s.trim())
            : anim;
    }
    if (dataset.saDuration)
        opts.duration = parseInt(dataset.saDuration, 10);
    if (dataset.saDelay)
        opts.delay = parseInt(dataset.saDelay, 10);
    if (dataset.saEasing)
        opts.easing = dataset.saEasing;
    if (dataset.saThreshold) {
        const t = dataset.saThreshold;
        opts.threshold = t.includes(',') ? t.split(',').map(parseFloat) : parseFloat(t);
    }
    if (dataset.saRootMargin)
        opts.rootMargin = dataset.saRootMargin;
    if (dataset.saRepeat !== undefined)
        opts.repeat = dataset.saRepeat !== 'false';
    if (dataset.saStagger)
        opts.stagger = parseInt(dataset.saStagger, 10);
    // Parallax attributes
    if (dataset.saParallaxX || dataset.saParallaxY || dataset.saParallaxRotate || dataset.saParallaxScale) {
        opts.parallax = {
            x: dataset.saParallaxX,
            y: dataset.saParallaxY,
            rotate: dataset.saParallaxRotate ? parseFloat(dataset.saParallaxRotate) : undefined,
            scale: dataset.saParallaxScale ? parseFloat(dataset.saParallaxScale) : undefined,
            speed: dataset.saParallaxSpeed ? parseFloat(dataset.saParallaxSpeed) : 1,
        };
    }
    return mergeOptions(opts, config);
}
function mergeOptions(opts, config) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    return {
        animation: (_a = opts.animation) !== null && _a !== void 0 ? _a : config.defaultAnimation,
        duration: (_b = opts.duration) !== null && _b !== void 0 ? _b : config.defaultDuration,
        delay: (_c = opts.delay) !== null && _c !== void 0 ? _c : config.defaultDelay,
        easing: (_d = opts.easing) !== null && _d !== void 0 ? _d : config.defaultEasing,
        threshold: (_e = opts.threshold) !== null && _e !== void 0 ? _e : config.defaultThreshold,
        rootMargin: (_f = opts.rootMargin) !== null && _f !== void 0 ? _f : config.defaultRootMargin,
        repeat: (_g = opts.repeat) !== null && _g !== void 0 ? _g : config.defaultRepeat,
        stagger: (_h = opts.stagger) !== null && _h !== void 0 ? _h : DEFAULT_OPTIONS.stagger,
        parallax: (_j = opts.parallax) !== null && _j !== void 0 ? _j : DEFAULT_OPTIONS.parallax,
        onStart: (_k = opts.onStart) !== null && _k !== void 0 ? _k : DEFAULT_OPTIONS.onStart,
        onComplete: (_l = opts.onComplete) !== null && _l !== void 0 ? _l : DEFAULT_OPTIONS.onComplete,
        onEnter: (_m = opts.onEnter) !== null && _m !== void 0 ? _m : DEFAULT_OPTIONS.onEnter,
        onLeave: (_o = opts.onLeave) !== null && _o !== void 0 ? _o : DEFAULT_OPTIONS.onLeave,
        onProgress: (_p = opts.onProgress) !== null && _p !== void 0 ? _p : DEFAULT_OPTIONS.onProgress,
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
        if (totalDelay > 0) {
            el.style.animationDelay = `${totalDelay}ms`;
        }
        el.classList.remove(config.hiddenClass);
        el.classList.add(config.visibleClass);
        onStart(el);
        setTimeout(() => onComplete(el), duration + totalDelay);
        return;
    }
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
    const anim = el.animate(keyframes, timing);
    onStart(el);
    anim.onfinish = () => onComplete(el);
}
function applyParallax(el, progress, parallax) {
    const { x = 0, y = 0, rotate = 0, scale = 1, speed = 1 } = parallax;
    const p = (progress - 0.5) * 2 * speed; // Range -1 to 1
    let transform = '';
    if (x)
        transform += ` translateX(${typeof x === 'number' ? x * p + 'px' : 'calc(' + x + ' * ' + p + ')'})`;
    if (y)
        transform += ` translateY(${typeof y === 'number' ? y * p + 'px' : 'calc(' + y + ' * ' + p + ')'})`;
    if (rotate)
        transform += ` rotate(${rotate * p}deg)`;
    if (scale !== 1)
        transform += ` scale(${1 + (scale - 1) * p})`;
    el.style.transform = transform;
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
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = '';
                        }
                        record.animated = true;
                        if (!opts.repeat && !Object.keys(opts.parallax).length && opts.onProgress === DEFAULT_OPTIONS.onProgress) {
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
            threshold: typeof opts.threshold === 'number' ? opts.threshold : opts.threshold[0],
            rootMargin: opts.rootMargin,
            root: config.root,
        });
    }
    function createProgressObserver(el, opts) {
        // Create a list of thresholds for smooth progress tracking
        const thresholds = [];
        for (let i = 0; i <= 100; i++)
            thresholds.push(i / 100);
        return new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const progress = entry.intersectionRatio;
                opts.onProgress(el, progress);
                if (Object.keys(opts.parallax).length > 0) {
                    applyParallax(el, progress, opts.parallax);
                }
            });
        }, {
            threshold: thresholds,
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
        let progressObserver;
        if (Object.keys(opts.parallax).length > 0 || opts.onProgress !== DEFAULT_OPTIONS.onProgress) {
            progressObserver = createProgressObserver(el, opts);
            progressObserver.observe(el);
        }
        registry.set(el, {
            element: el,
            options: opts,
            observer,
            animated: false,
            progressObserver
        });
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
                var _a;
                const record = registry.get(el);
                if (record) {
                    record.observer.unobserve(el);
                    (_a = record.progressObserver) === null || _a === void 0 ? void 0 : _a.unobserve(el);
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
                var _a;
                record.observer.disconnect();
                (_a = record.progressObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
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
 */
function createReactHooks(React) {
    function useScrollAnimate(options = {}) {
        const ref = React.useRef(null);
        React.useEffect(() => {
            const el = ref.current;
            if (!el)
                return;
            const { animation = 'fade-in-up', duration = 600, delay = 0, easing = 'ease', threshold = 0.1, rootMargin = '0px', repeat = false, parallax = {}, onStart, onComplete, onEnter, onLeave, onProgress, } = options;
            const preset = resolvePreset(animation);
            const easingValue = resolveEasing(easing);
            let animated = false;
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
                                easing: easingValue,
                                fill: 'both',
                            });
                            onStart === null || onStart === void 0 ? void 0 : onStart(el);
                            anim.onfinish = () => onComplete === null || onComplete === void 0 ? void 0 : onComplete(el);
                            animated = true;
                            if (!repeat && !Object.keys(parallax).length && !onProgress) {
                                observer.unobserve(el);
                            }
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
            }, { threshold: typeof threshold === 'number' ? threshold : threshold[0], rootMargin });
            let progressObserver = null;
            if (Object.keys(parallax).length > 0 || onProgress) {
                const thresholds = [];
                for (let i = 0; i <= 100; i++)
                    thresholds.push(i / 100);
                progressObserver = new IntersectionObserver((entries) => {
                    entries.forEach((entry) => {
                        const progress = entry.intersectionRatio;
                        onProgress === null || onProgress === void 0 ? void 0 : onProgress(el, progress);
                        if (Object.keys(parallax).length > 0) {
                            const { x = 0, y = 0, rotate = 0, scale = 1, speed = 1 } = parallax;
                            const p = (progress - 0.5) * 2 * speed;
                            let transform = '';
                            if (x)
                                transform += ` translateX(${typeof x === 'number' ? x * p + 'px' : 'calc(' + x + ' * ' + p + ')'})`;
                            if (y)
                                transform += ` translateY(${typeof y === 'number' ? y * p + 'px' : 'calc(' + y + ' * ' + p + ')'})`;
                            if (rotate)
                                transform += ` rotate(${rotate * p}deg)`;
                            if (scale !== 1)
                                transform += ` scale(${1 + (scale - 1) * p})`;
                            el.style.transform = transform;
                        }
                    });
                }, { threshold: thresholds, rootMargin });
                progressObserver.observe(el);
            }
            observer.observe(el);
            return () => {
                observer.disconnect();
                progressObserver === null || progressObserver === void 0 ? void 0 : progressObserver.disconnect();
            };
        }, []);
        return ref;
    }
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
            }, { threshold: typeof threshold === 'number' ? threshold : threshold[0], rootMargin });
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
 */
function createVueComposables(Vue) {
    function useScrollAnimate(options = {}) {
        const animateRef = Vue.ref(null);
        let observer = null;
        let progressObserver = null;
        Vue.onMounted(() => {
            const el = animateRef.value;
            if (!el)
                return;
            const { animation = 'fade-in-up', duration = 600, delay = 0, easing = 'ease', threshold = 0.1, rootMargin = '0px', repeat = false, parallax = {}, onStart, onComplete, onEnter, onLeave, onProgress, } = options;
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
                                easing: easingValue,
                                fill: 'both',
                            });
                            onStart === null || onStart === void 0 ? void 0 : onStart(el);
                            anim.onfinish = () => onComplete === null || onComplete === void 0 ? void 0 : onComplete(el);
                            animated = true;
                            if (!repeat && !Object.keys(parallax).length && !onProgress) {
                                observer === null || observer === void 0 ? void 0 : observer.unobserve(el);
                            }
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
            }, { threshold: typeof threshold === 'number' ? threshold : threshold[0], rootMargin });
            if (Object.keys(parallax).length > 0 || onProgress) {
                const thresholds = [];
                for (let i = 0; i <= 100; i++)
                    thresholds.push(i / 100);
                progressObserver = new IntersectionObserver((entries) => {
                    entries.forEach((entry) => {
                        const progress = entry.intersectionRatio;
                        onProgress === null || onProgress === void 0 ? void 0 : onProgress(el, progress);
                        if (Object.keys(parallax).length > 0) {
                            const { x = 0, y = 0, rotate = 0, scale = 1, speed = 1 } = parallax;
                            const p = (progress - 0.5) * 2 * speed;
                            let transform = '';
                            if (x)
                                transform += ` translateX(${typeof x === 'number' ? x * p + 'px' : 'calc(' + x + ' * ' + p + ')'})`;
                            if (y)
                                transform += ` translateY(${typeof y === 'number' ? y * p + 'px' : 'calc(' + y + ' * ' + p + ')'})`;
                            if (rotate)
                                transform += ` rotate(${rotate * p}deg)`;
                            if (scale !== 1)
                                transform += ` scale(${1 + (scale - 1) * p})`;
                            el.style.transform = transform;
                        }
                    });
                }, { threshold: thresholds, rootMargin });
                progressObserver.observe(el);
            }
            observer.observe(el);
        });
        Vue.onUnmounted(() => {
            observer === null || observer === void 0 ? void 0 : observer.disconnect();
            progressObserver === null || progressObserver === void 0 ? void 0 : progressObserver.disconnect();
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

export { EASING_MAP, PRESETS, createReactHooks, createScrollAnimate, createVueComposables, ScrollAnimate as default, resolveEasing, resolvePreset };
//# sourceMappingURL=index.esm.js.map
