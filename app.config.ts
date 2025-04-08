import path from "path";
import { fileURLToPath } from "url";

import { paraglideVitePlugin } from "@inlang/paraglide-js";
import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";
import Icons from "unplugin-icons/vite";

export default defineConfig({
  middleware: "src/middleware/index.ts",
  vite: {
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "src"),
        "lucide-solid/icons": fileURLToPath(
          new URL("./node_modules/lucide-solid/dist/source/icons", import.meta.url)
        ),
      },
    },
    plugins: [
      tailwindcss(),
      paraglideVitePlugin({
        project: "./project.inlang",
        outdir: "./src/paraglide",
        strategy: ["url", "cookie", "baseLocale"],
        urlPatterns: [
          {
            pattern: "/:path(.*)?",
            localized: [
              ["es", "/es/:path(.*)?"],
              ["en", "/en/:path(.*)?"],
            ],
          },
        ],
      }),
      Icons({ compiler: "solid" }),
    ],
  },
});
