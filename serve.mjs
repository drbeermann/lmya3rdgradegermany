#!/usr/bin/env node
// Tiny static dev server for dist/ (no dependencies). `node serve.mjs [port]`
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist');
const PORT = Number(process.argv[2] || process.env.PORT || 4173);
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json', '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.pdf': 'application/pdf', '.ics': 'text/calendar', '.txt': 'text/plain', '.woff2': 'font/woff2',
};

http
  .createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://x');
      let p = decodeURIComponent(url.pathname);
      if (p.endsWith('/')) p += 'index.html';
      let file = path.normalize(path.join(ROOT, p));
      if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
      let data;
      try {
        data = await fs.readFile(file);
      } catch {
        // allow /weeks/1 → /weeks/1/index.html
        try {
          data = await fs.readFile(path.join(file, 'index.html'));
          file = path.join(file, 'index.html');
        } catch {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          return res.end('Not found: ' + p);
        }
      }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      res.end(data);
    } catch (e) {
      res.writeHead(500);
      res.end(String(e));
    }
  })
  .listen(PORT, () => console.log(`Serving dist/ at http://localhost:${PORT}/`));
