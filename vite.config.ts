import { defineConfig } from "vite";
import { ConfigPlugin } from "@dxos/config/vite-plugin";
import topLevelAwait from "vite-plugin-top-level-await";
import wasm from "vite-plugin-wasm";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { ThemePlugin } from "@dxos/react-ui-theme/plugin";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config
export default defineConfig({
  server: {
    host: true,
  },
  build: {
    outDir: "out/.",
  },
  worker: {
    format: "es",
    plugins: () => [topLevelAwait(), wasm()],
  },

  plugins: [
    ConfigPlugin(),
    topLevelAwait(),
    wasm(),
    react({ jsxRuntime: "classic" }),
    ThemePlugin({
      content: [
        resolve(__dirname, "./index.html"),
        resolve(__dirname, "./src/**/*.{js,ts,jsx,tsx}"),
        resolve(__dirname, "node_modules/@dxos/react-ui/dist/**/*.mjs"),
        resolve(__dirname, "node_modules/@dxos/react-ui-theme/dist/**/*.mjs"),
      ],
    }),
    VitePWA({
      registerType: "prompt",
      workbox: {
        maximumFileSizeToCacheInBytes: 30000000,
      },
      includeAssets: ["favicon.ico"],
      manifest: {
        name: ".",
        short_name: ".",
        theme_color: "#ffffff",
        icons: [
          {
            src: "icons/icon-32.png",
            sizes: "32x32",
            type: "image/png",
          },
          {
            src: "icons/icon-256.png",
            sizes: "256x256",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
