import { readFile, writeFile, mkdir, cp, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'dist');
const config = JSON.parse(await readFile(path.join(root, 'projects.json'), 'utf8'));
const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
if (!/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,38})$/.test(config.githubUsername)) throw Error('Invalid GitHub username');
if (!/^(?:[a-z0-9-]+\.)+[a-z]{2,}$/.test(config.domain)) throw Error('Domain must be a hostname without a protocol or path');
// GitHub provides the active Pages URL, including the custom domain once configured.
const siteUrl = new URL(process.env.SITE_URL || `https://${config.domain}/`);
if (siteUrl.protocol !== 'https:' || siteUrl.username || siteUrl.password || siteUrl.port ||
    siteUrl.pathname !== '/' || siteUrl.search || siteUrl.hash) {
  throw Error('SITE_URL must be an HTTPS root-site URL without credentials, a port, or a path');
}
if (!Array.isArray(config.projects)) throw Error('projects must be an array');
if (!Array.isArray(config.preserveDirectories)) throw Error('preserveDirectories must be an array');
for (const directory of config.preserveDirectories) {
  if (!/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/.test(directory) || ['src','scripts','assets','dist','docs'].includes(directory)) {
    throw Error(`Invalid preserved directory: ${directory}`);
  }
  // Fail closed: a deployment must never silently erase an existing hosted app.
  await access(path.join(root, directory, 'index.html'));
}
const seen = new Set();
for (const item of config.projects) {
  if (!/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/.test(item.slug)) throw Error(`Invalid slug: ${item.slug}`);
  if (seen.has(item.slug)) throw Error(`Duplicate slug: ${item.slug}`);
  seen.add(item.slug);
  if (!['game', 'project'].includes(item.type)) throw Error(`Invalid type: ${item.type}`);
  if (!['word', 'snake', 'cards', 'neutral', 'orange', 'blue', 'neon', 'gold'].includes(item.theme)) throw Error(`Invalid theme: ${item.theme}`);
  for (const field of ['title', 'description', 'genre', 'imageAlt', 'note']) {
    if (typeof item[field] !== 'string' || !item[field].trim()) throw Error(`Missing ${field} for ${item.slug}`);
  }
  if (!/^[a-zA-Z0-9_-]+\.(?:webp|png|jpg|jpeg|svg)$/.test(item.image)) throw Error(`Invalid image: ${item.image}`);
  await access(path.join(root, 'assets', item.image));
}
const cards = config.projects.map(item => {
  const href = `/${item.slug}/`;
  const cta = item.type === 'game' ? 'Play now' : 'Explore';
  return `<article class="game-card theme-${item.theme}" data-type="${item.type}">
    <a class="game-art" href="${href}" tabindex="-1" aria-hidden="true"><img src="/assets/${item.image}" alt="${escape(item.imageAlt)}" width="800" height="500" loading="lazy"><span class="genre">${escape(item.genre)}</span></a>
    <div class="game-info"><h3 class="game-title"><a href="${href}">${escape(item.title)}</a></h3><p class="game-description">${escape(item.description)}</p>
    <div class="card-bottom"><span class="game-note">${escape(item.note)}</span><a class="play-link" href="${href}" aria-label="${cta}: ${escape(item.title)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 4 14 8-14 8z"/></svg>${cta}</a></div></div>
  </article>`;
}).join('\n');
const template = await readFile(path.join(root, 'src', 'index.html'), 'utf8');
const values = {DOMAIN:siteUrl.hostname, USERNAME:config.githubUsername, TOTAL:config.projects.length,
  GAMES:config.projects.filter(p => p.type === 'game').length, PROJECTS:config.projects.filter(p => p.type === 'project').length,
  COUNT_LABEL:`${config.projects.length} creation${config.projects.length === 1 ? '' : 's'} to explore`, CARDS:cards};
const html = template.replace(/\{\{([A-Z_]+)\}\}/g, (_, key) => {
  if (!(key in values)) throw Error(`Unknown template token: ${key}`);
  return values[key];
});
await mkdir(output, {recursive:true});
for (const directory of config.preserveDirectories) {
  await cp(path.join(root, directory), path.join(output, directory), {recursive:true});
}
await cp(path.join(root, 'assets'), path.join(output, 'assets'), {recursive:true});
for (const name of ['styles.css', 'app.js']) await cp(path.join(root, 'src', name), path.join(output, name));
await writeFile(path.join(output, 'index.html'), html);
await writeFile(path.join(output, 'CNAME'), config.domain + '\n');
await writeFile(path.join(output, '.nojekyll'), '');
await writeFile(path.join(output, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${siteUrl.origin}/sitemap.xml\n`);
await writeFile(path.join(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${siteUrl.origin}/</loc></url></urlset>\n`);
await writeFile(path.join(output, '404.html'), `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Page not found — Deep Fried Pixels</title><link rel="icon" href="/assets/favicon.svg"><link rel="stylesheet" href="/styles.css"></head><body><main class="wrap not-found"><p class="eyebrow">404 · Off the menu</p><h1>THIS ONE'S<br><span>NOT IN THE FRYER.</span></h1><p>That page may have moved, or the address isn't quite right. Head back to the collection and pick something good.</p><a class="button button-primary" href="/#collection">Back to the collection</a></main></body></html>`);
console.log(`Built ${config.projects.length} project cards and preserved ${config.preserveDirectories.length} existing app directories in dist/ for ${siteUrl.origin}/`);
