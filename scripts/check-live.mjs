import { readFile } from 'node:fs/promises';

const config = JSON.parse(await readFile(new URL('../projects.json', import.meta.url), 'utf8'));
const origin = `https://${config.domain}`;
const apex = `https://${config.domain.replace(/^www\./, '')}`;
const endpoint = 'https://lucaessey-card-game-packs.bokke26.chatgpt.site/api/packs';
let failures = 0;
async function check(name, action) {
  try {await action();console.log(`PASS ${name}`);}
  catch (error) {failures++;console.error(`FAIL ${name}: ${error.message}`);}
}
async function page(url, expectedPath, isLanding = false) {
  const response = await fetch(url, {signal:AbortSignal.timeout(20000)});
  if (!response.ok) throw Error(`HTTP ${response.status}`);
  const final = new URL(response.url);
  if (final.origin !== origin || final.pathname !== expectedPath) throw Error(`Unexpected destination: ${response.url}`);
  if (!response.headers.get('content-type')?.includes('text/html')) throw Error('Expected an HTML page');
  const html = await response.text();
  if (isLanding && !html.includes('id="collection-title"')) throw Error('Landing page content not found');
  if (!isLanding && html.includes('id="collection-title"')) throw Error('Received the landing page instead of the game');
}
await check('Landing page and HTTPS', () => page(`${origin}/`, '/', true));
await check('Bare domain redirects to www', () => page(`${apex}/`, '/', true));
for (const project of config.projects) await check(`${project.title} direct path`, () => page(`${origin}/${project.slug}/`, `/${project.slug}/`));
await check('Card service permits the new origin', async () => {
  const response = await fetch(endpoint, {method:'OPTIONS', signal:AbortSignal.timeout(20000), headers:{
    Origin:origin, 'Access-Control-Request-Method':'POST', 'Access-Control-Request-Headers':'content-type'
  }});
  if (response.status !== 204 || response.headers.get('access-control-allow-origin') !== origin ||
      !response.headers.get('access-control-allow-methods')?.includes('POST') ||
      !response.headers.get('access-control-allow-headers')?.toLowerCase().includes('content-type')) {
    throw Error(`HTTP ${response.status}; expected a successful CORS preflight for ${origin}`);
  }
});
console.log(failures ? `${failures} check(s) need attention. See README.md for setup details.` : 'Routing checks passed. Complete the browser/gameplay launch checklist too.');
process.exitCode = failures ? 1 : 0;
