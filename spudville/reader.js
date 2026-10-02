// Progressive enhancement: the full comic remains readable without JavaScript.
const $=selector=>document.querySelector(selector);
const panels=[...document.querySelectorAll('[data-panel]')];
const scenes=[...document.querySelectorAll('.sequence')];
const menu=$('#scene-menu');
const resume=$('#continue');
const key='spudville:reading:v1';
function updateResume(number){resume.href=`#panel-${number}`;resume.textContent=`Continue reading · panel ${number}`;resume.hidden=false;}
try{const saved=JSON.parse(localStorage.getItem(key));if(Number.isInteger(saved?.panel)&&panels.some(p=>Number(p.dataset.panel)===saved.panel))updateResume(saved.panel);}catch{}
let ticking=false,lastSaved=0;
function updateReading(){
  ticking=false;
  const line=Math.min(innerHeight*.42,340);
  let current=0,rowTop=-Infinity;
  for(const p of panels){const top=p.getBoundingClientRect().top;if(top>line)break;if(Math.abs(top-rowTop)>5){current=Number(p.dataset.panel);rowTop=top;}}
  if($('#comic').getBoundingClientRect().bottom<=innerHeight)current=panels.length;
  const percent=Math.round(current/panels.length*100);
  $('.progress').setAttribute('aria-valuenow',percent);
  $('.progress>span').style.width=`${percent}%`;$('#percent').textContent=`${percent}%`;
  if(current>0&&current!==lastSaved){lastSaved=current;updateResume(current);try{localStorage.setItem(key,JSON.stringify({panel:current}));}catch{}}
  let index=0;scenes.forEach((s,i)=>{if(s.getBoundingClientRect().top<line)index=i;});
  $('#current-scene').textContent=`${String(index+1).padStart(2,'0')} · ${scenes[index].querySelector('h2').textContent}`;
  menu.querySelectorAll('a').forEach((a,i)=>i===index?a.setAttribute('aria-current','location'):a.removeAttribute('aria-current'));
}
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(updateReading);}},{passive:true});
addEventListener('resize',updateReading);updateReading();
menu.addEventListener('click',event=>{if(event.target.closest('a'))menu.open=false;});
document.addEventListener('click',event=>{if(!menu.contains(event.target))menu.open=false;});
document.addEventListener('keydown',event=>{if(event.key==='Escape')menu.open=false;});
const dialog=$('#art-dialog');let trigger;
document.querySelectorAll('[data-enlarge]').forEach(button=>button.hidden=false);
$('#comic').addEventListener('click',event=>{
  const button=event.target.closest('[data-enlarge]');if(!button)return;
  trigger=button;const figure=button.closest('.panel');
  const image=figure.querySelector('.picture').cloneNode(true);image.querySelector('button').remove();
  image.querySelector('img').loading='eager';
  $('#art-title').textContent=`Panel ${button.dataset.enlarge} of ${panels.length}`;
  $('#enlarged').replaceChildren(image);
  if(figure.querySelector('figcaption')){const caption=document.createElement('div');caption.className='dialog-caption';caption.append(...[...figure.querySelector('figcaption').childNodes].map(node=>node.cloneNode(true)));$('#enlarged').append(caption);}
  dialog.showModal();document.body.classList.add('modal-open');
});
$('#close-art').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');trigger?.focus({preventScroll:true});});
document.querySelectorAll('a[href="#transcript"]').forEach(link=>link.addEventListener('click',()=>$('#transcript details').open=true));
if(location.hash==='#transcript')$('#transcript details').open=true;
addEventListener('hashchange',()=>{if(location.hash==='#transcript')$('#transcript details').open=true;});
