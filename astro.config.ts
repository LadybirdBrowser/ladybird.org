import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  output: "static",
  site: "https://ladybird.org",
  integrations: [tailwind(), sitemap(), mdx()],
  // Special case the initial posts from before the astro transition.
  // These are the super-SEO'd links that were shared around.
  redirects: {
    "/announcement": "/posts/announcement",
    "/announcement.html": "/posts/announcement",
    "/fork": "/posts/fork",
    "/fork.html": "/posts/fork",
    "/thanks": "/posts/thanks",
    "/thanks.html": "/posts/thanks",
    "/why-ladybird": "/posts/why-ladybird",
    "/why-ladybird.html": "/posts/why-ladybird",
    "/wire.pdf": "/payment-details",
  },
});
