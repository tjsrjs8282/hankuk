// @ts-check
import { defineConfig, envField, fontProviders } from "astro/config";
import { cp } from "node:fs/promises";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { buildFont } from "./scripts/font.mjs";

// Two deploy targets from one codebase:
// - default (GitHub Pages): plain static files under /hankuk. The AI 도우미 answers
//   from the built-in campus guide (src/data/guide.ts).
// - DEPLOY_TARGET=vercel (or a Vercel build): served from the domain root, plus
//   /api/assistant — Gemini grounded in the same guide.
const VERCEL = process.env.DEPLOY_TARGET === "vercel" || Boolean(process.env.VERCEL);
const SITE = VERCEL
  ? (process.env.SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:4350"))
  : "https://tjsrjs8282.github.io";
const BASE = VERCEL ? "" : "/hankuk";
const LEGACY = fileURLToPath(new URL("./legacy/", import.meta.url));

/** @type {Record<string, string>} */
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".gif": "image/gif",
};

/**
 * The 2020 site lives on, untouched, at legacy/ under the base (/hankuk/legacy/ on Pages).
 * icon.psd stays in the repo for history but is not shipped.
 * @returns {import("astro").AstroIntegration}
 */
function legacy2020() {
  return {
    name: "legacy-2020",
    hooks: {
      "astro:server:setup": ({ server }) => {
        server.middlewares.use((req, res, next) => {
          const prefix = `${BASE}/legacy/`;
          if (!req.url?.startsWith(prefix)) return next();
          const rel = decodeURIComponent(req.url.slice(prefix.length).split("?")[0]) || "index.html";
          const file = normalize(join(LEGACY, rel));
          if (!file.startsWith(normalize(LEGACY)) || !existsSync(file) || statSync(file).isDirectory()) return next();
          res.setHeader("Content-Type", MIME[extname(file).toLowerCase()] ?? "application/octet-stream");
          createReadStream(file).pipe(res);
        });
      },
      "astro:build:done": async ({ dir }) => {
        await cp(LEGACY, fileURLToPath(new URL("legacy/", dir)), {
          recursive: true,
          filter: (src) => !src.endsWith(".psd"),
        });
      },
    },
  };
}

/**
 * Cut Pretendard down to the characters in src/ before Vite sees the CSS (scripts/font.mjs).
 * @type {import("astro").AstroIntegration}
 */
const pretendardSubset = {
  name: "pretendard-subset",
  hooks: {
    "astro:config:setup": async ({ logger }) => {
      const bytes = await buildFont({ quiet: true });
      logger.info(`pretendard-site.woff2 ${(bytes / 1024).toFixed(0)} KB`);
    },
  },
};

/** @type {import("astro").AstroIntegration} */
const assistantRoute = {
  name: "assistant-route",
  hooks: {
    "astro:config:setup": ({ injectRoute }) => {
      injectRoute({ pattern: "/api/assistant", entrypoint: "./src/server/assistant.ts", prerender: false });
    },
  },
};

export default defineConfig({
  site: SITE,
  base: BASE || "/",
  output: "static",
  adapter: VERCEL ? (await import("@astrojs/vercel")).default() : undefined,
  integrations: VERCEL ? [pretendardSubset, legacy2020(), assistantRoute] : [pretendardSubset, legacy2020()],
  compressHTML: true,
  devToolbar: { enabled: false },

  i18n: {
    locales: ["ko", "en"],
    defaultLocale: "ko",
    routing: { prefixDefaultLocale: false },
  },

  env: {
    schema: {
      GEMINI_API_KEY: envField.string({ context: "server", access: "secret", optional: true }),
      GEMINI_MODEL: envField.string({ context: "server", access: "public", optional: true, default: "gemini-3.5-flash-lite" }),
    },
  },

  fonts: [
    {
      // Latin display serif for wordmarks, eyebrows and numbers. Hangul is set in
      // Pretendard (self-hosted dynamic subset, see global.css).
      name: "Cormorant Garamond",
      cssVariable: "--font-serif",
      provider: fontProviders.google(),
      weights: ["500 700"],
      styles: ["normal", "italic"],
      subsets: ["latin"],
      fallbacks: ["Georgia", "serif"],
    },
  ],

  image: {
    responsiveStyles: false,
  },

  // ~30 KB of CSS rides inside the HTML, so first paint waits on no extra request.
  build: {
    inlineStylesheets: "always",
  },

  vite: {
    // Whether /api/assistant exists in this build (false on GitHub Pages).
    define: { __ASSISTANT_ONLINE__: JSON.stringify(VERCEL) },
    build: {
      chunkSizeWarningLimit: 700,
    },
  },
});
