import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const config = JSON.parse(await readFile(new URL('../projects.json', import.meta.url), 'utf8'));
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.xml':'application/xml','.txt':'text/plain'};
const port = Number(process.env.PORT || 4321);
const server = createServer(async (req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) {res.writeHead(405, {Allow:'GET, HEAD'});res.end();return;}
  try {
    const url = new URL(req.url, 'http://localhost');
    const pathname = decodeURIComponent(url.pathname);
    // GitHub Pages serves sibling repositories in production. For a useful local
    // preview, open their existing public sites without copying or embedding games.
    const project = config.projects.find(p => pathname === `/${p.slug}` || pathname.startsWith(`/${p.slug}/`));
    if (project && !config.preserveDirectories.includes(project.slug)) {
      const destination = new URL(`https://${config.githubUsername}.github.io`);
      destination.pathname = pathname === `/${project.slug}` ? pathname + '/' : pathname;
      destination.search = url.search;
      res.writeHead(302, {Location:destination.href});res.end();return;
    }
    let filename = path.resolve(root, '.' + pathname);
    const relative = path.relative(root, filename);
    if (relative.startsWith('..') || path.isAbsolute(relative)) {res.writeHead(403);res.end();return;}
    if ((await stat(filename).catch(() => null))?.isDirectory()) {
      if (!pathname.endsWith('/')) {res.writeHead(301, {Location:pathname + '/' + url.search});res.end();return;}
      filename = path.join(filename, 'index.html');
    }
    let body; let status = 200;
    try {body = await readFile(filename);} catch {filename = path.join(root, '404.html');body = await readFile(filename);status = 404;}
    res.writeHead(status, {'Content-Type':types[path.extname(filename)] || 'application/octet-stream', 'Cache-Control':'no-store', 'X-Content-Type-Options':'nosniff'});
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch {res.writeHead(400);res.end('Bad request');}
});
server.listen(port, '127.0.0.1', () => console.log(`Deep Fried Pixels preview: http://127.0.0.1:${port}`));
