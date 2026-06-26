<script>
(function(){
  var c=document.getElementById('latcanvas'); if(!c)return;
  var cap=document.getElementById('lat-caption');
  var ctx=c.getContext('2d');
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DPR=Math.min(window.devicePixelRatio||1,2);
  var W=520,H=440;
  function resize(){var r=c.getBoundingClientRect();W=r.width||520;H=r.height||440;c.width=W*DPR;c.height=H*DPR;ctx.setTransform(DPR,0,0,DPR,0,0);}
  resize(); window.addEventListener('resize',resize);
  var COLS=9, ROWS=7, SP=44;
  function pt(i,j,shear){
    var x=(i-(COLS-1)/2)*SP + (j-(ROWS-1)/2)*shear;
    var y=(j-(ROWS-1)/2)*SP*0.60;
    return {x:W/2+x, y:H/2+y, j:j};
  }
  function nearest(tx,ty,shear){
    var best=null,bd=1e9;
    for(var i=0;i<COLS;i++)for(var j=0;j<ROWS;j++){var p=pt(i,j,shear);var d=(p.x-tx)*(p.x-tx)+(p.y-ty)*(p.y-ty);if(d<bd){bd=d;best=p;}}
    return best;
  }
  function dot(x,y,r,col,a){ctx.save();ctx.globalAlpha=a;ctx.shadowColor=col;ctx.shadowBlur=r*3.4;ctx.fillStyle=col;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();ctx.restore();}
  function beam(x1,y1,x2,y2,col,a,w){ctx.save();ctx.globalAlpha=a;ctx.strokeStyle=col;ctx.lineWidth=w||1.5;ctx.shadowColor=col;ctx.shadowBlur=10;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.restore();}
  function rnd(s){var x=Math.sin(s*12.9898)*43758.5453;return x-Math.floor(x);}
  var CYCLE=7200, t0=null, forced=null;
  function frame(now){
    if(t0===null)t0=now;
    var el=forced!==null?forced:(now-t0)%CYCLE;
    ctx.clearRect(0,0,W,H);
    var grd=ctx.createRadialGradient(W/2,H/2,10,W/2,H/2,Math.max(W,H)*0.7);
    grd.addColorStop(0,'rgba(139,92,246,0.06)');grd.addColorStop(1,'rgba(139,92,246,0)');
    ctx.fillStyle=grd;ctx.fillRect(0,0,W,H);
    var shear=0, phase='private';
    if(el<3200){shear=0;phase='private';}
    else if(el<3800){shear=((el-3200)/600)*34;phase='trans';}
    else{shear=34;phase='public';}
    var tx=W/2+72+16*Math.sin(el/950), ty=H/2-26+12*Math.cos(el/1150);
    for(var i=0;i<COLS;i++)for(var j=0;j<ROWS;j++){
      var p=pt(i,j,shear);var depth=j/(ROWS-1);
      dot(p.x,p.y,2.1+depth*1.7,'#8B5CF6',0.26+depth*0.46);
    }
    if(phase==='private'){
      var n=nearest(tx,ty,0);
      var prog=Math.min(1,el/650);
      beam(tx,ty,tx+(n.x-tx)*prog,ty+(n.y-ty)*prog,'#D9C9FF',0.92,2);
      if(prog>=1){var pulse=0.6+0.4*Math.sin(el/180);dot(n.x,n.y,6.4,'#ECE3FF',0.85*pulse+0.15);}
      dot(tx,ty,4.6,'#ffffff',1);
      if(cap)cap.innerHTML='<b style="color:#D9C9FF">Private key.</b> The nearest point is immediate.';
    } else if(phase==='public'){
      var seed=Math.floor((el-3800)/150);
      for(var s=0;s<11;s++){
        var ii=Math.floor(rnd(seed*7+s*3.1)*COLS), jj=Math.floor(rnd(seed*5+s*9.7)*ROWS);
        var p=pt(ii,jj,shear);
        var fl=0.3+0.7*((Math.sin(el/110+s*1.7)+1)/2);
        beam(tx,ty,p.x,p.y,'#E0703A',0.14+0.30*fl,1.2);
        dot(p.x,p.y,2.8,'#D65A4A',0.35+0.45*fl);
      }
      dot(tx,ty,4.6,'#ffffff',1);
      if(cap)cap.innerHTML='<b style="color:#E0703A">Public key.</b> The same search scatters into dead ends, and a quantum computer has no shortcut.';
    } else { dot(tx,ty,4.6,'#ffffff',1); }
    if(forced===null) requestAnimationFrame(frame);
  }
  if(reduce){forced=1500;requestAnimationFrame(frame);}
  else requestAnimationFrame(frame);
  window.__setphase=function(p){forced=p;requestAnimationFrame(frame);};
})();
</script>
