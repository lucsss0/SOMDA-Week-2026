# SOMDA Week 2026 — Post-event microsite

Static one-page site. No build step.

## Run locally

```bash
cd "/Users/inigoperez/Desktop/SOMDA-Week-2026"
python3 -m http.server 8000
# open http://localhost:8000
```

Or with Node:
```bash
npx serve .
```

## Notes (Oct 2026 refresh)

- Zero emojis anywhere (verified by search).
- New: responsive Event Gallery (`#gallery`, 6 slots, tap-to-enlarge lightbox with keyboard support) reuses the files below.
- New: Schedule / Activities (`#schedule`) lists only confirmed activities across Sep 21–24 with no invented day assignments.
- Photo section is now labeled Event Moments. Nav: About / Highlights / Gallery / Schedule / Video. Mobile menu included.

## Photos — WIRED (Oct 3, 2026)

Real photos supplied and wired. Canonical files now present and serving HTTP 200:

| File | Source photo | Section |
|---|---|---|
| `assets/img/hero.jpg` | large red-carpet crowd group photo | 01 Hero |
| `assets/img/highlight-quiz.jpg` | Mapuhuh quiz show stage | Highlight 01 + gallery |
| `assets/img/highlight-awarding.jpg` | certificate-recognition group photo | Highlight 02 + gallery + video poster |
| `assets/img/highlight-vector.jpg` | stylus-on-tablet vector work | Highlight 03 + gallery |
| `assets/img/design-talks.jpg` | speaker with WORK IN PROGRESS slide | 05 Design Talks + gallery |
| `assets/img/video-poster.jpg` | certificate group photo | 06 Video preview |

Original uploads (`FB_IMG_*`, `received_*`) kept as backup. Alt texts updated to describe actual photo content.

## Replace photos (if new ones arrive)

Drop real files here — names are already wired in `index.html`:

| File | Section | Suggested size |
|---|---|---|
| `assets/img/hero.jpg` | 01 Hero (dominant) | 1920×1200+ JPG |
| `assets/img/highlight-quiz.jpg` | Highlight 01 Mapuhuh quiz | 1400×1050 JPG |
| `assets/img/highlight-awarding.jpg` | Highlight 02 Awarding | 1400×1050 JPG |
| `assets/img/highlight-vector.jpg` | Highlight 03 Vector art | 1400×1050 JPG |
| `assets/img/design-talks.jpg` | 04 Design Talks (Mr. Vallespin) | 2000×1000+ JPG |
| `assets/img/video-poster.jpg` | 05 Video preview poster | 1280×720 JPG |

The layout shows a styled dark placeholder with the expected filename until each file exists. No code changes needed — just add the files with the exact names.

## Replace links

- Facebook highlight reel: search `facebook.com/share/r/1E4YKwgXGa` in `index.html` (2 places: preview + button).
- Photo gallery: find `data-gallery-link` in the Closing section (`<a ... href="#photo">`) and replace `href` with the real album URL.
- If a downloadable video file arrives: replace the `.video-preview` anchor with `<video controls poster="assets/img/video-poster.jpg" src="assets/video/highlights.mp4">`.

## Design tokens

All colors in `css/style.css` `:root`: `--bg #111214`, `--ink #F6F1E8`, `--orange #FF5C1A`, `--line`, etc.
Fonts (2 max): Archivo (display) + Inter (body) via Google Fonts.

## Checklist status

Past tense throughout. No invented winners/sponsors/numbers. Alt text, focus states, reduced-motion, semantic headings included.
