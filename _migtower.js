<script>
(function(){
  var c=document.getElementById('migcanvas'); if(!c)return;
  var ctx=c.getContext('2d');
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DPR=Math.min(window.devicePixelRatio||1,2);
  var W=560,H=470;
  function resize(){var r=c.getBoundingClientRect();W=r.width||560;H=r.height||470;c.width=W*DPR;c.height=H*DPR;ctx.setTransform(DPR,0,0,DPR,0,0);}
  resize(); addEventListener('resize',resize);
  var rows=[].slice.call(document.querySelectorAll('.mig-row'));
  var cap=document.getElementById('mig-cap');
  var N=6, SPAN=56, DEP=44, TH=16;
  function widthFor(i){return 150 + (N-1-i)*9;}
  function cy(i){return 92 + i*SPAN;}
  function cx(){return W*0.45;}
  var TEAL={top:'#2C6076',fr:'#1C4A5E',sd:'#123848'};
  var MAUVE={top:'#9A7388',fr:'#7C586C',sd:'#573E4E'};
  var GOLD={top:'#E9BE6A',fr:'#CC9F4C',sd:'#9C7430'};
  var GOLDLIT={top:'#F6D689',fr:'#E2B85E',sd:'#B68C40'};
  function lerp(a,b,t){return a+(b-a)*t;}
  function hx(h){return [parseInt(h.substr(1,2),16),parseInt(h.substr(3,2),16),parseInt(h.substr(5,2),16)];}
  function mix(c1,c2,t){var a=hx(c1),b=hx(c2);return 'rgb('+Math.round(lerp(a[0],b[0],t))+','+Math.round(lerp(a[1],b[1],t))+','+Math.round(lerp(a[2],b[2],t))+')';}
  function slab(x,y,w,pal,glow,gcol){
    var d=DEP,th=TH;
    if(glow){ctx.save();ctx.shadowColor=gcol;ctx.shadowBlur=glow;}
    ctx.beginPath();ctx.moveTo(x-w/2,y);ctx.lineTo(x+w/2,y);ctx.lineTo(x+w/2+d,y-d*0.5);ctx.lineTo(x-w/2+d,y-d*0.5);ctx.closePath();ctx.fillStyle=pal.top;ctx.fill();
    if(glow)ctx.restore();
    ctx.save();ctx.globalAlpha=.12;ctx.strokeStyle='#000';ctx.lineWidth=1;
    for(var g=1;g<6;g++){var t=g/6;ctx.beginPath();ctx.moveTo(x-w/2+w*t,y);ctx.lineTo(x-w/2+w*t+d,y-d*0.5);ctx.stroke();}
    ctx.restore();
    ctx.save();ctx.globalAlpha=glow?.95:.28;ctx.strokeStyle=glow?gcol:'rgba(255,255,255,.16)';ctx.lineWidth=glow?2:1;ctx.beginPath();ctx.moveTo(x-w/2,y);ctx.lineTo(x+w/2,y);ctx.stroke();ctx.restore();
    ctx.beginPath();ctx.moveTo(x-w/2,y);ctx.lineTo(x+w/2,y);ctx.lineTo(x+w/2,y+th);ctx.lineTo(x-w/2,y+th);ctx.closePath();ctx.fillStyle=pal.fr;ctx.fill();
    ctx.beginPath();ctx.moveTo(x+w/2,y);ctx.lineTo(x+w/2+d,y-d*0.5);ctx.lineTo(x+w/2+d,y-d*0.5+th);ctx.lineTo(x+w/2,y+th);ctx.closePath();ctx.fillStyle=pal.sd;ctx.fill();
  }
  var CYCLE=8400,t0=null,forced=null;
  function frame(now){
    if(t0===null)t0=now;
    var el=forced!==null?forced:(now-t0)%CYCLE;
    ctx.clearRect(0,0,W,H);
    var prog=(el-500)/640;
    var doneF=Math.max(0,Math.min(1,prog/N));
    var coreX=cx()+DEP/2, coreY=H*0.52;
    var core=ctx.createRadialGradient(coreX,coreY,8,coreX,coreY,W*0.52);
    core.addColorStop(0,'rgba(233,190,106,'+(0.05+0.12*doneF)+')');core.addColorStop(1,'rgba(233,190,106,0)');
    ctx.fillStyle=core;ctx.fillRect(0,0,W,H);
    for(var i=N-1;i>=0;i--){
      var p=prog-i, glow=0, gcol='#E9BE6A', pal;
      if(p>0.6){pal=GOLD;glow=24;}
      else if(p>0){var tt=Math.min(1,p/0.6);pal={top:mix(MAUVE.top,GOLDLIT.top,tt),fr:mix(MAUVE.fr,GOLDLIT.fr,tt),sd:mix(MAUVE.sd,GOLDLIT.sd,tt)};glow=14+18*tt;gcol='#CBA070';}
      else{pal=TEAL;}
      slab(cx(),cy(i),widthFor(i),pal,glow,gcol);
      if(rows[i]){rows[i].classList.toggle('mig-done',p>0.6);rows[i].classList.toggle('mig-active',p>0&&p<=0.6);}
    }
    var done=Math.max(0,Math.min(N,Math.floor(prog-0.6+1)));
    if(cap){cap.innerHTML= done>=N? '<b>6 of 6 categories migrated.</b> Signed ML-DSA-44.' : 'migrating to the post-quantum standard &middot; '+done+' of 6';}
    if(forced===null)requestAnimationFrame(frame);
  }
  if(reduce){forced=9200;requestAnimationFrame(frame);}
  else requestAnimationFrame(frame);
  window.__setmig=function(p){forced=p;requestAnimationFrame(frame);};
})();
</script>
