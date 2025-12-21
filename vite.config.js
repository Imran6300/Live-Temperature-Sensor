import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "./", // 🔥 REQUIRED FOR CLOUDFLARE
  plugins: [
    react(), // remove if not using React
    tailwindcss(), // <-- this is key for v4
  ],
  server: {
    allowedHosts: ["basename-cricket-succeed-amount.trycloudflare.com"],
  },
});
