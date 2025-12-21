import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false, // Set to true for production minification
  external: ["react", "react-dom"], // Don't bundle peer dependencies
  loader: {
    ".js": "jsx", // Treat .js files as JSX to handle JSX syntax
  },
  outExtension({ format }) {
    return {
      js: format === "cjs" ? ".cjs" : ".js",
    };
  },
});

