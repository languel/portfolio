/**
 * Digital Artist Portfolio - Interactive Engine
 */

const PROJECTS_DATA = [
  {
    id: 1,
    num: "01",
    title: "The Monolith",
    category: "Procedural Shaders",
    filter: "shaders",
    year: "2026",
    nativeRes: "128 × 128 px",
    renderRes: "512 × 512 px",
    palette: "8-Level Bayer Grayscale",
    pipeline: "Python Bitmap Engine / GLSL",
    description: "An inquiry into brutalist verticality and 4×4 Bayer matrix ordered dithering. An obsidian obelisk anchors the composition against a sparse stellar field and an exponential perspective plane, bisected by a luminescent core signal line.",
    tags: ["Bayer Dither", "Procedural", "Brutalism", "Monolith", "GLSL"],
    image: "images/project-01.png"
  },
  {
    id: 2,
    num: "02",
    title: "Megacity Spire",
    category: "Isometric Pixel Art",
    filter: "bitmap",
    year: "2026",
    nativeRes: "128 × 128 px",
    renderRes: "512 × 512 px",
    palette: "Slate Monotone & Beacon Accent",
    pipeline: "Pixel Shading / Layered Depth",
    description: "High-density urban brutalism modeled through staggered skyscraper silhouettes, window arrays, and high-frequency communication antennas with warning beacons piercing the dark smog atmosphere.",
    tags: ["Cityscape", "Isometric", "Cyberpunk", "Architecture"],
    image: "images/project-02.png"
  },
  {
    id: 3,
    num: "03",
    title: "Deep Space Relay",
    category: "Orthographic Bitmap",
    filter: "vector",
    year: "2026",
    nativeRes: "128 × 128 px",
    renderRes: "512 × 512 px",
    palette: "Deep Pitch & Cold Silver",
    pipeline: "Parametric Truss Projection",
    description: "An autonomous telemetry probe engineered for ultra-deep interstellar transit. Highlights a high-gain parabolic reflector dish, photodiode solar collectors, and an optical sensory core against an unbiased star map.",
    tags: ["Aerospace", "Sci-Fi", "Telemetry", "Probe"],
    image: "images/project-03.png"
  },
  {
    id: 4,
    num: "04",
    title: "Microcode Lattice",
    category: "Cellular Automata",
    filter: "generative",
    year: "2026",
    nativeRes: "128 × 128 px",
    renderRes: "512 × 512 px",
    palette: "Silicon Zinc & Phosphor White",
    pipeline: "Algorithmic Trace Routing",
    description: "Multi-core processor architecture layout displaying interconnect traces, surface-mount leads, and quantum bus lines on a dark substrate. Explores micro-scale computational circuitry as geometric art.",
    tags: ["Circuit", "Hardware", "Microcode", "Routing"],
    image: "images/project-04.png"
  },
  {
    id: 5,
    num: "05",
    title: "Celestial Eclipse",
    category: "Raymarched Astrometry",
    filter: "shaders",
    year: "2026",
    nativeRes: "128 × 128 px",
    renderRes: "512 × 512 px",
    palette: "10-Step Grayscale Gradient",
    pipeline: "Spherical Normal Mapping / Dither",
    description: "A gas giant exoplanet illuminated by oblique stellar radiance, girdled by an intricate planetary ring system with mathematically accurate limb darkening and ray-occluded orbital geometry.",
    tags: ["Astrometry", "Sphere", "Raymarch", "Rings"],
    image: "images/project-05.png"
  },
  {
    id: 6,
    num: "06",
    title: "Neural Visor",
    category: "Anatomical Pixel Art",
    filter: "bitmap",
    year: "2026",
    nativeRes: "128 × 128 px",
    renderRes: "512 × 512 px",
    palette: "Steel Grayscale & Photonic Ocular",
    pipeline: "Symmetrical Contour Sculpting",
    description: "A stylized cybernetic cranium featuring monolithic brow plating, an asymmetric high-intensity photonic sensor aperture, acoustic cooling vents, and flexible lateral bus conduits.",
    tags: ["Cybernetics", "Skull", "Interface", "Android"],
    image: "images/project-06.png"
  },
  {
    id: 7,
    num: "07",
    title: "Mineral Resonance",
    category: "Polygonal Faceting",
    filter: "generative",
    year: "2026",
    nativeRes: "128 × 128 px",
    renderRes: "512 × 512 px",
    palette: "Quartz Silver & Deep Obsidian",
    pipeline: "Procedural Crystal Growth / Sparks",
    description: "Generative mineral spires synthesized through angular shard growth equations. Highlights specular crystal crests, cross-hatched cleavage planes, and suspended floating luminescence.",
    tags: ["Crystals", "Geometry", "Specular", "Minerals"],
    image: "images/project-07.png"
  },
  {
    id: 8,
    num: "08",
    title: "Wireframe Horizon",
    category: "Perspective Heightmap",
    filter: "vector",
    year: "2026",
    nativeRes: "128 × 128 px",
    renderRes: "512 × 512 px",
    palette: "Vector Glow & CRT Pitch",
    pipeline: "Projective Mesh Displacements",
    description: "A digital perspective terrain mesh converging toward an expansive synthetic sun with horizontal raster slit gates. Pays homage to the visual aesthetics of vector CRT instrumentation and early simulator wireframes.",
    tags: ["Wireframe", "CRT", "Topography", "Vector"],
    image: "images/project-08.png"
  },
  {
    id: 9,
    num: "09",
    title: "Torus Knot",
    category: "Parametric 3D",
    filter: "shaders",
    year: "2026",
    nativeRes: "128 × 128 px",
    renderRes: "512 × 512 px",
    palette: "Specular Monotone & Dark Mist",
    pipeline: "Parametric 3D Projection / Bayer Shade",
    description: "A (3, 4) hyperdimensional mathematical torus knot with directional lighting and continuous Bayer crosshatching across intersecting curves. Bridges differential geometry and 8-bit visual precision.",
    tags: ["Topology", "Torus Knot", "3D Math", "Dither"],
    image: "images/project-09.png"
  },
  {
    id: 10,
    num: "10",
    title: "Signal Waveform",
    category: "Oscillographic Analysis",
    filter: "vector",
    year: "2026",
    nativeRes: "128 × 128 px",
    renderRes: "512 × 512 px",
    palette: "CRT Interlace & Phosphor Slate",
    pipeline: "Fourier Envelope / Scanline Pass",
    description: "Superimposed sinusoidal frequency envelopes with peak-hold frequency spectrum bars, captured under simulated CRT interlacing and signal modulation artifacts.",
    tags: ["Oscilloscope", "Audio", "Scanlines", "Waveform"],
    image: "images/project-10.png"
  },
  {
    id: 11,
    num: "11",
    title: "Titan Mech Rig",
    category: "Industrial Blueprint",
    filter: "bitmap",
    year: "2026",
    nativeRes: "128 × 128 px",
    renderRes: "512 × 512 px",
    palette: "Carbon Dark & Armor Slate",
    pipeline: "Mechanical Blueprint Construction",
    description: "A heavy bipedal assault frame designed with articulated hydraulic legs, reinforced cockpit visor canopy, and dual shoulder-mounted ordnance pods in a maintenance hangar dock.",
    tags: ["Mecha", "Robotics", "Industrial", "Blueprint"],
    image: "images/project-11.png"
  },
  {
    id: 12,
    num: "12",
    title: "Arcane Glyph",
    category: "Geometric Sigil",
    filter: "generative",
    year: "2026",
    nativeRes: "128 × 128 px",
    renderRes: "512 × 512 px",
    palette: "Astral Silver & Void Black",
    pipeline: "Concentric Dial / Compass Array",
    description: "Concentric orbital dials, radial compass ticks, and interlocking rotated squares framing a central crystalline power core. Merges cryptographic cipher geometry with astronomical astrolabe diagrams.",
    tags: ["Sigil", "Sacred Geometry", "Glyphs", "Astrolabe"],
    image: "images/project-12.png"
  }
];

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("[data-header]");
  const gridContainer = document.getElementById("projects-grid");
  const filterButtons = document.querySelectorAll("[data-filter]");
  const projectCounter = document.getElementById("project-counter");

  // Modal elements
  const detailModal = document.getElementById("detail-modal");
  const modalImg = document.getElementById("modal-img");
  const modalIndexTag = document.getElementById("modal-index-tag");
  const modalTitlePreview = document.getElementById("modal-title-preview");
  const modalKicker = document.getElementById("modal-kicker");
  const modalTitle = document.getElementById("modal-title");
  const modalDesc = document.getElementById("modal-desc");
  const modalMedium = document.getElementById("modal-medium");
  const modalRes = document.getElementById("modal-res");
  const modalPalette = document.getElementById("modal-palette");
  const modalPipeline = document.getElementById("modal-pipeline");
  const modalTags = document.getElementById("modal-tags");
  const modalRawLink = document.getElementById("modal-raw-link");
  const modalZoomBtn = document.getElementById("modal-zoom-btn");
  const artFrame = document.querySelector(".art__frame");
  const prevBtn = document.getElementById("modal-prev-btn");
  const nextBtn = document.getElementById("modal-next-btn");
  const closeBtn = document.getElementById("modal-close-btn");
  const modalBackdrop = document.querySelector(".modal__backdrop");

  // Info dialogs (About / Contact)
  const aboutDialog = document.getElementById("about-dialog");
  const contactDialog = document.getElementById("contact-dialog");
  const openAboutBtn = document.getElementById("open-about-btn");
  const openContactBtn = document.getElementById("open-contact-btn");
  const closeAboutBtn = document.getElementById("close-about-btn");
  const closeContactBtn = document.getElementById("close-contact-btn");
  const copyEmailBtn = document.getElementById("copy-email-btn");

  let currentProjectIndex = 0;
  let activeFilter = "all";
  let isZoomed = false;

  // Header scroll shadow
  window.addEventListener("scroll", () => {
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  }, { passive: true });

  // Render Projects Grid
  function renderGrid() {
    gridContainer.innerHTML = "";
    const filtered = activeFilter === "all" 
      ? PROJECTS_DATA 
      : PROJECTS_DATA.filter(p => p.filter === activeFilter);

    if (projectCounter) {
      projectCounter.textContent = `${filtered.length} OF ${PROJECTS_DATA.length} WORKS`;
    }

    filtered.forEach((project) => {
      const card = document.createElement("article");
      card.className = "project-card";
      card.setAttribute("data-id", project.id);

      card.innerHTML = `
        <header class="card__header">
          <span class="card__id">PROJECT ${project.id}</span>
          <span class="card__year">${project.year}</span>
        </header>

        <button 
          type="button" 
          class="card__media-btn" 
          data-open-project="${project.id}"
          aria-label="Expand details for Project ${project.id}: ${project.title}"
        >
          <div class="card__corner card__corner--tl" aria-hidden="true"></div>
          <div class="card__corner card__corner--tr" aria-hidden="true"></div>
          <div class="card__corner card__corner--bl" aria-hidden="true"></div>
          <div class="card__corner card__corner--br" aria-hidden="true"></div>

          <img 
            class="card__img" 
            src="${project.image}" 
            alt="Pixel art for Project ${project.id} — ${project.title}" 
            width="512" 
            height="512" 
            loading="lazy"
          />

          <div class="card__overlay">
            <span class="overlay__tag">${project.category}</span>
            <h3 class="overlay__title">Project ${project.id} — ${project.title}</h3>
            <p class="overlay__meta">${project.palette} · ${project.renderRes}</p>
            <div class="overlay__cta">
              <span>EXPAND DETAILS</span>
              <span aria-hidden="true">[ + ]</span>
            </div>
          </div>
        </button>

        <footer class="card__caption">
          <span class="card__caption-title">Project ${project.id} — ${project.title}</span>
          <span class="card__caption-meta">${project.category}</span>
        </footer>
      `;

      gridContainer.appendChild(card);
    });

    // Attach click listeners to cards
    document.querySelectorAll("[data-open-project]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.getAttribute("data-open-project"), 10);
        const idx = PROJECTS_DATA.findIndex(p => p.id === id);
        if (idx !== -1) {
          openDetailModal(idx);
        }
      });
    });
  }

  // Filter toolbar buttons
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      activeFilter = btn.getAttribute("data-filter");
      renderGrid();
    });
  });

  // Modal Open & Update
  function openDetailModal(index) {
    currentProjectIndex = (index + PROJECTS_DATA.length) % PROJECTS_DATA.length;
    const project = PROJECTS_DATA[currentProjectIndex];

    modalIndexTag.textContent = `PROJECT ${project.id} / 12`;
    modalTitlePreview.textContent = `// ${project.title.toUpperCase()}`;
    modalKicker.textContent = `PROJECT ${project.id} · ${project.year}`;
    modalTitle.textContent = `Project ${project.id} — ${project.title}`;
    modalDesc.textContent = project.description;

    modalMedium.textContent = project.category;
    modalRes.textContent = `${project.renderRes} (Native: ${project.nativeRes})`;
    modalPalette.textContent = project.palette;
    modalPipeline.textContent = project.pipeline;

    modalImg.src = project.image;
    modalImg.alt = `Project ${project.id}: ${project.title}`;
    modalRawLink.href = project.image;

    // Reset zoom state
    isZoomed = false;
    artFrame.classList.remove("is-zoomed");
    modalZoomBtn.textContent = "ZOOM 2X";

    // Populate tags
    modalTags.innerHTML = project.tags
      .map(tag => `<span class="tag-pill">#${tag}</span>`)
      .join("");

    if (!detailModal.open) {
      detailModal.showModal();
      document.body.style.overflow = "hidden";
    }

    // Sync URL hash without jumping page
    history.replaceState(null, "", `#project-${project.id}`);
  }

  function closeDetailModal() {
    detailModal.close();
    document.body.style.overflow = "";
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }

  // Prev / Next Project Handlers
  prevBtn.addEventListener("click", () => openDetailModal(currentProjectIndex - 1));
  nextBtn.addEventListener("click", () => openDetailModal(currentProjectIndex + 1));
  closeBtn.addEventListener("click", closeDetailModal);
  modalBackdrop.addEventListener("click", closeDetailModal);

  // Zoom toggle inside modal
  modalZoomBtn.addEventListener("click", () => {
    isZoomed = !isZoomed;
    artFrame.classList.toggle("is-zoomed", isZoomed);
    modalZoomBtn.textContent = isZoomed ? "FIT VIEW" : "ZOOM 2X";
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (detailModal.open) {
      if (e.key === "Escape") {
        closeDetailModal();
      } else if (e.key === "ArrowLeft" || e.key === "k" || e.key === "K") {
        openDetailModal(currentProjectIndex - 1);
      } else if (e.key === "ArrowRight" || e.key === "j" || e.key === "J") {
        openDetailModal(currentProjectIndex + 1);
      }
    }
  });

  // About and Contact dialogs
  openAboutBtn.addEventListener("click", () => {
    aboutDialog.showModal();
    document.body.style.overflow = "hidden";
  });
  closeAboutBtn.addEventListener("click", () => {
    aboutDialog.close();
    document.body.style.overflow = "";
  });
  aboutDialog.addEventListener("click", (e) => {
    if (e.target === aboutDialog) {
      aboutDialog.close();
      document.body.style.overflow = "";
    }
  });

  openContactBtn.addEventListener("click", () => {
    contactDialog.showModal();
    document.body.style.overflow = "hidden";
  });
  closeContactBtn.addEventListener("click", () => {
    contactDialog.close();
    document.body.style.overflow = "";
  });
  contactDialog.addEventListener("click", (e) => {
    if (e.target === contactDialog) {
      contactDialog.close();
      document.body.style.overflow = "";
    }
  });

  // Copy email button
  copyEmailBtn.addEventListener("click", () => {
    const email = "studio@languel.digital";
    navigator.clipboard.writeText(email).then(() => {
      copyEmailBtn.textContent = "COPIED!";
      setTimeout(() => {
        copyEmailBtn.textContent = "COPY";
      }, 2000);
    });
  });

  // Initial Grid render
  renderGrid();

  // Check URL hash on load (e.g. #project-4)
  const initialHash = window.location.hash;
  if (initialHash && initialHash.startsWith("#project-")) {
    const id = parseInt(initialHash.replace("#project-", ""), 10);
    const idx = PROJECTS_DATA.findIndex(p => p.id === id);
    if (idx !== -1) {
      openDetailModal(idx);
    }
  }
});
