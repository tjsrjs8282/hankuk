import { guide, fallback, type GuideEntry, type GuideLink } from "../data/guide";
import { menu } from "../data/site";
import type { Lang } from "./util";

/**
 * The offline brain of the AI 도우미: picks the guide entry whose keys best match the
 * question. Hangul keys match as substrings (particles like 은/는/이야 don't matter);
 * Latin keys match whole words, so "this" never triggers "hi".
 */
const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[\s.,!?·~'"“”‘’()[\]{}:;\-–—_/\\「」]+/g, "");
const ascii = /^[\x20-\x7e]+$/;
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function match(question: string): GuideEntry | null {
  const n = norm(question);
  const lower = question.toLowerCase();
  if (!n) return null;
  let best: GuideEntry | null = null;
  let top = 0;
  for (const g of guide) {
    let s = 0;
    if (norm(g.q.ko) === n || norm(g.q.en) === n) s += 10;
    for (const key of g.keys) {
      const hit = ascii.test(key) ? new RegExp(`\\b${escape(key.toLowerCase())}(e?s)?\\b`).test(lower) : n.includes(norm(key));
      if (hit) s += 1 + norm(key).length * 0.25;
    }
    if (s > top) {
      top = s;
      best = g;
    }
  }
  return top >= 1 ? best : null;
}

const kst = () => new Date(Date.now() + 9 * 3600_000);

function menuLine(lang: Lang) {
  const now = kst();
  const dow = now.getUTCDay();
  const md = `${now.getUTCMonth() + 1}/${now.getUTCDate()}`;
  if (dow === 0 || dow === 6) {
    return lang === "ko"
      ? `오늘(${md})은 주말이라 학생식당을 운영하지 않아요. 월요일 중식은 ${menu[0].lunch.main.ko}이에요.`
      : `It's the weekend (${md}), so the dining hall is closed. Monday's lunch is ${menu[0].lunch.main.en}.`;
  }
  const d = menu[dow - 1];
  const dinner = d.dinner ? (lang === "ko" ? ` 석식은 ${d.dinner.main.ko}예요.` : ` Dinner is ${d.dinner.main.en}.`) : lang === "ko" ? " 금요일 석식은 쉬어요." : " There's no dinner on Fridays.";
  return lang === "ko" ? `오늘(${md}) 중식은 ${d.lunch.main.ko} — ${d.lunch.sides.ko}.${dinner}` : `Today's lunch (${md}) is ${d.lunch.main.en} — ${d.lunch.sides.en}.${dinner}`;
}

function fill(text: string, lang: Lang) {
  let out = text.replace("{menu}", menuLine(lang));
  if (out.includes("{dday}")) {
    const now = kst();
    const days = Math.round((Date.UTC(2026, 11, 29) - Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())) / 86_400_000);
    const sentence = /[^.\n]*\{dday\}[^.\n]*\.\s?/;
    if (days > 0) out = out.replace("{dday}", lang === "ko" ? `${days}일` : `${days} days`);
    else if (days >= -2) out = out.replace(sentence, lang === "ko" ? "지금 원서를 받고 있어요. " : "Applications are open right now. ");
    else out = out.replace(sentence, lang === "ko" ? "올해 정시 접수는 마감됐어요. " : "This year's regular applications have closed. ");
  }
  return out;
}

export type Answer = { text: string; links: GuideLink[]; entry: GuideEntry | null };

export function answerLocally(question: string, lang: Lang): Answer {
  const entry = match(question);
  if (!entry) return { text: fallback[lang], links: [], entry: null };
  return { text: fill(entry.a[lang], lang), links: entry.links ?? [], entry };
}
