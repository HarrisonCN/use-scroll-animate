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
  stagger: 0,
  onStart: () => undefined,
  onComplete: () => undefined,
  onEnter: () => undefined,
  onLeave: () => undefined,
};

function parseDataAttributes(el: Element, config: Required<ScrollAnimateConfig>): Required<AnimateOptions> {
  const dataset = (el as HTMLElement).dataset;
  const opts: AnimateOptions = {};

  if (dataset.saAnimation) opts.animation = dataset.saAnimation as AnimateOptions['animation'];
  if (dataset.saDuration) opts.duration = parseInt(dataset.saDuration, 10);
  if (dataset.saDelay) opts.delay = parseInt(dataset.saDelay, 10);
  if (dataset.saEasing) opts.easing = dataset.saEasing;
  if (dataset.saThreshold) opts.threshold = parseFloat(dataset.saThreshold);
  if (dataset.saRootMargin) opts.rootMargin = dataset.saRootMargin;
  if (dataset.saRepeat !== undefined) opts.repeat = dataset.saRepeat !== 'false';
  if (dataset.saStagger) opts.stagger = parseInt(dataset.saStagger, 10);

  return mergeOptions(opts, config);
}

function mergeOptions(
  opts: AnimateOptions,
  config: Required<ScrollAnimateConfig>
): Required<AnimateOptions> {
  return {
    animation: opts.animation ?? config.defaultAnimation,
    duration: opts.duration ?? config.defaultDuration,
    delay: opts.delay ?? config.defaultDelay,
    easing: opts.easing ?? config.defaultEasing,
    threshold: opts.threshold ?? config.defaultThreshold,
    rootMargin: opts.rootMargin ?? config.defaultRootMargin,
    repeat: opts.repeat ?? config.defaultRepeat,
    stagger: opts.stagger ?? DEFAULT_OPTIONS.stagger,
    onStart: opts.onStart ?? DEFAULT_OPTIONS.onStart,
    onComplete: opts.onComplete ?? DEFAULT_OPTIONS.onComplete,
    onEnter: opts.onEnter ?? DEFAULT_OPTIONS.onEnter,
    onLeave: opts.onLeave ?? DEFAULT_OPTIONS.onLeave,
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
    // CSS class-based mode
    if (totalDelay > 0) {
      (el as HTMLElement).style.animationDelay = `${totalDelay}ms`;
    }
    el.classList.remove(config.hiddenClass);
    el.classList.add(config.visibleClass);
    onStart(el);
    setTimeout(() => onComplete(el), duration + totalDelay);
    return;
  }

  // Web Animations API mode
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

  // Special bounce easing
  if (animation === 'bounce') {
    timing.easing = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
  }

  const anim = el.animate(keyframes, timing);
  onStart(el);
  anim.onfinish = () => onComplete(el);
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
    return new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const record = registry.get(entry.target);
          if (!record) return;

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
              } else {
                // Skip animation but still show element
                (entry.target as HTMLElement).style.opacity = '1';
                (entry.target as HTMLElement).style.transform = '';
              }

              record.animated = true;

              if (!opts.repeat) {
                record.observer.unobserve(entry.target);
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
        threshold: opts.threshold,
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

    registry.set(el, { element: el, options: opts, observer, animated: false });
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
