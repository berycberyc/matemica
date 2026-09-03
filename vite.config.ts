import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const BUILD = new Date().toISOString();

export default defineConfig({
  define: { __BUILD__: JSON.stringify(BUILD) },
  plugins: [
    react(),
    {
      name: "версия",
      generateBundle() {
        this.emitFile({
          type: "asset",
          fileName: "version.json",
          source: JSON.stringify({ build: BUILD })
        });
      }
    }
  ]
});
