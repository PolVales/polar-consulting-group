/* Polar Consulting Group — trilingual static site generator
   Produces: index.html (ca, default), es.html, en.html, sitemap.xml, robots.txt
   Single template + i18n dictionary. Mobile-first, SEO-optimized for Catalonia. */
const fs = require('fs');
const crypto = require('crypto');
const assetVersion = crypto.createHash('sha256').update(fs.readFileSync('polar-experience.css')).update(fs.readFileSync('polar-experience.js')).digest('hex').slice(0,10);

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
    desc: 'Technology consulting across Europe. Expert in AI, web development, CRM, lead generation and marketing for businesses throughout Europe. Clear strategy, flawless execution and measurable results. Based in Barcelona, working remotely across the continent.',
    socialTitle: 'Polar Consulting Group · Human ideas, smart systems',
    socialDesc: 'AI, web, CRM and growth for ambitious businesses across Europe.'
  },
  es: {
    title: 'Consultoría tecnológica en Europa | IA, Web, CRM y Marketing · Polar Consulting Group',
    desc: 'Consultoría tecnológica en toda Europa. Experto en IA, desarrollo web, CRM, captación y marketing para empresas de toda Europa. Estrategia clara y resultados medibles. Con base en Barcelona, en remoto por todo el continente.',
    socialTitle: 'Polar Consulting Group · Ideas humanas, sistemas inteligentes',
    socialDesc: 'IA, web, CRM y crecimiento para empresas ambiciosas en toda Europa.'
  },
  ca: {
    title: 'Consultoria tecnològica a Europa | IA, Web, CRM i Màrqueting · Polar Consulting Group',
    desc: 'Consultoria tecnològica arreu d’Europa. Expert en IA, desenvolupament web, CRM, captació i màrqueting per a empreses d’arreu d’Europa. Estratègia clara i resultats mesurables. Amb base a Barcelona, en remot per tot el continent.',
    socialTitle: 'Polar Consulting Group · Idees humanes, sistemes intel·ligents',
    socialDesc: 'IA, web, CRM i creixement per a empreses ambicioses arreu d’Europa.'
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

const EXPERIENCE = {
  en: { first:'Think', second:'forward.', summary:'AI, digital experiences and smarter systems. We turn your next big idea into your next big move.', twist:'Change perspective', pause:'Pause animation', play:'Resume animation', intro:'01 / A new direction', statement:'Less ordinary.<br><em>More possible.</em>', detail:'Technology should open doors. We connect strategy, design and intelligent systems to move your business forward.', image:'A conversation about technology strategy on a Barcelona terrace' },
  es: { first:'Piensa', second:'en grande.', summary:'IA, experiencias digitales y sistemas inteligentes. Convertimos tu próxima gran idea en tu próximo gran paso.', twist:'Cambia de perspectiva', pause:'Pausar animación', play:'Reanudar animación', intro:'01 / Una nueva dirección', statement:'Menos de lo mismo.<br><em>Más posibilidades.</em>', detail:'La tecnología debe abrir puertas. Conectamos estrategia, diseño y sistemas inteligentes para hacer avanzar tu negocio.', image:'Una conversación sobre estrategia tecnológica en una terraza de Barcelona' },
  ca: { first:'Pensa', second:'en gran.', summary:'IA, experiències digitals i sistemes intel·ligents. Convertim la teva pròxima gran idea en el teu pròxim gran pas.', twist:'Canvia de perspectiva', pause:'Pausa l’animació', play:'Reprèn l’animació', intro:'01 / Una nova direcció', statement:'Menys del mateix.<br><em>Més possibilitats.</em>', detail:'La tecnologia ha d’obrir portes. Connectem estratègia, disseny i sistemes intel·ligents per fer avançar el teu negoci.', image:'Una conversa sobre estratègia tecnològica en una terrassa de Barcelona' }
};

function immersiveHero(lang) {
  const t=T[lang],x=EXPERIENCE[lang];
  return `<header class="hero" id="top">
    <div class="hero-topline"><p><span class="status-dot" aria-hidden="true"></span>${t.eyebrow}</p><span class="hero-edition" aria-hidden="true">BARCELONA · 41.38° N / 2.17° E</span></div>
    <h1><span>${x.first}</span><span class="hero-line-two">${x.second}</span></h1>
    <div class="sculpture" aria-hidden="true">
      <svg class="sculpture-fallback" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="metal" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#fff"/><stop offset=".22" stop-color="#a9b1ac"/><stop offset=".36" stop-color="#1e2723"/><stop offset=".48" stop-color="#e9edeb"/><stop offset=".64" stop-color="#fff"/><stop offset=".78" stop-color="#7b847b"/><stop offset=".9" stop-color="#F5CF00"/><stop offset="1" stop-color="#374138"/></linearGradient></defs><path d="M290 135C460 25 560 275 380 445S20 405 120 230 355 230 290 385 20 160 290 135Z" fill="none" stroke="url(#metal)" stroke-width="78" stroke-linecap="round"/></svg>
      <canvas id="polar-sculpture"></canvas>
    </div>
    <div class="scene-controls" hidden><button class="scene-switch" aria-pressed="false">${x.twist}<span aria-hidden="true">↗</span></button><button class="motion-toggle" aria-label="${x.pause}" data-pause="${x.pause}" data-play="${x.play}" aria-pressed="false">Ⅱ</button></div>
    <div class="hero-bottom"><p class="hero-summary">${x.summary}</p><div class="cta"><a href="https://wa.me/${WA}" class="btn btn-gold">${t.navcta} <span aria-hidden="true">↗</span></a><a href="#serveis" class="btn btn-ghost">${t.cta2} <span aria-hidden="true">↓</span></a></div><span class="hero-index" aria-hidden="true">BCN ↗ EUROPE</span></div>
  </header>`;
}


function ld(lang){
  const m = META[lang];
  const obj = {
    "@context":"https://schema.org","@type":"ProfessionalService",
    "name":"Polar Consulting Group","description":m.desc,"url":URLS[lang],
    "email":EMAIL,"image":BASE+"/og-image-v2.jpg","logo":BASE+"/logo.png","priceRange":"€€",
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
  const svc = t.svc.map(function(s,i){return '<article class="svc"><div class="svc-top"><span>0'+(i+1)+' / POLAR</span></div><div class="ico" aria-hidden="true">'+ICONS[i]+'</div><h3>'+s[0]+'</h3><p>'+s[1]+'</p></article>';}).join('');
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
  '<meta property="og:title" content="'+m.socialTitle+'">\n'+
  '<meta property="og:description" content="'+m.socialDesc+'">\n'+
  '<meta property="og:url" content="'+URLS[lang]+'">\n'+
  '<meta property="og:site_name" content="Polar Consulting Group">\n'+
  '<meta property="og:image" content="'+BASE+'/og-image-v2.jpg">\n'+
  '<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n'+
  '<meta name="twitter:card" content="summary_large_image">\n'+
  '<meta name="twitter:title" content="'+m.socialTitle+'">\n'+
  '<meta name="twitter:description" content="'+m.socialDesc+'">\n'+
  '<meta name="twitter:image" content="'+BASE+'/og-image-v2.jpg">\n'+
  '<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'+
  '<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">\n'+
  '<script type="application/ld+json">'+ld(lang)+'</'+'script>\n'+
  '<link rel="stylesheet" href="/polar-experience.css?v='+assetVersion+'">\n</head>\n<body>\n'+
  '<a href="#main" class="skip">'+t.skip+'</a>\n'+
  '<div id="progress" aria-hidden="true"></div>\n'+
  '<nav id="nav"><div class="wrap nav-in">'+
    '<a href="#top" class="brand" data-cursor><img src="/logo-dark.svg" alt="Polar Consulting Group" class="brand-img"></a>'+
    '<div class="nav-right">'+
      '<div class="lang" role="navigation" aria-label="Idioma">'+langSwitch(lang)+'</div>'+
      '<div class="nav-links">'+navLinks+'<a href="#contacte" class="btn btn-gold mag" data-cursor>'+t.navcta+'</a></div>'+
      '<button class="menu-btn" id="menuBtn" aria-label="'+t.menu+'" aria-expanded="false"><span></span><span></span><span></span></button>'+
    '</div></div></nav>\n'+
  '<div id="mobile-menu">'+mLinks+'<a href="#contacte" class="btn btn-gold">'+t.navcta+'</a></div>\n'+
  immersiveHero(lang)+'\n'+
  '<div class="ticker" aria-hidden="true"><div class="ticker-track">'+ticker+'</div></div>\n'+
  '<main id="main">\n'+
  '<section class="manifesto"><div class="wrap"><p class="section-label">'+EXPERIENCE[lang].intro+'</p><h2>'+EXPERIENCE[lang].statement+'</h2><div class="manifesto-bottom"><p>'+EXPERIENCE[lang].detail+'</p><span class="manifesto-arrow" aria-hidden="true">↗</span></div></div></section>\n'+
  '<section class="block" id="serveis"><div class="wrap"><div class="sec-head"><h2 class="rv">'+t.svc_h+'</h2><p class="rv">'+t.svc_p+'</p></div><div class="svc-grid">'+svc+'</div></div></section>\n'+
  '<section class="block" id="proces" style="background:var(--ink2)"><div class="wrap"><div class="sec-head"><h2 class="rv">'+t.proc_h+'</h2><p class="rv">'+t.proc_p+'</p></div><div class="proc">'+proc+'</div></div></section>\n'+
  '<section class="maresme" id="maresme"><div class="wrap people-band"><div><h2 class="rv">'+t.mar_h+'</h2><p class="rv">'+t.mar_p+'</p><div class="towns rv">'+towns+'</div></div><img src="/europe-conversation.jpg" alt="'+EXPERIENCE[lang].image+'" class="people-photo" loading="lazy" width="1600" height="1067"></div></section>\n'+
  '<section class="cta-final" id="contacte"><div class="glow" aria-hidden="true"></div><div class="wrap"><h2 class="rv">'+t.cta_h+'</h2><p class="rv">'+t.cta_p+'</p><div class="cta rv"><a href="https://wa.me/'+WA+'" class="btn btn-wa mag" data-cursor>'+WAICON+' '+t.wa+'</a><a href="https://wa.me/'+WA+'" class="btn btn-gold mag" data-cursor target="_blank" rel="noopener">'+t.cta_b1+'</a><a href="mailto:'+EMAIL+'" class="btn btn-ghost mag" data-cursor>'+EMAIL+'</a></div></div></section>\n'+
  '</main>\n'+
  '<a class="wa-float" href="https://wa.me/'+WA+'" aria-label="WhatsApp '+WA_DISPLAY+'" target="_blank" rel="noopener">'+WAICON+'</a>\n'+
  '<footer><div class="wrap foot-in">'+
    '<div><div class="foot-brand"><img src="/logo-white.svg" alt="Polar Consulting Group" class="foot-img"></div><div class="foot-tag">'+t.foot_tag+'</div></div>'+
    '<div class="foot-col"><h5>'+t.foot_links+'</h5><a href="#serveis">'+t.nav[0]+'</a><a href="#proces">'+t.nav[1]+'</a><a href="#maresme">'+t.nav[2]+'</a><a href="#contacte">'+t.nav[3]+'</a></div>'+
    '<div class="foot-col"><h5>'+t.foot_contact+'</h5><a href="mailto:'+EMAIL+'" data-cursor>'+EMAIL+'</a><a href="'+BASE+'">polarconsultinggroup.com</a></div>'+
  '</div><div class="wrap foot-note">© 2026 Polar Consulting Group · '+t.foot_note+'</div></footer>\n'+
  '<script src="/polar-experience.js?v='+assetVersion+'" defer></'+'script>\n</body>\n</html>\n';
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
