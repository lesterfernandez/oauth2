import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: "esm",
  dts: true,
  treeshake: true,
  sourcemap: true,
  clean: true,
});
