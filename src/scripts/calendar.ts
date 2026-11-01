import { calendar, calendarKinds } from "../data/site";
import { weeks, monthEvents, rangeLabel, monthTitle, clampYm, addMonth, canPrev, canNext, type Ym } from "../lib/cal";
import { $, lang, todayKst } from "./util";

/** 학사일정 — same month maths as the server render (lib/cal.ts), redrawn on navigation. */
export function initCalendar() {
  const root = $("[data-calendar]");
  if (!root) return;
  const title = $("[data-cal-title]", root)!;
  const body = $("[data-cal-body]", root)!;
  const list = $("[data-cal-events]", root)!;
  const prev = $<HTMLButtonElement>("[data-cal-prev]", root)!;
  const next = $<HTMLButtonElement>("[data-cal-next]", root)!;
  const todayLabel = $("[data-cal-today]", root);
  const today = todayKst();
  if (todayLabel) todayLabel.textContent = today.replaceAll("-", ".");

  let ym: Ym = clampYm({ y: +today.slice(0, 4), m: +today.slice(5, 7) });
  const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

  const render = () => {
    title.textContent = monthTitle(ym, lang);
    prev.disabled = !canPrev(ym);
    next.disabled = !canNext(ym);
    body.innerHTML = weeks(ym, calendar)
      .map(
        (week) =>
          `<tr>${week
            .map((c, i) => {
              if (!c) return '<td class="empty"></td>';
              const cls = [i === 0 && "sun", i === 6 && "sat", c.date === today && "today", c.kinds.length && "has"].filter(Boolean).join(" ");
              const dots = c.kinds.length ? `<span class="cal__dots" aria-hidden="true">${c.kinds.map((k) => `<i class="k-${k}"></i>`).join("")}</span>` : "";
              return `<td class="${cls}"><span class="cal__day">${c.day}</span>${dots}</td>`;
            })
            .join("")}</tr>`,
      )
      .join("");
    const events = monthEvents(ym, calendar);
    list.innerHTML = events.length
      ? events
          .map((e) => {
            const end = e.end ?? e.start;
            const state = end < today ? " past" : e.start <= today && end >= today ? " now" : "";
            return `<li class="cal__event k-${e.kind}${state}"><span class="cal__when tabular">${esc(rangeLabel(e, lang))}</span><span class="cal__what">${esc(e.title[lang])}</span><span class="cal__kind">${esc(calendarKinds[e.kind][lang])}</span></li>`;
          })
          .join("")
      : `<li class="cal__empty">${lang === "ko" ? "이 달에는 학사일정이 없어요." : "Nothing scheduled this month."}</li>`;
  };

  prev.addEventListener("click", () => {
    ym = addMonth(ym, -1);
    render();
  });
  next.addEventListener("click", () => {
    ym = addMonth(ym, 1);
    render();
  });
  render();
}
