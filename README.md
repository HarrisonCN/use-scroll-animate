<div align="center">

# use-scroll-animate 🚀

**A lightweight (~2.9KB gzipped), dependency-free scroll animation library for the modern web.**

[![npm version](https://img.shields.io/npm/v/use-scroll-animate.svg?style=flat-square)](https://www.npmjs.com/package/use-scroll-animate)
[![npm downloads](https://img.shields.io/npm/dm/use-scroll-animate.svg?style=flat-square)](https://www.npmjs.com/package/use-scroll-animate)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

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
# or
yarn add use-scroll-animate
# or
pnpm add use-scroll-animate
```

## Quick Start (Vanilla JS / HTML)

The easiest way to use it is via HTML `data-sa` attributes.

```html
<!-- 1. Add data-sa attributes to your elements -->
<div data-sa data-sa-animation="fade-in-up" data-sa-duration="800">
  I will animate when scrolled into view!
</div>

<div data-sa data-sa-animation="zoom-in" data-sa-delay="200">
  Me too, with a delay!
</div>

<script type="module">
  // 2. Import and initialize
  import ScrollAnimate from 'use-scroll-animate';
  
  ScrollAnimate.init();
</script>
```

## React Integration

We provide a dedicated hook for React users.

```tsx
import { createReactHooks } from 'use-scroll-animate/react';
import React from 'react';

const { useScrollAnimate, useScrollStagger } = createReactHooks(React);

function App() {
  // Single element animation
  const titleRef = useScrollAnimate({ animation: 'fade-in-down', duration: 1000 });
  
  // Staggered list animation
  const listRef = useScrollStagger({ animation: 'fade-in-up', stagger: 100 });

  return (
    <main>
      <h1 ref={titleRef}>Welcome to my site</h1>
      
      <ul ref={listRef}>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
      </ul>
    </main>
  );
}
```

## Vue 3 Integration

First-class support for Vue 3 Composition API.

```vue
<template>
  <main>
    <h1 :ref="el => titleRef = el">Welcome to my site</h1>
  </main>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { createVueComposables } from 'use-scroll-animate/vue';

const { useScrollAnimate } = createVueComposables({ ref, onMounted, onUnmounted });

const { animateRef: titleRef } = useScrollAnimate({ 
  animation: 'slide-right',
  duration: 800 
});
</script>
```

## Built-in Animations

Choose from 19 highly optimized built-in presets:

- `fade-in`, `fade-in-up`, `fade-in-down`, `fade-in-left`, `fade-in-right`
- `zoom-in`, `zoom-out`
- `slide-up`, `slide-down`, `slide-left`, `slide-right`
- `flip-x`, `flip-y`
- `bounce`, `rotate-in`, `blur-in`
- `skew-in`, `scale-x`, `scale-y`

## Configuration Options

You can pass these options via JavaScript or as `data-sa-*` attributes in HTML.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `animation` | `string` \| `string[]` \| `object` | `['fade-in-up']` | Preset name, array of presets, or custom keyframes |
| `duration` | `number` | `600` | Animation duration in ms |
| `delay` | `number` | `0` | Delay before animation starts in ms |
| `easing` | `string` | `ease` | CSS easing function (`linear`, `ease-out`, `spring`, etc.) |
| `threshold` | `number` \| `number[]` | `0.1` | Intersection threshold (0 to 1) or array for progress |
| `rootMargin` | `string` | `0px` | Root margin for IntersectionObserver |
| `repeat` | `boolean` | `false` | Replay animation every time it enters viewport |
| `stagger` | `number` | `0` | Delay between sibling elements in ms |
| `parallax` | `object` | `{}` | Parallax effect configuration (x, y, rotate, scale, speed) |
| `onProgress` | `(el, progress) => void` | `undefined` | Callback with scroll progress (0 to 1) |

## Advanced Usage

### Multiple Animations

Combine multiple built-in presets for richer effects. For example, `['fade-in-up', 'zoom-in']`.

```html
<div data-sa data-sa-animation="fade-in-up, zoom-in" data-sa-duration="1200">
  I will fade in from bottom and zoom in!
</div>
```

### Parallax Effect

Apply a parallax effect based on scroll position. Use `data-sa-parallax-x`, `data-sa-parallax-y`, `data-sa-parallax-rotate`, `data-sa-parallax-scale`.

```html
<div data-sa data-sa-parallax-y="-100px" data-sa-parallax-speed="0.5">
  I will move up 100px as you scroll!
</div>

<div data-sa data-sa-parallax-rotate="30" data-sa-parallax-speed="0.8">
  I will rotate 30 degrees as you scroll!
</div>
```

### Scroll Progress Listener

Get real-time scroll progress (0 to 1) for an element.

```javascript
import ScrollAnimate from 'use-scroll-animate';

ScrollAnimate.observe('.progress-bar', {
  onProgress: (el, progress) => {
    (el as HTMLElement).style.width = `${progress * 100}%`;
  }
});
```

### Custom Animations

You can define your own animations using the Web Animations API keyframe format:

```javascript
import ScrollAnimate from 'use-scroll-animate';

ScrollAnimate.observe('.custom-box', {
  animation: {
    from: { opacity: 0, transform: 'scale(0.5) rotate(-45deg)' },
    to: { opacity: 1, transform: 'scale(1) rotate(0deg)' }
  },
  duration: 1000,
  easing: 'spring'
});
```

### Callbacks

```javascript
ScrollAnimate.observe('.track-me', {
  onStart: (el) => console.log('Animation started on', el),
  onComplete: (el) => console.log('Animation finished on', el),
  onEnter: (el) => console.log('Element entered viewport'),
  onLeave: (el) => console.log('Element left viewport')
});
```

## Contributing

Contributions are always welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
