(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const nav = document.querySelector('#nav');
  const menu = document.querySelector('#mobile-menu');
  const button = document.querySelector('#menuBtn');
  const progress = document.querySelector('#progress');
  function closeMenu() {
    menu.classList.remove('open'); button.classList.remove('open');
    button.setAttribute('aria-expanded', 'false'); menu.inert = true;
    document.body.style.overflow = '';
  }
  menu.inert = true;
  button.setAttribute('aria-controls', 'mobile-menu');
  button.addEventListener('click', () => {
    if (menu.classList.contains('open')) return closeMenu();
    menu.classList.add('open'); button.classList.add('open');
    button.setAttribute('aria-expanded', 'true'); menu.inert = false;
    document.body.style.overflow = 'hidden';
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('open')) { closeMenu(); button.focus(); }
  });
  matchMedia('(min-width:820px)').addEventListener('change', closeMenu);
  let scroll = 0;
  function onScroll() {
    scroll = window.scrollY;
    nav.classList.toggle('scrolled', scroll > 40);
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = (max > 0 ? scroll / max * 100 : 0) + '%';
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // A faceted solid rendered by perspective projection: no library or remote model.
  const canvas = document.querySelector('#polar-star');
  const scene = canvas.parentElement;
  const ctx = canvas.getContext('2d');
  if (!ctx) return; // The inline vector remains visible.
  const vertices = [];
  for (let i = 0; i < 16; i++) {
    const angle = i * Math.PI / 8 - Math.PI / 2;
    const radius = i % 2 ? .31 : (i % 4 === 0 ? 1.08 : .75);
    vertices.push([Math.cos(angle) * radius, Math.sin(angle) * radius, 0]);
  }
  vertices.push([0, 0, .32], [0, 0, -.32]);
  const faces = [];
  for (let i = 0; i < 16; i++) {
    faces.push([i, (i + 1) % 16, 16]);
    faces.push([(i + 1) % 16, i, 17]);
  }
  let width = 0, height = 0, visible = false, raf = 0, phase = 0, last = 0;
  let targetX = 0, targetY = 0, tiltX = 0, tiltY = 0;
  function draw() {
    if (!width || !height) return;
    const a = -.20 + Math.sin(phase * .65) * .17 + tiltY;
    const b = -.34 + Math.sin(phase * .45) * .45 + tiltX;
    const z = -.12 + Math.sin(phase * .3) * .10 + (reduce.matches ? 0 : Math.min(scroll / 1700, .5));
    const size = Math.min(width * .40, height * .36);
    const rotated = vertices.map(([x,y,v]) => {
      let yy = y * Math.cos(a) - v * Math.sin(a), zz = y * Math.sin(a) + v * Math.cos(a);
      let xx = x * Math.cos(b) + zz * Math.sin(b); zz = -x * Math.sin(b) + zz * Math.cos(b);
      return [xx * Math.cos(z) - yy * Math.sin(z), xx * Math.sin(z) + yy * Math.cos(z), zz];
    });
    ctx.clearRect(0,0,width,height);
    const shadow = ctx.createRadialGradient(width*.5,height*.86,0,width*.5,height*.86,size*.68);
    shadow.addColorStop(0,'rgba(24,49,45,.12)');shadow.addColorStop(1,'rgba(24,49,45,0)');
    ctx.save();ctx.translate(0,height*.86);ctx.scale(1,.16);ctx.translate(0,-height*.86);
    ctx.fillStyle=shadow;ctx.fillRect(0,0,width,height*3);ctx.restore();
    faces.map((f,i) => ({f,i,depth:f.reduce((s,j)=>s+rotated[j][2],0)/3}))
      .sort((u,v)=>u.depth-v.depth).forEach(({f,i}) => {
        const [p,q,r] = f.map(j=>rotated[j]);
        const u=q.map((v,k)=>v-p[k]), v=r.map((v,k)=>v-p[k]);
        const n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
        const length=Math.hypot(...n); const light=Math.abs((n[0]*-.4+n[1]*-.6+n[2]*.7)/length);
        const cream=i%4===0;const lum=cream?76+light*18:31+light*35;
        ctx.fillStyle=`hsl(${cream?45:49} ${cream?68:96}% ${lum}%)`;
        ctx.strokeStyle=ctx.fillStyle;ctx.lineWidth=.6;ctx.beginPath();
        f.forEach((j,k)=>{const [x,y,depth]=rotated[j];const perspective=3.7/(3.7-depth);
          const px=width*.5+x*size*perspective,py=height*.47+y*size*perspective;
          if(k)ctx.lineTo(px,py);else ctx.moveTo(px,py);
        });ctx.closePath();ctx.fill();ctx.stroke();
      });
    scene.classList.add('rendered');
  }
  function frame(now) {
    raf=0;if (!visible || document.hidden || reduce.matches) {last=0;return;}
    if(now-last>=32){phase+=.018;tiltX+=(targetX-tiltX)*.08;tiltY+=(targetY-tiltY)*.08;draw();last=now;}
    raf=requestAnimationFrame(frame);
  }
  function resume(){if(visible&&!document.hidden&&!reduce.matches&&!raf)raf=requestAnimationFrame(frame);else draw();}
  new ResizeObserver(() => {
    const box=scene.getBoundingClientRect();width=box.width;height=box.height;
    const dpr=Math.min(devicePixelRatio||1,1.75);
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);draw();resume();
  }).observe(scene);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;resume();},{threshold:.01}).observe(scene);
  document.addEventListener('visibilitychange',resume);
  reduce.addEventListener('change',()=>{phase=0;targetX=targetY=tiltX=tiltY=0;draw();resume();});
  scene.addEventListener('pointermove',e=>{
    if(reduce.matches)return;const r=scene.getBoundingClientRect();
    targetX=((e.clientX-r.left)/r.width-.5)*.6;targetY=-((e.clientY-r.top)/r.height-.5)*.35;
  },{passive:true});
  scene.addEventListener('pointerleave',()=>{targetX=targetY=0;});
})();
