# Health Problems — Accessible Lessons

Simple single-page prototype demonstrating an accessible, multisensory lesson for children with special needs.

How to open locally:

1. In your file browser, open `index.html`.
2. Or run a simple HTTP server from the project root (recommended) to avoid browser restrictions:

```bash
python3 -m http.server 8000
# then open http://localhost:8000 in the browser
```

What this includes:
- `index.html` — landing page and the first lesson (Common Cold)
- `styles.css` — pastel background, big chunky UI, large fonts
- `script.js` — navigation, TTS narration, captions, drag & drop
- `assets/` — simple SVG icons and avatar

Notes:
- Font uses `Quicksand` from Google Fonts as a friendly, rounded sans-serif. Replace or add Open Dyslexic if available.
- The "video" is a lightweight animated SVG so the page works offline. You can replace it with an actual video element if you add a media file.
- The project was converted to a Vite + React app. To run locally:

```bash
# install deps
npm install
# start dev server
npm run dev
# open the URL shown by vite (e.g. http://localhost:5173)
```

Notes:
- The landing page now uses a circle of 12 large PNGs. Click any image to open its lesson (currently wired to open the common cold lesson).
- The Common Cold lesson uses `assets/COMMON_COLD.mp4` and includes a drag-and-drop game; correct items trigger confetti and a Next button.
# shankar_foundation_content_development