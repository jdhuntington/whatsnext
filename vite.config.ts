import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import wasm from "vite-plugin-wasm";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "ws://localhost:6010",
        ws: true,
      },
    },
  },
  plugins: [wasm(), react()],
  worker: {
    format: "es",
    plugins: () => [wasm()],
  },
});
