import {LEVELS,DIRECTIONS,createGame,start,pause,tick,tile,guards,inSight,seen} from './game-engine.js';
const $=id=>document.getElementById(id),canvas=$('farm'),ctx=canvas.getContext('2d');
const board=$('board-wrap'),primary=$('primary'),pauseButton=$('pause'),sound=$('sound'),gentle=$('gentle');
const sprites=new Image();sprites.src='./assets/art/game-sprites.webp';
const crops={farmer:[75,20,350,515],devil:[610,0,325,538],hay:[1028,65,507,445],crate:[40,545,425,460],gate:[520,597,500,370]};
const keys={ArrowUp:'up',w:'up',W:'up',ArrowRight:'right',d:'right',D:'right',ArrowDown:'down',s:'down',S:'down',ArrowLeft:'left',a:'left',A:'left'};
let state=createGame(),held=[],pointerDirection=null,last=0,scareUntil=0,lastPhase='',lastAnnouncement='',audioContext=null,activeSounds=new Set(),loaded=false;
gentle.checked=matchMedia('(prefers-reduced-motion: reduce)').matches;
function announce(text){if(lastAnnouncement!==text){$('announcement').textContent=text;lastAnnouncement=text;}}
function clearInput(){held=[];pointerDirection=null;}
function inputStep(direction){const moves=state.moves;tick(state,1,direction);if(state.moves!==moves)tone('step');updateUI();render();}
function silence(){for(const oscillator of activeSounds){try{oscillator.stop();}catch{}}activeSounds.clear();}
function tone(type){
  if(!sound.checked||!audioContext||audioContext.state!=='running')return;
  const now=audioContext.currentTime,osc=audioContext.createOscillator(),gain=audioContext.createGain();
  const fail=type==='caught',step=type==='step';
  osc.type=step?'sine':fail?'sawtooth':'triangle';
  osc.frequency.setValueAtTime(step?95:fail?180:620,now);osc.frequency.exponentialRampToValueAtTime(step?45:fail?38:400,now+(fail?.55:.14));
  gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(step?.018:fail?.07:.045,now+.015);gain.gain.exponentialRampToValueAtTime(.0001,now+(fail?.65:.18));
  osc.connect(gain);gain.connect(audioContext.destination);activeSounds.add(osc);osc.onended=()=>{activeSounds.delete(osc);osc.disconnect();gain.disconnect();};osc.start(now);osc.stop(now+(fail?.7:.2));
}
sound.addEventListener('change',async()=>{
  $('sound-label').textContent=sound.checked?'on':'off';
  if(!sound.checked){silence();return;}
  try{audioContext??=new (window.AudioContext||window.webkitAudioContext)();await audioContext.resume();tone('ready');}
  catch{sound.checked=false;$('sound-label').textContent='unavailable';announce('Audio is unavailable. You can play silently.');}
});
gentle.addEventListener('change',()=>{board.classList.toggle('gentle',gentle.checked);});
board.classList.toggle('gentle',gentle.checked);
function reset(level=0){clearInput();silence();state=createGame(level);scareUntil=0;$('scare').hidden=true;lastPhase='';render();updateUI();primary.focus({preventScroll:true});}
function togglePause(){
  if(state.phase==='playing'){pause(state);clearInput();silence();}
  else if(state.phase==='paused'){start(state);last=performance.now();canvas.focus({preventScroll:true});}
  updateUI();
}
pauseButton.addEventListener('click',togglePause);
$('restart').addEventListener('click',()=>reset());
primary.addEventListener('click',()=>{
  if(!loaded)return;
  if(state.phase==='caught')state=createGame(state.level);
  else if(state.phase==='cleared')state=createGame(state.level+1);
  else if(state.phase==='won')state=createGame();
  clearInput();start(state);last=performance.now();scareUntil=0;$('scare').hidden=true;
  canvas.focus({preventScroll:true});updateUI();
});
function editingTarget(target){return target.closest('input,select,textarea,a');}
document.addEventListener('keydown',event=>{
  if(editingTarget(event.target))return;
  if(['p','P','Escape'].includes(event.key)&&['playing','paused'].includes(state.phase)){event.preventDefault();if(!event.repeat)togglePause();return;}
  const direction=keys[event.key];if(!direction||state.phase!=='playing')return;
  event.preventDefault();if(!held.includes(event.key)){held.push(event.key);inputStep(direction);}
});
document.addEventListener('keyup',event=>{held=held.filter(key=>key!==event.key);});
document.querySelectorAll('[data-direction]').forEach(button=>{
  button.addEventListener('pointerdown',event=>{event.preventDefault();if(state.phase!=='playing')return;pointerDirection=button.dataset.direction;button.setPointerCapture(event.pointerId);inputStep(pointerDirection);});
  const release=()=>{if(pointerDirection===button.dataset.direction)pointerDirection=null;};
  button.addEventListener('pointerup',release);button.addEventListener('pointercancel',release);button.addEventListener('lostpointercapture',release);
  // Keyboard and assistive-technology activation gets one deliberate step.
  button.addEventListener('click',event=>{if(event.detail===0&&state.phase==='playing')inputStep(button.dataset.direction);});
});
function backgroundPause(){if(state.phase==='playing'){pause(state);clearInput();silence();updateUI();}}
document.addEventListener('visibilitychange',()=>{if(document.hidden)backgroundPause();});
window.addEventListener('blur',backgroundPause);
function overlay(kicker,title,copy,button){$('overlay-kicker').textContent=kicker;$('overlay-title').textContent=title;$('overlay-copy').textContent=copy;primary.textContent=button;}
function updateUI(){
  const level=LEVELS[state.level],phase=state.phase,changed=phase!==lastPhase,hidden=tile(state,state.player.x,state.player.y)==='H',watched=seen(state);
  $('level-number').textContent=`0${state.level+1} / 03`;$('level-name').textContent=level.name;
  $('sway').value=state.sway;$('sway').textContent=`${Math.round(state.sway)}%`;$('sway-number').textContent=`${Math.round(state.sway)}%`;
  $('sway-tip').textContent=phase==='won'?'Quiet at last.':phase==='cleared'?'A silent crossing.':state.sway>=75?'Stop. The bell is about to ring.':state.sway>=45?'Let it settle before you move.':state.sway>5?'Easy now. Short, quiet steps.':'Still hands. Silent bell.';
  $('alert').value=state.alert;$('watch-label').textContent=watched?'He can see you. Get to cover!':hidden?'Hidden in the hay':'Stay out of his sight';
  $('watch-label').parentElement.dataset.watched=watched;
  $('position').textContent=phase==='ready'?'You are the farmer with the bell.':`Row ${state.player.y+1}, column ${state.player.x+1} · ${hidden?'Hidden in hay':tile(state,state.player.x,state.player.y)==='M'?'On noisy metal':'On grass'}`;
  board.dataset.phase=phase;board.dataset.level=state.level+1;board.dataset.player=`${state.player.x},${state.player.y}`;board.dataset.sway=Math.round(state.sway);
  pauseButton.disabled=!['playing','paused'].includes(phase);pauseButton.innerHTML=phase==='paused'?'Resume <kbd>P</kbd>':'Pause <kbd>P</kbd>';
  $('overlay').hidden=phase==='playing';$('scare-note').hidden=phase!=='ready';primary.disabled=!loaded;
  if(!changed)return;
  lastPhase=phase;
  if(phase==='ready')overlay(`Area ${state.level+1} of 3 · ${level.name}`,'A quiet way out.',level.hint+' Reach the green gate at the top right.','Enter the farm');
  if(phase==='paused')overlay('Nothing moves while you’re away.','Hold your breath.','The farm is paused. Take your time, then pick up where you left off.','Resume crossing');
  if(phase==='caught'){
    clearInput();tone('caught');scareUntil=performance.now()+(gentle.checked?600:1050);$('scare').hidden=false;
    overlay('The farm heard you.',state.cause==='bell'?'You rang it.':'He found you.',state.cause==='bell'?'The bell reached 100%. Try shorter bursts, and wait for it to settle before crossing metal.':state.cause==='devil'?'You crossed his path. Hay hides you from his sight, but it cannot stop him touching you.':'You stayed in his sight too long. Watch the red tiles and use crates or hay for cover.','Try this area again');
  }
  if(phase==='cleared'){clearInput();tone('ready');overlay(`Area ${state.level+1} crossed`,'Still silent.',`You made it through ${level.name.toLowerCase()}. Ahead: ${LEVELS[state.level+1].name.toLowerCase()}.`,'Continue to the next area');}
  if(phase==='won'){clearInput();tone('ready');overlay('All three areas crossed','Through the gate.','You made it out without a ring. For now, the farm is quiet.','Play again');}
  if(phase==='playing'){announce(`Area ${state.level+1}: ${level.name}. ${level.hint}`);}
  else{announce($('overlay-title').textContent+' '+$('overlay-copy').textContent);if(loaded)primary.focus({preventScroll:true});}
}
function sprite(name,x,y,w,h){if(!loaded)return;const crop=crops[name];ctx.drawImage(sprites,...crop,x,y,w,h);}
function render(){
  const cell=72,level=LEVELS[state.level],patrols=guards(state);ctx.clearRect(0,0,792,648);
  level.map.forEach((row,y)=>[...row].forEach((ground,x)=>{
    const px=x*cell,py=y*cell;ctx.fillStyle=ground==='#'?'#202b20':(x+y)%2?'#344532':'#394b36';ctx.fillRect(px,py,cell,cell);
    if(ground!== '#'){
      ctx.strokeStyle='#74895a1f';ctx.lineWidth=1;ctx.strokeRect(px+.5,py+.5,cell-1,cell-1);
      ctx.strokeStyle='#91a56c20';for(let n=0;n<3;n++){const gx=px+12+((x*13+y*7+n*19)%50),gy=py+12+((y*17+x*7+n*11)%48);ctx.beginPath();ctx.moveTo(gx,gy);ctx.lineTo(gx+2,gy-5);ctx.stroke();}
    }
    if(ground==='M'){ctx.fillStyle='#637979';ctx.fillRect(px+5,py+5,cell-10,cell-10);ctx.strokeStyle='#aec0b3';ctx.lineWidth=2;for(let n=12;n<65;n+=13){ctx.beginPath();ctx.moveTo(px+n,py+11);ctx.lineTo(px+n-5,py+60);ctx.stroke();}ctx.fillStyle='#253c37';for(const a of [10,62])for(const b of [10,62]){ctx.beginPath();ctx.arc(px+a,py+b,2,0,7);ctx.fill();}}
    if(ground==='H'){ctx.fillStyle='#7f773d';ctx.fillRect(px+3,py+3,cell-6,cell-6);sprite('hay',px+3,py+5,cell-6,cell-10);}
    if(ground==='G'){ctx.fillStyle='#95bb76';ctx.fillRect(px+2,py+2,cell-4,cell-4);sprite('gate',px+3,py+19,cell-6,cell*.7);ctx.fillStyle='#102a1b';ctx.textAlign='center';ctx.font='bold 12px sans-serif';ctx.fillText('EXIT',px+cell/2,py+16);}
    if(ground==='#')sprite('crate',px+3,py+3,cell-6,cell-6);
  }));
  level.map.forEach((row,y)=>[...row].forEach((ground,x)=>{
    if(ground==='#'||ground==='H'||!patrols.some(g=>inSight(state,g,x,y)))return;
    ctx.fillStyle='#e5543f55';ctx.fillRect(x*cell+2,y*cell+2,cell-4,cell-4);ctx.strokeStyle='#ed91796b';ctx.lineWidth=1;ctx.strokeRect(x*cell+3,y*cell+3,cell-6,cell-6);
  }));
  const characters=[...patrols.map(g=>({...g,type:'devil'})),{...state.player,type:'farmer'}].sort((a,b)=>a.y-b.y);
  characters.forEach(character=>{
    const px=character.x*cell,py=character.y*cell,farmer=character.type==='farmer',hidden=farmer&&tile(state,character.x,character.y)==='H';
    ctx.fillStyle=farmer?'#c9e5a844':'#fc694b44';ctx.beginPath();ctx.ellipse(px+36,py+52,25,13,0,0,Math.PI*2);ctx.fill();
    if(!farmer){ctx.fillStyle='#ffb396';const cx=px+36+character.dx*27,cy=py+36+character.dy*27;ctx.beginPath();ctx.moveTo(cx+character.dx*7,cy+character.dy*7);ctx.lineTo(cx-character.dy*5-character.dx*4,cy+character.dx*5-character.dy*4);ctx.lineTo(cx+character.dy*5-character.dx*4,cy-character.dx*5-character.dy*4);ctx.fill();}
    ctx.globalAlpha=hidden?.58:1;sprite(character.type,px+11,py-12,50,77);ctx.globalAlpha=1;
    if(farmer){ctx.strokeStyle=hidden?'#eed69b':'#dbf2b3';ctx.lineWidth=2;ctx.strokeRect(px+8,py+8,56,56);ctx.fillStyle='#d9edbd';ctx.font='bold 10px sans-serif';ctx.textAlign='center';ctx.fillText(hidden?'HIDDEN':'YOU',px+36,py+cell-3);}
  });
  // Fixed position marker and meter carry information even when sound is off.
  if(state.sway>=75&&state.phase==='playing'){ctx.strokeStyle='#f3b84d';ctx.lineWidth=6;ctx.strokeRect(3,3,786,642);}
}
let lastUI=0;
function frame(now){
  const beforeMoves=state.moves,beforePhase=state.phase;
  if(last&&state.phase==='playing')tick(state,Math.min(80,now-last),pointerDirection||keys[held.at(-1)]||null);
  last=now;
  if(state.moves!==beforeMoves)tone('step');
  if(beforePhase!==state.phase||now-lastUI>70){updateUI();lastUI=now;}
  if(scareUntil&&now>=scareUntil){$('scare').hidden=true;scareUntil=0;primary.focus({preventScroll:true});}
  render();requestAnimationFrame(frame);
}
try{await sprites.decode();loaded=true;primary.disabled=false;lastPhase='';updateUI();render();requestAnimationFrame(frame);}
catch{overlay('The farm couldn’t load.','One more try.','The game artwork did not load. Reload this page to try again.','Reload the game');primary.disabled=false;primary.addEventListener('click',()=>location.reload(),{once:true});}
