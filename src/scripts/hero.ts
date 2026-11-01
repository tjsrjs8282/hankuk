import { $, reducedMotion, setToggle } from "./util";

/**
 * Hero loop: the still is the LCP image; the video loads after the page has, fades in
 * over it, and pauses when off screen. No video for reduced motion or data saver.
 */
export function initHero() {
  const hero = $("[data-hero]");
  const video = $<HTMLVideoElement>("[data-hero-video]");
  const toggle = $<HTMLButtonElement>("[data-hero-toggle]");
  if (!hero || !video) return;

  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (reducedMotion() || conn?.saveData || /(^|-)2g$/.test(conn?.effectiveType ?? "")) return;

  let userPaused = false;
  let visible = true;

  const start = () => {
    const phone = window.matchMedia("(max-width: 768px)").matches;
    const webm = !phone && video.canPlayType('video/webm; codecs="vp9"') !== "";
    video.src = phone ? video.dataset.mobile! : webm ? video.dataset.webm! : video.dataset.mp4!;
    video.addEventListener(
      "playing",
      () => {
        video.classList.add("is-playing");
        if (toggle) toggle.hidden = false;
      },
      { once: true },
    );
    video.play().catch(() => {
      /* autoplay refused — the still stays */
    });
  };

  // After the page has settled — the still is already a finished hero, the loop is a bonus.
  const delay = window.matchMedia("(max-width: 768px)").matches ? 3500 : 1200;
  const later = () => setTimeout(() => (typeof requestIdleCallback === "function" ? requestIdleCallback(start, { timeout: 2000 }) : start()), delay);
  if (document.readyState === "complete") later();
  else window.addEventListener("load", later, { once: true });

  const sync = () => {
    if (!video.src) return;
    if (visible && !userPaused) video.play().catch(() => {});
    else video.pause();
  };
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  }).observe(hero);
  document.addEventListener("visibilitychange", () => {
    visible = document.visibilityState === "visible";
    sync();
  });

  toggle?.addEventListener("click", () => {
    userPaused = !userPaused;
    setToggle(toggle, userPaused);
    sync();
  });
}
