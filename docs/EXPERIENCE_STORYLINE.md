# Pixardia cinematic presentation

This document defines the motion architecture for the existing homepage composition. It is not a redesign brief: section content, project data, cards, modal routes, Header, Footer, Archive, and Contact remain owned by the student layout.

## Story Order

| Step | Section | Role |
| --- | --- | --- |
| 1 | Hero (`#hero`, `data-cinematic-scene="hero"`) | Opening studio signal and first presentation frame. |
| 2 | Crafting / Structure (`#crafting-structure`, `data-cinematic-scene="crafting"`) | Architecture and AI terminal frame. |
| 3 | Product / Lifecycle (`#process`, `data-cinematic-scene="product"`) | Process cards, system panel, and delivery signal. |
| 4 | Archive (`#projects`) | Natural-flow chapter with controlled entry and active state. |
| 5 | Contact (`#contact`) | Natural-flow finale with controlled Archive handoff. |

Header and Footer remain framing elements. DOM order stays Hero -> Crafting / Structure -> Product / Process -> Archive -> Contact.

## Runtime Ownership

`components/presentation/CinematicRuntime.tsx` is the single owner of homepage cinematic scrolling and animation state. It is a small `"use client"` boundary mounted immediately after the server-rendered pinned stage wrapper in `app/page.tsx`, so the fixed veil, signal route, and navigator remain page-wide after stage unpin. It imports GSAP core, ScrollTrigger, `@gsap/react` `useGSAP`, and Lenis.

The previous `components/motion/MotionRuntime.tsx`, `StorylineOverlay.tsx`, CSS view timelines, and IntersectionObserver scene-state pass are retired from the homepage. The old system could mark active metadata, but it could not pin the stage, create hold phases, run a scrubbed master timeline, draw a visible veil, or choreograph elements separately.

## Pinned Stage

The first three narrative sections are wrapped once by `[data-cinematic-stage]`. In desktop cinematic mode, GSAP creates one primary `ScrollTrigger`:

- `pin: true`;
- `pinSpacing: true`;
- `scrub: 0.18`;
- `start: "top top"`;
- dynamic `end` based on viewport height;
- `invalidateOnRefresh: true`;
- no snap;
- no wheel or keyboard interception;
- no `scrollTo`.

The pinned root is not transformed. Only inner scene layers, text blocks, cards, the SVG signal route, and transition veil are animated. Navigator progress is a CSS custom property updated outside the timeline, so it has one owner across all five chapters.

## Master Timeline

The master timeline uses explicit labels:

- `hero`;
- `hero-to-crafting`;
- `crafting`;
- `crafting-to-product`;
- `product`;
- `product-deconstruct`;
- `product-to-archive-signal`;
- `product-to-archive`;
- `product-clean-release`.

Hero enters as a staged frame: eyebrow, title spans, copy, CTA, metadata, and character art. Hero then recedes while a short, restrained veil pulse rises and Crafting enters through a controlled clip/translate. Crafting copy, form card, terminal, and signal path animate in separate phases. Product enters after the second veil pulse, then heading, lifecycle cards, system panel, status indicator, and route line animate with staggered timing. Product now receives a readable hold, then deconstructs before primary pin release: cards, title, terminal, status, and signal graphics leave, the veil briefly peaks, and `product-clean-release` lands before the ScrollTrigger end. This avoids a frame where Product and Archive split the viewport.

## Flow Chapters

Archive and Contact remain normal document sections. They are not pinned, duplicated, or moved into the absolute scene stack. The same runtime adds a minimal set of natural-flow ScrollTrigger segments:

- Product -> Archive handoff: veil and signal route bridge the moment immediately after Product clean release.
- Archive entry: the Archive section eases from `autoAlpha: 0.78` and a small translate into its authored layout; existing cards receive only a small stagger on their existing DOM nodes.
- Archive active: navigator and signal state hold stage 04 while the user reads the archive.
- Archive -> Contact handoff: Archive subtly exits, the veil participates, the signal route converges, and Contact enters without pinning the form.
- Contact active/finale: navigator and signal state settle on stage 05 while the form stays interactive.

## Lenis

Lenis is enabled only in the GSAP `matchMedia` desktop condition:

- desktop width and height;
- fine pointer and hover;
- `prefers-reduced-motion: no-preference`.

The integration follows the GSAP ticker pattern: `lenis.on("scroll", ScrollTrigger.update)`, `gsap.ticker.add`, `lenis.raf(time * 1000)`, and `gsap.ticker.lagSmoothing(0)`. Cleanup removes the ticker callback and destroys Lenis.

Current desktop tuning uses `lerp: 0.12`, `wheelMultiplier: 0.9`, and primary ScrollTrigger `scrub: 0.18`. This removes the previous double-smoothing feel caused by Lenis smoothing plus a slower numeric scrub and eased scrubbed tweens.

## Navigator, Veil, Signal

`SceneNavigator` is fixed to the viewport with `right: var(--cinematic-nav-right)`, not to the content container. It includes Hero, Crafting, Product, Archive, and Contact as 44px keyboard/click button targets. Hero, Crafting, and Product scroll to master timeline labels computed from `timeline.labels`, `trigger.start`, and `trigger.end`; Archive and Contact scroll to their natural-flow sections with the header offset. Its progress maps the pinned intro to the first half of the rail, Archive to stage 04, and Contact to stage 05. It is hidden below the cinematic breakpoint.

`TransitionVeil` is a fixed full-viewport layer, pointer-inert, above scene backgrounds and below navigation. It remains mounted after stage unpin and participates in Product -> Archive and Archive -> Contact transitions while staying visually restrained.

`SignalRoute` is a simple SVG overlay with stroke-dash animation. It is decorative and `aria-hidden`. Runtime chapter state changes the route emphasis for Archive evidence framing and Contact convergence.

## Fallbacks

Mobile, tablet, short desktop, touch pointers, and reduced-motion users keep natural document flow, native scroll, no Lenis, no pinning, no fixed navigator, no veil, and no scene stacking. With JavaScript unavailable or if the desktop media query does not match, all sections remain readable and interactive in authored order.

## Accessibility And Performance

The homepage keeps one `h1`. The runtime does not move focus, does not intercept keyboard scrolling, and uses `inert` plus `aria-hidden` only for inactive desktop scene layers while the pinned presentation is active. Reduced motion disables the cinematic timeline and returns natural flow.

The runtime uses one master timeline, one primary ScrollTrigger, one Lenis instance, and one GSAP ticker callback. Animations are limited to opacity, transform, clip-path on major layers, and SVG stroke offset.
