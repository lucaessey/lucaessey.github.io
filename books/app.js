import './game.js';
const $=s=>document.querySelector(s), storageKey='from-yips-to-nerps-reading-v1';
let saved=null;
try{saved=JSON.parse(localStorage.getItem(storageKey));}catch{}
const validSaved=saved&&Number.isInteger(saved.panel)&&saved.panel>0&&saved.panel<=64;
if(validSaved){$('#continue').hidden=false;$('#continue').href=`#panel-${saved.panel}`;$('#continue').textContent=`Continue Reading · panel ${saved.panel}`;$('.return-reading').href=`#panel-${saved.panel}`;}
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const labelPositions={22:[[20,19],[82,24],[41,58],[20,87],[82,82]],23:[[47,65]],28:[[46,62]],32:[[26,68]],33:[[63,38]],51:[[82,44,28]],52:[[71,20,35]]};
function labelsMarkup(panel){if(!panel.labels)return '';const positions=labelPositions[panel.id];return `<span class="prop-labels ${positions?'positioned-labels':''}" aria-hidden="true">${panel.labels.map((label,i)=>{const p=positions?.[i];return `<span${p?` style="left:${p[0]}%;top:${p[1]}%;${p[2]?`width:${p[2]}%;`:''}"`:''}>${escape(label)}</span>`;}).join('')}</span>`;}
function artMarkup(panel,chapter,index){return `<div class="art-viewport" style="--col:${index%2};--row:${Math.floor(index/2)}"><img class="sheet-image" src="./assets/chapter-${chapter+1}.webp" alt="${escape(panel.alt)}" loading="lazy" decoding="async" width="2048" height="3072"></div>`;}
function panelMarkup(panel,chapter,index){
  const dialogue=(panel.dialogue||[]).map(d=>`<p class="bubble ${d.speaker.startsWith('Gorf')?'gorf':''}"><span class="speaker">${escape(d.speaker)}: </span>${escape(d.text)}</p>`).join('');
  return `<article class="panel ${panel.wide?'wide':''}" id="panel-${panel.id}" data-panel="${panel.id}" data-chapter="${chapter}" aria-label="Panel ${panel.id}"><button class="art-button" data-enlarge="${panel.id}" aria-label="Enlarge artwork for panel ${panel.id}: ${escape(panel.alt)}">${artMarkup(panel,chapter,index)}<span class="panel-number" aria-hidden="true">${String(panel.id).padStart(2,'0')}</span><span class="zoom-hint" aria-hidden="true">＋</span>${labelsMarkup(panel)}${panel.sfx?`<span class="sfx" aria-hidden="true">${escape(panel.sfx)}</span>`:''}</button>${dialogue?`<div class="lettering">${dialogue}</div>`:''}<p class="panel-caption">${escape(panel.caption)}</p></article>`;
}
let story;
try{
  const response=await fetch('./story.json');if(!response.ok)throw Error('Story unavailable');story=await response.json();
  $('#comic').innerHTML=story.chapters.map((chapter,ci)=>`<section class="chapter" id="${chapter.id}" aria-labelledby="chapter-title-${ci}"><header class="chapter-header"><span class="chapter-number" aria-hidden="true">${String(ci+1).padStart(2,'0')}</span><div><p class="eyebrow">${escape(chapter.kicker)}</p><h2 id="chapter-title-${ci}">${escape(chapter.title)}</h2></div></header><div class="panels">${chapter.panels.map((p,pi)=>panelMarkup(p,ci,pi)).join('')}</div>${ci<7?`<p class="chapter-end"><a href="#${story.chapters[ci+1].id}">Next: ${escape(story.chapters[ci+1].title)}</a></p>`:''}</section>`).join('');
}catch{
  $('#comic').innerHTML='<p class="loading-note">The illustrated comic could not load. <a href="./transcript.html">Read the complete text transcript</a>, or refresh to try again.</p>';
}
$('#chapters').addEventListener('change',event=>{location.hash=event.target.value;});
const dialog=$('#art-dialog');let trigger=null;
$('#comic').addEventListener('click',event=>{
  const button=event.target.closest('[data-enlarge]');if(!button||!story)return;
  const id=Number(button.dataset.enlarge),ci=Math.floor((id-1)/8),pi=(id-1)%8,p=story.chapters[ci].panels[pi];trigger=button;
  $('#art-title').textContent=`Panel ${id} · ${story.chapters[ci].title}`;
  $('#enlarged-art').innerHTML=artMarkup(p,ci,pi);$('#enlarged-art img').loading='eager';$('#art-description').textContent=p.alt;
  dialog.showModal();document.body.classList.add('modal-open');
});
function closeArt(){dialog.close();}
$('#close-art').addEventListener('click',closeArt);
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeArt();}});
dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');trigger?.focus({preventScroll:true});});
const panels=[...document.querySelectorAll('[data-panel]')];let frame=null,lastPanel=0;
function updateProgress(){
  frame=null;if(!panels.length)return;
  const readingLine=Math.min(innerHeight*.45,340);
  const comicBounds=$('#comic').getBoundingClientRect();
  if(comicBounds.bottom<80)return;
  let current=0;
  let lastTop=-Infinity;
  for(const panel of panels){const top=panel.getBoundingClientRect().top;if(top>readingLine)break;if(Math.abs(top-lastTop)>5){current=Number(panel.dataset.panel);lastTop=top;}}
  if(current===0){$('#read-count').textContent='0 / 64';$('#read-progress').value=0;return;}
  $('#read-count').textContent=`${current} / 64`;$('#read-progress').value=current;
  $('#read-progress').textContent=`${current} of 64 panels`;
  const ci=Math.floor((current-1)/8);$('#chapters').value=story.chapters[ci].id;
  // Keep the last story position when playing the game or reading the footer.
  if(current!==lastPanel){lastPanel=current;try{localStorage.setItem(storageKey,JSON.stringify({panel:current}));}catch{}
    $('#continue').hidden=false;$('#continue').href=`#panel-${current}`;$('#continue').textContent=`Continue Reading · panel ${current}`;$('.return-reading').href=`#panel-${current}`;
  }
}
addEventListener('scroll',()=>{if(frame===null)frame=requestAnimationFrame(updateProgress);},{passive:true});
addEventListener('resize',()=>{if(frame===null)frame=requestAnimationFrame(updateProgress);});
// Hash targets arrive after the editable story file loads.
if(location.hash&&story){const target=document.getElementById(decodeURIComponent(location.hash.slice(1)));if(target)requestAnimationFrame(()=>target.scrollIntoView({behavior:'instant',block:'start'}));}
updateProgress();
