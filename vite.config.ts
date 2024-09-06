import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import tsconfigPaths from 'vite-tsconfig-paths';
import { cwd } from "process";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      "@": path.resolve(cwd(), "./src"),
      '@components': path.resolve(cwd(), 'src/components'),

    },
  },
})
