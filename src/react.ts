/**
 * use-scroll-animate - React Integration
 * Provides useScrollAnimate and useScrollRef hooks for React applications.
 *
 * Note: This file uses a soft dependency on React.
 * Import from 'use-scroll-animate/react' in your React project.
 */

import type { AnimateOptions } from './types';
import { resolvePreset, resolveEasing } from './presets';

// We use dynamic imports to avoid bundling React as a hard dependency
type ReactRef<T> = { current: T | null };

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
        onStart,
        onComplete,
        onEnter,
        onLeave,
      } = options;

      const preset = resolvePreset(animation);
      const easingValue = resolveEasing(easing);

      let animated = false;

      // Set initial hidden state
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
                  easing: animation === 'bounce' ? 'cubic-bezier(0.34, 1.56, 0.64, 1)' : easingValue,
                  fill: 'both',
                });
                onStart?.(el);
                anim.onfinish = () => onComplete?.(el);
                animated = true;
                if (!repeat) observer.unobserve(el);
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
        { threshold, rootMargin }
      );

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
        { threshold, rootMargin }
      );

      observer.observe(container);
      return () => observer.disconnect();
    }, []);

    return ref;
  }

  return { useScrollAnimate, useScrollStagger };
}
