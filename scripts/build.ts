#!/usr/bin/env bun
import { cpSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { build } from "bun";

const DIST_DIR = "./dist";
const PUBLIC_DIR = "./public";

console.log("Building Octo website...");

// Create dist directory
if (!existsSync(DIST_DIR)) {
  mkdirSync(DIST_DIR, { recursive: true });
}

// Copy static assets
console.log("Copying static assets...");
if (existsSync(PUBLIC_DIR)) {
  cpSync(PUBLIC_DIR, DIST_DIR, { recursive: true, force: true });
}

// Build TypeScript files
console.log("Building TypeScript...");
const tsFiles = ["./public/scripts/main.ts"];

for (const file of tsFiles) {
  if (!existsSync(file)) {
    continue;
  }

  const result = await build({
    entrypoints: [file],
    outdir: join(DIST_DIR, "scripts"),
    minify: true,
    target: "browser",
  });

  if (result.success) {
    console.log(`  ✓ Built ${file}`);
  } else {
    console.error(`  ✗ Failed to build ${file}`);
    process.exit(1);
  }
}

console.log("\nBuild complete! Output in ./dist");
