
let stars=4,currentTheme='t-sport';
function setStar(n){stars=n;const s=document.getElementById('stars').children;for(let i=0;i<5;i++)s[i].textContent=i<n?'★':'☆';u();}
function lp(i){const f=i.files[0];if(!f)return;const r=new FileReader();r.onload=e=>{const s=e.target.result;document.getElementById('pd').innerHTML=`<img src="${s}"><input type="file" accept="image/*" onchange="lp(this)">`;document.getElementById('tc-photo').innerHTML=`<img src="${s}" style="width:100%;height:100%;object-fit:cover">`;};r.readAsDataURL(f);}
function st(el,t2){document.querySelectorAll('.sb').forEach(b=>b.classList.remove('on'));el.classList.add('on');currentTheme=t2;document.getElementById('tc').className='tc '+t2;u();}
function u(){
  document.getElementById('tc-name').textContent=document.getElementById('cname').value.toUpperCase();
  document.getElementById('tc-team').textContent=document.getElementById('team').value;
  document.getElementById('tc-rarity').textContent=document.getElementById('rarity').value;
  document.getElementById('tc-num').textContent=document.getElementById('num').value;
  document.getElementById('tc-desc').textContent=document.getElementById('desc').value;
  ['s1k','s2k','s3k','s1v','s2v','s3v'].forEach(id=>document.getElementById('tc-'+id).textContent=document.getElementById(id).value);
  document.getElementById('tc-stars').textContent='★'.repeat(stars)+'☆'.repeat(5-stars);
}
document.addEventListener('langready',u);
