import { $$, lang, toast } from "./util";

/** 글자크기 — five steps, remembered in localStorage, announced through the toast. */
const STEPS = [0.9, 1, 1.1, 1.2, 1.3];
const text = { ko: "글자 크기 {n}%", en: "Text size {n}%" };

export function initFontSize() {
  const root = document.documentElement;
  const groups = $$("[data-fontsize]");
  if (!groups.length) return;
  let scale = parseFloat(root.style.getPropertyValue("--fs-scale")) || 1;

  const apply = (s: number, announce: boolean) => {
    scale = s;
    root.style.setProperty("--fs-scale", String(s));
    try {
      localStorage.setItem("hk:font-scale", String(s));
    } catch {}
    const pct = `${Math.round(s * 100)}%`;
    for (const g of groups) {
      const value = g.querySelector("[data-font-value]");
      if (value) value.textContent = pct;
      g.querySelector<HTMLButtonElement>('[data-font-step="-1"]')!.disabled = s <= STEPS[0];
      g.querySelector<HTMLButtonElement>('[data-font-step="1"]')!.disabled = s >= STEPS[STEPS.length - 1];
    }
    if (announce) {
      toast(text[lang].replace("{n}", String(Math.round(s * 100))));
      window.dispatchEvent(new Event("resize")); // ScrollTrigger & co. re-measure
    }
  };

  for (const g of groups) {
    g.addEventListener("click", (e) => {
      const btn = (e.target as Element).closest("button");
      if (!btn) return;
      if (btn.hasAttribute("data-font-reset")) return apply(1, true);
      const dir = Number(btn.dataset.fontStep);
      const i = STEPS.findIndex((x) => Math.abs(x - scale) < 0.01);
      const next = STEPS[Math.min(STEPS.length - 1, Math.max(0, (i < 0 ? 1 : i) + dir))];
      apply(next, true);
    });
  }
  apply(scale, false);
}
