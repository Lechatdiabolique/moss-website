<script>
(function(){
  var root=document.getElementById('scan'); if(!root)return;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var rows=document.getElementById('scan-rows');
  var pctEl=document.getElementById('scan-pct'), fill=document.getElementById('scan-fill');
  var foot=document.getElementById('scan-foot'), live=document.getElementById('scan-live');
  var F=[
    {f:'jwt/issuer.py:42', a:'RSA-2048 keygen', s:'CRITICAL', c:'crit'},
    {f:'tls/server.go:88', a:'ECDSA P-256', s:'HIGH', c:'high'},
    {f:'auth/token.js:23', a:'JWT RS256', s:'HIGH', c:'high'},
    {f:'crypto/legacy.py:15', a:'MD5 digest', s:'MEDIUM', c:'med'}
  ];
  function row(x){var d=document.createElement('div');d.className='scan-row';d.innerHTML='<span class="sf">'+x.f+'</span><span class="sa">'+x.a+'</span><span class="ss '+x.c+'">'+x.s+'</span>';return d;}
  function setpct(p){pctEl.textContent=p+'%';fill.style.width=p+'%';}
  function reset(){rows.innerHTML='';foot.className='scan-foot';foot.innerHTML='';setpct(0);if(live){live.innerHTML='<i></i> scanning';live.className='scan-live';}}
  function run(){
    reset(); var i=0;
    function next(){
      if(i<F.length){rows.appendChild(row(F[i]));i++;setpct(Math.round(38*i/F.length));setTimeout(next,520);}
      else{if(live){live.innerHTML='<i></i> 4 findings';}setTimeout(fixphase,750);}
    }
    function fixphase(){
      foot.className='scan-foot show';
      foot.innerHTML='<span class="fx">opening fix PR &middot; ML-DSA-44</span>';
      var p=38;var iv=setInterval(function(){p+=4;if(p>=100){p=100;clearInterval(iv);done();}setpct(p);},42);
    }
    function done(){
      if(live){live.innerHTML='<i></i> signed';live.className='scan-live ok';}
      foot.className='scan-foot show ok';
      foot.innerHTML='<span class="chk"></span> PR #214 opened &middot; 4 fixes &middot; signed ML-DSA-44';
    }
    next();
  }
  if(reduce){F.forEach(function(x){rows.appendChild(row(x));});setpct(100);if(live){live.innerHTML='<i></i> signed';live.className='scan-live ok';}foot.className='scan-foot show ok';foot.innerHTML='<span class="chk"></span> PR #214 opened &middot; 4 fixes &middot; signed ML-DSA-44';return;}
  addEventListener('load',function(){setTimeout(run,600);});
  setInterval(run,9500);
})();
</script>
