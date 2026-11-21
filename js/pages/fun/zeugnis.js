
const def=[['English','A'],['Mathematics','B'],['Science','A'],['History','A+'],['Biology','B+'],['Physics','B'],['PE','A'],['Art','A'],['Music','A+']];
let subs=def.map(([n,g])=>({n,g}));
function renderList(){
  document.getElementById('slist').innerHTML=subs.map((s,i)=>`
    <div class="subject-row">
      <input type="text" value="${s.n}" oninput="subs[${i}].n=this.value;u()">
      <select onchange="subs[${i}].g=this.value;u()">
        ${['A+','A','B+','B','C+','C','D','F'].map(g=>`<option${g===s.g?' selected':''}>${g}</option>`).join('')}
      </select>
    </div>`).join('');
}
function addS(){subs.push({n:'New Subject',g:'B'});renderList();u();}
function setStyle(el,cls){document.querySelectorAll('.sb').forEach(b=>b.classList.remove('on'));el.classList.add('on');document.getElementById('z').className='zeugnis'+(cls?' '+cls:'');}
function gClass(g){const m={'A+':'g1','A':'g2','B+':'g2','B':'g3','C+':'g3','C':'g4','D':'g5','F':'g6'};return m[g]||'';}
function u(){
  document.getElementById('z-school').textContent=document.getElementById('school').value;
  document.getElementById('z-name').textContent=document.getElementById('name').value;
  document.getElementById('z-grade').textContent=document.getElementById('grade').value;
  document.getElementById('z-next').textContent=document.getElementById('next').value;
  document.getElementById('z-note').textContent=document.getElementById('note').value;
  document.getElementById('z-sig1').textContent=document.getElementById('sig1').value;
  document.getElementById('z-sig2').textContent=document.getElementById('sig2').value;
  const isAnnual=document.getElementById('sem').value==='J';
  const semLabel=isAnnual?t('z_annual'):t('z_semester');
  document.getElementById('z-sub').textContent=`${semLabel} · ${document.getElementById('year').value}`;
  document.getElementById('z-tbody').innerHTML=subs.map(s=>`<tr><td>${s.n}</td><td class="${gClass(s.g)}">${s.g}</td></tr>`).join('');
  const sch=document.getElementById('school').value.toUpperCase().split(' ');
  document.getElementById('z-stamp').innerHTML=sch.slice(0,3).map(w=>w[0]).join('');
}
document.addEventListener('langready',()=>{renderList();u();});
