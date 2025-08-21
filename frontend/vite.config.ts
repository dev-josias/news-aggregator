import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true, // 0.0.0.0 inside container
    port: 5173,
    strictPort: true,
    hmr: { host: "localhost", port: 5173 }, // browser connects to your host
  },
  plugins: [react()],
});
