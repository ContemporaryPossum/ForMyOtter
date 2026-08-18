# Just a reminder — a one-page love letter

A single-page romantic website. Deploy these 3 files as a static site (GitHub → Netlify or Vercel). No build step, no dependencies.

## Files
- `index.html` — all the page content (hero, timeline, polaroids, secret button)
- `styles.css` — colors, fonts, animations, responsive layout
- `script.js` — scroll reveal, love-letter modal, falling-petals effect

## Quick start (Netlify)
1. Create a GitHub repo with these 3 files (keep them at the root).
2. On netlify.com → "Add new site" → pick the repo.
3. Nothing to configure — build command and publish dir are empty. It deploys as-is.

## Quick start (Vercel)
1. Same repo setup.
2. vercel.com → Import project → the framework auto-detects as "Other".
3. Deploy. No build command needed.

## Where to edit
Search the files for these markers (all commented):

| What | Where |
|---|---|
| Hero headline / subtitle | `index.html` → `hero__title`, `hero__subtitle` |
| Hero background photo | `index.html` → `hero__bg` img `src` |
| Timeline memories (dates, titles, stories, photos) | `index.html` → each `<li class="timeline__item">` (5 blocks, edit or duplicate) |
| Polaroid photos + captions | `index.html` → each `<figure class="polaroid">` (6 blocks) |
| Secret button text | `index.html` → `secret__btn-text` |
| Love letter + sign-off | `script.js` → `LETTER_PARAGRAPHS` and `LETTER_SIGNOFF` (top of file) |
| Color palette | `styles.css` → `:root` variables at the very top |
| Falling petals color/speed | `styles.css` → `PETAL_COLORS` in `script.js` |
| Carousel — the slow looping strip under the polaroids | `index.html` → each `.carousel__slide` (10 slides) + `styles.css` → `.carousel` section |
| Carousel speed / pause on hover | `styles.css` → `carouselSlide 60s` duration in the `.carousel__track` rule |
| Background music | the song file `acs.mp4` at the repo root plays in a small `<audio>` tag in `index.html`; it starts on her first tap/scroll because browsers block sound until then |

Photo tip: use direct image URLs (png/jpg/webp). Keep them 900–1600px wide for a fast mobile load.