// Pure shuffle state. Rock identity travels with the artwork; slots never own the Yip.
export const LEVELS = [
  {name:'Very easy', swaps:3, duration:1250, pause:300},
  {name:'Easy', swaps:4, duration:1000, pause:240},
  {name:'Medium', swaps:6, duration:760, pause:180},
  {name:'Hard', swaps:8, duration:560, pause:140},
  {name:'Very hard', swaps:10, duration:420, pause:100},
];
export const START_SLOTS = [0,1,2];
export function applySwap(slots, a, b) {
  const result = slots.slice();
  [result[a],result[b]] = [result[b],result[a]];
  return result;
}
export function planShuffles(level, random = Math.random) {
  const pairs = level < 2 ? [[0,1],[1,2]] : [[0,1],[1,2],[0,2]];
  let previous = -1;
  return Array.from({length:LEVELS[level].swaps}, () => {
    let candidates = pairs.map((pair,index)=>({pair,index})).filter(p=>p.index!==previous);
    let choice = candidates[Math.floor(random()*candidates.length)];
    previous=choice.index;
    return choice.pair.slice();
  });
}
export const rockAtSlot = (slots,slot) => slots.indexOf(slot);
