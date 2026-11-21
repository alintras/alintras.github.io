
const C={
  DE:{name:'BUNDESREPUBLIK DEUTSCHLAND',type:'FÜHRERSCHEIN',flag:'🇩🇪',bg:'linear-gradient(160deg,#e8f2d4,#c8e0a8 60%,#a8c878)',accent:'#003300',text:'#1a3a1a',faded:'rgba(0,0,0,0.4)'},
  AT:{name:'REPUBLIK ÖSTERREICH',type:'FÜHRERSCHEIN',flag:'🇦🇹',bg:'linear-gradient(160deg,#f0e8e8,#e0c8c8)',accent:'#cc0000',text:'#3a0a0a',faded:'rgba(0,0,0,0.4)'},
  CH:{name:'SCHWEIZ · SUISSE · SVIZZERA',type:'FÜHRERAUSWEIS',flag:'🇨🇭',bg:'linear-gradient(160deg,#fff0f0,#ffe0e0)',accent:'#cc0000',text:'#3a0a0a',faded:'rgba(0,0,0,0.4)'},
  FR:{name:'RÉPUBLIQUE FRANÇAISE',type:'PERMIS DE CONDUIRE',flag:'🇫🇷',bg:'linear-gradient(160deg,#e8eef8,#d0ddf0 60%,#f0d0d8)',accent:'#002395',text:'#001040',faded:'rgba(0,0,0,0.4)'},
  IT:{name:'REPUBBLICA ITALIANA',type:'PATENTE DI GUIDA',flag:'🇮🇹',bg:'linear-gradient(160deg,#e8f4ec,#c8e8d0 60%,#f0e8e8)',accent:'#009246',text:'#1a3a20',faded:'rgba(0,0,0,0.4)'},
  ES:{name:'REINO DE ESPAÑA',type:'PERMISO DE CONDUCCIÓN',flag:'🇪🇸',bg:'linear-gradient(160deg,#fdf0d0,#f8e0a0)',accent:'#AA151B',text:'#3a2a08',faded:'rgba(0,0,0,0.4)'},
  NL:{name:'NEDERLAND',type:'RIJBEWIJS',flag:'🇳🇱',bg:'linear-gradient(160deg,#e8eef8,#d0ddf5)',accent:'#21468B',text:'#0d1a3a',faded:'rgba(0,0,0,0.4)'},
  PL:{name:'POLSKA',type:'PRAWO JAZDY',flag:'🇵🇱',bg:'linear-gradient(160deg,#fff0f0,#ffdede)',accent:'#dc143c',text:'#3a0a0a',faded:'rgba(0,0,0,0.4)'},
  SE:{name:'SVERIGE',type:'KÖRKORT',flag:'🇸🇪',bg:'linear-gradient(160deg,#e8f0fc,#ccdaf8)',accent:'#006AA7',text:'#0a1a3a',faded:'rgba(0,0,0,0.4)'},
  GB:{name:'UNITED KINGDOM',type:'DRIVING LICENCE',flag:'🇬🇧',bg:'linear-gradient(160deg,#f0f4ff,#dce6ff 60%,#ffe0e0)',accent:'#012169',text:'#001040',faded:'rgba(0,0,0,0.4)'},
  NO:{name:'NORGE',type:'FØRERKORT',flag:'🇳🇴',bg:'linear-gradient(160deg,#fff0f0,#ffd8d8)',accent:'#EF2B2D',text:'#3a0808',faded:'rgba(0,0,0,0.4)'},
  PT:{name:'PORTUGAL',type:'CARTA DE CONDUÇÃO',flag:'🇵🇹',bg:'linear-gradient(160deg,#e8f4ec,#c8e0cc)',accent:'#CC0000',text:'#1a3a20',faded:'rgba(0,0,0,0.4)'},
  GR:{name:'ΕΛΛΆΔΑ',type:'ΆΔΕΙΑ ΟΔΉΓΗΣΗΣ',flag:'🇬🇷',bg:'linear-gradient(160deg,#e8eef8,#c8d8f0)',accent:'#0D5EAF',text:'#0a1a3a',faded:'rgba(0,0,0,0.4)'},
  RU:{name:'РОССИЯ',type:'ВОДИТЕЛЬСКОЕ УДОСТОВЕРЕНИЕ',flag:'🇷🇺',bg:'linear-gradient(160deg,#e8eef8,#d0dcf0)',accent:'#0039A6',text:'#0a1a3a',faded:'rgba(0,0,0,0.4)'},
  US:{name:'UNITED STATES',type:"DRIVER'S LICENSE",flag:'🇺🇸',bg:'linear-gradient(160deg,#e8eef8,#d0ddf5 60%,#ffe8e8)',accent:'#002868',text:'#001035',faded:'rgba(0,0,0,0.4)'},
  CA:{name:'CANADA',type:"DRIVER'S LICENCE",flag:'🇨🇦',bg:'linear-gradient(160deg,#fff0f0,#ffdddd)',accent:'#FF0000',text:'#3a0808',faded:'rgba(0,0,0,0.4)'},
  MX:{name:'MÉXICO',type:'LICENCIA DE CONDUCIR',flag:'🇲🇽',bg:'linear-gradient(160deg,#e8f4ec,#c8e8cc 60%,#ffe8e8)',accent:'#006847',text:'#1a3a20',faded:'rgba(0,0,0,0.4)'},
  BR:{name:'BRASIL',type:'CARTEIRA DE HABILITAÇÃO',flag:'🇧🇷',bg:'linear-gradient(160deg,#e8f4ec,#c8e8c0)',accent:'#009c3b',text:'#1a3a20',faded:'rgba(0,0,0,0.4)'},
  AU:{name:'AUSTRALIA',type:'DRIVER LICENCE',flag:'🇦🇺',bg:'linear-gradient(160deg,#fdf0d8,#f8e0b8)',accent:'#CC0000',text:'#3a2008',faded:'rgba(0,0,0,0.4)'},
  CN:{name:'中国 CHINA',type:'机动车驾驶证',flag:'🇨🇳',bg:'linear-gradient(160deg,#fff0e8,#ffe0d0)',accent:'#DE2910',text:'#3a0a0a',faded:'rgba(0,0,0,0.4)'},
  IN:{name:'INDIA / BHARAT',type:'DRIVING LICENCE',flag:'🇮🇳',bg:'linear-gradient(160deg,#fff4e8,#ffe8c8 60%,#e8f0e8)',accent:'#FF9933',text:'#3a2808',faded:'rgba(0,0,0,0.4)'},
  JP:{name:'日本',type:'運転免許証',flag:'🇯🇵',bg:'linear-gradient(160deg,#fce8e8,#f8d0d0)',accent:'#BC002D',text:'#3a0a0a',faded:'rgba(0,0,0,0.4)'},
  KR:{name:'대한민국',type:'운전면허증',flag:'🇰🇷',bg:'linear-gradient(160deg,#e8eef8,#d0dcf5)',accent:'#003478',text:'#0a1a3a',faded:'rgba(0,0,0,0.4)'},
  TR:{name:'TÜRKİYE',type:'SÜRÜCÜ BELGESİ',flag:'🇹🇷',bg:'linear-gradient(160deg,#fce8e8,#f8d0d0)',accent:'#E30A17',text:'#3a0808',faded:'rgba(0,0,0,0.4)'},
  AE:{name:'UNITED ARAB EMIRATES',type:'DRIVING LICENCE',flag:'🇦🇪',bg:'linear-gradient(160deg,#e8f4ec,#c8e8cc 60%,#fff0f0)',accent:'#00732F',text:'#0a3a20',faded:'rgba(0,0,0,0.4)'},
  SG:{name:'SINGAPORE',type:'DRIVING LICENCE',flag:'🇸🇬',bg:'linear-gradient(160deg,#fce8e8,#f8d8d8 40%,#f0f8f0)',accent:'#EF3340',text:'#3a0808',faded:'rgba(0,0,0,0.4)'},
};
function fd(v){if(!v)return'';const[y,m,d]=v.split('-');return`${d}.${m}.${y}`;}
function lp(i){const f=i.files[0];if(!f)return;const r=new FileReader();r.onload=e=>{const s=e.target.result;document.getElementById('pd').innerHTML=`<img src="${s}"><input type="file" accept="image/*" onchange="lp(this)">`;document.getElementById('c-photo').innerHTML=`<img src="${s}" style="width:100%;height:100%;object-fit:cover">`;};r.readAsDataURL(f);}
function sp(f,l,d,p){document.getElementById('fn').value=f;document.getElementById('ln').value=l;document.getElementById('dob').value=d;document.getElementById('pob').value=p;u();}
function tc(el){el.classList.toggle('on');u();}
function u(){
  const code=document.getElementById('country').value;
  const c=C[code]||C.DE;
  document.getElementById('c-bg').style.background=c.bg;
  document.getElementById('c-accent').style.background=c.accent;
  ['c-country','c-main'].forEach(id=>{document.getElementById(id).style.color=c.text;});
  document.getElementById('c-fields').style.color=c.text;
  document.getElementById('c-sig').style.color=c.faded;
  document.querySelectorAll('.c-fields .l').forEach(el=>el.style.color=c.faded);
  document.getElementById('c-country').textContent=c.name;
  document.getElementById('c-main').textContent=c.type;
  document.getElementById('c-flag').textContent=c.flag;
  const fn=document.getElementById('fn').value;
  const ln=document.getElementById('ln').value;
  document.getElementById('c-fn').textContent=fn.toUpperCase();
  document.getElementById('c-ln').textContent=ln.toUpperCase();
  document.getElementById('c-dob').textContent=fd(document.getElementById('dob').value);
  document.getElementById('c-pob').textContent=document.getElementById('pob').value.toUpperCase();
  document.getElementById('c-iss').textContent=fd(document.getElementById('iss').value);
  document.getElementById('c-exp').textContent=fd(document.getElementById('exp').value);
  document.getElementById('c-sig').textContent=`${fn} ${ln}`;
  const active=[...document.querySelectorAll('.cat.on')].map(e=>e.textContent);
  document.getElementById('c-cats').innerHTML=active.map(cl=>`<div class="c-catbox" style="border:1px solid ${c.text}88;color:${c.text}">${cl}</div>`).join('');
}
document.addEventListener('langready', u);
