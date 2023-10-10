import { resolve } from "node:path"
import { URL, fileURLToPath } from "node:url"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      input: {
        "game": resolve(__dirname, "apps/game/index.html"),
        "new-game": resolve(__dirname, "apps/new-game/index.html"),
      },
    },
  },
})
