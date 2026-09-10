/* Polar Consulting Group — trilingual static site generator
   Produces: index.html (ca, default), es.html, en.html, sitemap.xml, robots.txt
   Single template + i18n dictionary. Mobile-first, SEO-optimized for Catalonia. */
const fs = require('fs');

const BASE = 'https://polarconsultinggroup.com';
const EMAIL = 'info@polarconsultinggroup.com';
const WA = '34647069850';
const WA_DISPLAY = '647 06 98 50';
const WAICON = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" style="vertical-align:-4px"><path fill="currentColor" d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15h-.01c-1.52 0-3.01-.41-4.3-1.18l-.31-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.37c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.69 8.23-8.23 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28z"/></svg>';
const FILES = { en: 'index.html', es: 'es.html', ca: 'ca.html' };
const URLS  = { en: BASE + '/', es: BASE + '/es.html', ca: BASE + '/ca.html' };
const OGLOC = { ca: 'ca_ES', es: 'es_ES', en: 'en_US' };
const TOWNS = ['Barcelona','Madrid','París','Berlín','Amsterdam','Milà','Lisboa','Dublín','Londres','Zúric'];

const META = {
  en: {
    title: 'Technology Consulting across Europe | AI, Web, CRM & Marketing · Polar Consulting Group',
    desc: 'Technology consulting across Europe. Expert in AI, web development, CRM, lead generation and marketing for businesses throughout Europe. Clear strategy, flawless execution and measurable results. Based in Barcelona, working remotely across the continent.'
  },
  es: {
    title: 'Consultoría tecnológica en Europa | IA, Web, CRM y Marketing · Polar Consulting Group',
    desc: 'Consultoría tecnológica en toda Europa. Experto en IA, desarrollo web, CRM, captación y marketing para empresas de toda Europa. Estrategia clara y resultados medibles. Con base en Barcelona, en remoto por todo el continente.'
  },
  ca: {
    title: 'Consultoria tecnològica a Europa | IA, Web, CRM i Màrqueting · Polar Consulting Group',
    desc: 'Consultoria tecnològica arreu d’Europa. Expert en IA, desenvolupament web, CRM, captació i màrqueting per a empreses d’arreu d’Europa. Estratègia clara i resultats mesurables. Amb base a Barcelona, en remot per tot el continent.'
  }
};

const T = {
  ca: {
    htmllang:'ca', skip:'Salta al contingut',
    nav:['Serveis','Procés','Europa','Contacte'], navcta:'Parlem-ne', menu:'Menú',
    eyebrow:'Consultoria tecnològica · Europa', badge:'Idees humanes.<br>Sistemes intel·ligents.',
    h1a:'IA, web i dades', h1b:'que treballen', h1c:'per tu.',
    lead:'Expert en IA, desenvolupament web, CRM, captació i màrqueting. Estratègia clara, execució impecable i resultats que es mesuren. Al teu costat, arreu d’Europa.',
    cta1:'Reserva una trucada', cta2:'Veure serveis', down:'Avall',
    ticker:['Intel·ligència Artificial','Desenvolupament Web','CRM i Dades','Captació','Màrqueting','Automatització'],
    svc_h:'Tecnologia que treballa pel teu negoci.',
    svc_p:'Un únic punt de contacte per resoldre el tècnic de cap a peus — sense agències disperses ni peces soltes.',
    svc:[
      ['Intel·ligència Artificial','Agents, automatitzacions i models a mida que executen tasques i t’alliberen temps real.'],
      ['Desenvolupament Web','Webs ràpides, modernes i pensades per convertir. Disseny i codi de primer nivell.'],
      ['CRM i Dades','La teva informació ordenada, connectada i treballant perquè venguis més i millor.'],
      ['Captació','Sistemes de generació de leads que omplen el teu pipeline d’oportunitats reals.'],
      ['Màrqueting','Campanyes amb criteri, mesura rigorosa i un retorn que pots defensar.'],
      ['Automatització','Processos que s’executen sols, sense fricció i sense errors manuals.']
    ],
    proc_h:'Un mètode clar,<br>de la idea al resultat.',
    proc_p:'Sense fum. Diagnòstic, pla prioritzat per impacte, execució ràpida i millora contínua.',
    proc:[
      ['Diagnòstic','Entenc el teu negoci, els teus números i on hi ha els colls d’ampolla.'],
      ['Estratègia','Dissenyem el pla i prioritzem per impacte i esforç, no per modes.'],
      ['Implementació','Construeixo i poso en marxa, ràpid i amb la qualitat que es nota.'],
      ['Optimització','Mesurem, iterem i escalem el que de veritat funciona.']
    ],
    mar_h:'Al costat d’empreses d’arreu d’Europa.',
    mar_p:'Remot primer, presencial quan importa. Amb base a Barcelona i disponible arreu d’Europa — parlem el teu idioma.',
    mar_more:'i tota Europa',
    towns:['Barcelona','Madrid','París','Berlín','Amsterdam','Milà','Lisboa','Dublín','Londres','Zúric'],
    cta_h:'Llestos per marcar el <span class="gold">nord</span>?',
    cta_p:'Explica’m què vols aconseguir. En una trucada de 30 minuts et dic, sense rodeigs, com ho abordaria.',
    cta_b1:'Reserva consultoria', wa:'Escriu-nos al WhatsApp',
    foot_tag:'Consulting Group', foot_note:'Consultoria tecnològica a Europa · IA, web, CRM, captació i màrqueting.',
    foot_links:'Navegació', foot_contact:'Contacte'
  },
  es: {
    htmllang:'es', skip:'Saltar al contenido',
    nav:['Servicios','Proceso','Europa','Contacto'], navcta:'Hablemos', menu:'Menú',
    eyebrow:'Consultoría tecnológica · Europa', badge:'Ideas humanas.<br>Sistemas inteligentes.',
    h1a:'IA, web y datos', h1b:'que trabajan', h1c:'por ti.',
    lead:'Experto en IA, desarrollo web, CRM, captación y marketing. Estrategia clara, ejecución impecable y resultados que se miden. A tu lado, en toda Europa.',
    cta1:'Reservar una llamada', cta2:'Ver servicios', down:'Scroll',
    ticker:['Inteligencia Artificial','Desarrollo Web','CRM y Datos','Captación','Marketing','Automatización'],
    svc_h:'Tecnología que trabaja por tu negocio.',
    svc_p:'Un único punto de contacto para resolver lo técnico de punta a punta — sin agencias dispersas ni piezas sueltas.',
    svc:[
      ['Inteligencia Artificial','Agentes, automatizaciones y modelos a medida que ejecutan tareas y te liberan tiempo real.'],
      ['Desarrollo Web','Webs rápidas, modernas y pensadas para convertir. Diseño y código de primer nivel.'],
      ['CRM y Datos','Tu información ordenada, conectada y trabajando para que vendas más y mejor.'],
      ['Captación','Sistemas de generación de leads que llenan tu pipeline de oportunidades reales.'],
      ['Marketing','Campañas con criterio, medición rigurosa y un retorno que puedes defender.'],
      ['Automatización','Procesos que se ejecutan solos, sin fricción y sin errores manuales.']
    ],
    proc_h:'Un método claro,<br>de la idea al resultado.',
    proc_p:'Sin humo. Diagnóstico, plan priorizado por impacto, ejecución rápida y mejora continua.',
    proc:[
      ['Diagnóstico','Entiendo tu negocio, tus números y dónde están los cuellos de botella.'],
      ['Estrategia','Diseñamos el plan y priorizamos por impacto y esfuerzo, no por modas.'],
      ['Implementación','Construyo y pongo en marcha, rápido y con la calidad que se nota.'],
      ['Optimización','Medimos, iteramos y escalamos lo que de verdad funciona.']
    ],
    mar_h:'Junto a empresas de toda Europa.',
    mar_p:'Remoto primero, presencial cuando importa. Con base en Barcelona y disponible en toda Europa — hablamos tu idioma.',
    mar_more:'y toda Europa',
    towns:['Barcelona','Madrid','París','Berlín','Ámsterdam','Milán','Lisboa','Dublín','Londres','Zúrich'],
    cta_h:'¿Listos para marcar el <span class="gold">norte</span>?',
    cta_p:'Cuéntame qué quieres conseguir. En una llamada de 30 minutos te digo, sin rodeos, cómo lo abordaría.',
    cta_b1:'Reservar consultoría', wa:'Escríbenos por WhatsApp',
    foot_tag:'Consulting Group', foot_note:'Consultoría tecnológica en Europa · IA, web, CRM, captación y marketing.',
    foot_links:'Navegación', foot_contact:'Contacto'
  },
  en: {
    htmllang:'en', skip:'Skip to content',
    nav:['Services','Process','Europe','Contact'], navcta:'Let’s talk', menu:'Menu',
    eyebrow:'Technology consulting · Europe', badge:'Human ideas.<br>Smart systems.',
    h1a:'AI, web & data', h1b:'that work', h1c:'for you.',
    lead:'Expert in AI, web development, CRM, lead generation and marketing. Clear strategy, flawless execution and results you can measure. By your side, across Europe.',
    cta1:'Book a call', cta2:'See services', down:'Scroll',
    ticker:['Artificial Intelligence','Web Development','CRM & Data','Lead Generation','Marketing','Automation'],
    svc_h:'Technology that works for your business.',
    svc_p:'A single point of contact for everything technical — no scattered agencies, no loose ends.',
    svc:[
      ['Artificial Intelligence','Custom agents, automations and models that get work done and give you real time back.'],
      ['Web Development','Fast, modern websites built to convert. Top-tier design and code.'],
      ['CRM & Data','Your data organized, connected and working so you sell more and better.'],
      ['Lead Generation','Lead engines that fill your pipeline with real opportunities.'],
      ['Marketing','Campaigns with judgment, rigorous measurement and a return you can defend.'],
      ['Automation','Processes that run themselves — no friction, no manual errors.']
    ],
    proc_h:'A clear method,<br>from idea to result.',
    proc_p:'No smoke. Diagnosis, an impact-first plan, fast execution and continuous improvement.',
    proc:[
      ['Diagnosis','I learn your business, your numbers and where the bottlenecks are.'],
      ['Strategy','We design the plan and prioritize by impact and effort, not hype.'],
      ['Implementation','I build and ship — fast, with quality you can feel.'],
      ['Optimization','We measure, iterate and scale what truly works.']
    ],
    mar_h:'Working with businesses across Europe.',
    mar_p:'Remote-first, on-site when it counts. Based in Barcelona and available throughout Europe — we speak your language.',
    mar_more:'and all of Europe',
    towns:['Barcelona','Madrid','Paris','Berlin','Amsterdam','Milan','Lisbon','Dublin','London','Zurich'],
    cta_h:'Ready to set your <span class="gold">true north</span>?',
    cta_p:'Tell me what you want to achieve. In a 30-minute call I’ll tell you, no fluff, how I’d approach it.',
    cta_b1:'Book a consultation', wa:'Message us on WhatsApp',
    foot_tag:'Consulting Group', foot_note:'Technology consulting across Europe · AI, web, CRM, lead generation and marketing.',
    foot_links:'Navigation', foot_contact:'Contact'
  }
};

const ICONS = ['◆','⬡','▦','◎','✦','⟳'];

const STYLE = `
  :root{--ink:#0C0C0D;--ink2:#141416;--surf:#181819;--line:rgba(247,245,241,.10);--bone:#F7F5F1;--stone:#9A9893;--stone2:#6E6C68;--gold:#F5CF00;--r:14px;--maxw:1180px}
  *{margin:0;padding:0;box-sizing:border-box}
  html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
  body{background:var(--ink);color:var(--bone);font-family:'Archivo',system-ui,sans-serif;font-weight:400;line-height:1.6;overflow-x:hidden;-webkit-font-smoothing:antialiased}
  ::selection{background:var(--gold);color:#000}
  a{color:inherit;text-decoration:none}
  .gold{color:var(--gold)}
  .sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}
  .skip{position:absolute;left:12px;top:-60px;background:var(--gold);color:#1a1500;padding:10px 16px;border-radius:8px;z-index:400;transition:top .2s;font-weight:600}
  .skip:focus{top:12px}
  .wrap{max-width:var(--maxw);margin:0 auto;padding:0 24px}
  .eyebrow{font-size:11px;font-weight:600;letter-spacing:.34em;text-transform:uppercase;color:var(--gold)}
  #progress{position:fixed;top:0;left:0;height:3px;width:0;background:var(--gold);z-index:200}
  #cursor,#cursor-dot{position:fixed;top:0;left:0;pointer-events:none;z-index:300;border-radius:50%;mix-blend-mode:difference;transform:translate(-50%,-50%);will-change:left,top}
  #cursor{width:34px;height:34px;border:1px solid #fff;transition:width .25s,height .25s,background .25s}
  #cursor-dot{width:5px;height:5px;background:#fff}
  #cursor.hover{width:62px;height:62px;background:rgba(255,255,255,.12);border-color:transparent}
  @media (hover:none),(pointer:coarse){#cursor,#cursor-dot{display:none}}
  nav{position:fixed;top:0;left:0;right:0;z-index:150;padding:16px 0;transition:padding .35s,background .35s,border-color .35s;border-bottom:1px solid transparent}
  nav.scrolled{padding:11px 0;background:rgba(12,12,13,.78);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom:1px solid var(--line)}
  .nav-in{display:flex;align-items:center;justify-content:space-between;gap:16px}
  .brand{font-weight:800;font-size:21px;letter-spacing:-.02em}
  .brand span{color:var(--gold)}
  .brand-img{height:22px;display:block}
  .nav-right{display:flex;align-items:center;gap:14px}
  .lang{display:flex;gap:8px;font-size:12px;font-weight:600;letter-spacing:.04em}
  .lang a{color:var(--stone2)}
  .lang a.on{color:var(--gold)}
  .nav-links{display:none;align-items:center;gap:28px;font-size:14px;font-weight:500}
  .nav-links a.lnk{color:var(--stone);transition:color .2s}
  .nav-links a.lnk:hover{color:var(--bone)}
  .btn{display:inline-flex;align-items:center;justify-content:center;gap:9px;font-weight:600;font-size:14px;padding:12px 20px;border-radius:8px;cursor:pointer;border:1px solid transparent;transition:transform .15s,background .25s,color .25s;font-family:inherit}
  .btn-gold{background:var(--gold);color:#1a1500}
  .btn-gold:hover{background:#ffe24d}
  .btn-ghost{border-color:var(--line);color:var(--bone)}
  .btn-ghost:hover{border-color:var(--bone)}
  .btn-wa{background:#25D366;color:#06351c}
  .btn-wa:hover{background:#1ebe5a}
  .wa-float{position:fixed;right:20px;bottom:20px;z-index:160;width:56px;height:56px;border-radius:50%;background:#25D366;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(0,0,0,.28);transition:transform .2s}
  .wa-float:hover{transform:scale(1.08)}
  .wa-float svg{width:30px;height:30px}
  .menu-btn{display:inline-flex;flex-direction:column;gap:5px;background:none;border:0;cursor:pointer;padding:8px 4px}
  .menu-btn span{display:block;width:24px;height:2px;background:var(--bone);transition:transform .3s,opacity .3s}
  .menu-btn.open span:nth-child(1){transform:translateY(7px) rotate(45deg)}
  .menu-btn.open span:nth-child(2){opacity:0}
  .menu-btn.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
  #mobile-menu{position:fixed;inset:0;z-index:140;background:rgba(12,12,13,.97);backdrop-filter:blur(8px);display:flex;flex-direction:column;justify-content:center;gap:8px;padding:0 28px;transform:translateX(100%);transition:transform .4s cubic-bezier(.16,1,.3,1)}
  #mobile-menu.open{transform:none}
  #mobile-menu a.mlnk{font-size:32px;font-weight:800;letter-spacing:-.02em;color:var(--bone);padding:9px 0}
  #mobile-menu .btn{margin-top:22px;align-self:flex-start;font-size:16px;padding:14px 24px}
  .hero{position:relative;min-height:100svh;display:flex;align-items:center;overflow:hidden}
  #aurora{position:absolute;inset:0;width:100%;height:100%;z-index:0}
  .hero::after{content:"";position:absolute;inset:0;z-index:1;background:radial-gradient(120% 90% at 50% 0%,transparent 42%,rgba(12,12,13,.65) 100%);pointer-events:none}
  .hero-in{position:relative;z-index:2;width:100%;padding-top:120px;padding-bottom:108px}
  .hero h1{font-weight:800;letter-spacing:-.03em;line-height:1.1;font-size:clamp(31px,7.7vw,104px);margin:26px 0 0}
  .hero h1 .ln{display:block;overflow:visible}
  .hero h1 .ln i{display:inline-block;font-style:normal;transform:none}
  .hero p.lead{max-width:600px;margin:28px 0 0;font-size:clamp(16px,4.4vw,20px);line-height:1.65;color:#d8d6d0;opacity:0;transform:translateY(20px);transition:all .8s ease .5s}
  .hero .cta{display:flex;gap:12px;margin-top:38px;flex-wrap:wrap;opacity:0;transform:translateY(20px);transition:all .8s ease .65s}
  .hero .cta .btn{flex:1 1 auto;min-width:160px}
  .hero.in p.lead,.hero.in .cta{opacity:1;transform:none}
  .scroll-hint{position:absolute;bottom:20px;left:50%;transform:translateX(-50%);z-index:2;font-size:10px;letter-spacing:.3em;text-transform:uppercase;color:var(--stone);display:flex;flex-direction:column;align-items:center;gap:9px}
  .scroll-hint .bar{width:1px;height:38px;background:linear-gradient(var(--gold),transparent);animation:drop 1.8s infinite}
  @keyframes drop{0%{transform:scaleY(0);transform-origin:top}50%{transform:scaleY(1);transform-origin:top}50.1%{transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}
  .ticker{border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:18px 0;white-space:nowrap;overflow:hidden;position:relative;z-index:2;background:var(--ink)}
  .ticker-track{display:inline-flex;gap:42px;animation:scrollx 26s linear infinite;will-change:transform}
  .ticker-track span{font-size:clamp(18px,5vw,32px);font-weight:700;letter-spacing:-.02em;color:#26262a;display:inline-flex;align-items:center;gap:42px}
  .ticker-track span::after{content:"✦";color:var(--gold);font-size:.5em}
  @keyframes scrollx{to{transform:translateX(-50%)}}
  section.block{padding:84px 0;position:relative}
  .sec-head{margin-bottom:48px}
  .sec-head h2{font-weight:800;letter-spacing:-.03em;line-height:1.04;font-size:clamp(30px,7vw,58px);max-width:760px}
  .sec-head p{max-width:440px;color:var(--stone);font-size:16px;margin-top:18px}
  .rv{opacity:0;transform:translateY(30px);transition:opacity .8s cubic-bezier(.16,1,.3,1),transform .8s cubic-bezier(.16,1,.3,1)}
  .rv.in{opacity:1;transform:none}
  .svc-grid{display:grid;grid-template-columns:1fr;gap:16px}
  .svc{position:relative;padding:30px 26px 34px;border:1px solid var(--line);border-radius:var(--r);background:var(--ink2);overflow:hidden;transition:transform .35s,border-color .35s}
  .svc::before{content:"";position:absolute;inset:0;background:radial-gradient(420px 200px at var(--mx,50%) var(--my,0%),rgba(245,207,0,.12),transparent 70%);opacity:0;transition:opacity .4s}
  .svc:hover{transform:translateY(-6px);border-color:rgba(245,207,0,.45)}
  .svc:hover::before{opacity:1}
  .svc .ico{font-size:24px;line-height:1;color:var(--bone)}
  .svc h3{font-size:22px;font-weight:700;letter-spacing:-.02em;margin:16px 0 10px}
  .svc p{color:var(--stone);font-size:15px}
  .proc{display:grid;grid-template-columns:1fr;gap:0}
  .step{padding:26px 0 30px;border-top:1px solid var(--line)}
  .step .pnum{font-size:clamp(44px,12vw,72px);font-weight:800;letter-spacing:-.04em;color:transparent;-webkit-text-stroke:1.4px var(--stone2);line-height:1;transition:color .4s,-webkit-text-stroke .4s}
  .step:hover .pnum{color:var(--gold);-webkit-text-stroke:1.4px var(--gold)}
  .step h4{font-size:19px;font-weight:700;margin:18px 0 8px;letter-spacing:-.01em}
  .step p{color:var(--stone);font-size:15px}
  .maresme{padding:84px 0;background:var(--ink2);position:relative}
  .maresme h2{font-weight:800;letter-spacing:-.03em;line-height:1.04;font-size:clamp(28px,6.5vw,52px);max-width:680px}
  .maresme p{color:var(--stone);font-size:16px;max-width:560px;margin-top:18px}
  .towns{display:flex;flex-wrap:wrap;gap:10px;margin-top:30px}
  .town{border:1px solid var(--line);border-radius:30px;padding:9px 16px;font-size:14px;font-weight:500;color:#cfcdc7;transition:border-color .25s,color .25s}
  .town:hover{border-color:var(--gold);color:var(--bone)}
  .town.more{background:var(--gold);color:#1a1500;border-color:var(--gold);font-weight:600}
  .cta-final{padding:96px 0;text-align:center;position:relative;overflow:hidden}
  .cta-final h2{font-weight:800;letter-spacing:-.035em;line-height:1.02;font-size:clamp(36px,9vw,86px)}
  .cta-final p{color:var(--stone);max-width:520px;margin:20px auto 0;font-size:16px}
  .cta-final .cta{display:flex;gap:12px;justify-content:center;margin-top:34px;flex-wrap:wrap}
  .glow{position:absolute;width:min(560px,90vw);height:min(560px,90vw);left:50%;top:50%;transform:translate(-50%,-50%);background:radial-gradient(circle,rgba(245,207,0,.15),transparent 62%);z-index:-1;pointer-events:none}
  footer{border-top:1px solid var(--line);padding:46px 0 40px}
  .foot-in{display:flex;flex-direction:column;gap:28px}
  .foot-brand{font-weight:800;font-size:25px;letter-spacing:-.02em}
  .foot-brand span{color:var(--gold)}
  .foot-img{height:26px;display:block}
  .foot-tag{color:var(--stone2);font-size:12px;letter-spacing:.3em;text-transform:uppercase;margin-top:6px}
  .foot-col h5{font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:var(--stone2);margin-bottom:12px;font-weight:600}
  .foot-col{display:flex;flex-direction:column;gap:9px;font-size:14px;color:var(--stone)}
  .foot-col a{transition:color .2s}
  .foot-col a:hover{color:var(--gold)}
  .foot-note{margin-top:34px;color:var(--stone2);font-size:13px;line-height:1.6}
  @media(min-width:600px){.svc-grid{grid-template-columns:1fr 1fr}.foot-in{flex-direction:row;justify-content:space-between;gap:30px}.hero .cta .btn{flex:0 0 auto}}
  @media(min-width:820px){.menu-btn{display:none}#mobile-menu{display:none}.nav-links{display:flex}.wrap{padding:0 32px}section.block{padding:120px 0}.sec-head{display:flex;align-items:flex-end;justify-content:space-between;gap:30px}.sec-head p{margin-top:0}.proc{grid-template-columns:repeat(4,1fr)}.step{border-top:none;border-left:1px solid var(--line);padding:30px 26px 36px}.step:first-child{border-left:none}.maresme,.cta-final{padding:120px 0}.hero h1{font-size:clamp(56px,7.6vw,104px);line-height:1}.hero h1 .ln{overflow:hidden}.hero h1 .ln i{transform:translateY(110%);transition:transform .9s cubic-bezier(.16,1,.3,1)}}
  @media(min-width:980px){.svc-grid{grid-template-columns:repeat(3,1fr)}}
  @media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}.hero h1 .ln i{transform:none}.hero p.lead,.hero .cta,.rv{opacity:1;transform:none}}
`;

const LIGHT_STYLE = `
  :root{--ink:#18312d;--ink2:#fff;--surf:#fff;--line:rgba(24,49,45,.13);--bone:#18312d;--stone:#5d6c68;--stone2:#7b8985;--gold:#F5CF00;--sky:#9dd9f3;--coral:#ff8068;--cream:#f8f5ed;--r:24px;--maxw:1240px}
  body{background:var(--cream);color:var(--ink);font-family:'Manrope',system-ui,sans-serif}
  .wrap{padding-left:22px;padding-right:22px}.eyebrow{color:var(--ink);font-weight:800;letter-spacing:.18em}
  #cursor,#cursor-dot,#aurora,.scroll-hint{display:none!important}#progress{height:4px}
  nav{padding:20px 0}nav.scrolled{padding:12px 0;background:rgba(248,245,237,.88);border-color:var(--line)}
  .brand-img{height:28px}.lang a{color:#78827f}.lang a.on{color:var(--ink);text-decoration:underline;text-decoration-color:var(--gold);text-decoration-thickness:4px;text-underline-offset:5px}
  .nav-links a.lnk{color:var(--ink)}.nav-links a.lnk:hover{color:#000}.menu-btn span{background:var(--ink)}
  #mobile-menu{background:var(--cream)}#mobile-menu a.mlnk{color:var(--ink)}
  .btn{border-radius:999px;padding:13px 22px}.btn-gold{color:var(--ink);box-shadow:0 5px 0 var(--ink)}.btn-gold:hover{transform:translateY(-2px);box-shadow:0 7px 0 var(--ink)}
  .btn-ghost{border-color:var(--ink);color:var(--ink);background:rgba(255,255,255,.6)}
  .hero{min-height:auto;padding:132px 0 72px}.hero::after{display:none}.hero-in{padding:0;display:grid;gap:46px;align-items:center}
  .hero-copy{position:relative;z-index:2}.hero h1{font-family:'DM Serif Display',serif;font-weight:400;font-size:clamp(52px,8vw,108px);line-height:.92;letter-spacing:-.045em;margin-top:24px}.hero h1 .gold{color:var(--ink);position:relative;display:inline-block}.hero h1 .gold:after{content:"";position:absolute;left:-2%;right:-2%;bottom:.04em;height:.18em;background:var(--gold);z-index:-1;border-radius:10px;transform:rotate(-1deg)}
  .hero p.lead{color:var(--stone);font-size:18px;max-width:580px}.hero-visual{position:relative;min-height:430px}.hero-photo{width:100%;height:100%;min-height:430px;object-fit:cover;border-radius:42% 42% 18px 18px;box-shadow:18px 18px 0 var(--gold)}
  .hero-badge{position:absolute;left:-18px;bottom:28px;width:126px;height:126px;border-radius:50%;background:var(--coral);display:grid;place-items:center;text-align:center;font-size:13px;font-weight:800;line-height:1.25;transform:rotate(-8deg);border:3px solid var(--cream)}
  .ticker{background:var(--sky);border:0;padding:16px 0;transform:rotate(-1deg);width:102%;margin-left:-1%}.ticker-track span{color:var(--ink);font-weight:800}
  section.block{padding:94px 0}.sec-head h2,.maresme h2,.cta-final h2{font-family:'DM Serif Display',serif;font-weight:400;letter-spacing:-.035em}.sec-head h2{font-size:clamp(42px,6vw,72px)}.sec-head p{color:var(--stone)}
  .svc-grid{gap:18px}.svc{border:0;background:#fff;padding:32px;border-radius:var(--r);box-shadow:0 12px 32px rgba(24,49,45,.06)}.svc:nth-child(2),.svc:nth-child(5){background:#eaf7fc}.svc:nth-child(3),.svc:nth-child(6){background:#fff1ec}.svc:hover{border:0;transform:translateY(-7px) rotate(.5deg)}.svc::before{display:none}.svc .ico{color:var(--ink);width:48px;height:48px;border-radius:16px;background:var(--gold);display:grid;place-items:center}.svc h3{font-size:21px}.svc p{color:var(--stone)}
  #proces{background:var(--sky)!important}.proc{gap:14px}.step{border:0!important;background:rgba(255,255,255,.72);padding:28px;border-radius:22px}.step .pnum{color:var(--ink);-webkit-text-stroke:0;font-size:28px}.step:hover .pnum{color:var(--coral);-webkit-text-stroke:0}
  .maresme{background:#fff;padding:100px 0}.people-band{display:grid;gap:40px;align-items:center}.people-photo{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:24px 90px 24px 24px}.town{border-color:var(--ink);color:var(--ink);background:#fff}.town.more{color:var(--ink)}
  .cta-final{margin:30px 18px 70px;padding:90px 0;background:var(--gold);border-radius:34px}.cta-final p{color:var(--ink)}.cta-final .btn-gold{background:var(--ink);color:#fff;box-shadow:none}.cta-final .btn-ghost{background:transparent}.glow{display:none}
  footer{background:var(--ink);color:#fff;border:0}.foot-col,.foot-note,.foot-tag{color:#b9c4c1}.foot-img{filter:none}.wa-float{box-shadow:0 8px 24px rgba(24,49,45,.24)}
  @media(min-width:820px){.hero-in{grid-template-columns:1.05fr .95fr}.hero{padding:145px 0 92px}.hero-visual{height:600px}.hero-photo{min-height:600px}.people-band{grid-template-columns:.9fr 1.1fr}.cta-final{margin-left:32px;margin-right:32px}.step{padding:30px 25px}.proc{gap:14px}.sec-head{align-items:start}}
  @media(max-width:819px){.hero h1 .ln i{transform:none!important}.hero-visual{order:-1;min-height:360px}.hero-photo{min-height:360px}.hero-badge{left:6px}.hero{padding-top:105px}.cta-final{margin-left:10px;margin-right:10px}.brand-img{height:23px}}
`;

const SCRIPT = `
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nav=document.getElementById('nav'), prog=document.getElementById('progress');
  function onScroll(){var h=document.documentElement,st=h.scrollTop||document.body.scrollTop,max=h.scrollHeight-h.clientHeight;prog.style.width=(max>0?(st/max*100):0)+'%';nav.classList.toggle('scrolled',st>40);}
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();
  var mb=document.getElementById('menuBtn'), mm=document.getElementById('mobile-menu');
  if(mb){mb.addEventListener('click',function(){var o=mm.classList.toggle('open');mb.classList.toggle('open',o);mb.setAttribute('aria-expanded',o);document.body.style.overflow=o?'hidden':'';});
    mm.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){mm.classList.remove('open');mb.classList.remove('open');document.body.style.overflow='';});});}
  window.addEventListener('load',function(){document.querySelector('.hero').classList.add('in');
    if(window.matchMedia('(min-width:820px)').matches){document.querySelectorAll('.hero h1 .ln i').forEach(function(el,i){el.style.transitionDelay=(0.15+i*0.12)+'s';el.style.transform='translateY(0)';});}});
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:0.14});
  document.querySelectorAll('.rv').forEach(function(el,i){el.style.transitionDelay=(i%3*0.07)+'s';io.observe(el);});
  if(window.matchMedia('(hover:hover) and (pointer:fine)').matches){
    var cur=document.getElementById('cursor'),dot=document.getElementById('cursor-dot'),cx=innerWidth/2,cy=innerHeight/2,dx=cx,dy=cy;
    document.addEventListener('mousemove',function(e){cx=e.clientX;cy=e.clientY;dot.style.left=cx+'px';dot.style.top=cy+'px';});
    (function loop(){dx+=(cx-dx)*0.18;dy+=(cy-dy)*0.18;cur.style.left=dx+'px';cur.style.top=dy+'px';requestAnimationFrame(loop);})();
    document.querySelectorAll('[data-cursor]').forEach(function(el){el.addEventListener('mouseenter',function(){cur.classList.add('hover');});el.addEventListener('mouseleave',function(){cur.classList.remove('hover');});});
    document.querySelectorAll('.mag').forEach(function(el){el.addEventListener('mousemove',function(e){var r=el.getBoundingClientRect(),mx=e.clientX-(r.left+r.width/2),my=e.clientY-(r.top+r.height/2);el.style.transform='translate('+mx*0.25+'px,'+my*0.35+'px)';});el.addEventListener('mouseleave',function(){el.style.transform='';});});
    document.querySelectorAll('.svc').forEach(function(el){el.addEventListener('mousemove',function(e){var r=el.getBoundingClientRect();el.style.setProperty('--mx',(e.clientX-r.left)+'px');el.style.setProperty('--my',(e.clientY-r.top)+'px');});});
  }
  var canvas=document.getElementById('aurora'); if(!canvas) return; var ctx=canvas.getContext('2d');
  var W,H,DPR,blobs=[],stars=[],pal=[[245,207,0],[200,175,0],[120,150,200],[230,225,215]];
  function size(){DPR=Math.min(window.devicePixelRatio||1,2);W=canvas.clientWidth=canvas.offsetWidth;H=canvas.clientHeight=canvas.offsetHeight;canvas.width=W*DPR;canvas.height=H*DPR;ctx.setTransform(DPR,0,0,DPR,0,0);}
  function init(){var nb=W<700?4:5;blobs=[];for(var i=0;i<nb;i++){var c=pal[i%pal.length];blobs.push({x:Math.random()*W,y:Math.random()*H,r:Math.max(W,H)*(0.28+Math.random()*0.22),vx:(Math.random()-.5)*0.18,vy:(Math.random()-.5)*0.18,c:c,a:0.15+Math.random()*0.12});}
    stars=[];var n=Math.min(W<700?80:150,Math.floor(W*H/9000));for(var j=0;j<n;j++){stars.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.5+0.3,s:Math.random()*0.25+0.04,t:Math.random()*Math.PI*2,tw:Math.random()*0.02+0.005});}}
  function frame(){ctx.clearRect(0,0,W,H);ctx.fillStyle='#0C0C0D';ctx.fillRect(0,0,W,H);ctx.globalCompositeOperation='lighter';
    for(var i=0;i<blobs.length;i++){var b=blobs[i];b.x+=b.vx;b.y+=b.vy;if(b.x<-b.r)b.x=W+b.r;if(b.x>W+b.r)b.x=-b.r;if(b.y<-b.r)b.y=H+b.r;if(b.y>H+b.r)b.y=-b.r;var g=ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,b.r);g.addColorStop(0,'rgba('+b.c[0]+','+b.c[1]+','+b.c[2]+','+b.a+')');g.addColorStop(1,'rgba('+b.c[0]+','+b.c[1]+','+b.c[2]+',0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.fill();}
    ctx.globalCompositeOperation='source-over';for(var s=0;s<stars.length;s++){var st=stars[s];st.y-=st.s;st.t+=st.tw;if(st.y<-2){st.y=H+2;st.x=Math.random()*W;}var al=0.35+Math.abs(Math.sin(st.t))*0.6;ctx.fillStyle='rgba(247,245,241,'+al+')';ctx.beginPath();ctx.arc(st.x,st.y,st.r,0,Math.PI*2);ctx.fill();}
    requestAnimationFrame(frame);}
  size();init();if(!reduce){frame();}else{ctx.fillStyle='#0C0C0D';ctx.fillRect(0,0,W,H);}
  var rt;window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){size();init();},200);});
})();
`;

function ld(lang){
  const m = META[lang];
  const obj = {
    "@context":"https://schema.org","@type":"ProfessionalService",
    "name":"Polar Consulting Group","description":m.desc,"url":URLS[lang],
    "email":EMAIL,"image":BASE+"/og-image.png","logo":BASE+"/logo.png","priceRange":"€€",
    "inLanguage":lang,
    "areaServed":[{"@type":"Place","name":"Europe"},{"@type":"Country","name":"Spain"},{"@type":"Country","name":"France"},{"@type":"Country","name":"Germany"},{"@type":"Country","name":"Netherlands"},{"@type":"Country","name":"Italy"},{"@type":"Country","name":"Portugal"},{"@type":"Country","name":"Ireland"},{"@type":"Country","name":"United Kingdom"},{"@type":"Country","name":"Switzerland"}],
    "address":{"@type":"PostalAddress","addressLocality":"Barcelona","addressRegion":"Catalunya","addressCountry":"ES"},
    "geo":{"@type":"GeoCoordinates","latitude":41.3874,"longitude":2.1686},
    "availableLanguage":["ca","es","en"],
    "knowsAbout":["Intel·ligència Artificial","Desenvolupament web","CRM","Captació de clients","Màrqueting digital","Automatització"],
    "hasOfferCatalog":{"@type":"OfferCatalog","name":"Serveis","itemListElement":T[lang].svc.map(function(s){return {"@type":"Offer","itemOffered":{"@type":"Service","name":s[0],"description":s[1]}};})}
  };
  return JSON.stringify(obj);
}

function altLinks(){
  return [
    '<link rel="alternate" hreflang="ca" href="'+URLS.ca+'">',
    '<link rel="alternate" hreflang="es" href="'+URLS.es+'">',
    '<link rel="alternate" hreflang="en" href="'+URLS.en+'">',
    '<link rel="alternate" hreflang="x-default" href="'+URLS.en+'">'
  ].join('\n');
}

function langSwitch(lang){
  return ['en','es','ca'].map(function(l){
    return '<a href="'+FILES[l]+'"'+(l===lang?' class="on" aria-current="true"':'')+' hreflang="'+l+'">'+l.toUpperCase()+'</a>';
  }).join('');
}

function page(lang){
  const t=T[lang], m=META[lang];
  const navLinks = t.nav.map(function(n,i){var ids=['#serveis','#proces','#maresme','#contacte'];return '<a href="'+ids[i]+'" class="lnk" data-cursor>'+n+'</a>';}).join('');
  const mLinks = t.nav.map(function(n,i){var ids=['#serveis','#proces','#maresme','#contacte'];return '<a href="'+ids[i]+'" class="mlnk">'+n+'</a>';}).join('');
  const svc = t.svc.map(function(s,i){return '<article class="svc rv" data-cursor><div class="ico" aria-hidden="true">'+ICONS[i]+'</div><h3>'+s[0]+'</h3><p>'+s[1]+'</p></article>';}).join('');
  const proc = t.proc.map(function(s,i){return '<div class="step rv" data-cursor><div class="pnum">0'+(i+1)+'</div><h4>'+s[0]+'</h4><p>'+s[1]+'</p></div>';}).join('');
  const ticker = t.ticker.concat(t.ticker).map(function(x){return '<span>'+x+'</span>';}).join('');
  const towns = t.towns.map(function(x){return '<span class="town">'+x+'</span>';}).join('')+'<span class="town more">'+t.mar_more+'</span>';

  return '<!DOCTYPE html>\n<html lang="'+t.htmllang+'">\n<head>\n'+
  '<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n'+
  '<title>'+m.title+'</title>\n'+
  '<meta name="description" content="'+m.desc+'">\n'+
  '<link rel="canonical" href="'+URLS[lang]+'">\n'+altLinks()+'\n'+
  '<meta name="theme-color" content="#F8F5ED">\n'+
  '<link rel="icon" type="image/svg+xml" href="/favicon.svg">\n'+
  '<link rel="icon" type="image/png" sizes="64x64" href="/favicon.png">\n'+
  '<link rel="apple-touch-icon" href="/apple-touch-icon.png">\n'+
  '<meta property="og:type" content="website">\n'+
  '<meta property="og:locale" content="'+OGLOC[lang]+'">\n'+
  '<meta property="og:title" content="'+m.title+'">\n'+
  '<meta property="og:description" content="'+m.desc+'">\n'+
  '<meta property="og:url" content="'+URLS[lang]+'">\n'+
  '<meta property="og:site_name" content="Polar Consulting Group">\n'+
  '<meta property="og:image" content="'+BASE+'/og-image.png">\n'+
  '<meta name="twitter:card" content="summary_large_image">\n'+
  '<meta name="twitter:title" content="'+m.title+'">\n'+
  '<meta name="twitter:description" content="'+m.desc+'">\n'+
  '<meta name="twitter:image" content="'+BASE+'/og-image.png">\n'+
  '<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'+
  '<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">\n'+
  '<script type="application/ld+json">'+ld(lang)+'</'+'script>\n'+
  '<style>'+STYLE+LIGHT_STYLE+'</style>\n</head>\n<body>\n'+
  '<a href="#main" class="skip">'+t.skip+'</a>\n'+
  '<div id="progress"></div>\n<div id="cursor"></div>\n<div id="cursor-dot"></div>\n'+
  '<nav id="nav"><div class="wrap nav-in">'+
    '<a href="#top" class="brand" data-cursor><img src="/logo-dark.svg" alt="Polar Consulting Group" class="brand-img"></a>'+
    '<div class="nav-right">'+
      '<div class="lang" role="navigation" aria-label="Idioma">'+langSwitch(lang)+'</div>'+
      '<div class="nav-links">'+navLinks+'<a href="#contacte" class="btn btn-gold mag" data-cursor>'+t.navcta+'</a></div>'+
      '<button class="menu-btn" id="menuBtn" aria-label="'+t.menu+'" aria-expanded="false"><span></span><span></span><span></span></button>'+
    '</div></div></nav>\n'+
  '<div id="mobile-menu">'+mLinks+'<a href="#contacte" class="btn btn-gold">'+t.navcta+'</a></div>\n'+
  '<header class="hero" id="top"><canvas id="aurora" aria-hidden="true"></canvas>'+
    '<div class="wrap hero-in"><div class="hero-copy"><p class="eyebrow rv">'+t.eyebrow+'</p>'+
    '<h1><span class="ln"><i>'+t.h1a+'</i></span><span class="ln"><i class="gold">'+t.h1b+'</i></span><span class="ln"><i>'+t.h1c+'</i></span></h1>'+
    '<p class="lead">'+t.lead+'</p>'+
    '<div class="cta"><a href="#contacte" class="btn btn-gold mag" data-cursor>'+t.cta1+'</a><a href="#serveis" class="btn btn-ghost mag" data-cursor>'+t.cta2+'</a></div></div><div class="hero-visual"><img src="/team-barcelona.jpg" alt="A collaborative technology team working together in Barcelona" class="hero-photo" width="1536" height="1024"><div class="hero-badge">'+t.badge+'</div></div></div>'+
    '<div class="scroll-hint" aria-hidden="true"><span>'+t.down+'</span><span class="bar"></span></div></header>\n'+
  '<div class="ticker" aria-hidden="true"><div class="ticker-track">'+ticker+'</div></div>\n'+
  '<main id="main">\n'+
  '<section class="block" id="serveis"><div class="wrap"><div class="sec-head"><h2 class="rv">'+t.svc_h+'</h2><p class="rv">'+t.svc_p+'</p></div><div class="svc-grid">'+svc+'</div></div></section>\n'+
  '<section class="block" id="proces" style="background:var(--ink2)"><div class="wrap"><div class="sec-head"><h2 class="rv">'+t.proc_h+'</h2><p class="rv">'+t.proc_p+'</p></div><div class="proc">'+proc+'</div></div></section>\n'+
  '<section class="maresme" id="maresme"><div class="wrap people-band"><div><h2 class="rv">'+t.mar_h+'</h2><p class="rv">'+t.mar_p+'</p><div class="towns rv">'+towns+'</div></div><img src="/team-barcelona.jpg" alt="People collaborating in a bright Barcelona studio" class="people-photo rv" loading="lazy" width="1536" height="1024"></div></section>\n'+
  '<section class="cta-final" id="contacte"><div class="glow" aria-hidden="true"></div><div class="wrap"><h2 class="rv">'+t.cta_h+'</h2><p class="rv">'+t.cta_p+'</p><div class="cta rv"><a href="https://wa.me/'+WA+'" class="btn btn-wa mag" data-cursor>'+WAICON+' '+t.wa+'</a><a href="https://wa.me/'+WA+'" class="btn btn-gold mag" data-cursor target="_blank" rel="noopener">'+t.cta_b1+'</a><a href="mailto:'+EMAIL+'" class="btn btn-ghost mag" data-cursor>'+EMAIL+'</a></div></div></section>\n'+
  '</main>\n'+
  '<a class="wa-float" href="https://wa.me/'+WA+'" aria-label="WhatsApp '+WA_DISPLAY+'" target="_blank" rel="noopener">'+WAICON+'</a>\n'+
  '<footer><div class="wrap foot-in">'+
    '<div><div class="foot-brand"><img src="/logo-white.svg" alt="Polar Consulting Group" class="foot-img"></div><div class="foot-tag">'+t.foot_tag+'</div></div>'+
    '<div class="foot-col"><h5>'+t.foot_links+'</h5><a href="#serveis">'+t.nav[0]+'</a><a href="#proces">'+t.nav[1]+'</a><a href="#maresme">'+t.nav[2]+'</a><a href="#contacte">'+t.nav[3]+'</a></div>'+
    '<div class="foot-col"><h5>'+t.foot_contact+'</h5><a href="mailto:'+EMAIL+'" data-cursor>'+EMAIL+'</a><a href="'+BASE+'">polarconsultinggroup.com</a></div>'+
  '</div><div class="wrap foot-note">© 2026 Polar Consulting Group · '+t.foot_note+'</div></footer>\n'+
  '<script>'+SCRIPT+'</'+'script>\n</body>\n</html>\n';
}

Object.keys(FILES).forEach(function(lang){ fs.writeFileSync(FILES[lang], page(lang)); console.log('wrote', FILES[lang]); });

const sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'+
  ['en','es','ca'].map(function(l){
    var alts = ['en','es','ca'].map(function(x){return '    <xhtml:link rel="alternate" hreflang="'+x+'" href="'+URLS[x]+'"/>';}).join('\n')+'\n    <xhtml:link rel="alternate" hreflang="x-default" href="'+URLS.en+'"/>';
    return '  <url>\n    <loc>'+URLS[l]+'</loc>\n'+alts+'\n    <changefreq>monthly</changefreq>\n    <priority>'+(l==='en'?'1.0':'0.8')+'</priority>\n  </url>';
  }).join('\n')+'\n</urlset>\n';
fs.writeFileSync('sitemap.xml', sm); console.log('wrote sitemap.xml');

fs.writeFileSync('robots.txt', 'User-agent: *\nAllow: /\n\nSitemap: '+BASE+'/sitemap.xml\n'); console.log('wrote robots.txt');
console.log('done');
