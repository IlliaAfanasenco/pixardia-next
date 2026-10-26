# Adding a case study

Every case study is one typed `Project` record in `content/projects.ts`. The shared template in
`features/projects/ProjectCaseStudy.tsx` renders both the canonical page and the intercepted modal
from that record. Do not add project-specific JSX; every optional section renders only when its
data exists.

## Classification

- `caseStudy.classification: "real_project"` — delivered client work. Requires `type: "client"`.
- `caseStudy.classification: "studio_concept"` — a proposed product. The modal labels the stack
  "Proposed stack" and the content contract rejects `results` on concepts.
- Omit it to keep the legacy project-type label.

## Optional fields

| Field | Use |
| --- | --- |
| `caseStudy.gallery` | `{ media, title, description }[]`. Each view's description updates with the gallery. All views must share one aspect ratio (contract-checked). Takes precedence over `coverImage` + `images`. |
| `challenge`, `solution` | Business challenge and proposed/delivered solution. |
| `caseStudy.featureGroups` | `{ label, items }[]`, e.g. "Customer experience" and "Merchant operations". |
| `caseStudy.capabilities` / `capabilitiesNote` | Flat capability list and a scope disclaimer. |
| `caseStudy.scope` | Deliverables, rendered as chips. |
| `caseStudy.technologyGroups` | Stack; every item must also be in `technologies`. |
| `caseStudy.clientProfile` | `{ name, industry?, region?, website? }` for identifiable clients. |
| `caseStudy.results` | Measured outcomes only (`label`, `value`, `source?`). Real projects only. |
| `caseStudy.links` | Extra external links. `liveUrl` only for a real, accessible deployment. |
| `caseStudy.commercialCta` | `{ label, href: "/contact?project=<slug>" }` — the localized contact flow. |

All copy is `LocalizedText` (English and German).

## Archive preview

The homepage archive card renders the designed system diagram for its variant in
`components/archive/archive-projects.ts`. It never reads the gallery or `coverImage`. To show an
image on the card instead, set `archivePreview.image` explicitly.

## Gallery assets

The modal frame takes the assets' own ratio, so images fill it edge to edge without cropping or
stretching. Deliver 16:9 (e.g. 1920×1080 WebP) for a consistent 16:9 presentation. Keep important
UI inside the central 90% and leave background margin around devices.

## Desktop fit

With the cinematic runtime active (≥1280×800, fine pointer, motion allowed) the modal blocks wheel
scrolling, so both panels must fit the viewport. Check new content at 1280×800 in German, the
longest locale, with `tests/e2e/nordmarkt-case-study.spec.ts` as a reference.

## NORDMARKT

NORDMARKT (`nordmarkt-commerce`) is a studio concept. The five 1672×941 (≈16:9) screens in
`public/images/projects/nordmarkt/16x9/` are concept renders, and the dashboard figures are
illustrative, not measured results. No client, deployment or performance
outcome is claimed.
