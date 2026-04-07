import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  site: "https://package-replacement.veritycost.com",
  integrations: [sitemap()],
  server: {
    host: true,
  },
});
