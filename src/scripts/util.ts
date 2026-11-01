export type Lang = "ko" | "en";

export const lang: Lang = document.documentElement.lang === "en" ? "en" : "ko";
export const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);
export const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)];

export const reducedMotion = () => document.documentElement.classList.contains("reduce-motion");

/** Now in Korea — campus clocks (menu, D-day, NEW badges) run on KST wherever the visitor is. */
export const kstNow = () => new Date(Date.now() + 9 * 3600_000);
export const todayKst = () => kstNow().toISOString().slice(0, 10);

let toastTimer = 0;
export function toast(message: string) {
  const el = $("[data-toast]");
  if (!el) return;
  el.textContent = message;
  el.classList.add("is-on");
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => el.classList.remove("is-on"), 3600);
}

/** Swap a toggle button's pressed state and its label (data-label-pause / data-label-play). */
export function setToggle(btn: HTMLElement | null, paused: boolean) {
  if (!btn) return;
  btn.setAttribute("aria-pressed", String(paused));
  const label = paused ? btn.dataset.labelPlay : btn.dataset.labelPause;
  if (label) btn.setAttribute("aria-label", label);
}

/** Scroll to an in-page target; motion.ts swaps in Lenis when it loads. */
export const scroller = {
  to(target: Element | number) {
    if (typeof target === "number") window.scrollTo({ top: target, behavior: reducedMotion() ? "auto" : "smooth" });
    else target.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "start" });
  },
};

/** Run when the browser is idle (or soon). */
export const idle = (fn: () => void, timeout = 2000) => {
  // Safari only gained requestIdleCallback recently; fall back to a short timeout.
  if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(fn, { timeout });
  else setTimeout(fn, 400);
};
