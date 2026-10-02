const status = document.querySelector('#offline-status');
const install = document.querySelector('#install-app');
const retry = document.querySelector('#retry-offline');
const help = document.querySelector('#install-help');
const updateNotice = document.querySelector('#pwa-update');
const updateButton = document.querySelector('#update-app');
const standalone = matchMedia('(display-mode: standalone)');
const appleMobile = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const restoreKey = 'lucas-books:update-position';
let installPrompt, registration, offlineReady = false, starting = false, reloading = false;

function installed() {
  install.hidden = true;
  help.hidden = true;
}
if (standalone.matches || navigator.standalone) installed();
standalone.addEventListener('change', event => { if (event.matches) installed(); });
if (appleMobile) install.textContent = 'Add to Home Screen';
addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  installPrompt = event;
  if (!standalone.matches && !navigator.standalone) install.hidden = false;
});
addEventListener('appinstalled', () => { installPrompt = null; installed(); });
install.addEventListener('click', async () => {
  if (!installPrompt) { help.open = !help.open; return; }
  const prompt = installPrompt;
  installPrompt = null;
  install.disabled = true;
  try {
    await prompt.prompt();
    const choice = await prompt.userChoice;
    if (choice.outcome === 'accepted') installed();
  } catch { help.open = true; }
  finally { install.disabled = false; }
});

function showOfflineStatus() {
  if (offlineReady) status.textContent = navigator.onLine ? 'Both stories and the game are ready to use offline.' : 'You’re offline. Both stories and the game are ready.';
}
function offlineFailure() {
  if (offlineReady) return;
  status.textContent = 'Offline saving didn’t finish. Connect to the internet and try again.';
  retry.hidden = false;
}
function askWorker(worker, type) {
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel();
    const timer = setTimeout(() => { channel.port1.close(); reject(new Error('No worker reply')); }, type === 'SAVE_OFFLINE' ? 120000 : 15000);
    channel.port1.onmessage = event => { clearTimeout(timer); channel.port1.close(); resolve(event.data); };
    worker.postMessage({type}, [channel.port2]);
  });
}
async function checkOffline() {
  const worker = navigator.serviceWorker.controller || registration?.active;
  if (!worker) return;
  try {
    let result = await askWorker(worker, 'OFFLINE_STATUS');
    if (!result.ready && navigator.onLine) result = await askWorker(worker, 'SAVE_OFFLINE');
    offlineReady = result.ready;
    if (offlineReady) { retry.hidden = true; showOfflineStatus(); }
    else offlineFailure();
  } catch { offlineFailure(); }
}
function watchUpdate() {
  updateNotice.hidden = !(registration?.waiting && navigator.serviceWorker.controller);
}
function watchInstalling(worker) {
  if (!worker) return;
  worker.addEventListener('statechange', () => {
    if (worker.state === 'installed') { watchUpdate(); void checkOffline(); }
    if (worker.state === 'activated') void checkOffline();
    if (worker.state === 'redundant') offlineFailure();
  });
}
async function registerOffline() {
  if (starting) return;
  if (!('serviceWorker' in navigator) || !isSecureContext) {
    status.textContent = 'This browser can read the stories online. Offline reading needs a supported browser.';
    return;
  }
  starting = true;
  retry.hidden = true;
  if (!offlineReady) status.textContent = 'Saving both stories and the game for offline use…';
  try {
    registration = await navigator.serviceWorker.register(new URL('./sw.js', import.meta.url), {scope:new URL('./', import.meta.url).href, updateViaCache:'none'});
    registration.addEventListener('updatefound', () => watchInstalling(registration.installing));
    watchInstalling(registration.installing);
    watchUpdate();
    await checkOffline();
  } catch { offlineFailure(); }
  finally { starting = false; }
}
function reloadKeepingPlace() {
  if (reloading) return;
  reloading = true;
  try { sessionStorage.setItem(restoreKey, JSON.stringify({url:location.href,y:scrollY})); } catch { /* Existing story bookmarks remain available. */ }
  location.reload();
}
updateButton.addEventListener('click', () => {
  if (registration?.waiting) {
    updateButton.disabled = true;
    updateButton.textContent = 'Updating…';
    registration.waiting.postMessage({type:'ACTIVATE_UPDATE'});
  } else reloadKeepingPlace();
});
let hadController = Boolean(navigator.serviceWorker?.controller);
navigator.serviceWorker?.addEventListener('controllerchange', () => {
  // First installation should never interrupt reading or a game. Only a later
  // user-approved release replacement reloads, preserving each tab's position.
  if (hadController) reloadKeepingPlace();
  else { hadController = true; watchUpdate(); void checkOffline(); }
});
retry.addEventListener('click', () => void registerOffline());
addEventListener('offline', showOfflineStatus);
addEventListener('online', () => {
  showOfflineStatus();
  if (!offlineReady) void registerOffline();
  else registration?.update().catch(() => {});
});
addEventListener('load', () => {
  try {
    const position = JSON.parse(sessionStorage.getItem(restoreKey));
    sessionStorage.removeItem(restoreKey);
    if (position?.url === location.href && Number.isFinite(position.y)) requestAnimationFrame(() => scrollTo({top:position.y,behavior:'instant'}));
  } catch { /* Storage is optional. */ }
}, {once:true});
void registerOffline();
