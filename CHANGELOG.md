# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-03-25

### Added

- **Multiple Animations**: Support for applying multiple animation presets simultaneously (e.g., `["fade-in-up", "zoom-in"]`).
- **Parallax Effect**: New `parallax` option for creating scroll-driven parallax effects (`x`, `y`, `rotate`, `scale`, `speed`).
- **Scroll Progress Listener**: New `onProgress` callback that provides real-time scroll progress (0 to 1) for an element.
- **New Animation Presets**: Added `skew-in`, `scale-x`, `scale-y`.
- **Threshold Array Support**: `threshold` option now accepts an array of numbers for more granular progress tracking.
- **Improved React Hooks**: `useScrollAnimate` and `useScrollStagger` now fully support `parallax` and `onProgress`.
- **Improved Vue Composables**: `useScrollAnimate` now fully supports `parallax` and `onProgress`.

### Changed

- Updated `AnimationPreset` type to include new presets.
- Modified `AnimateOptions` and `ScrollAnimateConfig` interfaces to include `parallax` and `onProgress`.
- Enhanced `resolvePreset` function to handle array of animation presets.
- Refactored core logic to integrate parallax and progress observation.

## [1.0.0] - 2025-03-25

### Added

- Initial release of `use-scroll-animate`.
- 16 built-in animation presets: `fade-in`, `fade-in-up`, `fade-in-down`, `fade-in-left`, `fade-in-right`, `zoom-in`, `zoom-out`, `flip-x`, `flip-y`, `slide-up`, `slide-down`, `slide-left`, `slide-right`, `bounce`, `rotate-in`, `blur-in`.
- Core `ScrollAnimate` singleton with `init()`, `observe()`, `unobserve()`, `animate()`, `destroy()`, `refresh()`, and `configure()` methods.
- HTML `data-sa` attribute API for zero-JS usage.
- React integration via `createReactHooks()` factory, providing `useScrollAnimate` and `useScrollStagger` hooks.
- Vue 3 integration via `createVueComposables()` factory, providing `useScrollAnimate` composable.
- Custom animation support via keyframe objects.
- `spring` easing preset (`cubic-bezier(0.34, 1.56, 0.64, 1)`).
- Stagger animation support for sibling elements.
- `onStart`, `onComplete`, `onEnter`, `onLeave` lifecycle callbacks.
- Full TypeScript support with comprehensive type definitions.
- Automatic `prefers-reduced-motion` detection and respect.
- Zero dependencies.
- ~2.9KB gzipped UMD bundle.
