/**
 * use-scroll-animate - Core Implementation
 * Uses IntersectionObserver + Web Animations API for zero-dependency,
 * high-performance scroll-triggered animations.
 */

import type {
  AnimateOptions,
  AnimatedElement,
  ScrollAnimateConfig,
  ScrollAnimateInstance,
  ParallaxOptions,
} from './types';
import { resolvePreset, resolveEasing } from './presets';

const DEFAULT_CONFIG: Required<ScrollAnimateConfig> = {
  defaultAnimation: 'fade-in-up',
  defaultDuration: 600,
  defaultDelay: 0,
  defaultEasing: 'ease',
  defaultThreshold: 0.1,
  defaultRootMargin: '0px',
  defaultRepeat: false,
  defaultOnce: true,
  defaultOffset: 0,
  hiddenClass: 'sa-hidden',
  visibleClass: 'sa-visible',
  useClassNames: false,
  disabled: false,
  root: null,
};

const DEFAULT_OPTIONS: Required<AnimateOptions> = {
  animation: 'fade-in-up',
  duration: 600,
  delay: 0,
  easing: 'ease',
  threshold: 0.1,
  rootMargin: '0px',
  repeat: false,
  once: true,
  offset: 0,
  stagger: 0,
  parallax: {},
  onStart: () => undefined,
  onComplete: () => undefined,
  onEnter: () => undefined,
  onLeave: () => undefined,
  onProgress: () => undefined,
};

function parseDataAttributes(el: Element, config: Required<ScrollAnimateConfig>): Required<AnimateOptions> {
  const dataset = (el as HTMLElement).dataset;
  const opts: AnimateOptions = {};

  if (dataset.saAnimation) {
    const anim = dataset.saAnimation;
    opts.animation = anim.includes(',') 
      ? anim.split(',').map(s => s.trim()) as any 
      : anim as any;
  }
  if (dataset.saDuration) opts.duration = parseInt(dataset.saDuration, 10);
  if (dataset.saDelay) opts.delay = parseInt(dataset.saDelay, 10);
  if (dataset.saEasing) opts.easing = dataset.saEasing;
  if (dataset.saThreshold) {
    const t = dataset.saThreshold;
    opts.threshold = t.includes(',') ? t.split(',').map(parseFloat) : parseFloat(t);
  }
  if (dataset.saRootMargin) opts.rootMargin = dataset.saRootMargin;
  if (dataset.saRepeat !== undefined) opts.repeat = dataset.saRepeat !== 'false';
  if (dataset.saOnce !== undefined) opts.once = dataset.saOnce !== 'false';
  if (dataset.saOffset) opts.offset = parseInt(dataset.saOffset, 10);
  if (dataset.saStagger) opts.stagger = parseInt(dataset.saStagger, 10);
  
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

function mergeOptions(
  opts: AnimateOptions,
  config: Required<ScrollAnimateConfig>
): Required<AnimateOptions> {
  const repeat = opts.repeat ?? config.defaultRepeat;
  return {
    animation: opts.animation ?? config.defaultAnimation,
    duration: opts.duration ?? config.defaultDuration,
    delay: opts.delay ?? config.defaultDelay,
    easing: opts.easing ?? config.defaultEasing,
    threshold: opts.threshold ?? config.defaultThreshold,
    rootMargin: opts.rootMargin ?? config.defaultRootMargin,
    repeat: repeat,
    once: opts.once ?? (repeat ? false : config.defaultOnce),
    offset: opts.offset ?? config.defaultOffset,
    stagger: opts.stagger ?? DEFAULT_OPTIONS.stagger,
    parallax: opts.parallax ?? DEFAULT_OPTIONS.parallax,
    onStart: opts.onStart ?? DEFAULT_OPTIONS.onStart,
    onComplete: opts.onComplete ?? DEFAULT_OPTIONS.onComplete,
    onEnter: opts.onEnter ?? DEFAULT_OPTIONS.onEnter,
    onLeave: opts.onLeave ?? DEFAULT_OPTIONS.onLeave,
    onProgress: opts.onProgress ?? DEFAULT_OPTIONS.onProgress,
  };
}

function resolveTargets(target: string | Element | NodeList | Element[]): Element[] {
  if (typeof target === 'string') {
    return Array.from(document.querySelectorAll(target));
  }
  if (target instanceof Element) {
    return [target];
  }
  if (target instanceof NodeList) {
    return Array.from(target) as Element[];
  }
  if (Array.isArray(target)) {
    return target;
  }
  return [];
}

function prefersReducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

function runAnimation(
  el: Element,
  opts: Required<AnimateOptions>,
  config: Required<ScrollAnimateConfig>,
  staggerIndex = 0
): void {
  const { animation, duration, delay, easing, stagger, onStart, onComplete } = opts;
  const totalDelay = delay + staggerIndex * stagger;
  const preset = resolvePreset(animation);
  const easingValue = resolveEasing(easing);

  if (config.useClassNames) {
    if (totalDelay > 0) {
      (el as HTMLElement).style.animationDelay = `${totalDelay}ms`;
    }
    el.classList.remove(config.hiddenClass);
    el.classList.add(config.visibleClass);
    onStart(el);
    setTimeout(() => onComplete(el), duration + totalDelay);
    return;
  }

  const keyframes: Keyframe[] = [
    preset.from as Keyframe,
    preset.to as Keyframe,
  ];

  const timing: KeyframeAnimationOptions = {
    duration,
    delay: totalDelay,
    easing: easingValue,
    fill: 'both',
  };

  // Check if Web Animations API is supported
  if (typeof el.animate === 'function') {
    const anim = el.animate(keyframes, timing);
    onStart(el);
    anim.onfinish = () => onComplete(el);
  } else {
    // Fallback for older browsers
    (el as HTMLElement).style.opacity = '1';
    (el as HTMLElement).style.transform = 'none';
    onStart(el);
    onComplete(el);
  }
}

function applyParallax(el: Element, progress: number, parallax: ParallaxOptions): void {
  const { x = 0, y = 0, rotate = 0, scale = 1, speed = 1 } = parallax;
  const p = (progress - 0.5) * 2 * speed;
  
  let transform = '';
  if (x) transform += ` translateX(${typeof x === 'number' ? x * p + 'px' : 'calc(' + x + ' * ' + p + ')'})`;
  if (y) transform += ` translateY(${typeof y === 'number' ? y * p + 'px' : 'calc(' + y + ' * ' + p + ')'})`;
  if (rotate) transform += ` rotate(${rotate * p}deg)`;
  if (scale !== 1) transform += ` scale(${1 + (scale - 1) * p})`;
  
  (el as HTMLElement).style.transform = transform;
}

function hideElement(el: Element, config: Required<ScrollAnimateConfig>): void {
  if (config.useClassNames) {
    el.classList.add(config.hiddenClass);
    el.classList.remove(config.visibleClass);
  } else {
    (el as HTMLElement).style.opacity = '0';
  }
}

export function createScrollAnimate(userConfig: ScrollAnimateConfig = {}): ScrollAnimateInstance {
  let config: Required<ScrollAnimateConfig> = { ...DEFAULT_CONFIG, ...userConfig };
  const registry = new Map<Element, AnimatedElement>();

  function createObserver(opts: Required<AnimateOptions>): IntersectionObserver {
    // Handle offset by adjusting rootMargin
    const rootMargin = opts.offset !== 0 
      ? `${opts.rootMargin.split(' ')[0]} 0px -${opts.offset}px 0px`
      : opts.rootMargin;

    return new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const record = registry.get(entry.target);
          if (!record) return;

          if (entry.isIntersecting) {
            opts.onEnter(entry.target);

            if (!record.animated || opts.repeat) {
              const parent = entry.target.parentElement;
              let staggerIndex = 0;
              if (parent && opts.stagger > 0) {
                // BUG FIX: Use a more robust way to find index among siblings that are also observed
                const siblings = Array.from(parent.children).filter((c) => registry.has(c));
                staggerIndex = siblings.indexOf(entry.target);
              }

              if (!config.disabled && !prefersReducedMotion()) {
                runAnimation(entry.target, opts, config, staggerIndex);
              } else {
                (entry.target as HTMLElement).style.opacity = '1';
                (entry.target as HTMLElement).style.transform = '';
              }

              record.animated = true;
              
              // Handle 'once' functionality
              if (opts.once) {
                record.observer.unobserve(entry.target);
                record.progressObserver?.unobserve(entry.target);
                // We don't delete from registry yet to allow other potential interactions
              }
            }
          } else {
            opts.onLeave(entry.target);
            if (opts.repeat && record.animated) {
              hideElement(entry.target, config);
              record.animated = false;
            }
          }
        });
      },
      {
        threshold: typeof opts.threshold === 'number' ? opts.threshold : opts.threshold[0],
        rootMargin: rootMargin,
        root: config.root,
      }
    );
  }

  function createProgressObserver(el: Element, opts: Required<AnimateOptions>): IntersectionObserver {
    const thresholds = [];
    for (let i = 0; i <= 100; i++) thresholds.push(i / 100);

    return new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const progress = entry.intersectionRatio;
          opts.onProgress(el, progress);
          
          if (Object.keys(opts.parallax).length > 0) {
            applyParallax(el, progress, opts.parallax);
          }
        });
      },
      {
        threshold: thresholds,
        rootMargin: opts.rootMargin,
        root: config.root,
      }
    );
  }

  function observeElement(el: Element, opts: Required<AnimateOptions>): void {
    if (registry.has(el)) return;

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

  const instance: ScrollAnimateInstance = {
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
          record.observer.disconnect(); // BUG FIX: Use disconnect for better cleanup
          record.progressObserver?.disconnect();
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
        record.progressObserver?.disconnect();
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
