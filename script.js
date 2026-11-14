document.querySelectorAll("[data-carousel]").forEach(carousel => {
  const track = carousel.querySelector(".carousel-track");
  const slides = [...track.children];
  const counter = carousel.querySelector(".carousel-count");
  let index = Number(carousel.dataset.start || 0);
  const select = next => {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === index);
      slide.setAttribute("aria-current", i === index ? "true" : "false");
    });
    counter.textContent = `${String(index + 1).padStart(2, "0")}/${String(slides.length).padStart(2, "0")}`;
  };
  const go = next => {
    select(next);
    const slide = slides[index];
    const left = slide.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
    track.scrollTo({ left: left - (track.clientWidth - slide.offsetWidth) / 2, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  carousel.querySelector("[data-prev]").addEventListener("click", () => go(index - 1));
  carousel.querySelector("[data-next]").addEventListener("click", () => go(index + 1));
  track.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      go(index + (event.key === "ArrowRight" ? 1 : -1));
    }
  });
  track.addEventListener("scroll", () => {
    const center = track.getBoundingClientRect().left + track.clientWidth / 2;
    const nearest = slides.reduce((best, slide, i) => Math.abs(slide.getBoundingClientRect().left + slide.offsetWidth / 2 - center) < Math.abs(slides[best].getBoundingClientRect().left + slides[best].offsetWidth / 2 - center) ? i : best, 0);
    if (nearest !== index) select(nearest);
  }, { passive: true });
  select(index);
  requestAnimationFrame(() => go(index));
});
