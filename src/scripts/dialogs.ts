import { $, $$, lang, toast } from "./util";

const demoText = {
  ko: "포트폴리오용으로 만든 가상의 대학교 홈페이지라 실제 계정·페이지는 없어요.",
  en: "This is a fictional university built as a portfolio piece, so there is no real account or page behind this link.",
};

/** The campus film dialog, backdrop-click closing for every modal, and demo-only links. */
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
