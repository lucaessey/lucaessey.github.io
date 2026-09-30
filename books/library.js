// Preserve existing links into the comic now that /books/ is the bookshelf.
const previousChapters = new Set(['cover','comic','transcript','flummoxprap','visitors','nerps','plan','japan','elevator','house','machine','gorfs','away','waiting']);
const hash = location.hash.slice(1);
if (hash === 'game') location.replace('./game.html');
else if (previousChapters.has(hash) || /^panel-\d+$/.test(hash)) location.replace(`./yips.html${location.hash}`);

try {
  const savedYips = JSON.parse(localStorage.getItem('yips-nerps:reading:v1')) || JSON.parse(localStorage.getItem('from-yips-to-nerps-reading-v1'));
  const number = savedYips?.number ?? savedYips?.panel;
  if (Number.isInteger(number) && number >= 1 && number <= 64) {
    const link = document.querySelector('#resume-yips');
    link.href = `./yips.html#panel-${number}`;
    link.textContent = `Continue the comic · panel ${number} →`;
    link.hidden = false;
  }
  const savedBook = JSON.parse(localStorage.getItem('bazooka:reading:v1'));
  if (Number.isInteger(savedBook?.paragraph) && savedBook.paragraph > 0 && savedBook.paragraph < 1000) {
    const link = document.querySelector('#resume-bazooka');
    link.href = `./bazooka.html#reading-p-${savedBook.paragraph}`;
    link.hidden = false;
  }
} catch { /* Both stories remain available if device storage is disabled. */ }
