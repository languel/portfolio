(() => {
  const main = document.querySelector("main");
  const gridSection = document.querySelector(".portfolio-grid-view");
  const grid = document.querySelector("[data-project-grid]");
  const detailSection = document.querySelector("#project-detail");
  const aboutSection = document.querySelector("#about");
  const thumbnailViewport = document.querySelector(".thumbnail-viewport");
  const thumbnailTrack = document.querySelector(".thumbnail-track");
  const previousButton = document.querySelector("[data-prev]");
  const nextButton = document.querySelector("[data-next]");
  const featureMedia = document.querySelector("#feature-media");
  const featureIndex = document.querySelector("#feature-index");
  const featureTitle = document.querySelector("#feature-title");
  const featureMeta = document.querySelector("#feature-meta");
  const featureDescription = document.querySelector("#feature-description");
  const featureBody = document.querySelector("#feature-body");
  const featureEmbed = document.querySelector("#feature-embed");
  const featureGallery = document.querySelector("#feature-gallery");
  const featureMedium = document.querySelector("#feature-medium");
  const featureYear = document.querySelector("#feature-year");
  const featureSeries = document.querySelector("#feature-series");
  const header = document.querySelector(".site-header");
  const homeLink = document.querySelector(".wordmark");
  const aboutLink = document.querySelector('.site-nav__link[href="#about"]');
  const themeToggle = document.querySelector("[data-theme-toggle]");

  if (
    !main ||
    !gridSection ||
    !grid ||
    !detailSection ||
    !aboutSection ||
    !thumbnailViewport ||
    !thumbnailTrack ||
    !previousButton ||
    !nextButton ||
    !featureMedia ||
    !featureIndex ||
    !featureTitle ||
    !featureMeta ||
    !featureDescription ||
    !featureBody ||
    !featureEmbed ||
    !featureGallery ||
    !featureMedium ||
    !featureYear ||
    !featureSeries ||
    !header
  ) {
    return;
  }

  let projects = [];
  let thumbnails = [];
  let activeIndex = 0;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const parseScalar = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return "";
    if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
      return trimmed.slice(1, -1);
    }
    return trimmed;
  };

  const parseFrontMatter = (markdown) => {
    const match = markdown.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
    const fields = {};
    const body = match ? match[2].trim() : markdown.trim();
    let activeListKey;

    if (match) {
      match[1].split("\n").forEach((line) => {
        const listItem = line.match(/^\s+-\s+(.+)$/);
        if (listItem && activeListKey) {
          fields[activeListKey].push(parseScalar(listItem[1]));
          return;
        }

        const field = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
        if (!field) return;

        const [, key, rawValue] = field;
        if (rawValue.trim() === "") {
          fields[key] = [];
          activeListKey = key;
        } else if (rawValue.trim().startsWith("[") && rawValue.trim().endsWith("]")) {
          fields[key] = rawValue
            .trim()
            .slice(1, -1)
            .split(",")
            .map(parseScalar)
            .filter(Boolean);
          activeListKey = undefined;
        } else {
          fields[key] = parseScalar(rawValue);
          activeListKey = undefined;
        }
      });
    }

    return {
      ...fields,
      body,
      description: fields.description || body,
    };
  };

  const asArray = (value) => {
    if (Array.isArray(value)) return value.filter(Boolean);
    return value ? [value] : [];
  };

  const isVideo = (source) => /\.(mp4|webm|mov|ogg)(?:\?|$)/i.test(source);
  const isPdf = (source) => /\.pdf(?:\?|$)/i.test(source);

  const createMediaElement = (source, alt, { detail = false } = {}) => {
    if (!source) {
      const empty = document.createElement("span");
      empty.className = "media-missing";
      empty.textContent = "Media unavailable";
      return empty;
    }

    const media = document.createElement(isPdf(source) ? "iframe" : isVideo(source) ? "video" : "img");
    media.className = "project-media";

    if (media instanceof HTMLIFrameElement) {
      media.src = source;
      media.title = alt || "Embedded PDF";
      media.loading = "lazy";
    } else if (media instanceof HTMLVideoElement) {
      media.muted = true;
      media.playsInline = true;
      media.preload = "metadata";
      media.controls = detail;
      media.setAttribute("aria-label", alt);
      if (!detail) media.loop = true;
    } else {
      media.src = source;
      media.alt = alt;
      media.decoding = "async";
    }

    if (!(media instanceof HTMLIFrameElement)) media.src = source;
    return media;
  };

  const resolveProject = async (entry, catalogDirectory) => {
    let fields = entry;
    let body = entry.body || "";
    let bodyDirectory;
    if (entry.markdown) {
      const markdownUrl = new URL(entry.markdown, catalogDirectory);
      const response = await fetch(markdownUrl);
      if (!response.ok) throw new Error(`Unable to load ${entry.markdown}`);
      fields = parseFrontMatter(await response.text());
      body = fields.body || "";
      bodyDirectory = new URL(".", markdownUrl);
    }
    const projectDirectory = entry.markdown
      ? new URL(entry.markdown, catalogDirectory).href.replace(/[^/]+$/, "")
      : catalogDirectory;
    const media = entry.markdown
      ? asArray(fields.media || entry.media).map((source) => new URL(source, projectDirectory).href)
      : asArray(entry.media).map((source) => new URL(source, catalogDirectory).href);

    return {
      ...fields,
      body,
      slug: entry.slug,
      index: fields.index || entry.index || entry.slug?.match(/\d+$/)?.[0] || "",
      title: fields.title || entry.slug,
      meta: fields.meta || "",
      medium: fields.medium || "",
      year: fields.year || "",
      series: fields.series || "",
      alt: fields.alt || fields.title || entry.slug,
      summary: fields.summary || fields.description || body.split(/\n\s*\n/)[0].trim(),
      directory: projectDirectory,
      bodyDirectory: bodyDirectory || projectDirectory,
      embed: fields.embed ? new URL(fields.embed, projectDirectory).href : "",
      media,
    };
  };

  const setTheme = (theme) => {
    const isLight = theme === "light";
    document.documentElement.dataset.theme = isLight ? "light" : "dark";

    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", String(isLight));
      themeToggle.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
    }

    document.querySelector("meta[name=\"theme-color\"]")?.setAttribute("content", isLight ? "#f2f1ed" : "#151515");
    try {
      window.localStorage.setItem("portfolio-theme", isLight ? "light" : "dark");
    } catch {
      // Private browsing can disable storage without affecting the theme itself.
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion.matches ? "auto" : "smooth",
    });
  };

  const getThumbnailMaxScroll = () => Math.max(0, thumbnailViewport.scrollWidth - thumbnailViewport.clientWidth);

  const setThumbnailScroll = (scrollLeft) => {
    const clampedScroll = Math.min(getThumbnailMaxScroll(), Math.max(0, scrollLeft));
    thumbnailViewport.scrollLeft = clampedScroll;
  };

  const centerThumbnail = (thumbnail) => {
    const viewportRect = thumbnailViewport.getBoundingClientRect();
    const thumbnailRect = thumbnail.getBoundingClientRect();
    const centeredScroll =
      thumbnailViewport.scrollLeft +
      (thumbnailRect.left - viewportRect.left) -
      (viewportRect.width - thumbnailRect.width) / 2;

    setThumbnailScroll(centeredScroll);
  };

  const clampThumbnailScroll = () => setThumbnailScroll(thumbnailViewport.scrollLeft);

  const updateDocumentTitle = (title = "Portfolio") => {
    document.title = title === "Portfolio" ? "Portfolio — Digital Artist" : `${title} — Portfolio`;
  };

  const resolveUrl = (source, baseUrl) => {
    try {
      return new URL(source, baseUrl).href;
    } catch {
      return source;
    }
  };

  const renderInline = (text, baseUrl) => {
    const fragment = document.createDocumentFragment();
    const tokenPattern = /!\[([^\]]*)\]\(([^)]+)\)|\[([^\]]+)\]\(([^)]+)\)|\\\(([^)]+)\\\)|\*\*([^*]+)\*\*|\*([^*]+)\*|<(https?:\/\/[^>]+)>|`([^`]+)`/g;
    let cursor = 0;
    let token;

    while ((token = tokenPattern.exec(text))) {
      if (token.index > cursor) fragment.append(text.slice(cursor, token.index));

      if (token[1] !== undefined) {
        const image = document.createElement("img");
        image.className = "project-body-image";
        image.src = resolveUrl(token[2], baseUrl);
        image.alt = token[1];
        image.loading = "lazy";
        fragment.append(image);
      } else if (token[3] !== undefined) {
        const link = document.createElement("a");
        link.href = resolveUrl(token[4], baseUrl);
        link.textContent = token[3];
        if (/^https?:/i.test(link.href)) {
          link.target = "_blank";
          link.rel = "noreferrer noopener";
        }
        fragment.append(link);
      } else if (token[5] !== undefined) {
        const math = document.createElement("span");
        math.className = "project-inline-math";
        math.textContent = `\\(${token[5]}\\)`;
        fragment.append(math);
      } else if (token[6] !== undefined) {
        const strong = document.createElement("strong");
        strong.textContent = token[6];
        fragment.append(strong);
      } else if (token[7] !== undefined) {
        const emphasis = document.createElement("em");
        emphasis.textContent = token[7];
        fragment.append(emphasis);
      } else if (token[8] !== undefined) {
        const link = document.createElement("a");
        link.href = token[8];
        link.textContent = token[8];
        link.target = "_blank";
        link.rel = "noreferrer noopener";
        fragment.append(link);
      } else if (token[9] !== undefined) {
        const inlineCode = document.createElement("code");
        inlineCode.textContent = token[9];
        fragment.append(inlineCode);
      }

      cursor = tokenPattern.lastIndex;
    }

    if (cursor < text.length) fragment.append(text.slice(cursor));
    return fragment;
  };

  const renderMarkdown = (markdown, container, baseUrl) => {
    container.replaceChildren();
    let paragraph = [];
    let code = null;

    const flushParagraph = () => {
      if (!paragraph.length) return;
      const text = paragraph.join(" ").trim();
      if (text) {
        const element = document.createElement("p");
        element.append(renderInline(text, baseUrl));
        container.append(element);
      }
      paragraph = [];
    };

    const flushCode = () => {
      if (!code) return;
      const pre = document.createElement("pre");
      const codeElement = document.createElement("code");
      if (code.language) codeElement.className = `language-${code.language}`;
      codeElement.textContent = code.lines.join("\n");
      pre.append(codeElement);
      container.append(pre);
      code = null;
    };

    markdown.split("\n").forEach((line) => {
      const fence = line.match(/^```\s*([\w+-]*)\s*$/);
      if (fence) {
        if (code) flushCode();
        else {
          flushParagraph();
          code = { language: fence[1], lines: [] };
        }
        return;
      }

      if (code) {
        code.lines.push(line);
        return;
      }

      const heading = line.match(/^(#{1,6})\s+(.+)$/);
      if (heading) {
        flushParagraph();
        const level = Math.min(4, heading[1].length + 1);
        const element = document.createElement(`h${level}`);
        element.textContent = heading[2];
        container.append(element);
        return;
      }

      if (!line.trim()) flushParagraph();
      else paragraph.push(line.trim());
    });

    if (code) flushCode();
    flushParagraph();
  };

  const renderMath = (container) => {
    if (typeof window.renderMathInElement !== "function") return;
    window.renderMathInElement(container, {
      delimiters: [
        { left: "\\(", right: "\\)", display: false },
        { left: "\\[", right: "\\]", display: true },
      ],
      throwOnError: false,
    });
  };

  const renderEmbed = (project) => {
    featureEmbed.replaceChildren();
    if (!project.embed) return;

    const iframe = document.createElement("iframe");
    iframe.src = project.embed;
    iframe.title = `${project.title} embedded sketch`;
    iframe.loading = "lazy";
    iframe.allow = "autoplay; fullscreen";
    iframe.referrerPolicy = "no-referrer";
    featureEmbed.append(iframe);
  };

  const renderGallery = (project) => {
    featureGallery.replaceChildren();
    project.media.slice(1).forEach((source, mediaIndex) => {
      const figure = document.createElement("figure");
      const media = createMediaElement(source, `${project.alt} — additional media ${mediaIndex + 1}`, { detail: true });
      figure.append(media);
      featureGallery.append(figure);
    });
  };

  const bodyWithoutSummary = (project) => {
    const summary = (project.summary || "").trim();
    const paragraphs = project.body.split(/\n\s*\n/);
    return summary && paragraphs[0]?.trim() === summary ? paragraphs.slice(1).join("\n\n").trim() : project.body;
  };

  const renderProject = (index, { focus = false, center = true } = {}) => {
    activeIndex = (index + projects.length) % projects.length;
    const project = projects[activeIndex];
    const thumbnail = thumbnails[activeIndex];

    thumbnails.forEach((item, itemIndex) => {
      const isSelected = itemIndex === activeIndex;
      item.setAttribute("aria-selected", String(isSelected));
      item.tabIndex = isSelected ? 0 : -1;
    });

    featureMedia.classList.add("is-changing");
    featureMedia.replaceChildren(createMediaElement(project.media[0], project.alt, { detail: true }));
    featureIndex.textContent = `Project ${project.index}`;
    featureTitle.textContent = project.title;
    featureMeta.textContent = project.meta;
    featureDescription.textContent = project.summary;
    featureMedium.textContent = project.medium;
    featureYear.textContent = project.year;
    featureSeries.textContent = project.series;
    renderMarkdown(bodyWithoutSummary(project), featureBody, project.bodyDirectory);
    renderMath(featureBody);
    renderEmbed(project);
    renderGallery(project);
    updateDocumentTitle(project.title);

    window.setTimeout(() => featureMedia.classList.remove("is-changing"), 120);

    if (center && thumbnail) centerThumbnail(thumbnail);
    if (focus && thumbnail) thumbnail.focus();
  };

  const moveProject = (step, options) => renderProject(activeIndex + step, options);

  const createThumbnail = (project, index) => {
    const thumbnail = document.createElement("button");
    thumbnail.className = "project-thumb";
    thumbnail.type = "button";
    thumbnail.setAttribute("data-project-thumb", "");
    thumbnail.setAttribute("role", "tab");
    thumbnail.setAttribute("aria-selected", "false");
    thumbnail.setAttribute("aria-controls", "project-stage");
    thumbnail.tabIndex = -1;

    const media = createMediaElement(project.media[0], "", { detail: false });
    media.setAttribute("aria-hidden", "true");
    thumbnail.append(media);

    const label = document.createElement("span");
    label.className = "sr-only";
    label.textContent = project.title;
    thumbnail.append(label);
    thumbnail.addEventListener("click", () => renderProject(index, { focus: true }));
    thumbnail.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        moveProject(1, { focus: true });
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveProject(-1, { focus: true });
      }
      if (event.key === "Home") {
        event.preventDefault();
        renderProject(0, { focus: true });
      }
      if (event.key === "End") {
        event.preventDefault();
        renderProject(projects.length - 1, { focus: true });
      }
    });

    return thumbnail;
  };

  const createGridCard = (project, index) => {
    const card = document.createElement("article");
    card.className = "project-grid-card";

    const button = document.createElement("button");
    button.className = "project-grid-card__trigger";
    button.type = "button";
    button.setAttribute("aria-label", `Open ${project.title}`);

    const media = document.createElement("span");
    media.className = "project-grid-card__media";
    media.append(createMediaElement(project.media[0], project.alt));

    const overlay = document.createElement("span");
    overlay.className = "project-grid-card__overlay";
    overlay.setAttribute("aria-hidden", "true");

    const title = document.createElement("span");
    title.className = "project-grid-card__title";
    title.textContent = project.title;

    const meta = document.createElement("span");
    meta.className = "project-grid-card__meta";
    meta.textContent = project.meta;

    const action = document.createElement("span");
    action.className = "project-grid-card__action";
    action.innerHTML =
      'View project <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false"><path d="M4 12h15M13 5l7 7-7 7" /></svg>';

    overlay.append(title, meta, action);
    button.append(media, overlay);
    button.addEventListener("click", () => showDetail(index));
    card.append(button);

    return card;
  };

  const showGrid = () => {
    main.dataset.view = "grid";
    header.dataset.view = "grid";
    gridSection.hidden = false;
    detailSection.hidden = true;
    aboutSection.hidden = true;
    updateDocumentTitle();
    window.history.replaceState(null, "", "#work");
    scrollToTop();
  };

  const showDetail = (index) => {
    main.dataset.view = "detail";
    header.dataset.view = "detail";
    gridSection.hidden = true;
    detailSection.hidden = false;
    aboutSection.hidden = true;
    renderProject(index);
    window.history.replaceState(null, "", "#project-detail");
    scrollToTop();
    thumbnails[activeIndex]?.focus({ preventScroll: true });
  };

  const showAbout = () => {
    main.dataset.view = "about";
    header.dataset.view = "about";
    gridSection.hidden = true;
    detailSection.hidden = true;
    aboutSection.hidden = false;
    updateDocumentTitle("About");
    window.history.replaceState(null, "", "#about");
    scrollToTop();
    document.querySelector("#about-title")?.focus({ preventScroll: true });
  };

  const showLoadError = (error) => {
    console.error(error);
    grid.textContent = "Project content could not be loaded.";
    grid.classList.add("content-error");
  };

  const getStoredTheme = () => {
    try {
      return window.localStorage.getItem("portfolio-theme") || "dark";
    } catch {
      return "dark";
    }
  };

  const loadContent = async () => {
    const catalogUrl = new URL("content/projects.json", document.baseURI);
    const catalogResponse = await fetch(catalogUrl);
    if (!catalogResponse.ok) throw new Error("Unable to load content/projects.json");

    const catalog = await catalogResponse.json();
    const catalogDirectory = new URL(".", catalogUrl);
    projects = await Promise.all((catalog.projects || []).map((entry) => resolveProject(entry, catalogDirectory)));
    if (!projects.length) throw new Error("The project catalog is empty");

    thumbnails = projects.map(createThumbnail);
    thumbnailTrack.append(...thumbnails);
    grid.append(...projects.map(createGridCard));
    renderProject(0, { center: false });

    const initialHash = window.location.hash;
    if (initialHash === "#project-detail") showDetail(0);
    else if (initialHash === "#about") showAbout();
    else showGrid();
  };

  thumbnailViewport.addEventListener("scroll", clampThumbnailScroll, { passive: true });
  window.addEventListener("resize", clampThumbnailScroll);
  window.addEventListener(
    "wheel",
    (event) => {
      if (header.dataset.view !== "detail") return;
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY) || !event.deltaX) return;

      event.preventDefault();
      if (thumbnailViewport.contains(event.target)) setThumbnailScroll(thumbnailViewport.scrollLeft + event.deltaX);
    },
    { capture: true, passive: false },
  );

  let thumbnailDrag;
  let suppressThumbnailClick = false;

  const finishThumbnailDrag = () => {
    if (thumbnailDrag?.isDragging) {
      suppressThumbnailClick = true;
      window.setTimeout(() => {
        suppressThumbnailClick = false;
      }, 0);
    }
    thumbnailDrag = undefined;
  };

  thumbnailViewport.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse") return;
    thumbnailDrag = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startScroll: thumbnailViewport.scrollLeft,
      isDragging: false,
    };
  });

  thumbnailViewport.addEventListener("pointermove", (event) => {
    if (!thumbnailDrag || event.pointerId !== thumbnailDrag.pointerId) return;
    const deltaX = thumbnailDrag.startX - event.clientX;
    const deltaY = thumbnailDrag.startY - event.clientY;

    if (!thumbnailDrag.isDragging) {
      if (Math.abs(deltaX) < 6 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
      thumbnailDrag.isDragging = true;
    }

    event.preventDefault();
    setThumbnailScroll(thumbnailDrag.startScroll + deltaX);
  });

  thumbnailViewport.addEventListener("pointerup", finishThumbnailDrag);
  thumbnailViewport.addEventListener("pointercancel", finishThumbnailDrag);
  thumbnailViewport.addEventListener(
    "click",
    (event) => {
      if (!suppressThumbnailClick) return;
      event.preventDefault();
      event.stopPropagation();
      suppressThumbnailClick = false;
    },
    true,
  );

  previousButton.addEventListener("click", () => moveProject(-1, { focus: true }));
  nextButton.addEventListener("click", () => moveProject(1, { focus: true }));

  homeLink?.addEventListener("click", (event) => {
    event.preventDefault();
    showGrid();
  });

  aboutLink?.addEventListener("click", (event) => {
    event.preventDefault();
    showAbout();
  });

  themeToggle?.addEventListener("click", () => {
    setTheme(document.documentElement.dataset.theme === "light" ? "dark" : "light");
  });

  setTheme(getStoredTheme());
  loadContent().catch(showLoadError);
})();
