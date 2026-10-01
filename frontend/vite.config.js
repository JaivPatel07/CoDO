import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * Vite configuration.
 *
 * The dev server is configured so the app can be previewed from any host
 * (including the Arena preview proxy) and so `/api` + `/ws` requests are
 * proxied to the Django backend. That means the frontend never needs to know
 * the backend's real address at build time.
 */

// Where the Django backend lives. Override with VITE_DEV_API_TARGET if needed.
const API_TARGET =
  process.env.VITE_DEV_API_TARGET || "http://127.0.0.1:8000";

export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],

  server: {
    host: true, // listen on 0.0.0.0 so LAN/preview hosts can reach it
    port: Number(process.env.PORT) || 5173,
    strictPort: false,
    // Allow any host — the dev server is proxied through the preview host.
    allowedHosts: true,
    proxy: {
      "/api": {
        target: API_TARGET,
        changeOrigin: true,
      },
      "/ws": {
        target: API_TARGET,
        ws: true,
        changeOrigin: true,
      },
      // Django admin & uploaded media, handy while developing.
      "/admin": { target: API_TARGET, changeOrigin: true },
      "/media": { target: API_TARGET, changeOrigin: true },
      "/static": { target: API_TARGET, changeOrigin: true },
    },
  },

  preview: {
    host: true,
    port: Number(process.env.PORT) || 4173,
    allowedHosts: true,
  },

  build: {
    // Production builds ship without source maps (smaller + no source leak).
    sourcemap: command === "serve",
    target: "es2020",
    cssCodeSplit: true,
    // Keep the warning threshold realistic now that routes are split out.
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        /**
         * Split rarely-changing vendor code into its own chunk so browsers can
         * cache it across app deploys.
         */
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;

          if (id.includes("framer-motion")) return "vendor-motion";
          if (id.includes("react-router")) return "vendor-router";
          if (id.includes("react-dom") || id.includes("/react/")) {
            return "vendor-react";
          }
          if (id.includes("lucide-react") || id.includes("react-icons")) {
            return "vendor-icons";
          }
          if (id.includes("axios")) return "vendor-axios";
          return "vendor";
        },
      },
    },
  },
}));
