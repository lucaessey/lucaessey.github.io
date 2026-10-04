import { writeFile } from 'node:fs/promises';

const endpoint = 'https://lucaessey-card-game-packs.bokke26.chatgpt.site/api/packs';
const allowed = ['https://lucaessey.github.io', 'https://www.deepfriedpixels.com', 'https://deepfriedpixels.com'];
const rejected = ['https://unrelated.example', 'https://www.deepfriedpixels.com.evil.example', 'http://www.deepfriedpixels.com'];
const results = [];
for (const origin of [...allowed, ...rejected]) {
  const response = await fetch(endpoint, {method:'OPTIONS', signal:AbortSignal.timeout(20000), headers:{
    Origin:origin, 'Access-Control-Request-Method':'POST', 'Access-Control-Request-Headers':'content-type'
  }});
  const expected = allowed.includes(origin) ? 204 : 403;
  const allowOrigin = response.headers.get('access-control-allow-origin');
  const allowMethods = response.headers.get('access-control-allow-methods');
  const allowHeaders = response.headers.get('access-control-allow-headers');
  const passed = response.status === expected && (expected === 204
    ? allowOrigin === origin && allowMethods === 'POST' && allowHeaders?.toLowerCase() === 'content-type'
    : allowOrigin === null);
  results.push({method:'OPTIONS',origin,status:response.status,allowOrigin,allowMethods,allowHeaders,passed});
}
// Deliberately invalid bodies exercise actual POST response headers without
// entering receipt creation or spending any player's coins.
for (const origin of allowed) {
  const response = await fetch(endpoint, {method:'POST', signal:AbortSignal.timeout(20000),headers:{Origin:origin,'Content-Type':'application/json'},body:'{}'});
  const body = await response.json();
  results.push({method:'POST (invalid request, no receipt)',origin,status:response.status,body,passed:response.status===400 && body.error==='invalid-request' && response.headers.get('access-control-allow-origin')===origin});
}
const healthResponse = await fetch(new URL('/health',endpoint), {signal:AbortSignal.timeout(20000)});
const health = await healthResponse.json();
results.push({method:'GET /health',status:healthResponse.status,body:health,passed:healthResponse.status===200 && health.status==='ready'});
const report = {checkedAt:new Date().toISOString(),endpoint,passed:results.every(result=>result.passed),results};
if (process.argv[2]) await writeFile(process.argv[2],JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
process.exitCode = report.passed ? 0 : 1;
