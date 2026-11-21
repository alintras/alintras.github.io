
let spinning=false;
function setMetal(){const m=document.getElementById('metal').value;document.getElementById('coin').className='coin '+m+(spinning?' spinning':'');}
function toggleSpin(){spinning=!spinning;document.getElementById('coin').classList.toggle('spinning',spinning);}
function lp(i){const f=i.files[0];if(!f)return;const r=new FileReader();r.onload=e=>{const s=e.target.result;document.getElementById('pd').innerHTML=`<img src="${s}"><input type="file" accept="image/*" onchange="lp(this)">`;document.getElementById('coin-img').innerHTML=`<img src="${s}">`;};r.readAsDataURL(f);}
function u(){
  document.getElementById('arc-text').textContent=document.getElementById('arc').value;
  document.getElementById('coin-val').textContent=document.getElementById('val').value;
  document.getElementById('coin-cur').textContent=document.getElementById('cur').value;
  document.getElementById('coin-year').textContent=document.getElementById('year').value;
  document.getElementById('coin-back').textContent=document.getElementById('back').value;
  setMetal();
}
document.addEventListener('langready',u);
