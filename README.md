# Languel — Digital Artist Portfolio

A minimalist, desaturated dark-themed portfolio for a digital artist showcasing generative bitmap pixel art, procedural shaders, and computational geometry.

## Key Features

- **Front-page Grid of Projects**: Direct presentation of work in a responsive card grid with no unnecessary hero clutter.
- **Minimal Top Navigation**: Sticky header with wordmark, real-time availability indicator, works counter, and modal triggers for About and Contact.
- **Interactive Card Hover State**: Smooth darkening overlay reveals project index, title, medium, palette, and click-to-expand prompt.
- **Expanded Detail View**: Accessible dialog with large pixel-rendered artwork viewer, 2× zoom toggle, technical specifications table, artist statement, tags, and keyboard navigation (`←` / `→` or `K` / `J`, `ESC` to close).
- **Dark & Desaturated Monochrome Aesthetic**: Deep obsidian background with subtle dot-matrix substrate, slate borders, and grayscale palette to make the digital artwork stand out.
- **12 Bitmap Pixel Art Placeholders**: Procedurally generated 8-bit/16-bit dithered artworks (Monolith, Megacity Spire, Deep Space Relay, Microcode Lattice, Celestial Eclipse, Neural Visor, Mineral Resonance, Wireframe Horizon, Torus Knot, Signal Waveform, Titan Mech Rig, Arcane Glyph) rendered with `image-rendering: pixelated;`.
- **Category Filtering**: Instant client-side filtering by category (All, Shaders, Bitmap, Generative, Vector).
- **Direct Hash Linking**: Deep links support (`#project-1` ... `#project-12`).

## Run Locally

```bash
python3 -m http.server 8080 --bind 0.0.0.0
```

Then visit [http://localhost:8080](http://localhost:8080) in your browser.
