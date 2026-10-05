// SOMDA Week 2026 — lightweight interactions
(function(){
  const body = document.body;
  requestAnimationFrame(()=>requestAnimationFrame(()=>body.classList.add('loaded')));

  // Color theme: system / dark / light (persisted, follows OS in system mode)
  const THEME_KEY = 'somda-theme';
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  let themeMode = 'system';
  try{ themeMode = localStorage.getItem(THEME_KEY) || 'system'; }catch(e){}
  if(!['system','dark','light'].includes(themeMode)) themeMode = 'system';
  function applyTheme(mode){
    themeMode = mode;
    const eff = mode === 'system' ? (mq.matches ? 'dark' : 'light') : mode;
    document.documentElement.dataset.theme = eff;
    try{ localStorage.setItem(THEME_KEY, mode); }catch(e){}
    document.querySelectorAll('[data-set-theme]').forEach(b=>{
      b.setAttribute('aria-pressed', String(b.dataset.setTheme === mode));
    });
  }
  document.querySelectorAll('[data-set-theme]').forEach(b=>{
    b.addEventListener('click', ()=>applyTheme(b.dataset.setTheme));
  });
  if(typeof mq.addEventListener === 'function'){
    mq.addEventListener('change', ()=>{ if(themeMode === 'system') applyTheme('system'); });
  }
  applyTheme(themeMode);

  // Smooth anchor offset (CSS handles most; this keeps fixed header clearance for older browsers)
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const id = a.getAttribute('href');
      if(id.length>1){
        const el = document.querySelector(id);
        if(el){ e.preventDefault(); closeMenu(); el.scrollIntoView({behavior: reducedMotion()?'auto':'smooth', block:'start'}); history.replaceState(null,'',id); }
      }
    });
  });

  function reducedMotion(){ return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }

  // Scroll reveal
  const io = new IntersectionObserver(entries=>{
    entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
  },{threshold:.12, rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  // Active nav + progress
  const links = [...document.querySelectorAll('[data-nav]')];
  const secs = links.map(a=>document.querySelector('#'+a.dataset.nav)).filter(Boolean);
  const bar = document.getElementById('progressBar');
  const secIO = new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        links.forEach(a=>a.classList.toggle('active', a.dataset.nav===en.target.id));
      }
    });
  },{rootMargin:'-40% 0px -55% 0px'});
  secs.forEach(s=>secIO.observe(s));
  const onScroll = ()=>{
    const h = document.documentElement;
    const p = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
    if(bar) bar.style.width = (p*100).toFixed(2)+'%';
  };
  document.addEventListener('scroll', onScroll, {passive:true}); onScroll();

  // Subtle parallax for photo highlight
  const pimg = document.querySelector('.photo-media img');
  if(pimg && !reducedMotion() && matchMedia('(pointer:fine)').matches){
    let ticking=false;
    document.addEventListener('scroll', ()=>{
      if(ticking) return; ticking=true;
      requestAnimationFrame(()=>{
        const r = pimg.parentElement.getBoundingClientRect();
        const vh = innerHeight;
        if(r.top < vh && r.bottom > 0){
          const t = (r.top + r.height/2 - vh/2) / vh; // -0.5..0.5
          pimg.style.transform = `translateY(${(-t*36).toFixed(1)}px)`;
        }
        ticking=false;
      });
    }, {passive:true});
  }

  // Custom cursor
  const cursor = document.querySelector('.cursor');
  if(cursor && matchMedia('(pointer:fine)').matches && !reducedMotion()){
    let x=0,y=0,cx=0,cy=0,raf=null;
    addEventListener('mousemove',e=>{ x=e.clientX; y=e.clientY; if(!raf) loop(); });
    function loop(){
      cx += (x-cx)*.2; cy += (y-cy)*.2;
      cursor.style.transform = `translate(${cx}px,${cy}px)`;
      raf = (Math.abs(x-cx)>.3||Math.abs(y-cy)>.3) ? requestAnimationFrame(loop) : (raf=null, requestAnimationFrame(()=>{cursor.style.transform=`translate(${x}px,${y}px)`;}));
    }
    document.querySelectorAll('a,.btn,button,.hl-media').forEach(el=>{
      el.addEventListener('mouseenter',()=>cursor.classList.add('grow'));
      el.addEventListener('mouseleave',()=>cursor.classList.remove('grow'));
    });
  } else if(cursor){ cursor.style.display='none'; }

  // Gallery lightbox (works with placeholders: caption still shows if file missing)
  const items = [...document.querySelectorAll('.g-item')];
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbCap = document.getElementById('lbCap');
  const lbCount = document.getElementById('lbCount');
  const lbPh = document.getElementById('lbPh');
  let idx = 0, lastFocus = null;
  function show(i){
    if(!items.length || !lb) return;
    idx = (i + items.length) % items.length;
    const it = items[idx];
    const full = it.dataset.full;
    const cap = it.dataset.cap || '';
    const thumb = it.querySelector('img');
    lastFocus = lastFocus || document.activeElement;
    lbImg.classList.remove('is-missing');
    lbImg.onerror = ()=>lbImg.classList.add('is-missing');
    lbImg.src = full;
    lbImg.alt = (thumb && !thumb.classList.contains('is-missing')) ? thumb.alt : cap;
    lbCap.textContent = cap;
    if(lbPh) lbPh.textContent = 'PHOTO ' + (idx+1) + ' / ' + items.length;
    if(lbCount) lbCount.textContent = (idx+1) + ' / ' + items.length;
    lb.hidden = false;
    body.style.overflow = 'hidden';
    const c = document.getElementById('lbClose'); if(c) c.focus();
  }
  function hide(){
    if(!lb || lb.hidden) return;
    lb.hidden = true;
    body.style.overflow = '';
    lbImg.removeAttribute('src');
    if(lastFocus && lastFocus.focus) lastFocus.focus();
  }
  items.forEach((b,i)=>b.addEventListener('click',()=>{ lastFocus = b; show(i); }));
  if(lb){
    lb.querySelectorAll('[data-lb-close]').forEach(el=>el.addEventListener('click',hide));
    const c=document.getElementById('lbClose'); if(c) c.addEventListener('click',hide);
    const p=document.getElementById('lbPrev'); if(p) p.addEventListener('click',e=>{e.stopPropagation();show(idx-1);});
    const n=document.getElementById('lbNext'); if(n) n.addEventListener('click',e=>{e.stopPropagation();show(idx+1);});
    document.addEventListener('keydown',e=>{
      if(!lb.hidden){
        if(e.key==='Escape') hide();
        if(e.key==='ArrowRight') show(idx+1);
        if(e.key==='ArrowLeft') show(idx-1);
      }
    });
  }

  // Mobile menu
  const btn = document.querySelector('.menu-btn');
  const menu = document.getElementById('mobileMenu');
  function closeMenu(){ if(!menu||menu.hidden) return; menu.hidden=true; btn.setAttribute('aria-expanded','false'); btn.setAttribute('aria-label','Open menu'); }
  if(btn&&menu){
    btn.addEventListener('click',()=>{
      const open = menu.hidden;
      menu.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open?'Close menu':'Open menu');
    });
    menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  }
})();
