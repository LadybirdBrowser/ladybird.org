import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  output: "static",
  site: "https://ladybird.org",
  integrations: [sitemap()],
  // Special case the initial posts from before the astro transition.
  // These are the super-SEO'd links that were shared around.
  redirects: {
    "/announcement": "/posts/announcement",
    "/announcement.html": "/posts/announcement",
    "/fork": "/posts/fork",
    "/fork.html": "/posts/fork",
    "/payment-details": "/organization#bank-details",
    "/thanks": "/posts/thanks",
    "/thanks.html": "/posts/thanks",
    "/why-ladybird": "/posts/why-ladybird",
    "/why-ladybird.html": "/posts/why-ladybird",
    "/wire.pdf": "/organization#bank-details",
    "/posts.xml": "/posts.rss",
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
