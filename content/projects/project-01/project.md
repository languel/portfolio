---
title: Template guide
index: 01
meta: Start here · Template
medium: Markdown / static site
year: 2026
series: Class portfolio
media: media/project-01.png
alt: Monochrome example image for the portfolio template
summary: Setup and customization instructions for adapting this class portfolio.
---
# Using this template

This portfolio is a small static site for a class, studio, or independent
project archive. Start by replacing the sample work with your own.

## Add your work

Create a folder in `content/projects/` with a `media/` folder and a
`project.md` file. Copy the frontmatter shape from another project, update the
title, description, metadata, and media path, then add the project to
`content/projects.json`.

The first media item becomes the grid card and large image. Additional media
items appear in the project gallery.

## Publish with GitHub Pages

The repository already includes `.github/workflows/pages.yml`, which deploys
the portfolio automatically whenever `main` changes.

### 1. Push the folder

Push the folder to a GitHub repository.

### 2. Turn on Pages

Open **Settings → Pages** and set **Source** to **GitHub Actions**.

### 3. Deploy updates

Push to `main` (or start the workflow from the **Actions** tab).

GitHub will show the live portfolio URL after the workflow completes. Future
pushes to `main` publish updates automatically.

## Run it locally (optional)

Serve the folder from a local web server, then open the site in a browser:

```bash
python3 -m http.server 8080 --bind 0.0.0.0
```

Visit <http://localhost:8080> to check the result during development. A server
is needed because the portfolio loads the catalog and markdown files at runtime.

## Make it yours

Update the page title, About copy, and favicon in `index.html` and
`favicon.svg`. Remove unused project folders and their entries from the
catalog when the class is ready to publish.

The full README in the repository has the complete file map and publishing
notes.
