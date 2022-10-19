import { buildSync } from "esbuild";

buildSync({
  entryPoints: ["./main.ts"],
  outfile: "./out/simple-http-server.js",
  sourcemap: "inline",
  bundle: true,
  minify: false,
  platform: "node",
  target: "node18",
});
