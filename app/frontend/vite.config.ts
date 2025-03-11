import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    watch: {
        usePolling: true, // Verify changes on the host machine
    },
    hmr: { path: "hmr" }, // Hot Module Replacement (HMR) updates in realtime on the host machine
    host: true, // needed for the Docker Container port mapping to work
  },
})
