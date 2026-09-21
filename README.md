# Portfolio

A small, static portfolio viewer for a digital artist. The front page is a
responsive grid; selecting a project rearranges the same document into the
detail view and thumbnail rail.

## Content model

Project content lives in `content/projects/`. Each project is a self-contained
folder:

```text
content/
  projects.json                 # display order and markdown entry points
  projects/
    project-01/
      project.md                # Obsidian-style frontmatter + description
      media/
        project-01.png
```

`project.md` uses a small YAML frontmatter block. The body becomes the project
description, so the prose can stay readable in Obsidian:

```md
---
title: Project 01
index: 01
meta: Digital study · 2026
medium: Bitmap / 1-bit
year: 2026
series: Thresholds
media: media/project-01.png
alt: Pixel-art doorway and figure in grayscale
---
A study of figures moving through an impossible threshold.
```

The `media` field may be a single image/video path, an inline list such as
`[media/a.png, media/b.png]`, or a YAML list. The viewer currently presents the
first item as the card and detail media; video files use native playback
controls in the detail view. Add the project markdown path to
`content/projects.json` to include a new project and control its order.

For a one-off image or video that needs no written metadata, a catalog entry
can point directly at the media file instead of a markdown file:

```json
{ "slug": "gesture-study", "media": "projects/gesture-study/media/study.mp4" }
```

## Run locally

```bash
python3 -m http.server 8080 --bind 0.0.0.0
```

Then visit [http://localhost:8080](http://localhost:8080). A static server is
required because the viewer fetches markdown and catalog JSON at runtime.

## Release checkpoint

`v1.0.0-grid-baseline` tags the stable visual grid before the content-folder
migration.
