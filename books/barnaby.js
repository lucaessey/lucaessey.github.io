const panels=[...document.querySelectorAll('.bb-panel[data-panel]')];
const chapters=[...document.querySelectorAll('.bb-chapter')];
const key='barnaby:reading:v1';
const menu=document.querySelector('#bb-chapters');
const currentLabel=document.querySelector('#bb-current');
const count=document.querySelector('#bb-count');
const progress=document.querySelector('.bb-progress');
let current=0,scheduled=false;
try{
  const saved=JSON.parse(localStorage.getItem(key));
  if(Number.isInteger(saved?.panel)&&saved.panel>=1&&saved.panel<=panels.length){
    const link=document.querySelector('#bb-continue');
    link.href=`#barnaby-panel-${saved.panel}`;
    link.textContent=`Continue · panel ${saved.panel} →`;
    link.hidden=false;
  }
}catch{/* Reading remains available without storage. */}
menu.addEventListener('click',event=>{if(event.target.closest('a'))menu.open=false;});
document.addEventListener('click',event=>{if(!menu.contains(event.target))menu.open=false;});
document.addEventListener('keydown',event=>{if(event.key==='Escape')menu.open=false;});
function update(){
  scheduled=false;
  const readingLine=Math.min(innerHeight*.4,300);
  let index=-1;
  for(let i=0;i<panels.length;i++)if(panels[i].getBoundingClientRect().top<=readingLine)index=i;
  if(index<0)return;
  const number=index+1,chapter=chapters[Math.floor(index/4)];
  if(current===number)return;
  current=number;
  count.textContent=`${number} / ${panels.length}`;
  currentLabel.textContent=chapter.querySelector('h2').textContent;
  const percentage=Math.round(number/panels.length*100);
  progress.setAttribute('aria-valuenow',percentage);
  progress.firstElementChild.style.width=`${percentage}%`;
  for(const link of menu.querySelectorAll('a')){
    if(link.hash===`#${chapter.id}`)link.setAttribute('aria-current','location');
    else link.removeAttribute('aria-current');
  }
  try{localStorage.setItem(key,JSON.stringify({panel:number}));}catch{}
}
function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(update);}}
addEventListener('scroll',schedule,{passive:true});
addEventListener('resize',schedule);addEventListener('load',schedule);
schedule();
const dialog=document.querySelector('#bb-dialog');
const content=document.querySelector('#bb-dialog-content');
const previous=document.querySelector('#bb-prev');
const next=document.querySelector('#bb-next');
let enlarged=0;
function showPanel(number){
  enlarged=number;
  const copy=panels[number-1].cloneNode(true);
  copy.removeAttribute('id');copy.removeAttribute('data-panel');
  copy.querySelector('.bb-enlarge').remove();
  copy.querySelector('img').loading='eager';
  content.replaceChildren(copy);
  document.querySelector('#bb-dialog-title').textContent=`Panel ${number} of ${panels.length}`;
  previous.disabled=number===1;next.disabled=number===panels.length;
  dialog.scrollTop=0;
}
for(const button of document.querySelectorAll('[data-enlarge]')){
  button.hidden=false;
  button.addEventListener('click',()=>{showPanel(Number(button.dataset.enlarge));dialog.showModal();});
}
document.querySelector('#bb-close').addEventListener('click',()=>dialog.close());
previous.addEventListener('click',()=>showPanel(enlarged-1));
next.addEventListener('click',()=>showPanel(enlarged+1));
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('keydown',event=>{
  if(event.key==='ArrowLeft'&&enlarged>1){event.preventDefault();showPanel(enlarged-1);}
  if(event.key==='ArrowRight'&&enlarged<panels.length){event.preventDefault();showPanel(enlarged+1);}
});
