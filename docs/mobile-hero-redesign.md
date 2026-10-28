# Mobile Hero redesign

Route: `/mobile-preview`. Desktop Hero, handshake canvas, Neural System, Project Archive, services, and routing are unchanged.

## Changed files

- `app/(mobile-preview)/layout.tsx`: a parser-time intro gate prevents the final Hero flashing before hydration. It expires after five seconds and leaves ordinary HTML available when JavaScript is disabled.
- `components/mobile/sections/MobileHeroSection.tsx` and `.module.css`: responsive composition in document flow, localized studio description and services CTA, separate character stage, unchanged statistics, and corrected contact-card wording.
- `components/mobile/useMobileHeroIntro.ts` and `MobileHeroIntro.module.css`: short GSAP arrival, session persistence, accessible header interruption, reduced-motion support, bounded resource waits, and cleanup.
- `i18n/messages/en.ts` and `de.ts`: uptime and loading-status translations. The description and services CTA reuse their existing English/German translations.
- `tests/e2e/mobile-intro.spec.ts`: continuity, geometry, requested viewport sizes, session, navigation, reduced motion, failed/stalled images, delayed hydration, and JavaScript-disabled checks.
- `docs/screenshots/mobile-hero/hero-375.png` and `hero-430.png`: final header and Hero captures.

## Reused desktop asset and transition

The final frame of the existing Desktop Hero animation, `public/images/hero-handshake/frame-065.webp`, contains the original full-body astronaut and alien in a handshake pose. It is a transparent 960 × 960 WebP, 155,148 bytes. No new character artwork was created. The existing contact avatar is retained.

Mobile requests only that static frame, rather than the 65-frame sequence (approximately 9.66 MiB). GSAP animates the same image element throughout: it measures the reserved Hero stage, applies an inverse fixed-position transform to center the characters beneath the unchanged header, then returns the transform to the measured endpoint. Reverting the animation context restores document flow without an image swap or layout shift.

The intro lasts approximately 1.85 seconds after resources are ready. It plays once per tab using `sessionStorage`, skips for reduced motion or a restored scroll position, and releases the page on an error, timeout, viewport change, or header interaction. Content reveals after character arrival. No mobile scroll sequence or new dependency was added.

## Verification

Requested widths: **320, 375, 390, 430, and 480 px**, in Chromium and WebKit with mobile/touch settings. Actual iPhone Safari hardware was not available; WebKit emulation does not reproduce every Safari address-bar or safe-area behavior.

Automated checks include:

- No character overlap with copy, services CTA, navigation, statistics, or contact link; no horizontal overflow.
- Same decoded image element and source throughout arrival; stable header and reserved Hero height.
- Repeat visit, scrolling without replay, disabled session storage, reduced motion initially and during arrival.
- Failed/stalled image loading, rotation, menu interaction during loading, restored scrolling, and services/contact navigation.
- Delayed scripts, startup fallback, and ordinary HTML with JavaScript disabled.

Final results: **36/36 Playwright checks pass** across Chromium and WebKit. `pnpm lint`, TypeScript checking, the standard `pnpm build` (Turbopack), and a Webpack production build pass. The initial sandbox build timeout was resolved by running the standard build with the required local process permissions. The repository-wide unit suite has two existing failures in untouched services heading and project-gallery source contracts (108 tests pass). Those unrelated sections were left unchanged.

## Remaining visual limitation

WebKit 26.5 PNG captures show a transparent rectangle at the top-left corner of the header. This also occurs with reduced motion (no intro). DOM isolation confirmed that removing the existing footer clears the capture artifact; removing the other sections or adding an opaque header background does not. The footer was left unchanged to honor the requested scope. See `screenshots/mobile-hero/webkit-capture-artifact.png`. Physical iPhone Safari validation is required to determine whether this is limited to WebKit screenshot capture. The final 375px and 430px deliverables are Chromium captures.
