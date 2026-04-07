import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  site: "https://package-replacement.veritycost.com",
  server: {
    host: true,
  },
});
