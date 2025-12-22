# Black Phoenix Tech Website

This repo is the source for the **Black Phoenix Tech** marketing website.

- Live site: <https://blackphoenixtech.com/>
- Type: Static site (plain HTML/CSS/JS)
- Hosting: Typically deployed via **GitHub Pages** (custom domain configured via `CNAME`)

## Project Structure

- **`index.html`**
  - The single-page site layout (hero, services, about, carousel/work, contact).
  - Includes SEO/social metadata (Open Graph + Twitter cards).
  - Loads `styles.css` and `main.js`.
  - Contact form is an embedded Airtable form via an `<iframe>`.

- **`styles.css`**
  - All site styling (design tokens in `:root`, layout grids, responsive breakpoints, accessibility styles).

- **`main.js`**
  - Mobile nav open/close behavior (accessible: `aria-expanded`, Escape-to-close, click-outside-to-close).
  - Sticky header border adjustment on scroll.
  - Carousel logic for the “What We Can Do” section:
    - Previous/Next buttons
    - Dots
    - Autoplay (disabled if user prefers reduced motion)
    - Touch swipe support

- **`CNAME`**
  - Custom domain record for GitHub Pages. Current value: `BlackPhoenixTech.com`.

- **Images**
  - `Logo_trans.png`, `logo.png`, `Logo_trans.png` are referenced by `index.html`.

## How To Run Locally

Because this is a static site, you can open `index.html` directly in a browser.

For best results (and to avoid any browser restrictions around local files), run a simple local server:

### Option A: VS Code “Live Server” extension

- Install the “Live Server” extension.
- Right-click `index.html` and choose “Open with Live Server”.

### Option B: Python (if installed)

From the repo folder:

- Python 3:
  - `python -m http.server 8000`

Then open:

- <http://localhost:8000>

## Editing Guidelines (for the next person)

- **Make changes in `index.html` first** (content/structure), then adjust `styles.css` (layout/theme), and only then touch `main.js` (behavior).
- **Keep accessibility intact**:
  - Preserve `aria-*` attributes on the nav toggle.
  - Preserve the “Skip to content” link.
  - Don’t remove the `prefers-reduced-motion` behavior for the carousel.
- **Images**:
  - If you replace any image files, keep filenames in sync with what `index.html` references, or update the references accordingly.

## Deployment Notes (GitHub Pages + Custom Domain)

If this is hosted on GitHub Pages:

- The repository’s Pages settings should point at the correct branch/folder (often `/root`).
- The `CNAME` file must contain the custom domain for GitHub Pages to keep the domain mapping.
- DNS (outside this repo) must have the correct records for GitHub Pages:
  - Typically `A` records for the apex domain and a `CNAME` for `www`.

## Contact Form

The Contact section embeds Airtable:

- `index.html` contains an `<iframe>` pointing to an Airtable form URL.
- If the form changes:
  - Update the `src` URL in the iframe.
  - Re-check height (`height="533"`) so it doesn’t cut off.

## Quick “Where is X?”

- Navigation links: `index.html` header section.
- Hero text: `index.html` section `#top`.
- Services cards: `index.html` section `#services`.
- About content: `index.html` section `#about`.
- Carousel slides: `index.html` section `#work` (elements with `data-carousel-slide`).
- Carousel behavior: `main.js` (`setupCarousel`).
- Colors / theme tokens: `styles.css` `:root`.
- Mobile breakpoint behavior: `styles.css` media queries (`max-width: 760px`, `900px`, etc.).

## Maintenance Checklist

- Update business copy (services, about, examples) as offerings evolve.
- Verify phone/email in the Contact section are still correct.
- Validate that the Airtable embed still loads.
- Periodically check Lighthouse / accessibility scores after major edits.
