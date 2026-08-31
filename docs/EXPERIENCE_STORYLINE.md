# Pixardia cinematic presentation

This document defines the motion architecture for the homepage composition.

## Story Order

| Step | Section | Role |
| --- | --- | --- |
| 1 | Hero (`#hero`, `data-cinematic-scene="hero"`) | Opening studio signal and first presentation frame. |
| 2 | Crafting / Structure (`#crafting-structure`, `data-cinematic-scene="crafting"`) | Architecture and AI terminal frame. |
| 3 | Neural / Intelligence (`#neural-system`, `data-cinematic-scene="neural"`) | The architecture powers on: core, connected system nodes, and intelligence become the visual centerpiece. |
| 4 | Product / Lifecycle (`#process`, `data-cinematic-scene="product"`) | The activated system becomes a delivery lifecycle. |
| 5 | Archive (`#projects`) | Natural-flow evidence chapter. |
| 6 | Contact (`#contact`) | Natural-flow finale. |

DOM order:

Hero -> Crafting -> Neural -> Product -> Archive -> Contact.

## Runtime

`components/presentation/CinematicRuntime.tsx` remains the single owner of homepage cinematic scrolling.

The first four chapters share one pinned GSAP/ScrollTrigger stage.

Timeline labels:

- `hero`
- `hero-to-crafting`
- `crafting`
- `crafting-to-neural`
- `neural`
- `neural-to-product`
- `product`
- `product-deconstruct`
- `product-to-archive-signal`
- `product-to-archive`
- `product-clean-release`

Neural is intentionally the visual peak. The title resolves first, the system core powers on, SVG network paths draw outward, connected nodes assemble, then insight and system status appear before a longer hold.

The Neural scene deconstructs into Product, so the story reads as:

process -> expertise -> digital products -> selected work -> contact.

Archive and Contact remain natural-flow sections and are not pinned.

The fixed navigator contains six chapters. Pinned chapters occupy progress 0.0 through 0.6, Archive is 0.8, Contact is 1.0.

Reduced motion, touch devices, short desktops, and smaller layouts keep natural document flow. No extra animation library or WebGL layer is introduced.
