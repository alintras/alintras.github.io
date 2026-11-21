
function lp(i){const f=i.files[0];if(!f)return;const r=new FileReader();r.onload=e=>{const s=e.target.result;document.getElementById('pd').innerHTML=`<img src="${s}"><input type="file" accept="image/*" onchange="lp(this)">`;document.getElementById('nc-photo').innerHTML=`<img src="${s}" style="width:100%;height:100%;object-fit:cover">`;};r.readAsDataURL(f);}
function ss(el,cls){document.querySelectorAll('.sb').forEach(b=>b.classList.remove('on'));el.classList.add('on');document.getElementById('nc').className='nc '+cls;}
function u(){
  document.getElementById('nc-ch').textContent=document.getElementById('ch').value;
  document.getElementById('nc-cat').textContent=document.getElementById('cat').value;
  document.getElementById('nc-hl').textContent=document.getElementById('hl').value;
  document.getElementById('nc-sub').textContent=document.getElementById('sub').value;
  document.getElementById('nc-body').textContent=document.getElementById('body').value;
  document.getElementById('nc-rep').textContent=document.getElementById('rep').value;
  document.getElementById('nc-time').textContent=document.getElementById('time').value;
  document.getElementById('nc-ticker').textContent=document.getElementById('ticker').value;
  document.querySelector('.nc-live').textContent=t('n_live');
}
document.addEventListener('langready',u);
