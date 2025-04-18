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
		headers: {
			"Content-Security-Policy": `
				default-src 'self';
				script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.stripe.com https://*.stripe.network;
				style-src 'self' 'unsafe-inline';
				img-src 'self' data: https://*.stripe.com;
				frame-src 'self' https://*.stripe.com https://*.stripe.network;
				connect-src 'self' https://*.stripe.com https://*.stripe.network http://localhost:3310;
			`
				.replace(/\s+/g, " ")
				.trim(),
		},
	},
	test: {
		environment: "jsdom", // Simulates a browser environment for testing
		setupFiles: ["./src/__tests__/setupTest.ts"], // Global configuration file
		globals: true, // Use global variables
	},
})
