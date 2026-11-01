import { $, $$, reducedMotion } from "./util";

/** 2020's vertical "성적 열람 및 상담 신청" slider with up/down buttons — now a 학사 알림 ticker. */
export function initTicker() {
  const root = $("[data-ticker]");
  const list = $("[data-ticker-list]", root ?? document);
  if (!root || !list) return;
  const items = $$("li", list);
  let i = 0;
  let timer = 0;
  let hold = false;

  const go = (next: number) => {
    i = (next + items.length) % items.length;
    list.style.transform = `translateY(-${(100 / items.length) * i}%)`;
    items.forEach((it, k) => (k === i ? it.removeAttribute("aria-hidden") : it.setAttribute("aria-hidden", "true")));
    schedule();
  };
  const schedule = () => {
    clearTimeout(timer);
    if (!hold && !reducedMotion()) timer = window.setTimeout(() => go(i + 1), 4800);
  };
  $("[data-ticker-prev]", root)?.addEventListener("click", () => go(i - 1));
  $("[data-ticker-next]", root)?.addEventListener("click", () => go(i + 1));
  root.addEventListener("mouseenter", () => ((hold = true), schedule()));
  root.addEventListener("mouseleave", () => ((hold = false), schedule()));
  root.addEventListener("focusin", () => ((hold = true), schedule()));
  root.addEventListener("focusout", () => ((hold = false), schedule()));
  go(0);
}
