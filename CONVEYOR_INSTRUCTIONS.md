# Conveyor Belt — Setup Instructions for Claude

## What was added
`app/components/ClientLogoConveyor.tsx` — an infinite horizontal scrolling conveyor belt for client logos or portfolio screenshots. Seamlessly loops, fades at edges, mobile responsive.

## How to add it to the page

1. Import it in `app/page.tsx`:
```tsx
import { ClientLogoConveyor } from './components/ClientLogoConveyor'
```

2. Drop it anywhere in the page JSX — recommended between HeroSection and the next section:
```tsx
<HeroSection />
<ClientLogoConveyor />
```

## How to add your actual images

Open `app/components/ClientLogoConveyor.tsx` and replace the `items` array with your real logos:

```tsx
const items = [
  { id: '1', src: '/clients/starbucks.png', alt: 'Starbucks' },
  { id: '2', src: '/clients/nike.png', alt: 'Nike' },
  // add as many as you want — minimum 3 recommended
]
```

Put the image files in `public/clients/` folder. Supported formats: PNG, WEBP, SVG, JPG.

## Customization

| Thing to change | Where |
|---|---|
| Card size | `desktopCardW` and `mobileCardW` variables |
| Card shape (portrait vs landscape) | The `* 0.65` multiplier — use `* 1.33` for portrait |
| Scroll speed | `32s` and `28s` in the style tag — lower = faster |
| Section heading | The `<h2>` text near the top |
| Background color | `bg-white` on the `<section>` — change to `bg-slate-50` etc |
| Border/card style | `border-slate-200 bg-slate-50` on card divs |

## Design notes
- Accent color `#4f6ef7` is already used for the "Trusted By" eyebrow label
- Cards use `objectFit: contain` with padding — good for logos with transparent backgrounds
- If showing portfolio screenshots instead of logos, change to `objectFit: cover` and remove the padding
- The fade-out edges use CSS `maskImage` — do not remove this or the loop seam will be visible
