/**
 * use-scroll-animate - Animation Presets
 * Defines keyframes for all built-in animation presets
 */

import type { AnimationPreset, CustomAnimation } from './types';

type KeyframeMap = {
  from: Record<string, string | number>;
  to: Record<string, string | number>;
};

export const PRESETS: Record<AnimationPreset, KeyframeMap> = {
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

export function resolvePreset(animation: AnimationPreset | CustomAnimation): KeyframeMap {
  if (typeof animation === 'string') {
    return PRESETS[animation] ?? PRESETS['fade-in-up'];
  }
  return animation;
}

/** Easing to CSS cubic-bezier mapping */
export const EASING_MAP: Record<string, string> = {
  linear: 'linear',
  ease: 'ease',
  'ease-in': 'ease-in',
  'ease-out': 'ease-out',
  'ease-in-out': 'ease-in-out',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
};

export function resolveEasing(easing: string): string {
  return EASING_MAP[easing] ?? easing;
}
