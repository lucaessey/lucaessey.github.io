const toolbar = document.querySelector('#collection-toolbar');
const buttons = [...document.querySelectorAll('[data-filter]')];
const cards = [...document.querySelectorAll('.game-card')];
const count = document.querySelector('#collection-count');
const empty = document.querySelector('#empty-state');

function filterCollection(filter) {
  let visible = 0;
  for (const card of cards) {
    card.hidden = filter !== 'all' && card.dataset.type !== filter;
    if (!card.hidden) visible++;
  }
  for (const button of buttons) {
    const selected = button.dataset.filter === filter;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  }
  const noun = filter === 'all' ? 'creation' : filter;
  count.textContent = `${visible} ${noun}${visible === 1 ? '' : 's'} to explore`;
  empty.hidden = visible !== 0;
}

if (toolbar && count && empty) {
  toolbar.hidden = false;
  for (const button of buttons) {
    button.addEventListener('click', () => filterCollection(button.dataset.filter));
  }
  document.querySelector('#show-games').addEventListener('click', () => {
    filterCollection('game');
    buttons.find(button => button.dataset.filter === 'game').focus();
  });
}
