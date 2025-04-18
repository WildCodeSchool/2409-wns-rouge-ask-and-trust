import react from "@vitejs/plugin-react"
import path from "path"
import { defineConfig } from "vitest/config"

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
		allowedHosts: ["frontend"], // expose frontend Docker service to external access
	},
	test: {
		environment: "jsdom", // Simulates a browser environment for testing
		setupFiles: ["./src/__tests__/setupTest.ts"], // Global configuration file
		globals: true, // Use global variables
	},
})
