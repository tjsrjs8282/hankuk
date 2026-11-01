import { menu, dining } from "../data/site";
import { $, $$, lang, kstNow } from "./util";

/** 오늘의 학식 — today's menu by the Korean weekday; dinner is preselected after 14:00 KST. */
const DOW = { ko: ["일", "월", "화", "수", "목", "금", "토"], en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] };
const closed = {
  ko: { main: "오늘은 쉬어요", sides: "주말에는 학생식당을 운영하지 않아요. 월요일 중식은 '{next}'입니다." },
  en: { main: "Closed today", sides: "The dining hall is closed at weekends. Monday's lunch: {next}." },
};
const noDinner = {
  ko: { main: "금요일 석식은 쉬어요", sides: "금요일 저녁에는 학생회관 1층 카페를 이용해 주세요." },
  en: { main: "No dinner on Fridays", sides: "On Friday evenings the café on the Student Union ground floor is open." },
};

export function todaysMenu(now = kstNow()) {
  const dow = now.getUTCDay();
  return { dow, day: dow >= 1 && dow <= 5 ? menu[dow - 1] : null, hour: now.getUTCHours() };
}

export function initDining() {
  const root = $("[data-dining]");
  if (!root) return;
  const { dow, day, hour } = todaysMenu();
  const now = kstNow();
  const dateEl = $("[data-dining-date]", root)!;
  dateEl.textContent =
    lang === "ko" ? `${now.getUTCMonth() + 1}.${now.getUTCDate()} (${DOW.ko[dow]})` : `${DOW.en[dow]}, ${now.toLocaleString("en-US", { month: "short", timeZone: "UTC" })} ${now.getUTCDate()}`;

  const main = $("[data-dining-main]", root)!;
  const sides = $("[data-dining-sides]", root)!;
  const hours = $("[data-dining-hours]", root)!;
  const radios = $$<HTMLButtonElement>("[data-meal]", root);

  const render = (meal: "lunch" | "dinner") => {
    radios.forEach((r) => r.setAttribute("aria-checked", String(r.dataset.meal === meal)));
    hours.textContent = dining.hours[meal];
    if (!day) {
      main.textContent = closed[lang].main;
      sides.textContent = closed[lang].sides.replace("{next}", menu[0].lunch.main[lang]);
      return;
    }
    const m = day[meal];
    if (!m) {
      main.textContent = noDinner[lang].main;
      sides.textContent = noDinner[lang].sides;
      return;
    }
    main.textContent = m.main[lang];
    sides.textContent = m.sides[lang];
  };

  for (const r of radios) r.addEventListener("click", () => render(r.dataset.meal as "lunch" | "dinner"));
  // Arrow keys move between the two radios.
  root.querySelector('[role="radiogroup"]')?.addEventListener("keydown", (e) => {
    const k = (e as KeyboardEvent).key;
    if (k !== "ArrowLeft" && k !== "ArrowRight") return;
    const i = radios.findIndex((r) => r.getAttribute("aria-checked") === "true");
    const next = radios[(i + 1) % radios.length];
    next.focus();
    render(next.dataset.meal as "lunch" | "dinner");
  });
  render(day?.dinner && hour >= 14 ? "dinner" : "lunch");
}
