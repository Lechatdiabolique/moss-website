<script>
(function(){
  var root=document.getElementById('migrec'); if(!root)return;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var rowsEl=document.getElementById('mr-rows'), live=document.getElementById('mr-live'), sigval=document.getElementById('mr-sigval'), sig=document.getElementById('mr-sig');
  var CATS=[['Key generation','RSA / ECDSA \u2192 ML-DSA-44'],['Signing','ECDSA \u2192 ML-DSA-44'],['Encryption','RSA \u2192 ML-KEM-768'],['JWT','RS256 / ES256 \u2192 ML-DSA-44'],['TLS','TLS 1.2 \u2192 PQC-hybrid 1.3'],['Hashing','MD5 / SHA-1 \u2192 SHA-256+']];
  var SIG='5edd4561 \u00b7 1f5164f1 \u00b7 036fb039 \u00b7 efccddf2\u2026';
  function build(){rowsEl.innerHTML='';CATS.forEach(function(c){var d=document.createElement('div');d.className='mr-row';d.innerHTML='<span class="mc">'+c[0]+'</span><span class="mm">'+c[1]+'</span><span class="ms"></span>';rowsEl.appendChild(d);});}
  function rows(){return [].slice.call(rowsEl.querySelectorAll('.mr-row'));}
  function done(){if(live){live.innerHTML='<i></i> signed';live.className='mr-live ok';}sig.classList.add('ok');}
  function run(){
    build(); var R=rows(), i=0;
    if(live){live.innerHTML='<i></i> migrating';live.className='mr-live';}
    sigval.textContent='pending'; sig.classList.remove('ok');
    function next(){
      if(i<R.length){R[i].classList.add('mr-ok');i++;setTimeout(next,460);}
      else{setTimeout(function(){var k=0;var iv=setInterval(function(){k++;sigval.textContent=SIG.slice(0,k);if(k>=SIG.length){clearInterval(iv);done();}},16);},420);}
    }
    next();
  }
  if(reduce){build();rows().forEach(function(r){r.classList.add('mr-ok');});sigval.textContent=SIG;done();return;}
  addEventListener('load',function(){setTimeout(run,700);});
  setInterval(run,9400);
})();
</script>
