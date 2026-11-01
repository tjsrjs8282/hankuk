import { seasons } from "../data/site";
import { $, $$, lang, reducedMotion } from "./util";

/**
 * 사계절 — the range input runs 0 → 300; image k (k ≥ 1) is fully opaque once the value
 * passes (k)·100 and fades in over the hundred before it, so any value is a blend of
 * two neighbouring seasons. Play sweeps the year once, slowly, then stops on the season.
 */
export function initSeasons() {
  const root = $("[data-seasons]");
  if (!root) return;
  const range = $<HTMLInputElement>("[data-season-range]", root)!;
  const imgs = $$<HTMLImageElement>("[data-season-img]", root);
  const ticks = $$<HTMLButtonElement>("[data-season]", root);
  const month = $("[data-season-month]", root)!;
  const caption = $("[data-season-caption]", root)!;
  const toggle = $<HTMLButtonElement>("[data-season-toggle]", root);
  let shown = -1;
  let raf = 0;

  const paint = (v: number) => {
    imgs.forEach((img, k) => {
      if (k === 0) return;
      img.style.opacity = String(Math.min(1, Math.max(0, v / 100 - (k - 1))));
    });
    const nearest = Math.round(v / 100);
    range.setAttribute("aria-valuetext", seasons[nearest].name[lang]);
    if (nearest !== shown) {
      shown = nearest;
      month.textContent = seasons[nearest].month[lang];
      caption.textContent = seasons[nearest].caption[lang];
      ticks.forEach((t, k) => {
        t.classList.toggle("is-active", k === nearest);
        t.setAttribute("aria-pressed", String(k === nearest));
      });
    }
  };

  // Here "pressed" means playing, so the label is the action the button would take next.
  const setPlaying = (on: boolean) => {
    toggle?.setAttribute("aria-pressed", String(on));
    toggle?.setAttribute("aria-label", (on ? toggle.dataset.labelPause : toggle.dataset.labelPlay) ?? "");
  };
  const stop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
    setPlaying(false);
  };

  /** Ease the slider to a value (instant with reduced motion). */
  const glide = (to: number, ms = 900, done?: () => void) => {
    cancelAnimationFrame(raf);
    const from = Number(range.value);
    if (reducedMotion() || ms === 0) {
      range.value = String(to);
      paint(to);
      done?.();
      return;
    }
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / ms);
      const e = p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2;
      const v = from + (to - from) * e;
      range.value = String(v);
      paint(v);
      if (p < 1) raf = requestAnimationFrame(step);
      else {
        raf = 0;
        done?.();
      }
    };
    raf = requestAnimationFrame(step);
  };

  range.addEventListener("input", () => {
    stop();
    paint(Number(range.value));
  });
  // Let go between two seasons → settle on the nearer one.
  range.addEventListener("change", () => glide(Math.round(Number(range.value) / 100) * 100, 450));
  ticks.forEach((t, k) =>
    t.addEventListener("click", () => {
      stop();
      glide(k * 100);
    }),
  );

  // Play: spring → winter, pausing a beat on each season.
  const play = () => {
    setPlaying(true);
    let k = Math.round(Number(range.value) / 100);
    if (k >= seasons.length - 1) {
      k = 0;
      glide(0, 600);
    }
    const next = () => {
      if (toggle?.getAttribute("aria-pressed") !== "true") return;
      k += 1;
      if (k >= seasons.length) return stop();
      glide(k * 100, 1600, () => window.setTimeout(next, 900));
    };
    window.setTimeout(next, 700);
  };
  toggle?.addEventListener("click", () => {
    if (toggle.getAttribute("aria-pressed") === "true") stop();
    else play();
  });

  paint(Number(root.dataset.start ?? range.value));
}
