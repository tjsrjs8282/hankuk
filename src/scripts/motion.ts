import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { $, $$, scroller } from "./util";

/**
 * Loaded after idle, only when motion is allowed: Lenis smooth scroll, reveals,
 * the numbers counting up, gentle parallax on the two photo bands.
 */
export function initMotion() {
  gsap.registerPlugin(ScrollTrigger);
  const root = document.documentElement;

  const lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  const headerOffset = () => -(($("[data-bar]")?.offsetHeight ?? 64) + 12);
  scroller.to = (target) => lenis.scrollTo(target as HTMLElement | number, { offset: typeof target === "number" ? 0 : headerOffset() });

  // In-page links glide (and move focus for keyboard and screen-reader users).
  document.addEventListener("click", (e) => {
    if (e.defaultPrevented) return;
    const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href")!.slice(1);
    const el = id ? document.getElementById(id) : null;
    if (!el) return;
    e.preventDefault();
    lenis.scrollTo(el, { offset: headerOffset() });
    history.pushState(null, "", `#${id}`);
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  });

  // Freeze the page behind modal dialogs.
  new MutationObserver(() => (root.classList.contains("dialog-open") ? lenis.stop() : lenis.start())).observe(root, { attributes: true, attributeFilter: ["class"] });

  // Reveals
  ScrollTrigger.batch(".reveal", {
    start: "top 90%",
    once: true,
    onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.08, overwrite: true }),
  });
  root.classList.add("motion-ready");

  // Numbers count up the first time they're seen.
  for (const el of $$<HTMLElement>("[data-count]")) {
    const to = Number(el.dataset.count);
    const decimals = Number(el.dataset.decimals ?? 0);
    const fmt = (v: number) => v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    const state = { v: 0 };
    if (ScrollTrigger.isInViewport(el)) continue;
    el.textContent = fmt(0);
    gsap.to(state, {
      v: to,
      duration: 1.8,
      ease: "power2.out",
      onUpdate: () => (el.textContent = fmt(state.v)),
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
  }

  // Parallax on the photo bands.
  const heroMedia = $(".hero__media");
  if (heroMedia) gsap.to(heroMedia, { yPercent: 14, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  const stage = $(".seasons__stage");
  if (stage) gsap.fromTo(stage, { scale: 1.1 }, { scale: 1, ease: "none", scrollTrigger: { trigger: ".seasons", start: "top bottom", end: "bottom top", scrub: true } });

  // Re-measure after fonts settle and when the 글자크기 changes the layout.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}
