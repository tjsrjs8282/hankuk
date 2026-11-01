import { $, $$, reducedMotion, setToggle } from "./util";

/**
 * The story carousel (2020: bxSlider with four copies of one slide). Fades, autoplays
 * with a progress bar, pauses on hover/focus or with its own button, swipes on touch,
 * and keeps hidden slides out of the tab order.
 */
const SLIDE_MS = 6500;

export function initSlider() {
  const root = $("[data-slider]");
  if (!root) return;
  const slides = $$("[data-slide]", root);
  const dots = $$("[data-slider-dot]", root);
  const current = $("[data-slider-current]", root);
  const toggle = $<HTMLButtonElement>("[data-slider-toggle]", root);
  root.style.setProperty("--slide-ms", `${SLIDE_MS}ms`);

  let index = 0;
  let timer = 0;
  let userPaused = reducedMotion();
  let hovered = false;
  let inView = false;

  const show = (next: number) => {
    index = (next + slides.length) % slides.length;
    slides.forEach((s, i) => {
      const on = i === index;
      s.classList.toggle("is-active", on);
      if (on) s.removeAttribute("aria-hidden");
      else s.setAttribute("aria-hidden", "true");
      for (const f of $$("a, button", s)) f.tabIndex = on ? 0 : -1;
    });
    dots.forEach((d, i) => {
      d.classList.toggle("is-active", i === index);
      d.classList.toggle("is-done", i < index);
      if (i === index) d.setAttribute("aria-current", "true");
      else d.removeAttribute("aria-current");
      // restart the progress animation
      const fill = d.firstElementChild as HTMLElement | null;
      if (fill && i === index) {
        fill.style.animation = "none";
        void fill.offsetWidth;
        fill.style.animation = "";
      }
    });
    if (current) current.textContent = String(index + 1).padStart(2, "0");
    schedule();
  };

  const running = () => !userPaused && !hovered && inView;
  const schedule = () => {
    clearTimeout(timer);
    root.classList.toggle("is-paused", !running());
    if (running()) timer = window.setTimeout(() => show(index + 1), SLIDE_MS);
  };

  $("[data-slider-prev]", root)?.addEventListener("click", () => show(index - 1));
  $("[data-slider-next]", root)?.addEventListener("click", () => show(index + 1));
  dots.forEach((d, i) => d.addEventListener("click", () => show(i)));
  toggle?.addEventListener("click", () => {
    userPaused = !userPaused;
    setToggle(toggle, userPaused);
    schedule();
  });
  setToggle(toggle, userPaused);

  root.addEventListener("mouseenter", () => ((hovered = true), schedule()));
  root.addEventListener("mouseleave", () => ((hovered = false), schedule()));
  root.addEventListener("focusin", () => ((hovered = true), schedule()));
  root.addEventListener("focusout", (e) => {
    if (!root.contains(e.relatedTarget as Node)) {
      hovered = false;
      schedule();
    }
  });
  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });

  // Swipe
  let x0: number | null = null;
  root.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse") x0 = e.clientX;
  });
  root.addEventListener("pointerup", (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 40) show(index + (dx < 0 ? 1 : -1));
  });

  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    schedule();
  }, { threshold: 0.4 }).observe(root);

  show(0);
}
