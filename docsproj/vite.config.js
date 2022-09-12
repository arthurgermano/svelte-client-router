import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import packageJson from "../package.json";

process.env.VITE_SCR_VERSION = packageJson.version;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()]
})
