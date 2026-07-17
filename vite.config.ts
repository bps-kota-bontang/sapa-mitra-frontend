import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (
          warning.code === "INVALID_ANNOTATION" &&
          typeof warning.message === "string" &&
          warning.message.includes("contains an annotation that Rollup cannot interpret")
        ) {
          return;
        }

        warn(warning);
      },
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          if (id.includes("node_modules/vue/") || id.includes("node_modules/vue-router/") || id.includes("node_modules/pinia/")) {
            return "framework";
          }

          if (id.includes("node_modules/html2pdf.js/src/")) {
            return "pdf-html2pdf";
          }

          if (id.includes("node_modules/html2canvas/")) {
            return "pdf-html2canvas";
          }

          if (id.includes("node_modules/jspdf/")) {
            return "pdf-jspdf";
          }

          if (id.includes("node_modules/pdf-lib/")) {
            return "pdf-lib";
          }

          if (id.includes("node_modules/pako/")) {
            return "pdf-pako";
          }

          if (id.includes("node_modules/dompurify/")) {
            return "pdf-dompurify";
          }

          if (id.includes("node_modules/chart.js/") || id.includes("node_modules/vue-chartjs/") || id.includes("node_modules/@kurkle/")) {
            return "charts";
          }
        },
      },
    },
  },
});
