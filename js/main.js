(() => {
  const main = document.querySelector("main");
  const gridSection = document.querySelector(".portfolio-grid-view");
  const grid = document.querySelector("[data-project-grid]");
  const detailSection = document.querySelector("#project-detail");
  const aboutSection = document.querySelector("#about");
  const thumbnailViewport = document.querySelector(".thumbnail-viewport");
  const thumbnails = [...document.querySelectorAll("[data-project-thumb]")];
  const previousButton = document.querySelector("[data-prev]");
  const nextButton = document.querySelector("[data-next]");
  const featureImage = document.querySelector("#feature-image");
  const featureIndex = document.querySelector("#feature-index");
  const featureTitle = document.querySelector("#feature-title");
  const featureMeta = document.querySelector("#feature-meta");
  const featureDescription = document.querySelector("#feature-description");
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
    !thumbnails.length ||
    !previousButton ||
    !nextButton ||
    !featureImage ||
    !featureIndex ||
    !featureTitle ||
    !featureMeta ||
    !featureDescription ||
    !featureMedium ||
    !featureYear ||
    !featureSeries ||
    !header
  ) {
    return;
  }

  let activeIndex = 0;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const setTheme = (theme) => {
    const isLight = theme === "light";
    document.documentElement.dataset.theme = isLight ? "light" : "dark";

    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", String(isLight));
      themeToggle.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
    }

    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", isLight ? "#f2f1ed" : "#151515");
    window.localStorage.setItem("portfolio-theme", isLight ? "light" : "dark");
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion.matches ? "auto" : "smooth",
    });
  };

  const getThumbnailMaxScroll = () => {
    if (!thumbnailViewport) return 0;
    return Math.max(0, thumbnailViewport.scrollWidth - thumbnailViewport.clientWidth);
  };

  const setThumbnailScroll = (scrollLeft) => {
    if (!thumbnailViewport) return;

    const clampedScroll = Math.min(getThumbnailMaxScroll(), Math.max(0, scrollLeft));
    thumbnailViewport.scrollLeft = clampedScroll;
  };

  const centerThumbnail = (thumbnail) => {
    if (!thumbnailViewport) return;

    const viewportRect = thumbnailViewport.getBoundingClientRect();
    const thumbnailRect = thumbnail.getBoundingClientRect();
    const centeredScroll =
      thumbnailViewport.scrollLeft +
      (thumbnailRect.left - viewportRect.left) -
      (viewportRect.width - thumbnailRect.width) / 2;

    setThumbnailScroll(centeredScroll);
  };

  const clampThumbnailScroll = () => {
    if (!thumbnailViewport) return;
    setThumbnailScroll(thumbnailViewport.scrollLeft);
  };

  const updateDocumentTitle = (title = "Portfolio") => {
    document.title = title === "Portfolio" ? "Portfolio — Digital Artist" : `${title} — Portfolio`;
  };

  const renderProject = (index, { focus = false, center = true } = {}) => {
    activeIndex = (index + thumbnails.length) % thumbnails.length;
    const thumbnail = thumbnails[activeIndex];

    thumbnails.forEach((item, itemIndex) => {
      const isSelected = itemIndex === activeIndex;
      item.setAttribute("aria-selected", String(isSelected));
      item.tabIndex = isSelected ? 0 : -1;
    });

    featureImage.classList.add("is-changing");
    featureImage.src = thumbnail.dataset.image;
    featureImage.alt = thumbnail.dataset.alt;
    featureIndex.textContent = thumbnail.dataset.title;
    featureTitle.textContent = thumbnail.dataset.title;
    featureMeta.textContent = thumbnail.dataset.meta;
    featureDescription.textContent = thumbnail.dataset.description;
    featureMedium.textContent = thumbnail.dataset.medium;
    featureYear.textContent = thumbnail.dataset.year;
    featureSeries.textContent = thumbnail.dataset.series;
    updateDocumentTitle(thumbnail.dataset.title);

    window.setTimeout(() => featureImage.classList.remove("is-changing"), 120);

    if (center) centerThumbnail(thumbnail);
    if (focus) thumbnail.focus();
  };

  const moveProject = (step, options) => renderProject(activeIndex + step, options);

  const createGridCard = (thumbnail, index) => {
    const card = document.createElement("article");
    card.className = "project-grid-card";

    const button = document.createElement("button");
    button.className = "project-grid-card__trigger";
    button.type = "button";
    button.setAttribute("aria-label", `Open ${thumbnail.dataset.title}`);

    const media = document.createElement("span");
    media.className = "project-grid-card__media";

    const image = document.createElement("img");
    image.src = thumbnail.dataset.image;
    image.alt = thumbnail.dataset.alt;
    media.append(image);

    const overlay = document.createElement("span");
    overlay.className = "project-grid-card__overlay";
    overlay.setAttribute("aria-hidden", "true");

    const title = document.createElement("span");
    title.className = "project-grid-card__title";
    title.textContent = thumbnail.dataset.title;

    const meta = document.createElement("span");
    meta.className = "project-grid-card__meta";
    meta.textContent = thumbnail.dataset.meta;

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
    thumbnails[activeIndex].focus({ preventScroll: true });
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

  grid.append(...thumbnails.map(createGridCard));

  thumbnailViewport?.addEventListener("scroll", clampThumbnailScroll, { passive: true });
  window.addEventListener("resize", clampThumbnailScroll);

  window.addEventListener(
    "wheel",
    (event) => {
      if (header.dataset.view !== "detail") return;
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY) || !event.deltaX) return;

      event.preventDefault();

      if (thumbnailViewport?.contains(event.target)) {
        setThumbnailScroll(thumbnailViewport.scrollLeft + event.deltaX);
      }
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

  thumbnailViewport?.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse") return;

    thumbnailDrag = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startScroll: thumbnailViewport.scrollLeft,
      isDragging: false,
    };
  });

  thumbnailViewport?.addEventListener("pointermove", (event) => {
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

  thumbnailViewport?.addEventListener("pointerup", finishThumbnailDrag);
  thumbnailViewport?.addEventListener("pointercancel", finishThumbnailDrag);
  thumbnailViewport?.addEventListener(
    "click",
    (event) => {
      if (!suppressThumbnailClick) return;
      event.preventDefault();
      event.stopPropagation();
      suppressThumbnailClick = false;
    },
    true,
  );

  thumbnails.forEach((thumbnail, index) => {
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
        renderProject(thumbnails.length - 1, { focus: true });
      }
    });
  });

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

  setTheme(window.localStorage.getItem("portfolio-theme") || "dark");
  renderProject(0, { center: false });
  showGrid();
})();
