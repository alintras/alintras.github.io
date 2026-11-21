
const months={en:['January','February','March','April','May','June','July','August','September','October','November','December'],de:['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'],fr:['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'],es:['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'],pt:['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'],ru:['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'],zh:['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],ar:['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'],ja:['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],hi:['जनवरी','फरवरी','मार्च','अप्रैल','मई','जून','जुलाई','अगस्त','सितंबर','अक्टूबर','नवंबर','दिसंबर']};
const days={en:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],de:['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'],fr:['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],es:['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],pt:['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],ru:['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'],zh:['周日','周一','周二','周三','周四','周五','周六'],ar:['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'],ja:['日曜日','月曜日','火曜日','水曜日','木曜日','金曜日','土曜日'],hi:['रविवार','सोमवार','मंगलवार','बुधवार','गुरुवार','शुक्रवार','शनिवार']};
function fd(v){if(!v)return{date:'',day:''};const d=new Date(v);const lang=window._lang||'en';const ml=months[lang]||months.en;const dl=days[lang]||days.en;return{date:`${d.getDate()} ${ml[d.getMonth()]} ${d.getFullYear()}`,day:dl[d.getDay()].toUpperCase()};}
function lp(i){const f=i.files[0];if(!f)return;const r=new FileReader();r.onload=e=>{const s=e.target.result;document.getElementById('pd').innerHTML=`<img src="${s}"><input type="file" accept="image/*" onchange="lp(this)">`;document.getElementById('np-photo').innerHTML=`<img src="${s}" style="width:100%;height:100%;object-fit:cover">`;};r.readAsDataURL(f);}
function ss(el,cls){document.querySelectorAll('.sb').forEach(b=>b.classList.remove('on'));el.classList.add('on');document.getElementById('np').className='np '+(cls||'');}
function u(){
  document.getElementById('np-name').textContent=document.getElementById('pname').value;
  document.getElementById('np-tagline').textContent=document.getElementById('tagline').value;
  document.getElementById('np-edition').textContent=document.getElementById('edition').value;
  const fd2=fd(document.getElementById('pdate').value);
  document.getElementById('np-date').textContent=fd2.date;
  document.getElementById('np-day').textContent=fd2.day;
  document.getElementById('np-headline').textContent=document.getElementById('headline').value;
  document.getElementById('np-sub').textContent=document.getElementById('sub').value;
  document.getElementById('np-author').textContent=document.getElementById('author').value;
  document.getElementById('np-text').textContent=document.getElementById('body').value;
  document.getElementById('np-caption').textContent=document.getElementById('caption').value;
}
document.addEventListener('langready',u);
