# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2025-03-25

### Added

- **Once Control**: New `once` option to automatically stop observing an element after its animation has triggered, saving system resources.
- **Viewport Offset**: New `offset` option to specify how many pixels an element must enter the viewport before the animation starts.
- **New Animation Presets**: Added `shimmer`, `pulse`, and `swing`.
- **Multi-language Documentation**: Added Chinese (`README_zh.md`) and Japanese (`README_ja.md`) documentation.
- **Fallback Support**: Added a fallback mechanism for browsers that do not support the Web Animations API.

### Fixed

- **Memory Leak**: Improved `IntersectionObserver` cleanup by using `disconnect()` instead of `unobserve()` in key areas.
- **Stagger Bug**: Fixed an issue where `stagger` animation indices were incorrectly calculated when DOM elements were added dynamically.
- **Type Safety**: Improved TypeScript definitions for better developer experience.

### Changed

- Updated `AnimateOptions` and `ScrollAnimateConfig` to include `once` and `offset`.
- Refactored `IntersectionObserver` logic to handle offsets via `rootMargin`.

## [1.1.0] - 2025-03-25

### Added

- **Multiple Animations**: Support for applying multiple animation presets simultaneously (e.g., `["fade-in-up", "zoom-in"]`).
- **Parallax Effect**: New `parallax` option for creating scroll-driven parallax effects (`x`, `y`, `rotate`, `scale`, `speed`).
- **Scroll Progress Listener**: New `onProgress` callback that provides real-time scroll progress (0 to 1) for an element.
- **New Animation Presets**: Added `skew-in`, `scale-x`, `scale-y`.
- **Threshold Array Support**: `threshold` option now accepts an array of numbers for more granular progress tracking.
- **Improved React Hooks**: `useScrollAnimate` and `useScrollStagger` now fully support `parallax` and `onProgress`.
- **Improved Vue Composables**: `useScrollAnimate` now fully supports `parallax` and `onProgress`.

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
