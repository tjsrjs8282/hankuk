import { spots } from "../data/site";
import { $, $$, lang } from "./util";

/** Campus map: pins and the list share one selection; the card describes it. */
export function initMap() {
  const root = $("[data-map]");
  if (!root) return;
  const pins = $$<HTMLButtonElement>(".map__pin", root);
  const items = $$<HTMLButtonElement>(".map__item", root);
  const num = $("[data-spot-num]", root)!;
  const name = $("[data-spot-name]", root)!;
  const text = $("[data-spot-text]", root)!;

  const select = (id: string) => {
    const i = spots.findIndex((s) => s.id === id);
    if (i < 0) return;
    num.textContent = String(i + 1).padStart(2, "0");
    name.textContent = spots[i].name[lang];
    text.textContent = spots[i].text[lang];
    pins.forEach((p) => p.setAttribute("aria-pressed", String(p.dataset.spot === id)));
    items.forEach((it) => it.classList.toggle("is-active", it.dataset.spot === id));
  };

  root.addEventListener("click", (e) => {
    const btn = (e.target as Element).closest<HTMLButtonElement>("[data-spot]");
    if (btn) select(btn.dataset.spot!);
  });
  // Hover previews on pointer devices.
  for (const p of pins) p.addEventListener("pointerenter", (e) => e.pointerType === "mouse" && select(p.dataset.spot!));
}
