import type { CalEvent } from "../data/site";

/**
 * Month maths for the 학사일정, shared by the server render (Academic.astro) and the
 * client (scripts/calendar.ts) so both draw the same grid.
 */
export type Ym = { y: number; m: number }; // m: 1–12

export const FIRST: Ym = { y: 2026, m: 9 };
export const LAST: Ym = { y: 2027, m: 3 };

const key = ({ y, m }: Ym) => y * 12 + (m - 1);
export const addMonth = (a: Ym, d: number): Ym => {
  const k = key(a) + d;
  return { y: Math.floor(k / 12), m: (k % 12) + 1 };
};
export const clampYm = (a: Ym): Ym => (key(a) < key(FIRST) ? FIRST : key(a) > key(LAST) ? LAST : a);
export const sameYm = (a: Ym, b: Ym) => key(a) === key(b);
export const canPrev = (a: Ym) => key(a) > key(FIRST);
export const canNext = (a: Ym) => key(a) < key(LAST);

export const iso = (y: number, m: number, d: number) => `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

/** Today in Korea, as YYYY-MM-DD (the calendar is in KST wherever the visitor is). */
export const todayKst = (now = new Date()) => new Date(now.getTime() + 9 * 3600_000).toISOString().slice(0, 10);

export type Cell = { day: number; date: string; kinds: CalEvent["kind"][] } | null;

/** Weeks (Sunday first) for a month, each day tagged with the kinds of event on it. */
export function weeks(ym: Ym, events: CalEvent[]): Cell[][] {
  const first = new Date(Date.UTC(ym.y, ym.m - 1, 1)).getUTCDay();
  const days = new Date(Date.UTC(ym.y, ym.m, 0)).getUTCDate();
  const cells: Cell[] = Array.from({ length: first }, () => null);
  for (let d = 1; d <= days; d++) {
    const date = iso(ym.y, ym.m, d);
    const kinds = [...new Set(events.filter((e) => date >= e.start && date <= (e.end ?? e.start)).map((e) => e.kind))];
    cells.push({ day: d, date, kinds });
  }
  while (cells.length % 7) cells.push(null);
  const out: Cell[][] = [];
  for (let i = 0; i < cells.length; i += 7) out.push(cells.slice(i, i + 7));
  return out;
}

/** Events that touch the month, in order. */
export function monthEvents(ym: Ym, events: CalEvent[]) {
  const from = iso(ym.y, ym.m, 1);
  const to = iso(ym.y, ym.m, new Date(Date.UTC(ym.y, ym.m, 0)).getUTCDate());
  return events.filter((e) => e.start <= to && (e.end ?? e.start) >= from).sort((a, b) => a.start.localeCompare(b.start));
}

const DOW = { ko: ["일", "월", "화", "수", "목", "금", "토"], en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] };
export const weekdays = (lang: "ko" | "en") => DOW[lang];

/** "11. 19(목)" / "Nov 19" — and a range when the event spans days. */
export function rangeLabel(e: CalEvent, lang: "ko" | "en") {
  const one = (s: string, withMonth = true) => {
    const [y, m, d] = s.split("-").map(Number);
    const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
    if (lang === "ko") return `${withMonth ? `${m}. ` : ""}${d}(${DOW.ko[dow]})`;
    const mon = new Date(Date.UTC(y, m - 1, d)).toLocaleString("en-US", { month: "short", timeZone: "UTC" });
    return withMonth ? `${mon} ${d}` : `${d}`;
  };
  if (!e.end || e.end === e.start) return one(e.start);
  const sameMonth = e.start.slice(0, 7) === e.end.slice(0, 7);
  return `${one(e.start)} – ${one(e.end, !sameMonth)}`;
}

export const monthTitle = (ym: Ym, lang: "ko" | "en") =>
  lang === "ko" ? `${ym.y}. ${String(ym.m).padStart(2, "0")}` : new Date(Date.UTC(ym.y, ym.m - 1, 1)).toLocaleString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
