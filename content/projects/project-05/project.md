---
title: Project 05
index: 05
meta: Digital study · 2026
medium: Bitmap / Shoreline
year: 2026
series: Low tide
media: media/project-05.png
alt: Pixel-art shoreline in grayscale
summary: A shoreline held at the instant where water, rock, and compression become the same surface.
---
A shoreline held at the instant where water, rock, and compression become the same surface.

This is a code-golfed GLSL starfield adapted to a shoreline-like horizon. The
short shader keeps the useful ingredients visible: a moving ray, a noisy depth
term, and a threshold that turns the field into pinpricks of light.

```glsl
void mainImage(out vec4 o, vec2 p) {
  vec2 uv = (p - .5 * iResolution.xy) / iResolution.y;
  float z = iTime, d = 0., s = 0.;
  for (int i = 0; i < 32; i++) {
    vec3 q = vec3(uv * z, z);
    s += smoothstep(.02, 0., length(fract(q) - .5) - .02) / z;
    z += .06;
  }
  o = vec4(vec3(s), 1.);
}
```

The fragment is deliberately compact enough to type live. Expanding each
variable is a useful teaching move: name the space, name the motion, then
decide which names can disappear without losing the image.
