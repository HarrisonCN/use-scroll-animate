<div align="center">

# use-scroll-animate 🚀

**A lightweight (~2.9KB gzipped), dependency-free scroll animation library for the modern web.**

[![GitHub release (latest by date)](https://img.shields.io/github/v/release/HarrisonCN/use-scroll-animate?style=flat-square)](https://github.com/HarrisonCN/use-scroll-animate/releases)
[![GitHub repo size](https://img.shields.io/github/repo-size/HarrisonCN/use-scroll-animate?style=flat-square)](https://github.com/HarrisonCN/use-scroll-animate)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

[English](./README.md) | [简体中文](./README_zh.md) | [日本語](./README_ja.md)

</div>

## Why `use-scroll-animate`?

In 2025, performance is everything. Traditional scroll animation libraries often bundle heavy dependencies, rely on outdated scroll event listeners, or force you into a specific framework.

`use-scroll-animate` is built differently:
- ⚡ **Zero Dependencies**: Pure Vanilla JS/TypeScript.
- 🚀 **High Performance**: Powered by `IntersectionObserver` and the native `Web Animations API`. No scroll event listeners, no layout thrashing.
- 🪶 **Ultra Lightweight**: Only ~2.9KB gzipped.
- 🧩 **Framework Agnostic**: Works seamlessly with Vanilla JS, React, Vue, Svelte, and more. First-class React Hooks and Vue Composables included.
- ♿ **Accessible**: Respects `prefers-reduced-motion` out of the box.

## Installation

```bash
npm install use-scroll-animate
```

## v1.3.0 New Features: Custom Easing 🎨

You can now use custom cubic-bezier curves or even JavaScript functions to create complex physical effects.

### 1. Cubic-Bezier Array
Pass an array of 4 numbers to define a custom cubic-bezier curve.

```javascript
ScrollAnimate.observe('.box', {
  animation: 'fade-in-up',
  easing: [0.68, -0.55, 0.265, 1.55] // Custom bounce effect
});
```

### 2. Custom Easing Function
Pass a function `(t: number) => number` for complete control over the animation timing.

```javascript
ScrollAnimate.observe('.box', {
  easing: (t) => t * t * (3 - 2 * t) // Custom smooth-step
});
```

### 3. New Physics Presets
We've added high-quality physics-based easing presets:
- `spring`: Standard spring effect.
- `soft-spring`: Gentle, bouncy entrance.
- `heavy-bounce`: Dramatic bounce effect.

## Quick Start (Vanilla JS / HTML)

```html
<div data-sa data-sa-animation="fade-in-up" data-sa-easing="soft-spring">
  I have a soft spring effect!
</div>

<div data-sa data-sa-animation="zoom-in" data-sa-easing="[0.34, 1.56, 0.64, 1]">
  I use a custom cubic-bezier array!
</div>

<script type="module">
  import ScrollAnimate from 'use-scroll-animate';
  ScrollAnimate.init();
</script>
```

## Core Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `animation` | `string` \| `string[]` | `'fade-in-up'` | Preset name or array of presets |
| `easing` | `string` \| `number[]` \| `function` | `'ease'` | CSS easing, cubic-bezier array, or function |
| `once` | `boolean` | `true` | Trigger animation only once |
| `offset` | `number` | `0` | Viewport offset in pixels |
| `parallax` | `object` | `{}` | Parallax effect configuration |

## Contributing

Contributions are always welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
