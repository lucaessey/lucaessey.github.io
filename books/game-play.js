import {levels, planRound} from './game-core.js';
const $=selector=>document.querySelector(selector);
const rocks=[...document.querySelectorAll('.rock')];
const token=$('#yip-token'), action=$('#round-action'), motion=$('#gentle-motion');
let level=0, state='ready', positions=[0,1,2], target=-1, run=0;
let animations=[];
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
motion.checked=reduced.matches;
reduced.addEventListener('change',event=>{motion.checked=event.matches;});
try { const saved=JSON.parse(localStorage.getItem('yips-nerps:reading:v1')); if(Number.isInteger(saved?.number)&&saved.number>=1&&saved.number<=64) $('#back-to-comic').href=`./yips.html#panel-${saved.number}`; } catch {}

function setMessage(title,detail){$('#game-status').textContent=title;$('#game-detail').textContent=detail;}
function setSelection(enabled){rocks.forEach(rock=>{rock.disabled=!enabled;});$('#stage').classList.toggle('can-choose',enabled);}
function placeRocks(){rocks.forEach((rock,id)=>{rock.style.left=`${2+positions[id]*33}%`;rock.setAttribute('aria-label',`Rock in position ${positions[id]+1}`);rock.style.zIndex='2';});}
function tokenAt(slot){token.style.left=`${2+slot*33}%`;}
function updateLevel(){
  $('#level-title').innerHTML=`Level ${level+1} <span>${levels[level].name}</span>`;
  document.querySelectorAll('.level-dots li').forEach((li,i)=>{li.classList.toggle('passed',i<level||state==='complete');li.removeAttribute('aria-current');if(i===level)li.setAttribute('aria-current','step');});
}
function cancelRound(){run++;animations.forEach(a=>a.cancel());animations=[];setSelection(false);}
// Wait in visible time so switching tabs never makes the player miss the shuffle.
async function wait(ms,id){let last=performance.now(),elapsed=0;while(elapsed<ms){await new Promise(resolve=>requestAnimationFrame(resolve));if(run!==id)throw new Error('cancelled');const now=performance.now();if(!document.hidden)elapsed+=Math.min(now-last,60);last=now;}}
async function animate(element,frames,options,id){
  if(run!==id)throw new Error('cancelled');
  const anim=element.animate(frames,options);animations.push(anim);if(document.hidden)anim.pause();
  try{await anim.finished;if(run!==id)throw new Error('cancelled');}finally{animations=animations.filter(a=>a!==anim);}
  return anim;
}
document.addEventListener('visibilitychange',()=>animations.forEach(a=>document.hidden?a.pause():a.play()));

function ready(){
  cancelRound();state='ready';target=-1;positions=[0,1,2];placeRocks();
  rocks.forEach(r=>{r.classList.remove('correct','wrong');r.querySelector('.rock-reveal').hidden=true;});
  tokenAt(1);token.style.opacity='1';token.style.transform='translateY(0) scale(1)';token.classList.remove('is-hiding');
  $('#celebration').hidden=true;action.disabled=false;action.hidden=false;action.textContent=`Start Level ${level+1}`;motion.disabled=false;
  setMessage('Keep an eye on this Yip.',level===0?'Ready? Start with a nice, slow shuffle.':`${levels[level].name}. A little more concentration this time.`);updateLevel();
}
async function startRound(){
  cancelRound();const id=run;state='hiding';action.disabled=true;motion.disabled=true;
  rocks.forEach(r=>{r.classList.remove('correct','wrong');r.querySelector('.rock-reveal').hidden=true;});
  const plan=planRound(level);target=plan.target;positions=[0,1,2];placeRocks();tokenAt(target);
  token.style.opacity='1';token.style.transform='translateY(0) scale(1)';
  setMessage('There goes the Yip…','Watch which rock it enters.');
  const gentle=motion.checked;
  try{
    await wait(1400,id);
    await animate(token,[{transform:'translateY(0) scale(1)',opacity:1},{transform:'translateY(-23%) scale(.42)',opacity:0}],{duration:gentle?850:650,fill:'forwards',easing:'ease-in'},id);
    token.style.opacity='0';token.style.transform='translateY(-23%) scale(.42)';
    // Remove filled token animation before revealing it later.
    token.getAnimations().forEach(a=>a.cancel());
    await wait(350,id);state='shuffling';setMessage('Follow the rock…','You can choose when the rocks stop.');
    const config=levels[level];
    for(const step of plan.steps){
      const duration=gentle?Math.max(900,config.duration*1.35):config.duration;
      await Promise.all(rocks.map(async(rock,identity)=>{
        if(step.from[identity]===step.to[identity])return;
        const from=2+step.from[identity]*33,to=2+step.to[identity]*33;
        const arc=gentle?0:(step.to[identity]>step.from[identity]?-28:22);
        rock.style.zIndex=arc<0?'1':'3';
        const a=await animate(rock,[{left:`${from}%`,transform:'translateY(0)'},{left:`${(from+to)/2}%`,transform:`translateY(${arc}px)`},{left:`${to}%`,transform:'translateY(0)'}],{duration,easing:'ease-in-out',fill:'forwards'},id);
        rock.style.left=`${to}%`;a.cancel();
      }));
      positions=[...step.to];placeRocks();await wait(gentle?config.pause+120:config.pause,id);
    }
    if(run!==id)return;state='choosing';setSelection(true);action.hidden=true;
    setMessage('Where is the Yip?','Choose rock 1, 2, or 3.');
    rocks[positions.indexOf(0)].focus({preventScroll:true});
  }catch(error){if(run===id){ready();setMessage('Let’s try that shuffle again.','Press Start to begin.');}}
}
function choose(identity){
  if(state!=='choosing')return;
  setSelection(false);state=identity===target?'won':'lost';
  tokenAt(positions[target]);token.style.opacity='1';token.style.transform='translateY(0) scale(1)';
  rocks[target].classList.add('correct');rocks[target].querySelector('.rock-reveal').hidden=false;
  if(identity!==target)rocks[identity].classList.add('wrong');
  action.hidden=false;action.disabled=false;motion.disabled=false;
  if(state==='won'&&level===4){state='complete';$('#celebration').hidden=false;setMessage('Five levels. Five victories. Yip!','You followed that little toe-shuffler all the way.');action.textContent='Play Again';}
  else if(state==='won'){setMessage('Yip! You found it.',`${levels[level].name} complete. Ready for ${levels[level+1].name.toLowerCase()}?`);action.textContent=`Next: Level ${level+2}`;}
  else{setMessage('Nerp. It was the other rock.',`The Yip was in position ${positions[target]+1}. Give ${levels[level].name.toLowerCase()} another try.`);action.textContent=`Retry Level ${level+1}`;}
  updateLevel();action.focus({preventScroll:true});
}
rocks.forEach((rock,id)=>rock.addEventListener('click',()=>choose(id)));
document.addEventListener('keydown',event=>{
  if(state!=='choosing'||event.altKey||event.ctrlKey||event.metaKey)return;
  if(['1','2','3'].includes(event.key)){event.preventDefault();choose(positions.indexOf(Number(event.key)-1));}
  if(['ArrowLeft','ArrowRight'].includes(event.key)){
    const focused=rocks.indexOf(document.activeElement);if(focused<0)return;event.preventDefault();const slot=(positions[focused]+(event.key==='ArrowRight'?1:2))%3;rocks[positions.indexOf(slot)].focus();
  }
});
action.addEventListener('click',()=>{
  if(state==='won'){level++;ready();startRound();}
  else if(state==='complete'){level=0;ready();}
  else if(['ready','lost'].includes(state))startRound();
});
$('#restart').addEventListener('click',()=>{level=0;ready();action.focus({preventScroll:true});});
ready();
