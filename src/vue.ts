/**
 * use-scroll-animate - Vue 3 Integration
 * Provides useScrollAnimate composable for Vue 3 applications.
 *
 * Note: This file uses a soft dependency on Vue 3.
 * Import from 'use-scroll-animate/vue' in your Vue project.
 */

import type { AnimateOptions } from './types';
import { resolvePreset, resolveEasing } from './presets';

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
export function createVueComposables(Vue: {
  ref: <T>(value: T | null) => { value: T | null };
  onMounted: (fn: () => void) => void;
  onUnmounted: (fn: () => void) => void;
}) {
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
  function useScrollAnimate(options: AnimateOptions = {}) {
    const animateRef = Vue.ref<Element>(null);
    let observer: IntersectionObserver | null = null;

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
        onStart,
        onComplete,
        onEnter,
        onLeave,
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
                    easing: animation === 'bounce' ? 'cubic-bezier(0.34, 1.56, 0.64, 1)' : easingValue,
                    fill: 'both',
                  }
                );
                onStart?.(el);
                anim.onfinish = () => onComplete?.(el);
                animated = true;
                if (!repeat) observer?.unobserve(el);
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
    });

    Vue.onUnmounted(() => {
      observer?.disconnect();
    });

    return { animateRef };
  }

  return { useScrollAnimate };
}
