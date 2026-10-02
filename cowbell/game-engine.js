export const DIRECTIONS = {up:[0,-1],right:[1,0],down:[0,1],left:[-1,0]};
const across=(y,from,to)=>Array.from({length:to-from+1},(_,i)=>[from+i,y]);
const patrolLine=across(3,1,9);
export const LEVELS = [
  {name:'The barnyard',hint:'Take a breath between steps. The hay is a place to hide.',period:1000,range:3,
    map:['#########G#','#....H....#','#..##.....#','#..##..M..#','#H.....M..#','#..##.....#','#..##..H..#','#S........#','###########'],
    routes:[[[7,2],[8,2],[9,2],[9,3],[9,4],[9,5],[8,5],[7,5],[7,4],[7,3]]]},
  {name:'The metal crossing',hint:'Metal rattles the bell. Settle it before you cross.',period:850,range:4,
    map:['#########G#','#H...#....#','#.##.#.##.#','#....M....#','###.#.#...#','#H..#.#H..#','#.#...#...#','#S..M.....#','###########'],
    routes:[[...patrolLine,...patrolLine.slice(1,-1).reverse()]]},
  {name:'The last gate',hint:'Two shadows now. Watch their routes, then choose your moment.',period:850,range:4,
    map:['#########G#','#H....H...#','#.##.##.#.#','#....M....#','###..#.##.#','#HM..#...H#','#.#M...#..#','#S..#.....#','###########'],
    routes:[[...patrolLine,...patrolLine.slice(1,-1).reverse()],[[3,5],[3,6],[3,7],[2,7],[1,7],[2,7],[3,7],[3,6]]]},
];
export const STEP_MS=240;
export const SWAY_COST={'.':20,S:20,G:20,H:8,M:36};
export function tile(state,x,y){return LEVELS[state.level].map[y]?.[x]||'#';}
export function createGame(level=0){
  const map=LEVELS[level].map,y=map.findIndex(row=>row.includes('S'));
  return {level,phase:'ready',player:{x:map[y].indexOf('S'),y},time:0,nextMove:0,sway:0,alert:0,moves:0,cause:null};
}
export function start(state){if(state.phase==='ready'||state.phase==='paused')state.phase='playing';}
export function pause(state){if(state.phase==='playing')state.phase='paused';}
export function guards(state){
  const level=LEVELS[state.level];
  return level.routes.map((route,i)=>{
    const index=Math.floor(state.time/(level.period+i*100))%route.length;
    const [x,y]=route[index],next=route[(index+1)%route.length];
    return {x,y,dx:next[0]-x,dy:next[1]-y};
  });
}
export function lineClear(state,x0,y0,x1,y1){
  const dx=Math.abs(x1-x0),dy=Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;
  let error=dx-dy;
  while(x0!==x1||y0!==y1){const e2=2*error;if(e2>-dy){error-=dy;x0+=sx;}if(e2<dx){error+=dx;y0+=sy;}if(tile(state,x0,y0)==='#')return false;}
  return true;
}
export function inSight(state,guard,x,y){
  const dx=x-guard.x,dy=y-guard.y,forward=dx*guard.dx+dy*guard.dy,side=Math.abs(dx*guard.dy-dy*guard.dx);
  return forward>0&&side<=forward*.72+.25&&Math.hypot(dx,dy)<=LEVELS[state.level].range+.35&&lineClear(state,guard.x,guard.y,x,y);
}
export function seen(state){return tile(state,state.player.x,state.player.y)!=='H'&&guards(state).some(g=>inSight(state,g,state.player.x,state.player.y));}
function catchPlayer(state,cause){state.phase='caught';state.cause=cause;}
function move(state,direction){
  const delta=DIRECTIONS[direction];if(!delta)return;
  state.nextMove=state.time+STEP_MS;
  const x=state.player.x+delta[0],y=state.player.y+delta[1],ground=tile(state,x,y);
  if(ground==='#')return;
  state.player={x,y};state.moves++;state.sway=Math.min(100,state.sway+SWAY_COST[ground]);
  if(state.sway>=100){catchPlayer(state,'bell');return;}
  if(guards(state).some(g=>g.x===x&&g.y===y)){catchPlayer(state,'devil');return;}
  if(ground==='G')state.phase=state.level===LEVELS.length-1?'won':'cleared';
}
// Fixed, small steps keep collision and exposure independent of rendering speed.
export function tick(state,milliseconds,direction=null){
  if(state.phase!=='playing')return state;
  let remaining=Math.max(0,milliseconds);
  while(remaining>0&&state.phase==='playing'){
    const dt=Math.min(20,remaining);remaining-=dt;state.time+=dt;
    state.sway=Math.max(0,state.sway-dt*.018);
    if(direction&&state.time>=state.nextMove)move(state,direction);
    if(state.phase!=='playing')break;
    if(guards(state).some(g=>g.x===state.player.x&&g.y===state.player.y)){catchPlayer(state,'devil');break;}
    state.alert=Math.max(0,Math.min(1,state.alert+dt*(seen(state)?1/900:-1/400)));
    if(state.alert>=1)catchPlayer(state,'spotted');
  }
  return state;
}
