import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import packageJson from "../package.json";
import css from "rollup-plugin-css-only";

process.env.VITE_SCR_VERSION = packageJson.version;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte({
      emitCss: true,
    }),
  ],
  build: {
    commonjsOptions: {
      sourceMap: true,
    },
    rollupOptions: {
      output: {
        sourcemap: true,
        format: "iife",
        name: "app",
        // file: "dist/build/bundle.js",
      },
      plugins: [css({ output: "bundle.css" })],
      inlineDynamicImports: true,
    },
  },
});
