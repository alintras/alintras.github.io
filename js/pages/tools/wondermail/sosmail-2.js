//<![CDATA[

var AboveGround=[
0,0,1,1,0,1,1,1,0,1,1,1,1,1,1,0,0,1,1,0,0,0,
1,0,0,0,0,0,0,1,0,1,0,1,1,1,0,1,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,1,0,1,0
]
function IsAboveGround(d){
 if(d>=AboveGround.length)return 1
 return AboveGround[d]
}
function showitems(name){
 document.write("<select name=\""+name+"\">");
 for(var i=0;i<items.length;i++){
  document.write("<option value=\"\">"+items[i]+" ["+i.toString(16)+"]</option>");  
 } 
 document.write("</select>");
}

function showpokemon(name){
 document.write("<select name=\""+name+"\">");
 for(var i=0;i<pokemon.length;i++){
  document.write("<option value=\"\">"+pokemon[i]+"</option>");  
 } 
 document.write("</select>");
}


var debug=0

function entrytopass(x){
 x=x.replace(/[\n\s\r\'\"]/g,"")
         .replace(/[\u2642]/g,"#")
         .replace(/[\u2640]/g,"%")
         .replace(/[\{\(\[]m([a\u00e2]le?)?[\)\]\}]/gi,"#")
         .replace(/[\{\(\[]f(em(ale|elle)?)?[\)\]\}]/gi,"%")
         .replace(/[\{\(\[]w(eib(l(ich)?)?)?[\)\]\}]/gi,"%")
         .replace(/[\{\(\[]m(acho)?[\)\]\}]/gi,"#")
         .replace(/[\{\(\[]h(em(bra)?)?[\)\]\}]/gi,"%")
         .replace(/[\{\(\[]m[a\u00e4\u00c4]nn(l(ich)?)?[\)\]\}]/gi,"#")
         .replace(/[\{\(\[]\.\.?\.?[\)\]\}]/g,".")
         .replace(/[\{\(\[][\u2026][\)\]\}]/g,".")
         .replace(/[\u2026]/g,".")
         .toUpperCase()
 testx=x.replace(/\.\.\./g,".")
 if(testx.length==54)
  x=testx
 return x
}

function formatpass(x){
 x=entrytopass(x)
 return x.substr(0,5)+" "
       +x.substr(5,8)+" "
       +x.substr(13,5)+"\r\n"
       +x.substr(18,5)+" "
       +x.substr(23,8)+" "
       +x.substr(31,5)+"\r\n"
       +x.substr(36,5)+" "
       +x.substr(41,8)+" "
       +x.substr(49,5)+"\r\n"
}

var baditems="EDEEEFB1E924D8D2B0DC323334C2ECF0"

function option(x){
 return parseInt(x[x.selectedIndex].value)
}

function isbaditem(x){
 if(x>=0xF0)return 0
 for(var i=0;i<baditems.length/2;i++){
  if(x==c2c(baditems,i))
   return 1
 }
 return 0
}

function showrewards(name){
 document.write("<select name=\""+name+"\">");
 for(var i=0;i<items.length;i++){
  if(!isbaditem(i)){
   document.write("<option value=\""+i+"\">"+items[i]
//      +" ["+i.toString(16)+"]"
      +"</option>");  
  }
 } 
 document.write("</select>");
}

function decodemission(pass){
 var diffstring="EDCBAS*"
 var client=pass[12]|(pass[13]<<8)
 var clientname=""
 for(var i=0;i<10;i++){
  if(pass[20+i]==0)break
  clientname+=String.fromCharCode(pass[20+i])
 }
 var clientstr=ClientLine+" "+clientname+" ("+pokemon[client]+")"
 var placestr=PlaceLine+" "+dungeons[pass[4]]+" "
 if(IsAboveGround(pass[4]))
  placestr+=AboveGroundFloor.replace("XX",pass[5])
 else
  placestr+=BasementFloor.replace("XX",pass[5])
 var id=pass[16]|(pass[17]<<8)
 var idstr=IDLine+" "+(id%10000)+"\r\n"
          +RescueChancesLine+" "+pass[44]+"\r\n"
          +DifficultyLine+" "+diffstring.charAt(GetDifficulty(0,pass[4],pass[5]))
 return clientstr+"\r\n"+placestr+"\r\n"+idstr+"\r\n"
}

function genmailex(f,mail,flags,mailtype){
 var pass=[]
 var x=entrytopass(mail)
 if(x.length==0){
  alert(NoPassword)
  return 0
 } if(x.length<54){
  alert(PasswordTooShort)
  return 0
 }
 if(!convertpass(x,pass)){
  alert(InvalidPasswordLong)
  return 0
 } else if(pass[0]!=mailtype) {
  if(mailtype==1){
   if(pass[0]==4){
    if(confirm(AOKMailEnteredInSOS)){
     flags=2;
     f.aok.value=formatpass(x);
    } else {
     return 0;
    }
   } else {
    alert(NotSOSMail)
    return 0
   }
  }else if(mailtype==4){
   if(pass[0]==1){
    if(confirm(SOSMailEnteredInAOK)){
     flags=1;
     f.sos.value=formatpass(x);
    } else {
     return 0;
    }
   } else {
    alert(NotAOKMail)
    return 0
   }
  }
 }
 f.mission.value=decodemission(pass)
 if(flags&1){
  pass[0]=4//A-OK mail ID
  pass[40]=pass[36]
  pass[41]=pass[37]
  pass[42]=pass[38]
  pass[43]=pass[39]
  pass[44]=pass[44]-1//rescue chances left
  //works even if line below is commented out
  f.aok.value=formatpass(datatopass(pass))
 }
 if(flags&2){
  var itemidx=option(f.item)
  pass[0]=5//Thank-You mail ID
  if(itemidx){
   pass[33]=1
   pass[34]=itemidx&0xFF
   pass[35]=(itemidx>>8)&0xFF
  }
  f.ty.value=formatpass(datatopass(pass))
 }
 return 1
}

function genaok(f){
 if(genmailex(f,f.sos.value,1,1)){
  f.sos.value=formatpass(f.sos.value)
 }
}

function genaokty(f){
 if(genmailex(f,f.sos.value,3,1)){
  f.sos.value=formatpass(f.sos.value)
 }
}

function genty(f){
 if(genmailex(f,f.aok.value,2,4)){
  f.aok.value=formatpass(f.aok.value)
 }
}

function decsos(f){
 var x=entrytopass(f.sos.value)
 var pass=[]
 if(!convertpass(x,pass)){
  alert(InvalidPassword)
 } else {
  x=datatopass(pass)
  f.sos.value=formatpass(x)
  if(debug){
   f.data.value=tostr(pass)
  }
 }
}

function encsos(f){
 var pass=f.data.value.split(",")
 for(var i=0;i<pass.length;i++){
  pass[i]=parseInt(pass[i],16)
 }
 x=datatopass(pass)
 f.sos.value=formatpass(x)
 if(debug){
  f.data.value=tostr(pass)
 }
}
//]]>
