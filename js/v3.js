(function(){
  var d=document,w=window,hero=d.querySelector('.hero');
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  requestAnimationFrame(function(){requestAnimationFrame(function(){hero&&hero.classList.add('go')})});
  var ph=d.querySelector('[data-tilt]'),fine=matchMedia('(pointer:fine)').matches,px=0,py=0;
  if(ph&&fine&&!reduce){
    hero.addEventListener('pointermove',function(e){
      px=e.clientX/innerWidth-.5;py=e.clientY/innerHeight-.5;
      ph.style.setProperty('--ry',(px*8).toFixed(2)+'deg');ph.style.setProperty('--rx',(-py*6).toFixed(2)+'deg');
    });
  }
  if(reduce)return;
  var c=d.createElement('canvas');c.className='dust';c.setAttribute('aria-hidden','true');d.body.appendChild(c);
  var x=c.getContext('2d'),W,H,dpr,motes=[],run=true,idle=0;
  function size(){dpr=Math.min(2,w.devicePixelRatio||1);W=innerWidth;H=innerHeight;c.width=W*dpr;c.height=H*dpr;x.setTransform(dpr,0,0,dpr,0,0)}
  size();w.addEventListener('resize',size);
  for(var i=0;i<22;i++)motes.push({x:Math.random(),y:Math.random(),r:.6+Math.random()*1.4,v:.00008+Math.random()*.00018,a:.15+Math.random()*.35});
  function tick(){
    if(!run)return;
    x.clearRect(0,0,W,H);
    motes.forEach(function(m){m.y-=m.v*16;if(m.y<-.02){m.y=1.02;m.x=Math.random()}
      x.beginPath();x.arc((m.x+px*.02*m.r)*W,m.y*H,m.r,0,6.283);x.fillStyle='rgba(241,232,215,'+m.a+')';x.fill()});
    if(++idle>3600){run=false;return}
    requestAnimationFrame(tick);
  }
  function wake(){idle=0;if(!run&&!d.hidden){run=true;requestAnimationFrame(tick)}}
  d.addEventListener('visibilitychange',function(){if(d.hidden)run=false;else wake()});
  ['pointermove','scroll','touchstart','keydown'].forEach(function(t){w.addEventListener(t,wake,{passive:true})});
  requestAnimationFrame(tick);
})();
