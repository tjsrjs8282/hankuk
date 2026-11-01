import { $$ } from "./util";

/** WAI-ARIA tabs: click, ←/→, Home/End; only the selected tab is in the tab order. */
export function initTabs() {
  for (const list of $$("[data-tabs]")) {
    const tabs = $$<HTMLButtonElement>('[role="tab"]', list);
    const select = (tab: HTMLButtonElement, focus = false) => {
      for (const t of tabs) {
        const on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(t.getAttribute("aria-controls")!);
        if (panel) panel.hidden = !on;
      }
      if (focus) tab.focus();
    };
    list.addEventListener("click", (e) => {
      const tab = (e.target as Element).closest<HTMLButtonElement>('[role="tab"]');
      if (tab) select(tab);
    });
    list.addEventListener("keydown", (e) => {
      const i = tabs.indexOf(document.activeElement as HTMLButtonElement);
      if (i < 0) return;
      const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (next === undefined) return;
      e.preventDefault();
      select(tabs[(next + tabs.length) % tabs.length], true);
    });
  }
}
