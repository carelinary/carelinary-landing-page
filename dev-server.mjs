import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GET, POST } from './api/interest.mjs';

const root = resolve(fileURLToPath(new URL('.', import.meta.url)));
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.mp4': 'video/mp4' };
createServer(async (req, res) => {
  try {
    const path = new URL(req.url, 'http://localhost').pathname;
    if (path === '/api/interest') {
      let response;
      if (req.method === 'GET') response = GET();
      else if (req.method === 'POST') {
        const base = `http://${req.headers.host || 'localhost:5500'}`;
        const chunks = [];
        for await (const chunk of req) chunks.push(chunk);
        response = await POST(new Request(`${base}/api/interest`, {
          method: 'POST', headers: { 'content-type': req.headers['content-type'] || '', origin: req.headers.origin || base },
          body: Buffer.concat(chunks)
        }));
      } else response = new Response('', { status: 405 });
      res.writeHead(response.status, Object.fromEntries(response.headers));
      res.end(Buffer.from(await response.arrayBuffer()));
      return;
    }
    const filename = resolve(root, '.' + (path === '/' ? '/index.html' : path));
    if (!filename.startsWith(root + sep) && filename !== resolve(root, 'index.html')) throw new Error('Invalid path');
    const content = await readFile(filename);
    res.writeHead(200, { 'Content-Type': mime[extname(filename)] || 'application/octet-stream' });
    res.end(content);
  } catch { res.writeHead(404); res.end('Not found'); }
}).listen(5500, '127.0.0.1', () => console.log('Preview: http://127.0.0.1:5500'));
