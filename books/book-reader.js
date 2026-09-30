const storageKey = 'bazooka:reading:v1';
const paragraphs = [...document.querySelectorAll('[data-reading-paragraph]')];
const chapters = [...document.querySelectorAll('.prose-chapter')];
const menu = document.querySelector('#book-chapters');
const chapterLinks = [...menu.querySelectorAll('a')];
const resume = document.querySelector('#continue-book');
const progress = document.querySelector('.book-progress');
let saved = 0;
function updateResume(number) {
  resume.href = `#reading-p-${number}`;
  resume.hidden = false;
}
try {
  const prior = JSON.parse(localStorage.getItem(storageKey));
  if (Number.isInteger(prior?.paragraph) && paragraphs.some(p => Number(p.dataset.readingParagraph) === prior.paragraph)) updateResume(prior.paragraph);
} catch { /* Reading never depends on device storage. */ }
menu.addEventListener('click', event => { if (event.target.closest('a')) menu.open = false; });
document.addEventListener('click', event => { if (!menu.contains(event.target)) menu.open = false; });
document.addEventListener('keydown', event => { if (event.key === 'Escape') menu.open = false; });
let ticking = false;
function update() {
  ticking = false;
  const focus = Math.min(innerHeight * .42, 340);
  let current = 0;
  for (const p of paragraphs) {
    if (p.getBoundingClientRect().top > focus) break;
    current = Number(p.dataset.readingParagraph);
  }
  if (document.querySelector('#story').getBoundingClientRect().bottom <= innerHeight) current = paragraphs.length;
  const percentage = Math.round(current / paragraphs.length * 100);
  progress.firstElementChild.style.width = `${percentage}%`;
  progress.setAttribute('aria-valuenow', percentage);
  document.querySelector('#book-percent').textContent = `${percentage}%`;
  if (current > 0 && current !== saved) {
    saved = current;
    updateResume(current);
    try { localStorage.setItem(storageKey, JSON.stringify({paragraph:current})); } catch { /* Optional. */ }
  }
  let index = 0;
  chapters.forEach((chapter,i) => { if (chapter.getBoundingClientRect().top <= focus) index = i; });
  document.querySelector('#book-current-chapter').textContent = `${String(index+1).padStart(2,'0')} · ${chapters[index].querySelector('h2').textContent}`;
  chapterLinks.forEach((link,i) => i === index ? link.setAttribute('aria-current','location') : link.removeAttribute('aria-current'));
}
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, {passive:true});
addEventListener('resize', update);
update();
