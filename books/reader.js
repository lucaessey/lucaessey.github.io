import { chapters, panels } from './story.js';

const $ = selector => document.querySelector(selector);
const storageKey = 'yips-nerps:reading:v1';
const escape = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sheetPath = n => `./assets/art/sheet-${String(n).padStart(2, '0')}.webp`;

function artwork(panel, enlarged = false) {
  return `<div class="art-crop cell-${panel.cell}"><img src="${sheetPath(panel.sheet)}" alt="${escape(panel.alt)}" width="1448" height="1086" ${enlarged ? '' : 'loading="lazy"'} decoding="async"></div>`;
}
function lettering(panel) {
  const bubbles = (panel.speech || []).map(([who, text]) => `<span class="speech ${who.toLowerCase()}" aria-label="${escape(who)} says: ${escape(text)}">${escape(text)}</span>`).join('');
  return `${bubbles ? `<div class="speech-row lettering-${panel.number} ${panel.speech.length > 3 ? 'chorus' : ''}">${bubbles}</div>` : ''}${panel.labels ? `<div class="scene-labels labels-${panel.number}">${panel.labels.map(label => `<span>${escape(label)}</span>`).join('')}</div>` : ''}${panel.sfx ? `<span class="sound-effect" aria-label="Sound: ${escape(panel.sfx)}">${escape(panel.sfx)}</span>` : ''}`;
}

$('#chapter-links').innerHTML = chapters.map((c, i) => `<li><a href="#${c.id}"><span>${String(i + 1).padStart(2,'0')}</span>${escape(c.title)}</a></li>`).join('');
$('#comic').innerHTML = chapters.map((chapter, i) => `<section class="chapter chapter-${i+1}" id="${chapter.id}" aria-labelledby="title-${chapter.id}"><header class="chapter-heading"><span class="chapter-number" aria-hidden="true">${String(i+1).padStart(2,'0')}</span><div><p class="eyebrow">${escape(chapter.kicker)}</p><h2 id="title-${chapter.id}">${escape(chapter.title)}</h2></div></header><div class="panels">${chapter.panels.map(panel => `<figure class="panel ${panel.layout || ''} ${panel.final ? 'final-panel' : ''}" id="${panel.id}" data-number="${panel.number}"><div class="panel-picture">${artwork(panel)}${lettering(panel)}<button class="enlarge-button" type="button" data-enlarge="${panel.number}" aria-label="Enlarge artwork for panel ${panel.number}"><span aria-hidden="true">⤢</span></button></div>${panel.caption ? `<figcaption>${escape(panel.caption)}</figcaption>` : ''}<span class="panel-number" aria-hidden="true">${String(panel.number).padStart(2,'0')}</span></figure>`).join('')}</div></section>`).join('');

const transcript = chapters.map((chapter, i) => `<section><h3>${i+1}. ${escape(chapter.title)}</h3>${chapter.panels.map(panel => `<div class="transcript-panel"><h4>Panel ${panel.number}</h4><p class="transcript-art"><em>${escape(panel.alt)}</em></p>${panel.caption ? `<p>${escape(panel.caption)}</p>` : ''}${(panel.speech||[]).map(([who,text])=>`<p><strong>${escape(who)}:</strong> ${escape(text)}</p>`).join('')}${panel.labels ? `<p>Labels: ${panel.labels.map(escape).join(', ')}.</p>` : ''}${panel.sfx ? `<p>Sound: ${escape(panel.sfx)}</p>` : ''}</div>`).join('')}</section>`).join('');
$('#transcript-text').innerHTML = transcript;

let savedPanel;
try {
  savedPanel = JSON.parse(localStorage.getItem(storageKey));
  if (!savedPanel) {
    const earlier = JSON.parse(localStorage.getItem('from-yips-to-nerps-reading-v1'));
    if (Number.isInteger(earlier?.panel) && earlier.panel >= 1 && earlier.panel <= 64) savedPanel = {number:earlier.panel};
  }
} catch { /* Reading works without storage. */ }
if (Number.isInteger(savedPanel?.number) && savedPanel.number > 1 && savedPanel.number <= panels.length) {
  const link = $('#continue-reading');
  link.hidden = false;
  link.href = `#panel-${savedPanel.number}`;
  link.textContent = `Continue Reading · panel ${savedPanel.number}`;
}

$('#chapter-links').addEventListener('click', event => {
  if (event.target.closest('a')) $('#chapter-menu').open = false;
});
document.addEventListener('click', event => {
  if (!event.target.closest('#chapter-menu')) $('#chapter-menu').open = false;
});
document.addEventListener('keydown', event => { if (event.key === 'Escape') $('#chapter-menu').open = false; });

const panelElements = [...document.querySelectorAll('.panel')];
const chapterElements = [...document.querySelectorAll('.chapter')];
const progress = $('.reading-progress');
let ticking = false, lastSaved = 0;
function updateReading() {
  ticking = false;
  const focusLine = Math.min(window.innerHeight * .42, 360);
  let current = 0, rowTop = -Infinity;
  for (const panel of panelElements) {
    const top = panel.getBoundingClientRect().top;
    if (top >= focusLine) break;
    // Resume at the first panel in a desktop row so no panel is skipped.
    if (Math.abs(top - rowTop) > 5) { current = Number(panel.dataset.number); rowTop = top; }
  }
  if ($('#comic').getBoundingClientRect().bottom <= window.innerHeight) current = panels.length;
  const percent = Math.round(current / panels.length * 100);
  progress.firstElementChild.style.width = `${percent}%`;
  progress.setAttribute('aria-valuenow', String(percent));
  $('#progress-label').textContent = `${percent}%`;
  if (current > 0 && current !== lastSaved) {
    lastSaved = current;
    try { localStorage.setItem(storageKey, JSON.stringify({number:current})); } catch { /* Device storage is optional. */ }
    $('#continue-reading').hidden = false;
    $('#continue-reading').href = `#panel-${current}`;
    $('#continue-reading').textContent = `Continue Reading · panel ${current}`;
  }
  let chapterIndex = 0;
  chapterElements.forEach((el, i) => { if (el.getBoundingClientRect().top < focusLine) chapterIndex = i; });
  $('#current-chapter').textContent = `${String(chapterIndex + 1).padStart(2,'0')} · ${chapters[chapterIndex].title}`;
  document.querySelectorAll('#chapter-links a').forEach((el,i) => i===chapterIndex ? el.setAttribute('aria-current','location') : el.removeAttribute('aria-current'));
}
window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(updateReading); ticking = true; } }, {passive:true});
window.addEventListener('resize', updateReading);
updateReading();

const dialog = $('#art-dialog');
$('#comic').addEventListener('click', event => {
  const button = event.target.closest('[data-enlarge]');
  if (!button) return;
  const panel = panels[Number(button.dataset.enlarge)-1];
  $('#art-dialog-title').textContent = `Panel ${panel.number} of ${panels.length}`;
  $('#enlarged-panel').innerHTML = `<div class="panel-picture">${artwork(panel, true)}${lettering(panel)}</div>${panel.caption ? `<p class="enlarged-caption">${escape(panel.caption)}</p>` : ''}`;
  dialog.showModal();
  document.body.classList.add('modal-open');
});
$('#close-art').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if(event.target === dialog) { const r=dialog.getBoundingClientRect(); if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom) dialog.close(); } });
dialog.addEventListener('close',()=> document.body.classList.remove('modal-open'));

document.querySelector('a[href="#transcript"]').addEventListener('click',()=>$('#transcript details').open=true);
if (location.hash === '#transcript') $('#transcript details').open = true;
// Content is rendered synchronously; honor links to a chapter or saved panel.
const earlierHashes = { '#cover':'#top', '#gorfs':'#visitors', '#away':'#nerps', '#waiting':'#machine' };
if (earlierHashes[location.hash]) history.replaceState(null, '', earlierHashes[location.hash]);
if (location.hash === '#game') location.replace('./game.html');
if (location.hash) requestAnimationFrame(() => document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView());
