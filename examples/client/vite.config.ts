import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    hmr: false,
  },
  plugins: [reactRouter(), tsconfigPaths()],
});
