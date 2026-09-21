---
title: Project 03
index: 03
meta: Geometric study · 2025
medium: Bitmap / Color field
year: 2025
series: Nested field
media: media/project-03.png
embed: media/sketch.html
alt: Abstract offset rectangular fields in grayscale
summary: Offset rectangles hold a quiet central void, shifting value through measured layers of grayscale.
---
Offset rectangles hold a quiet central void, shifting value through measured layers of grayscale.

This project pairs a still image with a small p5.js sketch. The animation uses
the same measured field as the bitmap, but lets the value move through the
grid rather than settling into one final frame.

```javascript
const wave = sin(distance * 0.82 - time * 3.2) * 0.5 + 0.5;
const value = constrain(25 + wave * 180 - distance * 3.5, 8, 220);
fill(value);
rect(x * cell, y * cell, cell - 1, cell - 1);
```

[Download the p5.js demo archive](p5-sketch.zip)
