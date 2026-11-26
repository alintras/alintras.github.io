//<![CDATA[

// ═══════════════════════════════════════════════════════
// TILE  (port of VfPSolTile [4]bool)
// tile[0]=voltorb, tile[1]=1, tile[2]=2, tile[3]=3
// ═══════════════════════════════════════════════════════

function newUnsolvedTile() { return [true,true,true,true]; }
function newSolvedTile(v)  { return [v===0,v===1,v===2,v===3]; }
function cloneTile(t)      { return [t[0],t[1],t[2],t[3]]; }

function tileIsPossible(t) { return t[0]||t[1]||t[2]||t[3]; }
function tileIsSolved(t)   { var n=0; for(var i=0;i<4;i++) if(t[i]) n++; return n===1; }
function tileIsVoltorb(t)  { return t[0]; }
function tilePoints(t) {
  for(var i=0;i<4;i++) if(t[i]) return i;
  return -1;
}
function tileIsPossiblyNecessaryToWin(t) { return t[2]||t[3]; }

// ═══════════════════════════════════════════════════════
// BOARD STATE
// ═══════════════════════════════════════════════════════

var rowTotals    = [{pts:0,v:0},{pts:0,v:0},{pts:0,v:0},{pts:0,v:0},{pts:0,v:0}];
var colTotals    = [{pts:0,v:0},{pts:0,v:0},{pts:0,v:0},{pts:0,v:0},{pts:0,v:0}];
// userBoard[y][x]: null=unknown, 0/1/2/3=known value
var userBoard    = [];
var gameOver     = false;
var highlightPos = null; // {x,y}

function initUserBoard() {
  userBoard = [];
  for(var y=0;y<5;y++) { userBoard[y]=[]; for(var x=0;x<5;x++) userBoard[y][x]=null; }
  gameOver = false; highlightPos = null;
}

// ═══════════════════════════════════════════════════════
// PARTIAL SOLUTION  (port of vfPartialSolution)
// ═══════════════════════════════════════════════════════

function newPSol(rTotals, cTotals, initTiles) {
  var tiles = [], inv = [];
  for(var y=0;y<5;y++) { tiles[y]=[]; for(var x=0;x<5;x++) tiles[y][x]=cloneTile(initTiles[y][x]); }
  for(var x=0;x<5;x++) { inv[x]=[]; for(var y=0;y<5;y++) inv[x][y]=cloneTile(tiles[y][x]); }

  var ps = {
    rTotals: rTotals, cTotals: cTotals,
    tiles: tiles, inv: inv,
    rowData: [{},{},{},{},{}], colData: [{},{},{},{},{}]
  };

  if(!updateAllRowData(ps) || !updateAllColData(ps)) return null;
  if(!isPossible(ps)) return null;
  if(!applyHeuristics(ps)) return null;
  return ps;
}

function updateRowData(ps, y) {
  var rp=ps.rTotals[y].pts, rv=ps.rTotals[y].v, nut=0;
  for(var x=0;x<5;x++){
    var t=ps.tiles[y][x];
    if(!tileIsPossible(t)) return false;
    if(tileIsSolved(t)){ if(tileIsVoltorb(t)) rv--; else rp-=tilePoints(t); }
    else nut++;
  }
  ps.rowData[y]={rp:rp,rv:rv,nut:nut};
  return lineIsPossible(ps.rowData[y]);
}
function updateAllRowData(ps){for(var y=0;y<5;y++)if(!updateRowData(ps,y))return false;return true;}

function updateColData(ps, x) {
  var rp=ps.cTotals[x].pts, rv=ps.cTotals[x].v, nut=0;
  for(var y=0;y<5;y++){
    var t=ps.inv[x][y];
    if(!tileIsPossible(t)) return false;
    if(tileIsSolved(t)){ if(tileIsVoltorb(t)) rv--; else rp-=tilePoints(t); }
    else nut++;
  }
  ps.colData[x]={rp:rp,rv:rv,nut:nut};
  return lineIsPossible(ps.colData[x]);
}
function updateAllColData(ps){for(var x=0;x<5;x++)if(!updateColData(ps,x))return false;return true;}

function lineIsPossible(d) {
  return d.rp>=0 && d.rv>=0 && d.nut>=0 && d.rv<=d.nut &&
    d.nut-d.rv<=d.rp && d.rp<=(d.nut-d.rv)*3;
}

function isPossible(ps) {
  var pt=0,vt=0;
  for(var i=0;i<5;i++){pt+=ps.rTotals[i].pts;vt+=ps.rTotals[i].v;}
  for(var i=0;i<5;i++){pt-=ps.cTotals[i].pts;vt-=ps.cTotals[i].v;}
  if(pt!==0||vt!==0) return false;
  for(var y=0;y<5;y++){
    var d=ps.rowData[y];
    if(d.rv>d.nut||d.rv<0||d.rp>(d.nut-d.rv)*3||d.rp<0) return false;
  }
  return true;
}

function isWon(ps) {
  for(var y=0;y<5;y++) for(var x=0;x<5;x++)
    if(!tileIsSolved(ps.tiles[y][x])&&tileIsPossiblyNecessaryToWin(ps.tiles[y][x])) return false;
  return true;
}

function syncInvFromTiles(ps) {
  for(var y=0;y<5;y++) for(var x=0;x<5;x++) ps.inv[x][y]=cloneTile(ps.tiles[y][x]);
}
function syncTilesFromInv(ps) {
  for(var y=0;y<5;y++) for(var x=0;x<5;x++) ps.tiles[y][x]=cloneTile(ps.inv[x][y]);
}

function h0(d,line){ if(d.rv+d.rp!==d.nut) return false; var u=false; for(var i=0;i<5;i++){var t=line[i];if(!tileIsSolved(t)&&(t[2]||t[3])){t[2]=false;t[3]=false;u=true;}} return u; }
function h1(d,line){ if(d.nut-d.rv!==d.rp-1) return false; var u=false; for(var i=0;i<5;i++){var t=line[i];if(!tileIsSolved(t)&&t[3]){t[3]=false;u=true;}} return u; }
function h2(d,line){ if(d.rv!==0) return false; var u=false; for(var i=0;i<5;i++){var t=line[i];if(!tileIsSolved(t)&&t[0]){t[0]=false;u=true;}} return u; }
function h3(d,line){ if(d.nut-1!==d.rv) return false; var u=false; for(var i=0;i<5;i++){var t=line[i];if(!tileIsSolved(t)){for(var j=1;j<4;j++){if(d.rp!==j&&t[j]){t[j]=false;u=true;}}}} return u; }
function h4(d,line){ if((d.nut-d.rv)>Math.floor((d.rp+1)/3)) return false; var u=false; for(var i=0;i<5;i++){var t=line[i];if(!tileIsSolved(t)&&t[1]){t[1]=false;u=true;}} return u; }
function h5(d,line){ if(!(d.rv===0&&d.rp===d.nut)) return false; var u=false; for(var i=0;i<5;i++){var t=line[i];if(!tileIsSolved(t)){t[0]=false;t[1]=true;t[2]=false;t[3]=false;u=true;}} return u; }
function h6(d,line){ if(d.rv!==d.nut) return false; var u=false; for(var i=0;i<5;i++){var t=line[i];if(!tileIsSolved(t)){t[0]=true;t[1]=false;t[2]=false;t[3]=false;u=true;}} return u; }
function h7(d,line){ if(d.nut!==1) return false; for(var i=0;i<5;i++){var t=line[i];if(!tileIsSolved(t)){t[0]=d.rp===0;t[1]=d.rp===1;t[2]=d.rp===2;t[3]=d.rp===3; return true;}} return false; }
function h8(d,line){ if(d.rp!==d.nut*3) return false; var u=false; for(var i=0;i<5;i++){var t=line[i];if(!tileIsSolved(t)){t[0]=false;t[1]=false;t[2]=false;t[3]=true;u=true;}} return u; }

var heuristics = [h0,h1,h2,h3,h4,h5,h6,h7,h8];

function applyHeuristics(ps) {
  var invOutOfDate=false, rowUpdated=false, colUpdated=false;
  for(;;){
    rowUpdated=false;
    for(var y=0;y<5;y++){
      if(ps.rowData[y].nut===0) continue;
      for(var hi=0;hi<heuristics.length;hi++){
        if(heuristics[hi](ps.rowData[y],ps.tiles[y])){
          if(!updateRowData(ps,y)) return false;
          invOutOfDate=true; rowUpdated=true; break;
        }
      }
    }
    if(rowUpdated) continue;
    if(invOutOfDate){
      syncInvFromTiles(ps);
      if(!updateAllColData(ps)) return false;
      invOutOfDate=false;
    }
    colUpdated=false;
    for(var x=0;x<5;x++){
      if(ps.colData[x].nut===0) continue;
      for(var hi=0;hi<heuristics.length;hi++){
        if(heuristics[hi](ps.colData[x],ps.inv[x])){
          if(!updateColData(ps,x)) return false;
          colUpdated=true; break;
        }
      }
    }
    if(colUpdated){
      syncTilesFromInv(ps);
      if(!updateAllRowData(ps)) return false;
      continue;
    }
    return true;
  }
}

function allPossibleSolvedBoards(ps) {
  var rowOptions=[], safeCounts=new Array(25);
  for(var i=0;i<25;i++) safeCounts[i]=0;

  for(var y=0;y<5;y++){
    rowOptions[y]=[];
    var values=new Array(5);
    function buildRow(x, points, voltorbs) {
      if(x===5){
        if(points===ps.rTotals[y].pts && voltorbs===ps.rTotals[y].v)
          rowOptions[y].push(values.slice());
        return;
      }
      var tile=ps.tiles[y][x];
      for(var value=0;value<4;value++){
        if(!tile[value]) continue;
        var nextPoints=points+(value===0?0:value);
        var nextVoltorbs=voltorbs+(value===0?1:0);
        if(nextPoints>ps.rTotals[y].pts || nextVoltorbs>ps.rTotals[y].v) continue;
        values[x]=value;
        buildRow(x+1,nextPoints,nextVoltorbs);
      }
    }
    buildRow(0,0,0);
    if(rowOptions[y].length===0) return {safeCounts:safeCounts,total:0};
  }

  function stateKey(points,voltorbs) {
    var key='';
    for(var x=0;x<5;x++) key+=points[x]+','+voltorbs[x]+';';
    return key;
  }

  function columnsRemainPossible(points,voltorbs,rowsUsed) {
    var cellsLeft=5-rowsUsed;
    for(var x=0;x<5;x++){
      var pointsLeft=ps.cTotals[x].pts-points[x];
      var voltorbsLeft=ps.cTotals[x].v-voltorbs[x];
      if(voltorbsLeft<0 || voltorbsLeft>cellsLeft ||
        pointsLeft<0 || pointsLeft<cellsLeft-voltorbsLeft ||
        pointsLeft>(cellsLeft-voltorbsLeft)*3) return false;
    }
    return true;
  }

  var forward=[{}], zeroPoints=[0,0,0,0,0], zeroVoltorbs=[0,0,0,0,0];
  var initialKey=stateKey(zeroPoints,zeroVoltorbs);
  forward[0][initialKey]={points:zeroPoints,voltorbs:zeroVoltorbs,ways:1};

  for(var y=0;y<5;y++){
    var nextStates={};
    for(var stateId in forward[y]){
      var state=forward[y][stateId];
      for(var oi=0;oi<rowOptions[y].length;oi++){
        var row=rowOptions[y][oi];
        var points=state.points.slice(),voltorbs=state.voltorbs.slice();
        for(var x=0;x<5;x++){
          points[x]+=row[x];
          if(row[x]===0) voltorbs[x]++;
        }
        if(!columnsRemainPossible(points,voltorbs,y+1)) continue;
        var key=stateKey(points,voltorbs);
        if(nextStates[key]) nextStates[key].ways+=state.ways;
        else nextStates[key]={points:points,voltorbs:voltorbs,ways:state.ways};
      }
    }
    forward[y+1]=nextStates;
  }

  var backward=[null,null,null,null,null,{}];
  for(var stateId in forward[5]) backward[5][stateId]=1;
  for(var y=4;y>=0;y--){
    backward[y]={};
    for(var stateId in forward[y]){
      var state=forward[y][stateId], completions=0;
      for(var oi=0;oi<rowOptions[y].length;oi++){
        var row=rowOptions[y][oi];
        var points=state.points.slice(),voltorbs=state.voltorbs.slice();
        for(var x=0;x<5;x++){
          points[x]+=row[x];
          if(row[x]===0) voltorbs[x]++;
        }
        var nextKey=stateKey(points,voltorbs);
        if(backward[y+1][nextKey])
          completions+=backward[y+1][nextKey];
      }
      backward[y][stateId]=completions;
    }

    for(var stateId in forward[y]){
      var state=forward[y][stateId];
      for(var oi=0;oi<rowOptions[y].length;oi++){
        var row=rowOptions[y][oi];
        var points=state.points.slice(),voltorbs=state.voltorbs.slice();
        for(var x=0;x<5;x++){
          points[x]+=row[x];
          if(row[x]===0) voltorbs[x]++;
        }
        var suffixWays=backward[y+1][stateKey(points,voltorbs)]||0;
        var boardWays=state.ways*suffixWays;
        if(boardWays===0) continue;
        for(var x=0;x<5;x++)
          if(row[x]!==0) safeCounts[y*5+x]+=boardWays;
      }
    }
  }

  return {safeCounts:safeCounts,total:backward[0][initialKey]||0};
}

function safetyFromSolvedBoards(ps, res) {
  var safety={}, total=res.total;
  if(total===0) return {safety:safety,total:0};
  for(var y=0;y<5;y++){
    for(var x=0;x<5;x++){
      if(!tileIsSolved(ps.tiles[y][x])){
        safety[y+'_'+x]=res.safeCounts[y*5+x];
      }
    }
  }
  return {safety:safety,total:total};
}

function safetyOfEachGuess(ps) {
  return safetyFromSolvedBoards(ps,allPossibleSolvedBoards(ps));
}

function safestUnsolvedPosition(ps, possibleBoards) {
  var res=safetyFromSolvedBoards(ps,possibleBoards);
  if(res.total===0) return {possible:false};
  if(isWon(ps)) return {possible:true,won:true};
  for(var y=0;y<5;y++) for(var x=0;x<5;x++){
    var t=ps.tiles[y][x];
    if(!tileIsSolved(t)&&!t[0])
      return {possible:true,won:false,x:x,y:y,safety:1.0};
  }
  var safety=res.safety, total=res.total;
  var bestX=-1,bestY=-1,bestN=-1;
  for(var y=0;y<5;y++){
    for(var x=0;x<5;x++){
      var key=y+'_'+x;
      if(!(key in safety)) continue;
      var n=safety[key];
      if(n>bestN && tileIsPossiblyNecessaryToWin(ps.tiles[y][x])){
        bestX=x;bestY=y;bestN=n;
      }
    }
  }
  if(bestX===-1) return {possible:true,won:true};
  return {possible:true,won:false,x:bestX,y:bestY,safety:bestN/total};
}

function solve(rTotals, cTotals, knownBoard) {
  var initTiles=[];
  for(var y=0;y<5;y++){initTiles[y]=[];for(var x=0;x<5;x++){
    initTiles[y][x]= knownBoard[y][x]!==null ? newSolvedTile(knownBoard[y][x]) : newUnsolvedTile();
  }}
  var ps=newPSol(rTotals,cTotals,initTiles);
  if(!ps) return {possible:false};
  var possibleBoards=allPossibleSolvedBoards(ps);
  if(possibleBoards.total===0) return {possible:false};
  if(isWon(ps)) return {possible:true,won:true,tiles:ps.tiles};
  var result=safestUnsolvedPosition(ps,possibleBoards);
  result.tiles=ps.tiles;
  return result;
}

function readHint(id){ return Number(document.getElementById(id).value); }
function setConsole(html){ document.getElementById('con').innerHTML=html; }

function validateHints(hints) {
  var lines=hints.rt.concat(hints.ct);
  for(var i=0;i<lines.length;i++){
    var line=lines[i];
    if(!Number.isInteger(line.pts) || !Number.isInteger(line.v) ||
      line.pts<0 || line.pts>15 || line.v<0 || line.v>5 ||
      line.pts<5-line.v || line.pts>(5-line.v)*3) return false;
  }
  var rowPoints=0,colPoints=0,rowVoltorbs=0,colVoltorbs=0;
  for(var i=0;i<5;i++){
    rowPoints+=hints.rt[i].pts;
    rowVoltorbs+=hints.rt[i].v;
    colPoints+=hints.ct[i].pts;
    colVoltorbs+=hints.ct[i].v;
  }
  return rowPoints===colPoints && rowVoltorbs===colVoltorbs;
}

function highlightCell(x,y){
  for(var ry=0;ry<5;ry++) for(var rx=0;rx<5;rx++)
    document.getElementById('celltd'+ry+'_'+rx).className='cell';
  if(x!==null) document.getElementById('celltd'+y+'_'+x).className='cell highlight';
  highlightPos=(x!==null)?{x:x,y:y}:null;
}

function buildHintsFromInputs(){
  var rt=[],ct=[];
  for(var i=0;i<5;i++){rt.push({pts:readHint('rs'+i),v:readHint('rv'+i)});}
  for(var i=0;i<5;i++){ct.push({pts:readHint('cs'+i),v:readHint('cv'+i)});}
  return {rt:rt,ct:ct};
}

function renderBoard(tiles){
  for(var y=0;y<5;y++){
    for(var x=0;x<5;x++){
      var el=document.getElementById('cell'+y+'_'+x);
      var u=userBoard[y][x];
      var val='', sub='';
      if(u!==null){
        val= u===0?'&#9889;':''+u;
      } else if(tiles){
        var t=tiles[y][x];
        if(tileIsSolved(t)){
          var p=tilePoints(t);
          val= p===0?'&#9889;':''+p;
        } else {
          val='?';
          var opts=[];
          if(t[1]) opts.push('1'); if(t[2]) opts.push('2×'); if(t[3]) opts.push('3×');
          if(t[0]&&opts.length>0) sub='V?';
          else if(opts.length>0) sub=opts.join(' ');
        }
      } else {
        val='?';
      }
      el.innerHTML='<div class="val">'+val+'</div><div class="sub">'+sub+'</div>';
    }
  }
}

function doSolve(){
  if(gameOver) return;
  var h=buildHintsFromInputs();
  if(!validateHints(h)){
    setConsole('Invalid hints — check that every row and column has valid totals and that both sets add up equally.');
    highlightCell(null,null); renderBoard(null); return;
  }
  var result=solve(h.rt,h.ct,userBoard);
  if(!result.possible){
    setConsole('Board is impossible — check your hint values.');
    highlightCell(null,null); renderBoard(null); return;
  }
  renderBoard(result.tiles);
  if(result.won){
    highlightCell(null,null);
    var safe=[];
    for(var y=0;y<5;y++) for(var x=0;x<5;x++){
      var t=result.tiles[y][x];
      if(tileIsSolved(t)&&!tileIsVoltorb(t)&&userBoard[y][x]===null)
        safe.push(colLetter(x)+(y+1)+'='+tilePoints(t));
    }
    if(safe.length>0)
      setConsole('<b>You\'ve found all &#xD7;2 and &#xD7;3 cards!</b> Remaining safe flips: '+safe.join(', '));
    else
      setConsole('<b>Board solved!</b> All &#xD7;2 and &#xD7;3 cards found.');
    return;
  }
  var bx=result.x, by=result.y;
  highlightCell(bx,by);
  var safelist=[];
  for(var y=0;y<5;y++) for(var x=0;x<5;x++){
    var t=result.tiles[y][x];
    if(tileIsSolved(t)&&!tileIsVoltorb(t)&&userBoard[y][x]===null)
      safelist.push(colLetter(x)+(y+1)+'='+tilePoints(t));
  }
  var msg='';
  if(safelist.length>0) msg+='Safe to flip: <b>'+safelist.join(', ')+'</b><br/>';
  var riskPercent=(1-result.safety)*100;
  var sp=percentLabel(riskPercent);
  msg+='&#9658; Flip highlighted card <b>'+colLetter(bx)+(by+1)+'</b>';
  if(result.safety<1){
    msg+=' &mdash; ';
    if(riskPercent<0.5) msg+='almost certainly safe (&lt;1% Voltorb)';
    else if(riskPercent<=5) msg+='almost certainly safe ('+sp+'% Voltorb)';
    else if(riskPercent<=25) msg+=Math.round(100-riskPercent)+'% safe ('+sp+'% Voltorb)';
    else msg+='risky! '+sp+'% Voltorb chance';
  } else {
    msg+=' &mdash; safe';
  }
  msg+='<br/>What did you get? ';
  msg+='<input type="button" value="1" onclick="markCell('+bx+','+by+',1)"/> ';
  msg+='<input type="button" value="2" onclick="markCell('+bx+','+by+',2)"/> ';
  msg+='<input type="button" value="3" onclick="markCell('+bx+','+by+',3)"/> ';
  msg+='<input type="button" value="Voltorb &#9889;" onclick="markVoltorb('+bx+','+by+')"/> ';
  msg+='<input type="button" value="Skip &#8594;" onclick="skipCell('+bx+','+by+')" title="Ask about a different card"/>';
  setConsole(msg);
}

function colLetter(x){ return 'ABCDE'[x]; }
function percentLabel(percent){ return percent>0 && percent<0.5?'&lt;1':String(Math.round(percent)); }
var skipped={};

function markCell(x,y,val){ skipped={}; userBoard[y][x]=val; doSolve(); }

function markVoltorb(x,y){
  userBoard[y][x]=0; gameOver=true; highlightCell(null,null);
  var h=buildHintsFromInputs();
  var result=solve(h.rt,h.ct,userBoard);
  renderBoard(result&&result.tiles?result.tiles:null);
  setConsole('<b>Game over!</b> You hit a Voltorb at <b>'+colLetter(x)+(y+1)+'</b>. '
    +'<input type="button" value="Start new game" onclick="doReset()"/>');
}

function skipCell(x,y){
  skipped[y+'_'+x]=true;
  var h=buildHintsFromInputs();
  if(!validateHints(h)){
    setConsole('Invalid hints — check that every row and column has valid totals and that both sets add up equally.');
    highlightCell(null,null); renderBoard(null); return;
  }
  var initTiles=[];
  for(var ry=0;ry<5;ry++){initTiles[ry]=[];for(var rx=0;rx<5;rx++){
    initTiles[ry][rx]=userBoard[ry][rx]!==null?newSolvedTile(userBoard[ry][rx]):newUnsolvedTile();
  }}
  var ps=newPSol(h.rt,h.ct,initTiles);
  if(!ps){setConsole('Board impossible.');return;}
  var res=safetyOfEachGuess(ps);
  if(res.total===0){
    setConsole('Board is impossible — check your hint values.');
    highlightCell(null,null); renderBoard(null); return;
  }
  renderBoard(ps.tiles);
  var bestX=-1,bestY=-1,bestN=-1;
  for(var ry=0;ry<5;ry++){
    for(var rx=0;rx<5;rx++){
      var key=ry+'_'+rx;
      if(skipped[key]) continue;
      if(!(key in res.safety)) continue;
      var t=ps.tiles[ry][rx];
      if(!tileIsSolved(t)&&tileIsPossiblyNecessaryToWin(t)&&res.safety[key]>bestN){
        bestX=rx;bestY=ry;bestN=res.safety[key];
      }
    }
  }
  if(bestX===-1){skipped={};doSolve();return;}
  highlightCell(bestX,bestY);
  var sp=percentLabel((1-bestN/res.total)*100);
  var msg='&#9658; Flip <b>'+colLetter(bestX)+(bestY+1)+'</b>';
  msg+=' &mdash; '+sp+'% Voltorb chance';
  msg+='<br/>What did you get? ';
  msg+='<input type="button" value="1" onclick="markCell('+bestX+','+bestY+',1)"/> ';
  msg+='<input type="button" value="2" onclick="markCell('+bestX+','+bestY+',2)"/> ';
  msg+='<input type="button" value="3" onclick="markCell('+bestX+','+bestY+',3)"/> ';
  msg+='<input type="button" value="Voltorb &#9889;" onclick="markVoltorb('+bestX+','+bestY+')"/> ';
  msg+='<input type="button" value="Skip &#8594;" onclick="skipCell('+bestX+','+bestY+')"/>';
  setConsole(msg);
}

function clickCell(x,y){
  if(gameOver) return;
  var u=userBoard[y][x];
  if(u!==null){
    var msg='Card <b>'+colLetter(x)+(y+1)+'</b>: marked as '+(u===0?'Voltorb':''+u)+'. ';
    msg+='<input type="button" value="Clear" onclick="clearCell('+x+','+y+')"/>';
    setConsole(msg); return;
  }
  highlightCell(x,y);
  var h=buildHintsFromInputs();
  if(!validateHints(h)){
    setConsole('Invalid hints — check that every row and column has valid totals and that both sets add up equally.');
    renderBoard(null); return;
  }
  var initTiles=[];
  for(var ry=0;ry<5;ry++){initTiles[ry]=[];for(var rx=0;rx<5;rx++){
    initTiles[ry][rx]=userBoard[ry][rx]!==null?newSolvedTile(userBoard[ry][rx]):newUnsolvedTile();
  }}
  var ps=newPSol(h.rt,h.ct,initTiles);
  var msg='Card <b>'+colLetter(x)+(y+1)+'</b>: ';
  if(!ps){msg+='board impossible.';setConsole(msg);return;}
  var res=safetyOfEachGuess(ps);
  if(res.total===0){
    setConsole('Board is impossible — check your hint values.');
    highlightCell(null,null); renderBoard(null); return;
  }
  var t=ps.tiles[y][x];
  if(tileIsSolved(t)){
    msg+= tileIsVoltorb(t)?'Voltorb.':'Value '+tilePoints(t)+'.';
  } else {
    var n=res.safety[y+'_'+x]||0, tot=res.total;
    var sp=percentLabel((1-n/tot)*100);
    msg+=sp+'% Voltorb chance.';
  }
  msg+='<br/>What did you get? ';
  msg+='<input type="button" value="1" onclick="markCell('+x+','+y+',1)"/> ';
  msg+='<input type="button" value="2" onclick="markCell('+x+','+y+',2)"/> ';
  msg+='<input type="button" value="3" onclick="markCell('+x+','+y+',3)"/> ';
  msg+='<input type="button" value="Voltorb &#9889;" onclick="markVoltorb('+x+','+y+')"/>';
  setConsole(msg);
}

function clearCell(x,y){ userBoard[y][x]=null; skipped={}; doSolve(); }

function doReset(){
  initUserBoard(); skipped={};
  for(var i=0;i<5;i++){document.getElementById('rs'+i).value=0;document.getElementById('rv'+i).value=0;}
  for(var i=0;i<5;i++){document.getElementById('cs'+i).value=0;document.getElementById('cv'+i).value=0;}
  highlightCell(null,null); renderBoard(null);
  setConsole('Board reset. Enter hints and click Solve.');
}

function loadExample(){
  var rs=[2,3,7,7,8],rv=[4,2,1,2,1],cs=[2,9,7,2,7],cv=[3,0,1,4,2];
  for(var i=0;i<5;i++){document.getElementById('rs'+i).value=rs[i];document.getElementById('rv'+i).value=rv[i];}
  for(var i=0;i<5;i++){document.getElementById('cs'+i).value=cs[i];document.getElementById('cv'+i).value=cv[i];}
  initUserBoard(); skipped={}; doSolve();
}

function setupDrop(){
  var dz=document.getElementById('dropzone');
  dz.ondragover=function(e){e.preventDefault();};
  dz.ondrop=function(e){e.preventDefault();if(e.dataTransfer.files[0])processImage(e.dataTransfer.files[0]);};
  document.addEventListener('paste',function(e){
    for(var i=0;i<e.clipboardData.items.length;i++)
      if(e.clipboardData.items[i].type.indexOf('image')!==-1){processImage(e.clipboardData.items[i].getAsFile());break;}
  });
}

function processImage(file){
  var reader=new FileReader();
  reader.onload=function(e){
    var canvas=document.getElementById('scancanvas');
    var img=new Image();
    img.onload=function(){
      var scale=Math.min(1,480/img.width);
      canvas.width=img.width*scale;canvas.height=img.height*scale;
      canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);
      canvas.style.display='block';
    };
    img.src=e.target.result;
    scanWithAI(e.target.result.split(',')[1],file.type||'image/jpeg');
  };
  reader.readAsDataURL(file);
}

function scanWithAI(b64,mt){
  document.getElementById('scanresult').innerHTML='Scanning with AI...';
  document.getElementById('applybtn').style.display='none';
  var prompt="This is a screenshot of a Voltorb Flip game board (Pokemon HeartGold/SoulSilver). "
    +"Read the hint tiles on the RIGHT side (rows 1-5 top to bottom) and BOTTOM (columns 1-5 left to right). "
    +"Each hint tile shows two numbers: top=point sum, bottom=Voltorb count. "
    +"Return ONLY valid JSON:\n"
    +"{\"rows\":[{\"pts\":X,\"v\":X},{\"pts\":X,\"v\":X},{\"pts\":X,\"v\":X},{\"pts\":X,\"v\":X},{\"pts\":X,\"v\":X}],"
    +"\"cols\":[{\"pts\":X,\"v\":X},{\"pts\":X,\"v\":X},{\"pts\":X,\"v\":X},{\"pts\":X,\"v\":X},{\"pts\":X,\"v\":X}]}";
  fetch('https://api.anthropic.com/v1/messages',{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:300,
      messages:[{role:'user',content:[
        {type:'image',source:{type:'base64',media_type:mt,data:b64}},
        {type:'text',text:prompt}
      ]}]})
  })
  .then(function(r){return r.json();})
  .then(function(data){
    var text=data.content&&data.content[0]&&data.content[0].text;
    if(!text){document.getElementById('scanresult').innerHTML='AI scan failed.';return;}
    text=text.replace(/```json|```/g,'').trim();
    var p; try{p=JSON.parse(text);}catch(e){document.getElementById('scanresult').innerHTML='Parse error: '+text;return;}
    if(!p.rows||!p.cols||p.rows.length!==5||p.cols.length!==5){document.getElementById('scanresult').innerHTML='Unexpected format.';return;}
    window._scanResult=p;
    var html='<table border="1" cellpadding="3"><tr><th></th><th>Pts</th><th>V</th></tr>';
    for(var i=0;i<5;i++) html+='<tr><td>Row '+(i+1)+'</td><td>'+p.rows[i].pts+'</td><td>'+p.rows[i].v+'</td></tr>';
    html+='</table>&nbsp;<table border="1" cellpadding="3"><tr><th></th><th>Pts</th><th>V</th></tr>';
    for(var i=0;i<5;i++) html+='<tr><td>Col '+(i+1)+'</td><td>'+p.cols[i].pts+'</td><td>'+p.cols[i].v+'</td></tr>';
    html+='</table>';
    document.getElementById('scanresult').innerHTML='AI scan complete. Review then click Apply.<br/>'+html;
    document.getElementById('applybtn').style.display='inline';
  })
  .catch(function(e){document.getElementById('scanresult').innerHTML='Error: '+e.message;});
}

function applyScannedHints(){
  var d=window._scanResult;if(!d)return;
  for(var i=0;i<5;i++){document.getElementById('rs'+i).value=d.rows[i].pts;document.getElementById('rv'+i).value=d.rows[i].v;}
  for(var i=0;i<5;i++){document.getElementById('cs'+i).value=d.cols[i].pts;document.getElementById('cv'+i).value=d.cols[i].v;}
  initUserBoard();skipped={};doSolve();
}

function startCamera(){
  navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}}).then(function(s){
    var v=document.getElementById('camvideo');v.srcObject=s;v.style.display='block';
    document.getElementById('capturebtn').style.display='inline';
    document.getElementById('stopcambtn').style.display='inline';
    window._cam=s;
  }).catch(function(){document.getElementById('scanresult').innerHTML='Camera denied.';});
}
function captureFrame(){
  var v=document.getElementById('camvideo'),c=document.createElement('canvas');
  c.width=v.videoWidth;c.height=v.videoHeight;c.getContext('2d').drawImage(v,0,0);
  c.toBlob(function(b){processImage(new File([b],'cap.jpg',{type:'image/jpeg'}));});
}
function stopCamera(){
  if(window._cam) window._cam.getTracks().forEach(function(t){t.stop();});
  document.getElementById('camvideo').style.display='none';
  document.getElementById('capturebtn').style.display='none';
  document.getElementById('stopcambtn').style.display='none';
}

(function(){
  initUserBoard();
  var t=document.getElementById('boardtable');
  var html='<tr><th class="ch"></th>';
  for(var c=0;c<5;c++) html+='<th class="ch">'+'ABCDE'[c]+'</th>';
  html+='<th></th></tr>';
  for(var y=0;y<5;y++){
    html+='<tr><th style="padding:0 4px;font-weight:normal;font-size:0.85em">'+(y+1)+'</th>';
    for(var x=0;x<5;x++){
      html+='<td class="cell" id="celltd'+y+'_'+x+'" onclick="clickCell('+x+','+y+')">'
           +'<div id="cell'+y+'_'+x+'"><div class="val">?</div><div class="sub"></div></div></td>';
    }
    html+='<td class="hint">Pts:&nbsp;<input type="number" id="rs'+y+'" value="0" min="0" max="15" onchange="doSolve()"/><br/>'
         +'V:&nbsp;&nbsp;<input type="number" id="rv'+y+'" value="0" min="0" max="5" onchange="doSolve()"/></td></tr>';
  }
  html+='<tr><td></td>';
  for(var x=0;x<5;x++)
    html+='<td class="hint" align="center">P:<input type="number" id="cs'+x+'" value="0" min="0" max="15" onchange="doSolve()"/><br/>'
         +'V:<input type="number" id="cv'+x+'" value="0" min="0" max="5" onchange="doSolve()"/></td>';
  html+='<td></td></tr>';
  t.innerHTML=html;
  setupDrop();
})();

//]]>
