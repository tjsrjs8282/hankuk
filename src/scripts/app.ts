// Entry point. Everything here is small; GSAP + Lenis load later, when the browser is idle.
import { idle, reducedMotion } from "./util";
import { initFontSize } from "./fontsize";
import { initHeader } from "./header";
import { initHero } from "./hero";
import { initSlider } from "./slider";
import { initTabs } from "./tabs";
import { initDining } from "./dining";
import { initLive } from "./live";
import { initCalendar } from "./calendar";
import { initTicker } from "./ticker";
import { initSeasons } from "./seasons";
import { initMap } from "./map";
import { initDialogs } from "./dialogs";
import { initAssistant } from "./assistant";

const steps = [initFontSize, initHeader, initDialogs, initAssistant, initHero, initSlider, initTabs, initDining, initLive, initCalendar, initTicker, initSeasons, initMap];
for (const step of steps) {
  try {
    step();
  } catch (err) {
    // One broken widget must not take the page down with it.
    console.error(err);
  }
}

if (!reducedMotion()) {
  idle(() => {
    import("./motion")
      .then((m) => m.initMotion())
      .catch((err) => {
        console.error(err);
        document.documentElement.classList.add("motion-ready");
      });
  }, 1200);
} else {
  document.documentElement.classList.add("motion-ready");
}
