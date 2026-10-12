(function(){
  var d=document,de=d.documentElement,w=window;
  /* mobile menu with scroll lock */
  var btn=d.querySelector('.burger'),menu=d.getElementById('menu'),head=d.querySelector('.head'),savedY=0,open=false;
  function lock(){
    savedY=w.scrollY;
    var r=head.getBoundingClientRect();
    head.style.position='fixed';head.style.top=r.top+'px';head.style.left='0';head.style.zIndex='51';
    menu.style.setProperty('--mtop',r.bottom+'px');
    de.classList.add('locked');
    var b=d.body.style;b.position='fixed';b.top=(-savedY)+'px';b.left='0';b.right='0';b.width='100%';
  }
  function unlock(after){
    var b=d.body.style;b.position=b.top=b.left=b.right=b.width='';
    head.style.position=head.style.top=head.style.left=head.style.zIndex='';
    de.classList.remove('locked');
    de.style.scrollBehavior='auto';
    try{w.scrollTo({top:savedY,left:0,behavior:'instant'})}catch(e){w.scrollTo(0,savedY)}
    function fix(){if(Math.abs(w.scrollY-savedY)>1){try{w.scrollTo({top:savedY,left:0,behavior:'instant'})}catch(e){w.scrollTo(0,savedY)}}}
    requestAnimationFrame(function(){fix();requestAnimationFrame(function(){fix();
      de.style.scrollBehavior='';
      requestAnimationFrame(function(){if(after)after();});
    });});
  }
  function setOpen(v,after){
    if(!btn||v===open)return;open=v;
    btn.setAttribute('aria-expanded',v?'true':'false');
    btn.setAttribute('aria-label',v?'Закрыть меню':'Меню');
    if(v){lock();menu.hidden=false;var f=menu.querySelector('a');if(f)f.focus({preventScroll:true});}
    else{menu.hidden=true;unlock(after);btn.focus({preventScroll:true});}
  }
  if(btn&&menu){
    btn.addEventListener('click',function(){setOpen(!open)});
    menu.addEventListener('click',function(e){
      var a=e.target.closest('a');if(!a)return;
      var h=a.getAttribute('href')||'',i=h.indexOf('#');
      var t=i>-1&&(h.slice(0,i)===''||a.pathname===location.pathname)?d.getElementById(h.slice(i+1)):null;
      if(t){e.preventDefault();setOpen(false,function(){
        var smooth=!w.matchMedia('(prefers-reduced-motion: reduce)').matches;
        t.scrollIntoView({behavior:smooth?'smooth':'auto',block:'start'});
        if(history.pushState)history.pushState(null,'','#'+t.id);
      });}
      else setOpen(false);
    });
    d.addEventListener('keydown',function(e){
      if(!open)return;
      if(e.key==='Escape'){setOpen(false);return;}
      if(e.key==='Tab'){
        var f=[btn].concat([].slice.call(menu.querySelectorAll('a')));
        var k=f.indexOf(d.activeElement);
        if(e.shiftKey&&k<=0){e.preventDefault();f[f.length-1].focus();}
        else if(!e.shiftKey&&k===f.length-1){e.preventDefault();f[0].focus();}
      }
    });
    w.matchMedia('(min-width:960px)').addEventListener('change',function(m){if(m.matches)setOpen(false)});
  }
  /* map on click */
  [].forEach.call(d.querySelectorAll('[data-map]'),function(m){
    var b=m.querySelector('button');if(!b)return;
    b.addEventListener('click',function(){
      var f=d.createElement('iframe');f.src=m.getAttribute('data-map');f.title='Карта: Ошарская улица, 21';f.loading='eager';f.allowFullscreen=true;
      m.appendChild(f);b.remove();m.classList.add('map--on');
    });
  });
  /* carousels */
  [].forEach.call(d.querySelectorAll('[data-car]'),function(c){
    var tr=c.querySelector('.car__track'),sl=tr.children,n=sl.length,i=0,
        pv=c.querySelector('[data-prev]'),nx=c.querySelector('[data-next]'),ct=c.querySelector('.car__count'),vw=c.querySelector('.car__view');
    function go(k,anim){
      i=Math.max(0,Math.min(n-1,k));
      tr.style.transition=anim===false?'none':'';
      tr.style.transform='translateX('+(-100*i)+'%)';
      pv.disabled=i===0;nx.disabled=i===n-1;ct.textContent=(i+1)+' / '+n;
      for(var j=0;j<n;j++)sl[j].setAttribute('aria-hidden',j===i?'false':'true');
    }
    pv.addEventListener('click',function(){go(i-1)});nx.addEventListener('click',function(){go(i+1)});
    c.addEventListener('keydown',function(e){
      if(e.key==='ArrowLeft'){e.preventDefault();go(i-1)}
      else if(e.key==='ArrowRight'){e.preventDefault();go(i+1)}
      else if(e.key==='Home'){e.preventDefault();go(0)}else if(e.key==='End'){e.preventDefault();go(n-1)}
    });
    var x0=null,y0=0,dx=0,horiz=null;
    function start(x,y){x0=x;y0=y;dx=0;horiz=null;tr.style.transition='none';}
    function move(x,y,e){
      if(x0===null)return;dx=x-x0;var dy=y-y0;
      if(horiz===null&&(Math.abs(dx)>6||Math.abs(dy)>6))horiz=Math.abs(dx)>Math.abs(dy);
      if(horiz){if(e&&e.cancelable)e.preventDefault();tr.style.transform='translateX(calc('+(-100*i)+'% + '+dx+'px))';}
    }
    function end(){
      if(x0===null)return;var W=vw.clientWidth;x0=null;tr.style.transition='';
      if(horiz&&Math.abs(dx)>Math.min(60,W*.18))go(i+(dx<0?1:-1));else go(i);
    }
    vw.addEventListener('touchstart',function(e){var t=e.touches[0];start(t.clientX,t.clientY)},{passive:true});
    vw.addEventListener('touchmove',function(e){var t=e.touches[0];move(t.clientX,t.clientY,e)},{passive:false});
    vw.addEventListener('touchend',end);vw.addEventListener('touchcancel',end);
    vw.addEventListener('mousedown',function(e){e.preventDefault();start(e.clientX,e.clientY)});
    w.addEventListener('mousemove',function(e){if(x0!==null)move(e.clientX,e.clientY)});
    w.addEventListener('mouseup',end);
    go(0,false);
  });
  /* reveal: observe the parent section, with fallbacks */
  var secs=d.querySelectorAll('.sec');
  function all(){[].forEach.call(secs,function(s){s.classList.add('in')})}
  if(!('IntersectionObserver' in w)||w.matchMedia('(prefers-reduced-motion: reduce)').matches){all();}
  else{
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:0,rootMargin:'0px 0px -8% 0px'});
    [].forEach.call(secs,function(s){io.observe(s)});
    function sweep(){var H=w.innerHeight;[].forEach.call(secs,function(s){if(s.getBoundingClientRect().top<H)s.classList.add('in')})}
    w.addEventListener('load',sweep);w.addEventListener('hashchange',sweep);
    setTimeout(all,3000);
  }
})();
