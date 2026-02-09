const args = process.argv.slice(2);
const PORT_FLAG = args.indexOf("--port");
const LISTEN_FLAG = args.indexOf("--listen");

const PORT =
  PORT_FLAG !== -1
    ? Number(args[PORT_FLAG + 1]) || 3000
    : Number(process.env.PORT) || 3000;

const HOSTNAME =
  LISTEN_FLAG !== -1 ? args[LISTEN_FLAG + 1] || "0.0.0.0" : "localhost";

const PUBLIC_DIR = "./public";

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
};

function getMimeType(path: string): string {
  const ext = path.slice(path.lastIndexOf("."));
  return MIME_TYPES[ext] || "application/octet-stream";
}

/**
 * Transpile .ts files to JS on-the-fly for dev serving.
 */
async function transpileTs(filePath: string): Promise<Response> {
  const file = Bun.file(filePath);
  const source = await file.text();
  const transpiler = new Bun.Transpiler({ loader: "ts" });
  const js = transpiler.transformSync(source);
  return new Response(js, {
    headers: { "Content-Type": "application/javascript" },
  });
}

Bun.serve({
  port: PORT,
  hostname: HOSTNAME,
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    let pathname = url.pathname;

    // Default to index.html
    if (pathname === "/") {
      pathname = "/index.html";
    }

    const filePath = `${PUBLIC_DIR}${pathname}`;

    try {
      const file = Bun.file(filePath);
      const exists = await file.exists();

      if (!exists) {
        // Try serving index.html for SPA routes
        const indexFile = Bun.file(`${PUBLIC_DIR}/index.html`);
        const indexExists = await indexFile.exists();

        if (indexExists) {
          return new Response(indexFile, {
            headers: {
              "Content-Type": "text/html",
            },
          });
        }

        return new Response("Not Found", { status: 404 });
      }

      // Transpile TypeScript on the fly for dev
      if (pathname.endsWith(".ts")) {
        return transpileTs(filePath);
      }

      return new Response(file, {
        headers: {
          "Content-Type": getMimeType(pathname),
        },
      });
    } catch {
      return new Response("Internal Server Error", { status: 500 });
    }
  },
});

console.log(`Server running at http://${HOSTNAME}:${PORT}`);
