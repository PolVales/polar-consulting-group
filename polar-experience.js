(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const nav = document.querySelector('#nav');
  const menu = document.querySelector('#mobile-menu');
  const menuButton = document.querySelector('#menuBtn');
  const progress = document.querySelector('#progress');
  const hero = document.querySelector('.hero');
  const scene = document.querySelector('.sculpture');
  const canvas = document.querySelector('#polar-sculpture');
  const controls = document.querySelector('.scene-controls');
  const turnButton = document.querySelector('.scene-switch');
  const pauseButton = document.querySelector('.motion-toggle');
  let scrollAmount = 0;
  function closeMenu() {
    menu.classList.remove('open'); menuButton.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false'); menu.inert = true;
    document.body.style.overflow = '';
  }
  menu.inert = true;
  menuButton.setAttribute('aria-controls', 'mobile-menu');
  menuButton.addEventListener('click', () => {
    if (menu.classList.contains('open')) { closeMenu(); return; }
    menu.classList.add('open'); menuButton.classList.add('open');
    menuButton.setAttribute('aria-expanded', 'true'); menu.inert = false;
    document.body.style.overflow = 'hidden';
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => {
    if (!menu.classList.contains('open')) return;
    if (e.key === 'Escape') { closeMenu(); menuButton.focus(); }
    if (e.key === 'Tab') {
      const items = [menuButton, ...menu.querySelectorAll('a')];
      if (e.shiftKey && document.activeElement === items[0]) { e.preventDefault(); items.at(-1).focus(); }
      else if (!e.shiftKey && document.activeElement === items.at(-1)) { e.preventDefault(); menuButton.focus(); }
    }
  });
  matchMedia('(min-width:820px)').addEventListener('change', closeMenu);
  let scrollFrame = 0;
  function updateScroll() {
    scrollFrame = 0;
    scrollAmount = Math.min(1, Math.max(0, window.scrollY / hero.offsetHeight));
    document.body.classList.toggle('at-hero', scrollAmount < .8);
    nav.classList.toggle('scrolled', window.scrollY > 36);
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = (max > 0 ? window.scrollY / max * 100 : 0) + '%';
    if (!reduced.matches) {
      scene.style.setProperty('--scene-shift', `${scrollAmount * 100}px`);
      scene.style.setProperty('--scene-turn', `${scrollAmount * -16}deg`);
    }
  }
  addEventListener('scroll', () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); }, {passive:true});
  updateScroll();

  let gl;
  try { gl = canvas.getContext('webgl', {alpha:true, antialias:true, powerPreference:'low-power', premultipliedAlpha:false}); } catch(error) { return; }
  if (!gl) return;

  // A closed trefoil tube morphs into a circular tube. Both share the same topology.
  // Geometry and studio reflections are procedural; no models, textures or dependencies.
  const vertexSource = `
    precision highp float;
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    attribute vec3 aRing;
    attribute vec3 aRingNormal;
    uniform mat4 uProjection;
    uniform vec3 uRotation;
    uniform float uMorph;
    uniform float uTime;
    varying vec3 vNormal;
    varying vec3 vPosition;
    mat3 rotation(vec3 a) {
      float cx=cos(a.x),sx=sin(a.x),cy=cos(a.y),sy=sin(a.y),cz=cos(a.z),sz=sin(a.z);
      return mat3(cz,-sz,0.,sz,cz,0.,0.,0.,1.) * mat3(cy,0.,sy,0.,1.,0.,-sy,0.,cy) * mat3(1.,0.,0.,0.,cx,-sx,0.,sx,cx);
    }
    void main() {
      vec3 p=mix(aPosition,aRing,uMorph);
      vec3 n=normalize(mix(aNormal,aRingNormal,uMorph));
      p+=n * .018*sin(p.y*5.+uTime)*sin(p.x*4.-uTime*.7);
      mat3 rot=rotation(uRotation);
      vNormal=rot*n;
      vPosition=rot*p;
      gl_Position=uProjection*vec4(vPosition+vec3(0.,0.,-3.7),1.);
    }
  `;
  const fragmentSource = `
    precision mediump float;
    varying vec3 vNormal;
    varying vec3 vPosition;
    vec3 studio(vec3 r) {
      float horizon=smoothstep(-.3,.4,r.y);
      vec3 c=mix(vec3(.035,.045,.039),vec3(.63,.69,.66),horizon);
      float key=pow(max(0.,dot(r,normalize(vec3(-.8,1.,1.)))),14.);
      float strip=pow(max(0.,dot(r,normalize(vec3(1.,.2,.6)))),32.);
      float top=pow(max(0.,dot(r,normalize(vec3(.1,1.,-.5)))),10.);
      float slit=smoothstep(.015,.045,abs(r.x+.22))* (1.-smoothstep(.13,.19,abs(r.x+.22)));
      c+=vec3(1.2,1.17,1.08)*key + vec3(1.8)*strip + vec3(.75)*top;
      c*=1.-slit*.78;
      float yellow=(1.-smoothstep(.08,.4,abs(r.y+.30)))*smoothstep(-.8,.7,r.x);
      c=mix(c,vec3(.96,.77,.015)*(.3+.7*horizon),yellow*.92);
      return c;
    }
    void main() {
      vec3 n=normalize(vNormal);
      if (!gl_FrontFacing) n=-n;
      vec3 v=normalize(vec3(0.,0.,3.7)-vPosition);
      vec3 r=reflect(-v,n);
      float fresnel=pow(1.-max(dot(n,v),0.),4.);
      vec3 c=studio(r);
      float diffuse=max(0.,dot(n,normalize(vec3(-.5,.8,1.))));
      c=c*(.76+.24*fresnel)+vec3(.085,.09,.078)*diffuse;
      c=c/(c+.62);
      gl_FragColor=vec4(pow(c,vec3(.4545)),1.);
    }
  `;

  let program, buffers = [], uniforms, indicesCount = 0;
  let visible = false, lost = false, paused = false, alternate = false, destroyed = false;
  let raf = 0, last = 0, elapsed = 0, morph = 0, tiltX = 0, tiltY = 0, pointerX = 0, pointerY = 0;
  let width = 1, height = 1;
  const normalize = v => { const d = Math.hypot(...v) || 1; return v.map(x => x/d); };
  const cross = (a,b) => [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  function center(t, ring) {
    if (ring) return [.83*Math.cos(t),.83*Math.sin(t),0];
    const r = .67 + .25 * Math.cos(3*t);
    return [r*Math.cos(2*t),r*Math.sin(2*t),.31*Math.sin(3*t)];
  }
  function surface(t, v, ring) {
    const c=center(t,ring), next=center(t+.0001,ring), prev=center(t-.0001,ring);
    const tangent=normalize(next.map((x,i)=>x-prev[i]));
    const normal=normalize(cross(tangent,[0,0,1])), binormal=cross(tangent,normal);
    const n=normal.map((x,i)=>x*Math.cos(v)+binormal[i]*Math.sin(v));
    return [...c.map((x,i)=>x+n[i]*(ring?.245:.235)),...n];
  }
  function compile(type, source) {
    const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);return shader;
  }
  function init() {
    const vertex=compile(gl.VERTEX_SHADER,vertexSource), fragment=compile(gl.FRAGMENT_SHADER,fragmentSource);
    program=gl.createProgram();gl.attachShader(program,vertex);gl.attachShader(program,fragment);
    gl.bindAttribLocation(program,0,'aPosition');gl.linkProgram(program);
    if (!gl.getProgramParameter(program,gl.LINK_STATUS)) {
      console.warn('Polar sculpture:',gl.getShaderInfoLog(vertex),gl.getShaderInfoLog(fragment));
      gl.deleteShader(vertex);gl.deleteShader(fragment);gl.deleteProgram(program);throw new Error('WebGL unavailable');
    }
    gl.deleteShader(vertex);gl.deleteShader(fragment);gl.useProgram(program);
    const positions=[], normals=[], rings=[], ringNormals=[], indices=[];
    const segments=192, sides=36;
    for(let i=0;i<=segments;i++)for(let j=0;j<=sides;j++){
      const t=i/segments*Math.PI*2, v=j/sides*Math.PI*2;
      const p=surface(t,v,false),r=surface(t,v,true);
      positions.push(...p.slice(0,3));normals.push(...p.slice(3));rings.push(...r.slice(0,3));ringNormals.push(...r.slice(3));
      if(i<segments&&j<sides){const a=i*(sides+1)+j,b=a+sides+1;indices.push(a,b,a+1,b,b+1,a+1);}
    }
    buffers=[];
    [['aPosition',positions],['aNormal',normals],['aRing',rings],['aRingNormal',ringNormals]].forEach(([name,data])=>{
      const buffer=gl.createBuffer();buffers.push(buffer);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);
      const location=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(location);gl.vertexAttribPointer(location,3,gl.FLOAT,false,0,0);
    });
    const indexBuffer=gl.createBuffer();buffers.push(indexBuffer);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices),gl.STATIC_DRAW);indicesCount=indices.length;
    uniforms={};['uProjection','uRotation','uMorph','uTime'].forEach(name=>uniforms[name]=gl.getUniformLocation(program,name));
    gl.enable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);gl.clearColor(0,0,0,0);
    controls.hidden=false;lost=false;resize();
  }
  function resize() {
    if(lost||destroyed)return;
    const r=scene.getBoundingClientRect();width=r.width;height=r.height;
    const dpr=Math.min(devicePixelRatio||1,innerWidth<820?1.3:1.6,1600/Math.max(width,height));
    canvas.width=Math.max(1,Math.round(width*dpr));canvas.height=Math.max(1,Math.round(height*dpr));
    gl.viewport(0,0,canvas.width,canvas.height);
    const aspect=width/height, f=2.7*Math.min(1,aspect), near=.1, far=100;
    gl.uniformMatrix4fv(uniforms.uProjection,false,new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)/(near-far),-1,0,0,2*far*near/(near-far),0]));
    draw();start();
  }
  function draw() {
    if(lost||destroyed)return;
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.uniform3f(uniforms.uRotation,.28+Math.sin(elapsed*.31)*.20+tiltY,-.20+elapsed*.19+tiltX+(reduced.matches?0:scrollAmount*1.7),-.5+Math.sin(elapsed*.24)*.15);
    gl.uniform1f(uniforms.uMorph,morph);gl.uniform1f(uniforms.uTime,elapsed);
    gl.drawElements(gl.TRIANGLES,indicesCount,gl.UNSIGNED_SHORT,0);
    scene.classList.add('is-live');
  }
  function stop(){cancelAnimationFrame(raf);raf=0;last=0;}
  function tick(now) {
    raf=0;if(!visible||document.hidden||paused||reduced.matches||lost||destroyed){last=0;return;}
    if(!last)last=now-33;
    const dt=now-last;
    if(dt>=30){
      const seconds=Math.min(dt/1000,.05);elapsed+=seconds;last=now;
      const ease=1-Math.exp(-seconds*5);
      const target=alternate?1:Math.min(.95,scrollAmount*1.35);
      morph+=(target-morph)*ease;tiltX+=(pointerX-tiltX)*ease;tiltY+=(pointerY-tiltY)*ease;
      draw();
    }
    raf=requestAnimationFrame(tick);
  }
  function start(){if(visible&&!document.hidden&&!paused&&!reduced.matches&&!lost&&!destroyed&&!raf)raf=requestAnimationFrame(tick);}
  try{init();}catch(error){console.warn('Polar: static sculpture enabled.');controls.hidden=true;scene.classList.remove('is-live');buffers.forEach(b=>gl.deleteBuffer(b));return;}
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(scene);
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)start();else stop();},{threshold:.01});observer.observe(hero);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else start();});
  function motionPreference(){
    stop();elapsed=0;tiltX=tiltY=pointerX=pointerY=0;morph=alternate?1:0;
    scene.style.setProperty('--scene-shift','0px');scene.style.setProperty('--scene-turn','0deg');
    pauseButton.hidden=reduced.matches;draw();start();
  }
  pauseButton.hidden=reduced.matches;
  reduced.addEventListener('change',motionPreference);
  pauseButton.addEventListener('click',()=>{
    paused=!paused;pauseButton.setAttribute('aria-pressed',String(paused));
    pauseButton.textContent=paused?'▶':'Ⅱ';pauseButton.setAttribute('aria-label',paused?pauseButton.dataset.play:pauseButton.dataset.pause);
    if(paused)stop();else start();
  });
  turnButton.addEventListener('click',()=>{
    alternate=!alternate;turnButton.setAttribute('aria-pressed',String(alternate));
    if(paused||reduced.matches){morph=alternate?1:0;draw();}else start();
  });
  scene.addEventListener('pointermove',event=>{
    if(reduced.matches||paused)return;
    const r=scene.getBoundingClientRect();pointerX=((event.clientX-r.left)/r.width-.5)*1.5;pointerY=((event.clientY-r.top)/r.height-.5)*.8;
  },{passive:true});
  const release=()=>{pointerX=pointerY=0;};scene.addEventListener('pointerleave',release);scene.addEventListener('pointerup',release);scene.addEventListener('pointercancel',release);
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();lost=true;stop();scene.classList.remove('is-live');controls.hidden=true;});
  canvas.addEventListener('webglcontextrestored',()=>{try{init();start();}catch(error){controls.hidden=true;scene.classList.remove('is-live');}});
  addEventListener('pagehide',event=>{
    stop();if(event.persisted)return;destroyed=true;resizeObserver.disconnect();observer.disconnect();buffers.forEach(b=>gl.deleteBuffer(b));gl.deleteProgram(program);
  });
  addEventListener('pageshow',()=>{if(!destroyed)start();});
})();
