import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const root = join(process.cwd(), 'dist');
const port = Number(process.env.PORT || 5173);

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
};

const server = createServer(async (request, response) => {
  const url = new URL(request.url || '/', `http://${request.headers.host}`);
  const pathname = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, '');
  const target = pathname === '/' || pathname === '/admin' ? 'index.html' : pathname.replace(/^[/\\]/, '');

  try {
    const file = await readFile(join(root, target));
    response.writeHead(200, { 'content-type': types[extname(target)] || 'application/octet-stream' });
    response.end(file);
  } catch {
    const file = await readFile(join(root, 'index.html'));
    response.writeHead(200, { 'content-type': types['.html'] });
    response.end(file);
  }
});

server.listen(port, '127.0.0.1');
