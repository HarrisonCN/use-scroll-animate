/**
 * use-scroll-animate - React Integration
 * Provides useScrollAnimate and useScrollRef hooks for React applications.
 */

import type { AnimateOptions } from './types';
import { resolvePreset, resolveEasing } from './presets';

type ReactRef<T> = { current: T | null };

export function createReactHooks(React: {
  useRef: <T>(initial: T | null) => ReactRef<T>;
  useEffect: (effect: () => (() => void) | void, deps?: unknown[]) => void;
}) {
  function useScrollAnimate(options: AnimateOptions = {}) {
    const ref = React.useRef<Element>(null);

    React.useEffect(() => {
      const el = ref.current;
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

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              onEnter?.(el);
              if (!animated || repeat) {
                const keyframes: Keyframe[] = [
                  preset.from as Keyframe,
                  preset.to as Keyframe,
                ];
                const anim = el.animate(keyframes, {
                  duration,
                  delay,
                  easing: easingValue,
                  fill: 'both',
                });
                onStart?.(el);
                anim.onfinish = () => onComplete?.(el);
                animated = true;
                if (!repeat && !Object.keys(parallax).length && !onProgress) {
                  observer.unobserve(el);
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

      let progressObserver: IntersectionObserver | null = null;
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
      return () => {
        observer.disconnect();
        progressObserver?.disconnect();
      };
    }, []);

    return ref;
  }

  function useScrollStagger(options: AnimateOptions & { stagger?: number } = {}) {
    const ref = React.useRef<Element>(null);

    React.useEffect(() => {
      const container = ref.current;
      if (!container) return;

      const {
        animation = 'fade-in-up',
        duration = 600,
        delay = 0,
        easing = 'ease',
        threshold = 0.1,
        rootMargin = '0px',
        stagger = 80,
      } = options;

      const children = Array.from(container.children) as HTMLElement[];
      const preset = resolvePreset(animation);
      const easingValue = resolveEasing(easing);

      children.forEach((child) => {
        child.style.opacity = '0';
      });

      let animated = false;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !animated) {
              animated = true;
              children.forEach((child, i) => {
                child.animate(
                  [preset.from as Keyframe, preset.to as Keyframe],
                  {
                    duration,
                    delay: delay + i * stagger,
                    easing: easingValue,
                    fill: 'both',
                  }
                );
              });
              observer.unobserve(container);
            }
          });
        },
        { threshold: typeof threshold === 'number' ? threshold : threshold[0], rootMargin }
      );

      observer.observe(container);
      return () => observer.disconnect();
    }, []);

    return ref;
  }

  return { useScrollAnimate, useScrollStagger };
}
