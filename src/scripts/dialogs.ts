import { $, $$, lang, toast } from "./util";

const demoText = { ko: "준비 중인 페이지입니다.", en: "This page is coming soon." };

/** The campus film dialog, backdrop-click closing for every modal, and links to pages that don't exist yet. */
export function initDialogs() {
  const root = document.documentElement;
  const film = $<HTMLDialogElement>("[data-film]");
  const video = film?.querySelector<HTMLVideoElement>("video");

  if (film && video) {
    for (const btn of $$("[data-open-film]")) {
      btn.addEventListener("click", () => {
        if (!video.src) {
          // Poster and film are fetched only now — not with the page.
          video.poster = video.dataset.poster ?? "";
          video.src = video.dataset.src!;
        }
        film.showModal();
        root.classList.add("dialog-open");
        video.play().catch(() => {});
      });
    }
    film.addEventListener("close", () => {
      video.pause();
      root.classList.remove("dialog-open");
    });
    film.addEventListener("click", (e) => {
      const t = e.target as Element;
      if (t === film || t.closest("[data-close]")) film.close();
    });
  }

  document.addEventListener("click", (e) => {
    const demo = (e.target as Element).closest("[data-demo]");
    if (demo) toast(demoText[lang]);
  });
}
