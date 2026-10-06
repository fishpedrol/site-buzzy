// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// Publicado como GitHub Pages de projeto: https://fishpedrol.github.io/site-buzzy/
export default defineConfig({
  site: "https://fishpedrol.github.io",
  base: "/site-buzzy/",
  // O GitHub Pages serve cada página como pasta (/site-buzzy/), então as URLs terminam em barra.
  trailingSlash: "always",
  build: { format: "directory" },
  // Compressão sem perdas: mantém os espaços que afetam o texto renderizado.
  compressHTML: true,
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
  },
});
