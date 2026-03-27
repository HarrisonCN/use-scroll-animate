/**
 * use-scroll-animate - Animation Presets
 * Defines keyframes for all built-in animation presets
 */
import type { AnimationPreset, CustomAnimation, EasingType } from './types';
type KeyframeMap = {
    from: Record<string, string | number>;
    to: Record<string, string | number>;
};
export declare const PRESETS: Record<AnimationPreset, KeyframeMap>;
export declare function resolvePreset(animation: AnimationPreset | AnimationPreset[] | CustomAnimation): KeyframeMap;
/** Easing to CSS cubic-bezier mapping */
export declare const EASING_MAP: Record<string, string>;
export declare function resolveEasing(easing: EasingType): string;
export {};
