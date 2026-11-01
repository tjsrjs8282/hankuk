/**
 * Prefix a `public/` path with the deploy base: "/hankuk" on GitHub Pages, "/" on
 * Vercel (see astro.config.mjs). Works in pages and in client scripts.
 */
export const withBase = (path: string) => `${import.meta.env.BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
