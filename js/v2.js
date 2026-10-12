(function(){
  var card=document.querySelector('[data-tilt]');if(!card)return;
  var ph=card.querySelector('.lq__ph');
  if(!matchMedia('(pointer:fine)').matches||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  card.addEventListener('pointermove',function(e){
    var r=ph.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
    ph.style.setProperty('--ry',((x-.5)*10).toFixed(2)+'deg');ph.style.setProperty('--rx',((.5-y)*8).toFixed(2)+'deg');
    ph.style.setProperty('--hx',(x*100).toFixed(1)+'%');ph.style.setProperty('--hy',(y*100).toFixed(1)+'%');
  });
  card.addEventListener('pointerleave',function(){ph.style.setProperty('--rx','0deg');ph.style.setProperty('--ry','0deg')});
  card.addEventListener('pointerdown',function(e){
    var r=card.getBoundingClientRect(),s=document.createElement('span');s.className='ring';
    s.style.left=(e.clientX-r.left)+'px';s.style.top=(e.clientY-r.top)+'px';card.appendChild(s);
    setTimeout(function(){s.remove()},800);
  });
})();
