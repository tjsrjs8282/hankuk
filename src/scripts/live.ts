import { libraryApp } from "../data/site";
import { $, $$, lang, kstNow, todayKst } from "./util";

/** Things that depend on today: the D-day, NEW badges on notices, library seats. */
export function initLive() {
  const today = todayKst();
  const day = (iso: string) => Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10));

  // D-day until 정시 원서접수 (Dec 29, 09:00 KST)
  const dday = $<HTMLElement>("[data-dday]");
  if (dday?.dataset.deadline) {
    const deadline = dday.dataset.deadline.slice(0, 10);
    const diff = Math.round((day(deadline) - day(today)) / 86_400_000);
    const label = $("[data-dday-label]");
    if (diff > 0) dday.textContent = `D-${diff}`;
    else if (diff >= -2) {
      // Dec 29–31: applications are open
      dday.textContent = lang === "ko" ? "접수 중" : "Open now";
      if (label) label.textContent = lang === "ko" ? "정시 원서접수 12. 31(목) 18:00까지" : "regular applications close Dec 31, 18:00";
    } else {
      dday.textContent = lang === "ko" ? "접수 마감" : "Closed";
      if (label) label.textContent = lang === "ko" ? "편입학 원서접수 1. 5(화) – 1. 8(금)" : "transfer applications Jan 5–8";
    }
  }

  // NEW: notices from the last three days
  for (const item of $$<HTMLElement>("[data-date]")) {
    const age = (day(today) - day(item.dataset.date!)) / 86_400_000;
    const badge = $("[data-new]", item);
    if (badge) badge.hidden = !(age >= 0 && age <= 3);
  }

  // Library seats: busier in the afternoon and in exam weeks (a plausible curve, not live data).
  const free = $("[data-seats-free]");
  const bar = $<HTMLElement>("[data-seats-bar]");
  if (free && bar) {
    const now = kstNow();
    const h = now.getUTCHours() + now.getUTCMinutes() / 60;
    const exam = today >= "2026-12-07" && today <= "2026-12-18";
    const curve = 0.18 + 0.62 * Math.exp(-((h - 15.5) ** 2) / 18) + (h < 6 ? 0.05 : 0);
    const used = Math.min(0.97, curve + (exam ? 0.15 : 0));
    const total = libraryApp.seats.total;
    free.textContent = Math.round(total * (1 - used)).toLocaleString("en-US");
    bar.style.setProperty("--used", `${Math.round(used * 100)}%`);
  }
}
