import { $, $$, scroller } from "./util";

/** Sticky bar, mega menu (Esc closes), sitemap dialog, back-to-top. */
export function initHeader() {
  const root = document.documentElement;
  const header = $("[data-header]");
  const toTop = $<HTMLButtonElement>("[data-to-top]");

  // The bar detaches once the utility bar + bar have scrolled away.
  let ticking = false;
  const update = () => {
    ticking = false;
    const threshold = header ? header.offsetHeight : 120;
    root.classList.toggle("is-scrolled", window.scrollY > threshold);
    if (toTop) toTop.hidden = window.scrollY < 900;
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  update();

  toTop?.addEventListener("click", () => {
    scroller.to(0);
    $<HTMLElement>("#main")?.focus({ preventScroll: true });
  });

  // Mega menu: CSS opens it on hover/focus-within; Esc or a click closes it until the pointer leaves.
  const gnb = $("[data-gnb]");
  if (gnb) {
    const close = () => gnb.classList.add("is-closed");
    gnb.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        close();
        gnb.querySelector<HTMLElement>(".gnb__link")?.focus();
      }
    });
    gnb.addEventListener("click", (e) => {
      if ((e.target as Element).closest("a, button")) close();
    });
    gnb.addEventListener("mouseleave", () => gnb.classList.remove("is-closed"));
    gnb.addEventListener("focusout", (e) => {
      if (!gnb.contains(e.relatedTarget as Node)) gnb.classList.remove("is-closed");
    });
    gnb.addEventListener("focusin", (e) => {
      // Re-open when keyboard focus comes back to a top-level link.
      if ((e.target as Element).matches(".gnb__link")) gnb.classList.remove("is-closed");
    });
  }

  // Sitemap / mobile menu.
  const sitemap = $<HTMLDialogElement>("[data-sitemap]");
  if (sitemap) {
    for (const btn of $$("[data-open-sitemap]")) {
      btn.addEventListener("click", () => {
        sitemap.showModal();
        root.classList.add("dialog-open");
      });
    }
    sitemap.addEventListener("close", () => root.classList.remove("dialog-open"));
    sitemap.addEventListener("click", (e) => {
      const target = e.target as Element;
      if (target === sitemap || target.closest("[data-close]")) return sitemap.close();
      const link = target.closest<HTMLAnchorElement>('a[href^="#"]');
      if (link) sitemap.close();
    });
  }
}
