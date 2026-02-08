#!/usr/bin/env bun
const PORT = Number(process.env.PORT) || 3000;
const DIST_DIR = "./dist";

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

function getMimeType(path: string): string {
  const ext = path.slice(path.lastIndexOf("."));
  return MIME_TYPES[ext] || "application/octet-stream";
}

Bun.serve({
  port: PORT,
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    let pathname = url.pathname;

    if (pathname === "/") {
      pathname = "/index.html";
    }

    const filePath = `${DIST_DIR}${pathname}`;

    try {
      const file = Bun.file(filePath);
      const exists = await file.exists();

      if (!exists) {
        const indexFile = Bun.file(`${DIST_DIR}/index.html`);
        return new Response(indexFile, {
          headers: { "Content-Type": "text/html" },
        });
      }

      return new Response(file, {
        headers: { "Content-Type": getMimeType(pathname) },
      });
    } catch {
      return new Response("Internal Server Error", { status: 500 });
    }
  },
});

console.log(`Preview server running at http://localhost:${PORT}`);
console.log("Press Ctrl+C to stop");
