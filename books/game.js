import {LEVELS,START_SLOTS,applySwap,planShuffles,rockAtSlot} from './game-engine.js';
const $=s=>document.querySelector(s);
const stage=$('#rock-stage'), rocks=[...document.querySelectorAll('.rock')], yip=$('#game-yip');
const start=$('#game-start'), restart=$('#game-restart'), status=$('#game-status'), slow=$('#slow-mode');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let level=0, slots=START_SLOTS.slice(), target=0, phase='ready', runId=0, won=false;
const left=slot=>6+slot*31;
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const setStatus=text=>status.textContent=text;
const activeAnimations=new Set();
async function animate(element, frames, options){
  const animation=element.animate(frames,options); activeAnimations.add(animation);
  try{await animation.finished;}catch{}finally{activeAnimations.delete(animation);}
}
function setRocksEnabled(enabled){rocks.forEach(r=>r.disabled=!enabled);}
function updateSlots(){
  const names=['left','middle','right'];
  rocks.forEach((r,id)=>{r.style.left=`${left(slots[id])}%`;r.style.transform='';r.setAttribute('aria-label',`Choose the ${names[slots[id]]} rock (${slots[id]+1})`);r.style.zIndex='3';});
  // Keyboard Tab visits rocks in visual left-to-right order after every shuffle.
  [...rocks].sort((a,b)=>slots[Number(a.dataset.rock)]-slots[Number(b.dataset.rock)]).forEach(r=>stage.append(r));
}
function updateLevel(){
  $('#level-name').textContent=`Level ${level+1} · ${LEVELS[level].name}`;
  document.querySelectorAll('.level-dots li').forEach((li,i)=>{li.classList.toggle('complete',i<level||(phase==='complete'));li.removeAttribute('aria-current');if(i===level&&phase!=='complete')li.setAttribute('aria-current','step');});
}
function reset(){
  runId++;activeAnimations.forEach(a=>a.cancel());activeAnimations.clear();
  level=0;slots=START_SLOTS.slice();target=0;phase='ready';won=false;
  yip.style.opacity='0';yip.style.transform='';stage.classList.remove('celebrate');
  rocks.forEach(r=>r.classList.remove('correct','wrong'));setRocksEnabled(false);updateSlots();updateLevel();
  start.disabled=false;start.textContent='Start level 1';slow.disabled=false;
  setStatus('Watch the Yip enter a rock. Follow it through the shuffle.');
}
async function run(){
  if(phase==='hiding'||phase==='shuffling'||phase==='choosing')return;
  if(phase==='complete'){reset();}
  if(won){level++;won=false;}
  const token=++runId;phase='hiding';setRocksEnabled(false);start.disabled=true;slow.disabled=true;
  stage.classList.remove('celebrate');rocks.forEach(r=>r.classList.remove('correct','wrong'));
  slots=START_SLOTS.slice();updateSlots();updateLevel();target=Math.floor(Math.random()*3);
  const targetSlot=slots[target];
  yip.style.left=`${left(targetSlot)+5}%`;yip.style.opacity='1';yip.style.transform='translateY(0)';
  setStatus(`Watch carefully. The Yip is entering rock ${targetSlot+1}.`);
  rocks[target].style.transform='translateY(-35px)';
  await wait(1100);if(token!==runId)return;
  await animate(yip,[{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(25px)'}],{duration:reduced.matches?200:500,easing:'ease-in',fill:'forwards'});
  if(token!==runId)return;yip.style.opacity='0';yip.style.transform='';yip.getAnimations().forEach(a=>a.cancel());
  rocks[target].style.transform='';await wait(450);if(token!==runId)return;
  phase='shuffling';setStatus('Follow the rock. Wait until the shuffle stops.');
  const factor=slow.checked?1.8:1, settings=LEVELS[level];
  for(const [a,b] of planShuffles(level)){
    if(token!==runId)return;
    // The chosen pair is a pair of rock IDs, not position labels.
    const next=applySwap(slots,a,b), dx=(left(next[a])-left(slots[a]))/100*stage.clientWidth;
    const arc=reduced.matches?0:Math.min(42,stage.clientHeight*.14);
    rocks[a].style.zIndex='5';rocks[b].style.zIndex='2';
    await Promise.all([
      animate(rocks[a],[{transform:'translate(0,0)'},{transform:`translate(${dx/2}px,${-arc}px)`,offset:.5},{transform:`translate(${dx}px,0)`}],{duration:settings.duration*factor,easing:'ease-in-out',fill:'forwards'}),
      animate(rocks[b],[{transform:'translate(0,0)'},{transform:`translate(${-dx/2}px,${arc}px)`,offset:.5},{transform:`translate(${-dx}px,0)`}],{duration:settings.duration*factor,easing:'ease-in-out',fill:'forwards'})
    ]);
    if(token!==runId)return;
    slots=next;rocks.forEach(r=>r.getAnimations().forEach(a=>a.cancel()));updateSlots();
    await wait(settings.pause*factor);
  }
  if(token!==runId)return;phase='choosing';setRocksEnabled(true);
  setStatus('Where is the Yip? Choose a rock: 1, 2, or 3.');
  rocks[rockAtSlot(slots,0)].focus({preventScroll:true});
}
function choose(id){
  if(phase!=='choosing')return;
  phase='result';setRocksEnabled(false);slow.disabled=false;
  rocks[target].classList.add('correct');rocks[target].style.transform='translateY(-35px)';
  yip.style.left=`${left(slots[target])+5}%`;yip.style.opacity='1';
  if(id===target){
    if(level===4){phase='complete';stage.classList.add('celebrate');start.textContent='Play again';setStatus('Yip! All five levels complete. You are a master rock watcher!');updateLevel();}
    else{won=true;start.textContent=`Play level ${level+2}`;setStatus(`Yip! You found the Yip. Level ${level+1} complete.`);}
  }else{rocks[id].classList.add('wrong');start.textContent=`Retry level ${level+1}`;setStatus(`Nerp! The Yip was under rock ${slots[target]+1}. Try this level again.`);}
  start.disabled=false;start.focus({preventScroll:true});
}
rocks.forEach(r=>r.addEventListener('click',()=>choose(Number(r.dataset.rock))));
start.addEventListener('click',run);restart.addEventListener('click',()=>{reset();start.focus({preventScroll:true});});
document.addEventListener('keydown',event=>{
  if(phase!=='choosing'||!['1','2','3'].includes(event.key)||event.altKey||event.ctrlKey||event.metaKey)return;
  if(/INPUT|SELECT|TEXTAREA/.test(event.target.tagName)||event.target.isContentEditable||document.querySelector('dialog[open]'))return;
  const bounds=stage.getBoundingClientRect();if(bounds.bottom<0||bounds.top>innerHeight)return;
  event.preventDefault();choose(rockAtSlot(slots,Number(event.key)-1));
});
function motion(){ $('#motion-note').hidden=!reduced.matches; }
reduced.addEventListener('change',motion);motion();reset();
document.addEventListener('visibilitychange',()=>{
  if(!document.hidden||!['hiding','shuffling'].includes(phase))return;
  runId++;activeAnimations.forEach(a=>a.cancel());rocks.forEach(r=>r.getAnimations().forEach(a=>a.cancel()));
  phase='ready';yip.style.opacity='0';slots=START_SLOTS.slice();updateSlots();setRocksEnabled(false);
  start.disabled=false;slow.disabled=false;start.textContent=`Retry level ${level+1}`;
  setStatus('You stepped away. Start this level again so you can see every move.');
});
// Resizing during a swap invalidates pixel travel distances. Restart that level fairly.
let width=stage.clientWidth;
new ResizeObserver(()=>{let next=stage.clientWidth;if(Math.abs(next-width)>5&&(phase==='hiding'||phase==='shuffling')){runId++;activeAnimations.forEach(a=>a.cancel());rocks.forEach(r=>r.getAnimations().forEach(a=>a.cancel()));phase='ready';yip.style.opacity='0';slots=START_SLOTS.slice();updateSlots();setRocksEnabled(false);start.disabled=false;slow.disabled=false;start.textContent=`Retry level ${level+1}`;setStatus('The play area changed size. Start this level again so every move is fair.');}width=next;}).observe(stage);
