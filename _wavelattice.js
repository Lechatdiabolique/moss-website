<script>
(function(){
  var c=document.getElementById('wlcanvas'); if(!c)return;
  var ctx=c.getContext('2d');
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var BW=140, BH=116;
  var off=document.createElement('canvas'); off.width=BW; off.height=BH;
  var octx=off.getContext('2d'); var img=octx.createImageData(BW,BH);
  var W=560,H=460,DPR=Math.min(devicePixelRatio||1,2);
  function resize(){var r=c.getBoundingClientRect();W=r.width||560;H=r.height||460;c.width=W*DPR;c.height=H*DPR;ctx.setTransform(DPR,0,0,DPR,0,0);}
  resize(); addEventListener('resize',resize);
  var NODES=[], GN=5, sp=15;
  for(var i=0;i<GN;i++)for(var j=0;j<GN;j++){NODES.push([BW*0.52+(i-(GN-1)/2)*sp,BH*0.5+(j-(GN-1)/2)*sp]);}
  var K=0.62, OM=0.07;
  function spectral(t){
    if(t<0.5){var u=t/0.5;return [60+(150-60)*u,175+(112-175)*u,205+(150-205)*u];}
    var u=(t-0.5)/0.5;return [150+(233-150)*u,112+(190-112)*u,150+(106-150)*u];
  }
  var t=0, dist=[];
  // precompute node distances per pixel? skip; compute live
  function render(){
    t+=1; var d=img.data;
    for(var y=0;y<BH;y++){
      for(var x=0;x<BW;x++){
        var f=Math.cos(K*x*0.55 - OM*t)*0.42;
        for(var n=0;n<NODES.length;n++){
          var dx=x-NODES[n][0], dy=y-NODES[n][1];
          var r=Math.sqrt(dx*dx+dy*dy);
          f += Math.cos(K*r - OM*t)/(1.2+r*0.16);
        }
        var hue=Math.max(0,Math.min(1,f*0.42+0.5));
        var col=spectral(hue);
        var inten=Math.pow(Math.min(1,Math.abs(f)*0.30),1.35);
        var idx=(y*BW+x)*4;
        d[idx]=col[0]*inten; d[idx+1]=col[1]*inten; d[idx+2]=col[2]*inten; d[idx+3]=255;
      }
    }
    octx.putImageData(img,0,0);
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle='#17191E'; ctx.fillRect(0,0,W,H);
    ctx.imageSmoothingEnabled=true; ctx.globalCompositeOperation='lighter';
    ctx.drawImage(off,0,0,BW,BH,0,0,W,H);
    ctx.globalCompositeOperation='source-over';
    for(var m=0;m<NODES.length;m++){
      var nx=NODES[m][0]/BW*W, ny=NODES[m][1]/BH*H;
      var g=ctx.createRadialGradient(nx,ny,0,nx,ny,8);
      g.addColorStop(0,'rgba(255,255,255,.95)');g.addColorStop(.45,'rgba(210,245,255,.45)');g.addColorStop(1,'rgba(160,220,255,0)');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(nx,ny,8,0,7); ctx.fill();
    }
    if(!reduce) requestAnimationFrame(render);
  }
  render();
  window.__wl=function(n){for(var i=0;i<n;i++)t++;render();};
})();
</script>
