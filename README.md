# Portfolio

A minimal, dark portfolio shell for a digital artist. The `contenttest` branch
opens on a twelve-project monochrome grid; selecting a project rearranges the
same page into a large project view with a horizontal thumbnail carousel.

Live: [languel.github.io/portfolio](https://languel.github.io/portfolio/)

Pushes to `main` publish automatically via GitHub Pages (`.github/workflows/pages.yml`).

## Deploying

One-time setup (repo admin only): open
[Settings → Pages](https://github.com/languel/portfolio/settings/pages) and set
**Build and deployment → Source** to **GitHub Actions**, then click **Save**.

GitHub does not allow a workflow's `GITHUB_TOKEN` to create the Pages site itself
(the create-site API needs `administration: write`, which cannot be granted to
`GITHUB_TOKEN`), so this switch has to be flipped once by hand. After that, every
push to `main` deploys automatically, and the workflow can also be triggered
manually (**Actions → Deploy GitHub Pages → Run workflow**).

## Run locally

```bash
python3 -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080).
