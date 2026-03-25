/**
 * use-scroll-animate - Vue 3 Integration
 * Provides useScrollAnimate composable for Vue 3 applications.
 */

import type { AnimateOptions } from './types';
import { resolvePreset, resolveEasing } from './presets';

export function createVueComposables(Vue: {
  ref: <T>(value: T | null) => { value: T | null };
  onMounted: (fn: () => void) => void;
  onUnmounted: (fn: () => void) => void;
}) {
  function useScrollAnimate(options: AnimateOptions = {}) {
    const animateRef = Vue.ref<Element>(null);
    let observer: IntersectionObserver | null = null;
    let progressObserver: IntersectionObserver | null = null;

    Vue.onMounted(() => {
      const el = animateRef.value;
      if (!el) return;

      const {
        animation = 'fade-in-up',
        duration = 600,
        delay = 0,
        easing = 'ease',
        threshold = 0.1,
        rootMargin = '0px',
        repeat = false,
        parallax = {},
        onStart,
        onComplete,
        onEnter,
        onLeave,
        onProgress,
      } = options;

      const preset = resolvePreset(animation);
      const easingValue = resolveEasing(easing);
      let animated = false;

      (el as HTMLElement).style.opacity = '0';

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              onEnter?.(el);
              if (!animated || repeat) {
                const anim = el.animate(
                  [preset.from as Keyframe, preset.to as Keyframe],
                  {
                    duration,
                    delay,
                    easing: easingValue,
                    fill: 'both',
                  }
                );
                onStart?.(el);
                anim.onfinish = () => onComplete?.(el);
                animated = true;
                if (!repeat && !Object.keys(parallax).length && !onProgress) {
                  observer?.unobserve(el);
                }
              }
            } else {
              onLeave?.(el);
              if (repeat && animated) {
                (el as HTMLElement).style.opacity = '0';
                animated = false;
              }
            }
          });
        },
        { threshold: typeof threshold === 'number' ? threshold : threshold[0], rootMargin }
      );

      if (Object.keys(parallax).length > 0 || onProgress) {
        const thresholds = [];
        for (let i = 0; i <= 100; i++) thresholds.push(i / 100);
        
        progressObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              const progress = entry.intersectionRatio;
              onProgress?.(el, progress);
              
              if (Object.keys(parallax).length > 0) {
                const { x = 0, y = 0, rotate = 0, scale = 1, speed = 1 } = parallax;
                const p = (progress - 0.5) * 2 * speed;
                let transform = '';
                if (x) transform += ` translateX(${typeof x === 'number' ? x * p + 'px' : 'calc(' + x + ' * ' + p + ')'})`;
                if (y) transform += ` translateY(${typeof y === 'number' ? y * p + 'px' : 'calc(' + y + ' * ' + p + ')'})`;
                if (rotate) transform += ` rotate(${rotate * p}deg)`;
                if (scale !== 1) transform += ` scale(${1 + (scale - 1) * p})`;
                (el as HTMLElement).style.transform = transform;
              }
            });
          },
          { threshold: thresholds, rootMargin }
        );
        progressObserver.observe(el);
      }

      observer.observe(el);
    });

    Vue.onUnmounted(() => {
      observer?.disconnect();
      progressObserver?.disconnect();
    });

    return { animateRef };
  }

  return { useScrollAnimate };
}
