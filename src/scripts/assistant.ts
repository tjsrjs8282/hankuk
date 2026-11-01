import fullPretendard from "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css?url";
import { answerLocally } from "./assistant-engine";
import { $, $$, lang } from "./util";
import { withBase } from "../lib/paths";

/**
 * AI 도우미 panel. Non-modal on desktop (the page stays usable while it answers),
 * modal and full screen on phones. Anything with [data-ask] opens it with a question.
 */
const ONLINE = typeof __ASSISTANT_ONLINE__ !== "undefined" && __ASSISTANT_ONLINE__;
const t = {
  thinking: { ko: "답을 찾는 중", en: "Looking it up" },
  fromGuide: { ko: "캠퍼스 안내서 기반", en: "Answers from the campus guide" },
  fromGemini: { ko: "Gemini · 캠퍼스 안내서 참조", en: "Gemini · grounded in the campus guide" },
  srcGuide: { ko: "출처: 한국대 캠퍼스 안내서", en: "Source: Hanguk campus guide" },
  srcGemini: { ko: "Gemini가 캠퍼스 안내서를 바탕으로 답했어요", en: "Answered by Gemini from the campus guide" },
};

export function initAssistant() {
  const dialog = $<HTMLDialogElement>("[data-ai]");
  const fab = $("[data-ai-open]");
  if (!dialog) return;
  const log = $("[data-ai-log]", dialog)!;
  const form = $<HTMLFormElement>("[data-ai-form]", dialog)!;
  const input = $<HTMLInputElement>("[data-ai-input]", dialog)!;
  const mode = $("[data-ai-mode]", dialog);
  if (mode) mode.textContent = (ONLINE ? t.fromGemini : t.fromGuide)[lang];
  const root = document.documentElement;
  const phone = () => window.matchMedia("(max-width: 640px)").matches;
  let opener: HTMLElement | null = null;
  let busy = false;
  let fullFont = false;

  const open = (from?: HTMLElement | null) => {
    // Typed questions (and Gemini answers) can contain any Hangul — bring in the full
    // Pretendard slices now; the page itself ships only the characters it uses.
    if (!fullFont) {
      fullFont = true;
      // A <link>, not import(): Astro would hoist an imported stylesheet into every page.
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = fullPretendard;
      document.head.append(link);
    }
    // Close any modal (sitemap, film) first — the panel takes over.
    for (const d of $$<HTMLDialogElement>("dialog[open]")) if (d !== dialog) d.close();
    opener = from ?? (document.activeElement as HTMLElement | null);
    if (!dialog.open) {
      if (phone()) dialog.showModal();
      else dialog.show();
    }
    root.classList.add("ai-open");
    if (phone()) root.classList.add("dialog-open");
    if (!busy) input.focus({ preventScroll: true });
  };
  const close = () => dialog.close();
  dialog.addEventListener("close", () => {
    root.classList.remove("ai-open", "dialog-open");
    (opener?.isConnected ? opener : fab)?.focus({ preventScroll: true });
  });
  dialog.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !phone()) {
      e.preventDefault();
      close();
    }
  });
  $("[data-close]", dialog)?.addEventListener("click", close);
  fab?.addEventListener("click", () => open(fab));

  const scrollDown = () => log.scrollTo({ top: log.scrollHeight, behavior: "smooth" });

  const bubble = (who: "me" | "bot", text: string) => {
    const el = document.createElement("div");
    el.className = `msg msg--${who}`;
    const p = document.createElement("p");
    p.textContent = text;
    el.append(p);
    log.append(el);
    scrollDown();
    return el;
  };

  const ask = async (question: string) => {
    question = question.trim().slice(0, 300);
    if (!question || busy) return;
    busy = true;
    bubble("me", question);
    const typing = document.createElement("div");
    typing.className = "msg msg--bot msg--typing";
    typing.setAttribute("aria-label", t.thinking[lang]);
    typing.innerHTML = "<i></i><i></i><i></i>";
    log.append(typing);
    scrollDown();

    const local = answerLocally(question, lang);
    let text = local.text;
    let online = false;
    const t0 = performance.now();
    if (ONLINE) {
      try {
        const res = await fetch(withBase("api/assistant"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, lang }),
          signal: AbortSignal.timeout(20_000),
        });
        if (res.ok) {
          const data = (await res.json()) as { answer?: string };
          if (data.answer) {
            text = data.answer;
            online = true;
          }
        }
      } catch {
        /* fall back to the guide */
      }
    }
    // A short, human pause even when the answer is local.
    const wait = Math.max(0, 450 + Math.min(500, text.length * 4) - (performance.now() - t0));
    await new Promise((r) => setTimeout(r, wait));
    typing.remove();

    const el = bubble("bot", text);
    if (local.links.length) {
      const links = document.createElement("div");
      links.className = "msg__links";
      for (const l of local.links) {
        const a = document.createElement(l.href ? "a" : "button");
        a.className = "msg__link";
        a.textContent = `${l.label[lang]} →`;
        if (l.href) {
          (a as HTMLAnchorElement).href = l.href;
          a.addEventListener("click", () => phone() && close());
        } else if (l.ask) {
          (a as HTMLButtonElement).type = "button";
          a.dataset.aiAsk = l.ask[lang];
        }
        links.append(a);
      }
      el.append(links);
    }
    if (local.entry || online) {
      const src = document.createElement("small");
      src.className = "msg__src";
      src.textContent = (online ? t.srcGemini : t.srcGuide)[lang];
      el.append(src);
    }
    scrollDown();
    busy = false;
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = input.value;
    input.value = "";
    void ask(q);
  });

  // [data-ask] anywhere on the page opens the panel with that question; chips ask inside it.
  document.addEventListener("click", (e) => {
    const target = e.target as Element;
    const chip = target.closest<HTMLElement>("[data-ai-ask]");
    if (chip) return void ask(chip.dataset.aiAsk!);
    const trigger = target.closest<HTMLElement>("[data-ask]");
    if (trigger) {
      e.preventDefault();
      open(trigger);
      void ask(trigger.dataset.ask!);
    }
  });
}
