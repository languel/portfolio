(() => {
  const header = document.querySelector("[data-header]");
  const works = [...document.querySelectorAll("[data-work]")];
  const dialog = document.querySelector(".lightbox");
  const dialogImg = dialog.querySelector(".lightbox__img");
  const dialogTitle = dialog.querySelector("#lb-title");
  const dialogMeta = dialog.querySelector("#lb-meta");
  const prevBtn = dialog.querySelector("[data-prev]");
  const nextBtn = dialog.querySelector("[data-next]");

  let index = 0;

  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-in"));
  }

  const open = (i) => {
    index = (i + works.length) % works.length;
    const work = works[index];
    const img = work.querySelector("img");

    dialogImg.src = img.currentSrc || img.src;
    dialogImg.alt = img.alt;
    dialogTitle.textContent = work.dataset.title;
    dialogMeta.textContent = work.dataset.meta;

    if (!dialog.open) dialog.showModal();
  };

  works.forEach((work, i) => {
    work.querySelector(".work__hit").addEventListener("click", () => open(i));
  });

  prevBtn.addEventListener("click", () => open(index - 1));
  nextBtn.addEventListener("click", () => open(index + 1));

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  document.addEventListener("keydown", (event) => {
    if (!dialog.open) return;
    if (event.key === "ArrowLeft") open(index - 1);
    if (event.key === "ArrowRight") open(index + 1);
  });

  dialog.addEventListener("close", () => {
    dialogImg.removeAttribute("src");
  });
})();
