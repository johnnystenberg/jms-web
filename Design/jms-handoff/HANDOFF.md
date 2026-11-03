# Handoff: jmssoftware.se, start page (dark theme, filterable app grid)

**Version:** 1.0 · 2026-11-03
**Design source:** Design canvas, artboard "A · Filtrerbart rutnät"
**Reference build:** `reference/index.html`. Self-contained HTML/CSS/vanilla JS. Open it in a browser; it's the source of truth for every value in this spec.

## Package contents

| Path | What |
|---|---|
| `HANDOFF.md` | This spec |
| `reference/index.html` | Working reference implementation (tokens in `:root`, data in `APPS` / `CATEGORIES`) |
| `assets/jms-logo-light.png` | Logo for dark backgrounds (used in header) |
| `assets/jms-logo-dark.png` | Logo for light backgrounds (not used on this page) |
| `screenshots/01–07` | Desktop, tablet, mobile, filter states, hover/focus |

> **Logo:** use the original **SVG** files in production; the PNGs here are placeholders. Header height is 44 px desktop and 36 px mobile, with width auto.

---

## 1. Overview

The old page listed every app top to bottom, so it got longer with each new app. The new page shows apps as a **card grid with category filters**: a visitor can find an app quickly, and the page stays short with 15–20+ apps.

Page order: **Header → Hero → Our apps (filters + grid) → Get in touch → Footer.**

## 2. Layout

- Content container: `max-width: 1160px`, centered, horizontal padding `24px`.
- App grid: `grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))`, `gap: 16px`. This gives 3 columns at desktop width, 2 on tablet and 1 on phone. It has no breakpoints of its own.
- Cards in the same row are equal height. The description takes up the extra space (`flex: 1`), so badges and links line up across a row.

## 3. Design tokens

### Color
| Token | Value | Usage |
|---|---|---|
| `--color-bg` | `#0B0C0E` | Page background |
| `--color-surface` | `#15171B` | Cards, language switch background |
| `--color-surface-alt` | `#111316` | Contact + footer band |
| `--color-border` | `#262A31` | Card border, card link divider |
| `--color-border-subtle` | `#1E2127` | Header bottom border, contact top border |
| `--color-border-control` | `#30343C` | Unselected filter chip border |
| `--color-text` | `#F2F3F5` | Headings, nav, primary text |
| `--color-text-body` | `#C9CDD4` | Card description |
| `--color-text-muted` | `#A1A7B3` | Hero lead, tagline, platforms |
| `--color-text-faint` | `#8A909C` | Footer legal text |
| `--color-brand` | `#3D5AFE` | Logo blue: selected chip, hero period, focus ring base |
| `--color-link` | `#8FA3FF` | Links on dark (brand tint, passes AA on `#15171B`) |
| `--color-link-hover` | `#B8C5FF` | Link hover |
| `--color-ok-bg / -fg` | `#12301C / #7EE2A0` | "Available" badge |
| `--color-soon-bg / -fg` | `#33240C / #FFC46B` | "Coming soon" badge |

Don't use `--color-brand` for text on dark backgrounds, because it fails contrast. Use `--color-link` for blue text.

### Typography
Font family **Inter** (400/500/600/700) from Google Fonts. Fallback: `system-ui, -apple-system, "Segoe UI", sans-serif`.

| Role | Size / line height / weight | Letter spacing |
|---|---|---|
| Hero H1 | `clamp(36px, 5vw, 60px)` / 1.04 / 700 | −0.025em |
| Hero lead | 19px (17px mobile) / 1.5 / 400 | – |
| Section H2 | 28px / normal / 700 | −0.01em |
| Card title H3 | 19px / normal / 700 | – |
| Card tagline | 14px / 400 | – |
| Card description | 15px / 1.55 / 400 | – |
| Card link | 15px / 600 | – |
| Chip | 14px / 500 | – |
| Nav | 15px / 400 | – |
| Badge | 12px / 600 | – |
| Platforms | 13px / 400 | – |
| Footer | 12px / 1.6 | – |

### Spacing and radii
Spacing scale (px): 4 · 8 · 12 · 16 · 20 · 24 · 32 · 48 · 56 · 72 · 88.
Radii: language segment 7 · button 12 · app icon 14 · card 20 · chip/badge 999 (pill).

## 4. Components

| Component | Spec |
|---|---|
| **Header** | Logo (left) + nav (right): `Apps` (anchor `#apps`), `Contact` (anchor `#contact`), and the EN/SV segment. 20px vertical padding, 1px bottom border. Wraps on narrow screens. |
| **Language switch** | Segment control, 3px inner padding, `--color-surface` background. The active language is `--color-text` background with `--color-bg` text and `aria-current="true"`. Links go to `/` and `/sv/`. |
| **Hero** | H1 with the final period wrapped in `<span class="dot">`, colored `--color-brand`. This echoes the "jms." logo. The lead text is limited to 600px width. Padding 72/48 (48/32 on mobile). |
| **Filter chip** | `<button aria-pressed>`, min height 40px, padding 8×16, pill shape. The count follows the label at 60% opacity. **Off:** transparent background, `--color-border-control` border. **Hover:** border `#4A505B`. **On:** `--color-brand` background and border, white text. |
| **App card** | `<li>` in a `<ul>`. Padding 24, radius 20, `--color-surface` background, 1px `--color-border`. Content from top: icon (56×56, r14) + name/tagline → description → status badge (left) + platforms (right, joined with " · ") → divider + link "{label} →". |
| **App icon** | Use the real app icon (`icon` field). Without one, the fallback is a colored square with the first letter (`color` / `fg` fields). |
| **Status badge** | `live` → "Available" (green). `soon` → "Coming soon" (amber). |
| **Contact band** | H2 + short line on the left, primary button `mailto:kontakt@jmssoftware.se` on the right. The button is light (`--color-text`) with dark text, and goes full width on mobile. |

## 5. Data model

To add an app, add one object to `APPS`. No other change is needed: the chip counts update automatically, and a chip whose category has no apps is hidden.

```js
{
  name: 'Prisio',            // card title
  tagline: 'Price Scanner',  // one short line
  desc: '…',                 // 1–2 sentences, aim for ≤ 120 characters
  category: 'travel',        // id from CATEGORIES (not 'all' / 'soon')
  status: 'live' | 'soon',
  platforms: ['iOS', 'Android'],
  url: 'https://prisio.io',  // external site or internal page (/lonekoll/)
  linkLabel: 'prisio.io',    // or 'Learn more'
  icon: '/img/prisio.png',   // optional, 112×112 @2x; null → letter fallback
  color: '#C2410C', fg: '#FFFFFF' // fallback icon colors
}
```

Current categories: `all` (All), `money` (Money & everyday), `travel` (Travel), `work` (Teams & work), `soon` (Coming soon). `soon` is virtual: it filters on `status === 'soon'`.

## 6. States and interactions

| Element | State | Behavior |
|---|---|---|
| Filter chip | Click | Shows only matching cards. Sets `aria-pressed`. Updates the URL to `?cat=<id>` with `history.replaceState`, which adds no history entries. |
| Page load | `?cat=work` in the URL | Opens with that filter active, so filtered views can be linked. An unknown value falls back to `all`. |
| App card | Hover | Border lightens to `#3A3F48` and the card moves up 2px (`translateY(-2px)`), over 200ms. |
| Links | Hover | `--color-link` → `--color-link-hover`. |
| Primary button | Hover | Background goes to pure `#FFFFFF`. |
| Everything focusable | `:focus-visible` | 2px outline `--color-link`, 3px offset. |
| Grid | Filter result is empty | Shows "No apps in this category yet." in a dashed box. This can't happen with today's data, because empty chips are hidden. |

### Motion
| Element | Trigger | Animation | Duration | Easing |
|---|---|---|---|---|
| Chip | Select/hover | bg, border, color | 150ms | `cubic-bezier(.2,.7,.2,1)` |
| Card | Hover | border-color, translateY(−2px) | 200ms | same |
| Page | Anchor click | Smooth scroll | browser | – |

`prefers-reduced-motion: reduce` turns off all transitions and smooth scrolling.

## 7. Responsive behavior

| Breakpoint | Changes |
|---|---|
| ≥ 1000px | 3-column grid. Chips sit on the same row as the "Our apps" heading. |
| 640–1000px | 2-column grid. The chip row wraps below the heading. |
| ≤ 600px | 1 column. The **chips scroll sideways** in one row, edge to edge, with no scrollbar, so they don't stack into three rows. Logo is 36px. Smaller hero padding. Contact button is full width. |

## 8. Edge cases

- **Long app name or tagline:** these wrap. Don't truncate them, because the cards have room.
- **Long description:** aim for ≤ 120 characters. Longer text makes that card taller, and the whole row follows.
- **Swedish version (`/sv/`):** same layout, with translated labels. Suggested chip labels: *Alla, Pengar & vardag, Resor, Team & jobb, Kommer snart*. Badges: *Tillgänglig / Kommer snart*. Link labels: *Läs mer*. Swedish strings run about 10–15% longer, and the chips already wrap or scroll to fit them.
- **Many apps (20+):** the grid just grows. If needed later, the "All" view could show the 6 newest apps with a "Show all" button. That isn't part of this version.
- **Fonts fail to load:** the fallback is the system font. The layout is unaffected.
- **No JS:** the reference renders the cards with JS. In production, **render the cards server-side or statically** and let JS only handle filtering, so the content is there for SEO and for visitors without JS.

## 9. Accessibility

- Order: skip link (recommended to add) → logo → Apps → Contact → EN/SV → filter chips → cards (each card has one link) → contact button.
- Filter chips are a `role="group"` with `aria-label="Filter apps"`, and each one is a `<button>` with `aria-pressed`.
- After filtering, a visually hidden `aria-live="polite"` region announces "Teams & work: 2 apps".
- Card links include hidden context (`<span class="sr-only"> – Prisio</span>`), so a screen reader doesn't hear five links all called "Learn more".
- The fallback letter icons are `aria-hidden`. Real icon images get `alt=""`, because the name is right next to them.
- Contrast was checked against AA. Body text, muted text, links, badges and the white text on the selected chip (`#3D5AFE`) all pass 4.5:1.
- Logo `alt`: "JMS Software & Consulting – home".

## 10. Open items

1. Swap the logo PNG for the SVG.
2. Real app icons for all five apps.
3. Confirm the category names and which category each app belongs to.
4. Swedish copy for `/sv/`.
