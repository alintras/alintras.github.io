
const months={en:['January','February','March','April','May','June','July','August','September','October','November','December'],de:['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'],fr:['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'],es:['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'],pt:['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'],ru:['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'],zh:['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],ar:['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'],ja:['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],hi:['जनवरी','फरवरी','मार्च','अप्रैल','मई','जून','जुलाई','अगस्त','सितंबर','अक्टूबर','नवंबर','दिसंबर']};
function fd(v){if(!v)return'';const d=new Date(v);const lang=window._lang||'en';const ml=months[lang]||months.en;return`${document.getElementById('place').value}, ${d.getDate()} ${ml[d.getMonth()]} ${d.getFullYear()}`;}
function ss(el,cls){document.querySelectorAll('.sb').forEach(b=>b.classList.remove('on'));el.classList.add('on');document.getElementById('urk').className='urk '+cls;}
function u(){
  document.getElementById('u-org').textContent=document.getElementById('org').value;
  document.getElementById('u-title').textContent=document.getElementById('title').value;
  document.getElementById('u-name').textContent=document.getElementById('recipient').value;
  document.getElementById('u-reason').textContent=document.getElementById('reason').value;
  document.getElementById('u-body').textContent=document.getElementById('body').value;
  document.getElementById('u-date').textContent=fd(document.getElementById('date').value);
  document.getElementById('u-sig1').textContent=document.getElementById('sig1').value;
  document.getElementById('u-sig2').textContent=document.getElementById('sig2').value;
  document.getElementById('u-stamp').innerHTML=document.getElementById('stamp').value.split(' ').join('<br>');
  document.querySelector('.urk-pre').textContent=t('u_awarded_to');
}
document.addEventListener('langready',u);
