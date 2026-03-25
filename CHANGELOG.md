# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
