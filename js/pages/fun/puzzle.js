
let photoSrc=null,pieces=[],dragging=null,ox,oy,cols,rows,pw,ph,img;
const cv=document.getElementById('cv'),ctx=cv.getContext('2d');
const palette=['#e8f0ff','#d0e8ff','#e8f8e8','#f8f0d8','#f8e8e8','#f0e8f8','#e8f8f8','#f8f8e8'];

function lp(i){
  const f=i.files[0];if(!f)return;
  const r=new FileReader();
  r.onload=e=>{
    photoSrc=e.target.result;
    document.getElementById('pd').innerHTML=`<img src="${photoSrc}"><input type="file" accept="image/*" onchange="lp(this)">`;
    document.getElementById('pb-img').innerHTML=`<img src="${photoSrc}" style="width:100%;height:100%;object-fit:cover">`;
  };
  r.readAsDataURL(f);
}

function ub(){
  document.getElementById('pb-title').textContent=document.getElementById('ptitle').value;
  const n=document.getElementById('pieces').value;
  document.getElementById('pb-meta').textContent=`${n} ${t('p_pieces')} · ${t('p_puzz_title')}`;
}

function resetView(){
  document.getElementById('boxview').style.display='';
  cv.style.display='none';
  document.getElementById('info').style.display='none';
  document.getElementById('game-btns').style.display='none';
}

function startPuzzle(){
  const n=parseInt(document.getElementById('pieces').value);
  cols=rows=Math.sqrt(n);
  const container=cv.parentElement;
  const W=container.clientWidth-2;
  cv.width=W;
  cv.height=Math.round(W*0.66);
  pw=cv.width/cols;ph=cv.height/rows;
  document.getElementById('boxview').style.display='none';
  cv.style.display='block';
  document.getElementById('info').style.display='block';
  document.getElementById('game-btns').style.display='flex';
  if(photoSrc){img=new Image();img.onload=()=>init();img.src=photoSrc;}
  else{img=null;init();}
}

function init(){
  pieces=[];
  for(let r=0;r<rows;r++)
    for(let c=0;c<cols;c++)
      pieces.push({c,r,x:20+Math.random()*(cv.width-pw-40),y:20+Math.random()*(cv.height-ph-40),done:false});
  draw();
}

function shuffle(){init();}

function solve(){
  pieces.forEach(p=>{p.x=p.c*pw;p.y=p.r*ph;p.done=true;});
  draw();
}

function getGridColor(){
  return document.documentElement.getAttribute('data-theme')==='dark'?'rgba(255,255,255,0.15)':'rgba(0,0,0,0.12)';
}

function draw(){
  const isDark=document.documentElement.getAttribute('data-theme')==='dark';
  ctx.fillStyle=isDark?'#1a1a1a':'#f0f0ec';
  ctx.fillRect(0,0,cv.width,cv.height);
  ctx.strokeStyle=getGridColor();ctx.lineWidth=1;
  for(let r=0;r<rows;r++)
    for(let c=0;c<cols;c++)
      ctx.strokeRect(c*pw,r*ph,pw,ph);
  pieces.forEach(p=>{
    ctx.save();ctx.translate(p.x,p.y);
    if(img){
      ctx.drawImage(img,p.c*(img.width/cols),p.r*(img.height/rows),img.width/cols,img.height/rows,0,0,pw,ph);
    } else {
      ctx.fillStyle=palette[(p.r*cols+p.c)%palette.length];
      ctx.fillRect(0,0,pw,ph);
      ctx.fillStyle='#555';
      ctx.font=`bold ${Math.min(pw,ph)*0.32}px monospace`;
      ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillText(p.r*cols+p.c+1,pw/2,ph/2);
    }
    ctx.strokeStyle=p.done?'#22aa44':'rgba(0,0,0,0.2)';
    ctx.lineWidth=p.done?2:1;
    ctx.strokeRect(0,0,pw,ph);
    ctx.restore();
  });
}

function getAt(mx,my){
  for(let i=pieces.length-1;i>=0;i--){
    const p=pieces[i];
    if(mx>=p.x&&mx<=p.x+pw&&my>=p.y&&my<=p.y+ph)return i;
  }
  return -1;
}

function snap(p){
  if(Math.abs(p.x-p.c*pw)<20&&Math.abs(p.y-p.r*ph)<20){
    p.x=p.c*pw;p.y=p.r*ph;p.done=true;
    if(pieces.every(q=>q.done)) setTimeout(()=>alert('Puzzle complete! 🎉'),100);
  }
}

function toCanvas(e,touch){
  const r=cv.getBoundingClientRect();
  const src=touch||e;
  return{mx:(src.clientX-r.left)*(cv.width/r.width),my:(src.clientY-r.top)*(cv.height/r.height)};
}

cv.addEventListener('mousedown',e=>{
  const {mx,my}=toCanvas(e);
  const i=getAt(mx,my);
  if(i!==-1){dragging=pieces.splice(i,1)[0];pieces.push(dragging);ox=mx-dragging.x;oy=my-dragging.y;}
});
document.addEventListener('mousemove',e=>{
  if(!dragging)return;
  const {mx,my}=toCanvas(e);
  dragging.x=mx-ox;dragging.y=my-oy;draw();
});
document.addEventListener('mouseup',()=>{
  if(dragging){snap(dragging);draw();dragging=null;}
});

cv.addEventListener('touchstart',e=>{
  e.preventDefault();
  const {mx,my}=toCanvas(e,e.touches[0]);
  const i=getAt(mx,my);
  if(i!==-1){dragging=pieces.splice(i,1)[0];pieces.push(dragging);ox=mx-dragging.x;oy=my-dragging.y;}
},{passive:false});
document.addEventListener('touchmove',e=>{
  if(!dragging)return;
  e.preventDefault();
  const {mx,my}=toCanvas(e,e.touches[0]);
  dragging.x=mx-ox;dragging.y=my-oy;draw();
},{passive:false});
document.addEventListener('touchend',()=>{
  if(dragging){snap(dragging);draw();dragging=null;}
});

let resizeTimer;
window.addEventListener('resize',()=>{
  clearTimeout(resizeTimer);
  resizeTimer=setTimeout(()=>{if(cv.style.display!=='none')startPuzzle();},100);
});

document.addEventListener('langready',ub);
