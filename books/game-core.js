export const levels = [
  { name: 'Very easy', moves: 3, duration: 1200, pause: 340 },
  { name: 'Easy', moves: 5, duration: 960, pause: 260 },
  { name: 'Medium', moves: 7, duration: 720, pause: 170 },
  { name: 'Hard', moves: 10, duration: 500, pause: 120 },
  { name: 'Very hard', moves: 13, duration: 360, pause: 90 }
];

// A position maps a persistent rock identity to its current visible slot.
// Every visual motion and every answer is derived from the same permutation.
export function planRound(level, random = Math.random) {
  const config = levels[level];
  if (!config) throw new RangeError('Unknown level');
  const target = Math.floor(random() * 3);
  let positions = [0,1,2];
  const steps = [];
  let lastPair = '';
  for (let i=0;i<config.moves;i++) {
    const next = [...positions];
    if (level >= 3 && random() < (level === 4 ? .5 : .3)) {
      const direction = random() < .5 ? 1 : 2;
      for (let id=0;id<3;id++) next[id]=(positions[id]+direction)%3;
      lastPair='';
    } else {
      const pairs = level === 0 ? [[0,1],[1,2]] : [[0,1],[1,2],[0,2]];
      const choices = pairs.filter(pair => pair.join('') !== lastPair);
      const [a,b] = choices[Math.floor(random()*choices.length)];
      const ia=positions.indexOf(a),ib=positions.indexOf(b);
      next[ia]=b; next[ib]=a; lastPair=[a,b].join('');
    }
    steps.push({from:[...positions],to:next});
    positions=next;
  }
  return { target, steps, final:[...positions], targetSlot:positions[target] };
}
