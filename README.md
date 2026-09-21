# Class Portfolio Template

This is a small, static portfolio template for a class, studio, or independent
project archive. It has no build step or database: the browser loads a project
catalog and markdown files, then lays the work out as a responsive grid.

## Start here

### 1. Replace the sample files

Replace the sample files in `content/projects/` with your own work, then edit
`content/projects.json` to set the order and number of projects.

### 2. Run it locally

Open the site through a local web server (the browser must be able to fetch the
markdown and catalog files):

```bash
python3 -m http.server 8080 --bind 0.0.0.0
```

Visit [http://localhost:8080](http://localhost:8080) and open Project 1 for a
short in-site orientation page while you customize the template.

## Adapt it to a class or assignment

### 1. Name the portfolio

Update the page title, description, social metadata, and About text in
`index.html`. Change the favicon in `favicon.svg` if the class has its own mark.

### 2. Add a project

Create a folder such as `content/projects/project-13/` with a `media/` folder
and a `project.md` file. The frontmatter below is the only required shape:

```md
---
title: Assignment title
index: 13
meta: Short label · 2026
medium: Image / code / sound
year: 2026
series: Unit or course name
media: media/project-13.png
alt: A useful description of the image
---
Write the project description here. Markdown paragraphs, headings, links,
inline images, and fenced code blocks are supported.
```

Then add the markdown path to `content/projects.json`:

```json
{ "slug": "project-13", "markdown": "projects/project-13/project.md" }
```

The first media item becomes the grid card and large image. Additional items
listed in `media` appear in the project gallery. Keep media inside the project
folder so each student submission stays portable.

### 3. Remove the examples

Once the class has its own projects, delete unused project folders and remove
their entries from `content/projects.json`. Project 1 is intentionally retained
as the template guide; replace its instructions when the class needs a more
specific workflow.

### 4. Publish

This repository includes a GitHub Pages workflow in
`.github/workflows/pages.yml`. Push the folder to a repository, enable Pages
for the workflow, and share the resulting site URL. The project can also be
hosted by any static file server.

## File map

```text
index.html                 page shell and About copy
css/styles.css             layout and theme styles
js/main.js                 catalog loading and project rendering
content/projects.json      project order and markdown entry points
content/projects/*         one self-contained folder per project
```

There is deliberately no package manager or framework to install. Keep the
template small, edit the content first, and only change the application code
when the class needs a different interaction.
