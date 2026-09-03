import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), "src/backend/.env") });

export default defineConfig({
  envPrefix: ["VITE_", "VITE_SUPABASE_URL", "VITE_SUPABASE_PUBLISHABLE_KEY"],
  plugins: [
    tanstackStart({
      server: { entry: "backend/server" },
    }),
    viteReact(),
    tailwindcss(),
    tsConfigPaths(),
  ],
});
