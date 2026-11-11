/* =====================================================================
   The Goodall Family — Date-gated Holiday Banners
   ---------------------------------------------------------------------
   • Shows a themed, animated banner at the top of the page ONLY during
     each holiday's date window (invisible the rest of the year).
   • 3 KJV (English) / RVR1960 (Spanish) verses per holiday that rotate
     automatically each year. Page language is auto-detected (<html lang>).
   • Hand-drawn SVG scenes (flags, fireworks, silhouettes) — no images.
   • Preview any banner anytime:  ?banner=christmas   (or usind, coind,
     boyaca, mxind, mexind-dieciseis, thanksgiving, easter, newyear …)
     Turn off:  ?banner=off
   ---------------------------------------------------------------------
   TO EDIT VERSES: change the `verses` arrays below.
   ===================================================================== */
(function () {
  'use strict';

  /* ---------- small SVG helpers ---------- */
  function star(cx, cy, r, fill, op) {
    var p = '';
    for (var i = 0; i < 10; i++) {
      var a = Math.PI / 5 * i - Math.PI / 2, rad = (i % 2) ? r * 0.42 : r;
      p += (cx + Math.cos(a) * rad).toFixed(1) + ',' + (cy + Math.sin(a) * rad).toFixed(1) + ' ';
    }
    return '<polygon points="' + p.trim() + '" fill="' + fill + '" opacity="' + (op == null ? 1 : op) + '"/>';
  }
  function firework(cx, cy, R, color, delay) {
    var n = 14, s = '<g class="hb__fw" style="animation-delay:' + delay + 's">';
    for (var i = 0; i < n; i++) {
      var a = i / n * Math.PI * 2, x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R;
      s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + x.toFixed(1) + '" y2="' + y.toFixed(1) +
           '" stroke="' + color + '" stroke-width="1.5" stroke-linecap="round"/>';
      s += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="2" fill="' + color + '"/>';
    }
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="2.6" fill="#fff"/></g>';
    return s;
  }
  function dots(list) { // [[x,y,r,fill,op],...]
    return list.map(function (d) {
      return '<circle cx="' + d[0] + '" cy="' + d[1] + '" r="' + d[2] + '" fill="' + d[3] + '" opacity="' + (d[4] == null ? 1 : d[4]) + '"/>';
    }).join('');
  }
  function skyline(baseY, color, op) {
    var s = '', x = 0;
    while (x < 1220) {
      var w = 26 + Math.round(Math.random() * 40), h = 24 + Math.round(Math.random() * 60);
      s += '<rect x="' + x + '" y="' + (baseY - h) + '" width="' + w + '" height="' + (h + 10) + '" fill="' + color + '" opacity="' + op + '"/>';
      // a couple of lit windows
      if (Math.random() > 0.4) s += '<rect x="' + (x + 6) + '" y="' + (baseY - h + 8) + '" width="4" height="5" fill="#ffd27a" opacity="0.8"/>';
      x += w + 4;
    }
    return s;
  }
  function svg(inner) {
    return '<svg class="hb__svg" viewBox="0 0 1200 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' + inner + '</svg>';
  }

  /* ---------- national flags (as flying flags with a pole) ---------- */
  function flagUS(tx, ty) {
    var W = 196, H = 104, stripeH = H / 13, s = '';
    for (var i = 0; i < 13; i++)
      s += '<rect x="0" y="' + (i * stripeH).toFixed(1) + '" width="' + W + '" height="' + stripeH.toFixed(1) + '" fill="' + (i % 2 ? '#f4f4f4' : '#b22234') + '"/>';
    s += '<rect x="0" y="0" width="92" height="' + (stripeH * 7).toFixed(1) + '" fill="#3c3b6e"/>';
    for (var r = 0; r < 5; r++) for (var c = 0; c < 6; c++)
      s += star(10 + c * 15, 8 + r * 11, 3.4, '#fff', 0.95);
    return '<rect x="' + (tx - 5) + '" y="' + (ty - 8) + '" width="5" height="160" rx="2" fill="#6b4f2a"/>' +
           '<g class="hb__flag" transform="translate(' + tx + ',' + ty + ')">' +
           '<g opacity="0.95">' + s + '</g>' +
           '<path d="M0,0 L' + W + ',6 L' + W + ',' + (H + 6) + ' L0,' + H + ' Z" fill="url(#hbFold)"/></g>';
  }
  function flagCO(tx, ty) {
    var W = 196, s =
      '<rect x="0" y="0" width="' + W + '" height="52" fill="#FCD116"/>' +
      '<rect x="0" y="52" width="' + W + '" height="26" fill="#003893"/>' +
      '<rect x="0" y="78" width="' + W + '" height="26" fill="#CE1126"/>';
    return '<rect x="' + (tx - 5) + '" y="' + (ty - 8) + '" width="5" height="160" rx="2" fill="#6b4f2a"/>' +
           '<g class="hb__flag" transform="translate(' + tx + ',' + ty + ')"><g opacity="0.96">' + s +
           '</g><path d="M0,0 L' + W + ',6 L' + W + ',110 L0,104 Z" fill="url(#hbFold)"/></g>';
  }
  function flagMX(tx, ty) {
    var W = 198, t = W / 3, s =
      '<rect x="0" y="0" width="' + t + '" height="104" fill="#006847"/>' +
      '<rect x="' + t + '" y="0" width="' + t + '" height="104" fill="#f7f7f7"/>' +
      '<rect x="' + (2 * t) + '" y="0" width="' + t + '" height="104" fill="#ce1126"/>' +
      // simplified eagle-on-cactus emblem (stylized, centered)
      '<g transform="translate(' + (t + t / 2) + ',56)" fill="#6b4a1f" opacity="0.9">' +
      '<ellipse cx="0" cy="2" rx="13" ry="7"/>' +
      '<path d="M-2,-2 Q-16,-12 -24,-6 Q-14,-3 -6,-1 Z"/>' +
      '<path d="M2,-3 Q10,-14 20,-12 Q12,-6 6,-2 Z"/>' +
      '<path d="M11,0 q7,-2 12,2 q-6,3 -12,1 Z"/>' +
      '<circle cx="12" cy="-1" r="1.6" fill="#3a2810"/>' +
      '<path d="M-10,8 Q0,16 12,10" stroke="#2f7d32" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '</g>';
    return '<rect x="' + (tx - 5) + '" y="' + (ty - 8) + '" width="5" height="160" rx="2" fill="#6b4f2a"/>' +
           '<g class="hb__flag" transform="translate(' + tx + ',' + ty + ')"><g opacity="0.96">' + s +
           '</g><path d="M0,0 L' + W + ',6 L' + W + ',110 L0,104 Z" fill="url(#hbFold)"/></g>';
  }

  /* shared defs: a translucent "fold" gradient so flags read as cloth */
  var DEFS = '<defs>' +
    '<linearGradient id="hbFold" x1="0" y1="0" x2="1" y2="0.2">' +
      '<stop offset="0" stop-color="#000" stop-opacity="0.18"/>' +
      '<stop offset="0.25" stop-color="#fff" stop-opacity="0.12"/>' +
      '<stop offset="0.5" stop-color="#000" stop-opacity="0.16"/>' +
      '<stop offset="0.75" stop-color="#fff" stop-opacity="0.1"/>' +
      '<stop offset="1" stop-color="#000" stop-opacity="0.2"/>' +
    '</linearGradient>' +
    '<radialGradient id="hbSun" cx="0.5" cy="0.5" r="0.5">' +
      '<stop offset="0" stop-color="#fff7dc"/><stop offset="0.5" stop-color="#ffd27a"/>' +
      '<stop offset="1" stop-color="#ffb24a" stop-opacity="0"/>' +
    '</radialGradient>' +
  '</defs>';

  function sunRays(cx, cy, R, color) {
    var s = '<g class="hb__rays">';
    for (var i = 0; i < 16; i++) {
      var a = i / 16 * Math.PI * 2;
      s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + Math.cos(a) * R).toFixed(1) +
           '" y2="' + (cy + Math.sin(a) * R).toFixed(1) + '" stroke="' + color + '" stroke-width="6" stroke-linecap="round" opacity="0.35"/>';
    }
    return s + '</g>';
  }

  /* --------------------------------------------------------------- */
  /* ====================  HOLIDAY DEFINITIONS  ==================== */
  /* when.kind: fixed | wrap | easter | thanksgiving                 */
  /* months are 1-based in config                                    */
  var HOLIDAYS = [

    /* ---------------- NEW YEAR (Dec 31 – Jan 2) ---------------- */
    { id: 'newyear', name: { en: 'Happy New Year', es: 'Feliz Año Nuevo' },
      when: { kind: 'wrap', from: [12, 31], to: [1, 2] },
      theme: {
        grad: 'linear-gradient(160deg,#0b1020,#1a1a3a 55%,#3a2766)', text: 'light', accent: '#f5d06b',
        motes: { twinkle: ['✨'], }, moteCount: 14,
        scene: function () {
          return svg(DEFS +
            skyline(200, '#070a16', 0.9) +
            firework(260, 66, 48, '#f5d06b', 0) +
            firework(940, 58, 52, '#e9c35a', 1.1) +
            firework(620, 44, 36, '#fff3cf', 2.0) +
            firework(1080, 104, 30, '#f5d06b', 2.7) +
            firework(120, 120, 26, '#e9c35a', 1.7) +
            dots([[200,40,1.6,'#fff',0.8],[1000,30,1.6,'#fff',0.8],[520,150,1.4,'#fff',0.6],[760,70,1.4,'#fff',0.7],[360,110,1.3,'#fff',0.6]]));
        }
      },
      verses: [
        { en: { t: 'It is of the LORD’s mercies that we are not consumed… they are new every morning.', r: 'Lamentations 3:22-23' }, es: { t: 'Por la misericordia de Jehová no hemos sido consumidos… Nuevas son cada mañana.', r: 'Lamentaciones 3:22-23' } },
        { en: { t: 'Behold, I will do a new thing; now it shall spring forth; shall ye not know it?', r: 'Isaiah 43:19' }, es: { t: 'He aquí que yo hago cosa nueva; pronto saldrá a luz; ¿no la conoceréis?', r: 'Isaías 43:19' } },
        { en: { t: 'If any man be in Christ, he is a new creature: old things are passed away; behold, all things are become new.', r: '2 Corinthians 5:17' }, es: { t: 'Si alguno está en Cristo, nueva criatura es; las cosas viejas pasaron; he aquí todas son hechas nuevas.', r: '2 Corintios 5:17' } }
      ] },

    /* ---------------- EASTER (Palm Sun → Easter Mon) ---------------- */
    { id: 'easter', name: { en: 'He Is Risen', es: 'Ha Resucitado' },
      when: { kind: 'easter', before: 7, after: 1 },
      theme: {
        grad: 'linear-gradient(160deg,#fde9c8,#fcd9a8 45%,#bfe3c0)', text: 'dark', accent: '#b45309',
        scrim: 'radial-gradient(ellipse at center, rgba(255,255,255,.55), rgba(255,255,255,.15) 70%)',
        motes: { fall: ['🌸'] }, moteCount: 10,
        scene: function () {
          return svg(DEFS +
            '<circle cx="600" cy="150" r="70" fill="url(#hbSun)"/>' + sunRays(600, 150, 150, '#f7b24a') +
            '<path d="M0,200 L0,165 Q300,120 600,150 Q900,120 1200,160 L1200,200 Z" fill="#6f924e"/>' +
            // three crosses on the hill
            crosses(600, 150) +
            // two birds
            '<path class="hb__bird" d="M300,70 q10,-8 20,0 q10,-8 20,0" stroke="#5b4a33" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
            '<path class="hb__bird" style="animation-delay:1.2s" d="M880,56 q9,-7 18,0 q9,-7 18,0" stroke="#5b4a33" stroke-width="2.5" fill="none" stroke-linecap="round"/>');
        }
      },
      verses: [
        { en: { t: 'He is not here: for he is risen, as he said. Come, see the place where the Lord lay.', r: 'Matthew 28:6' }, es: { t: 'No está aquí, pues ha resucitado, como dijo. Venid, ved el lugar donde fue puesto el Señor.', r: 'Mateo 28:6' } },
        { en: { t: 'But thanks be to God, which giveth us the victory through our Lord Jesus Christ.', r: '1 Corinthians 15:57' }, es: { t: 'Mas gracias sean dadas a Dios, que nos da la victoria por medio de nuestro Señor Jesucristo.', r: '1 Corintios 15:57' } },
        { en: { t: 'I am the resurrection, and the life: he that believeth in me, though he were dead, yet shall he live.', r: 'John 11:25' }, es: { t: 'Yo soy la resurrección y la vida; el que cree en mí, aunque esté muerto, vivirá.', r: 'Juan 11:25' } }
      ] },

    /* ---------------- USA INDEPENDENCE (Jul 2–5) ---------------- */
    { id: 'usind', name: { en: 'Independence Day · USA', es: 'Día de la Independencia · EE. UU.' },
      when: { kind: 'fixed', from: [7, 2], to: [7, 5] },
      theme: {
        grad: 'linear-gradient(160deg,#0a1836,#15306e 55%,#6e1420)', text: 'light', accent: '#fcd34d',
        stripe: ['#b22234', '#ffffff', '#3c3b6e'],
        motes: { twinkle: ['✨'] }, moteCount: 10,
        scene: function () {
          return svg(DEFS +
            skyline(200, '#07122b', 0.8) +
            statueOfLiberty(150) +
            flagUS(960, 34) +
            firework(430, 60, 46, '#fcd34d', 0) +
            firework(700, 48, 40, '#ef4444', 0.9) +
            firework(560, 96, 30, '#ffffff', 1.8) +
            firework(300, 120, 24, '#fcd34d', 2.5));
        }
      },
      verses: [
        { en: { t: 'Where the Spirit of the Lord is, there is liberty.', r: '2 Corinthians 3:17' }, es: { t: 'Donde está el Espíritu del Señor, allí hay libertad.', r: '2 Corintios 3:17' } },
        { en: { t: 'Blessed is the nation whose God is the LORD; and the people whom he hath chosen for his own inheritance.', r: 'Psalm 33:12' }, es: { t: 'Bienaventurada la nación cuyo Dios es Jehová, el pueblo que él escogió como heredad para sí.', r: 'Salmo 33:12' } },
        { en: { t: 'If the Son therefore shall make you free, ye shall be free indeed.', r: 'John 8:36' }, es: { t: 'Así que, si el Hijo os libertare, seréis verdaderamente libres.', r: 'Juan 8:36' } }
      ] },

    /* ---------------- COLOMBIA INDEPENDENCE (Jul 19–21) ---------------- */
    { id: 'coind', name: { en: 'Independence Day · Colombia', es: 'Día de la Independencia · Colombia' },
      when: { kind: 'fixed', from: [7, 19], to: [7, 21] },
      theme: {
        grad: 'linear-gradient(160deg,#0b1f4d,#13316e 60%,#0a1a3d)', text: 'light', accent: '#ffd100',
        stripe: ['#FCD116', '#003893', '#CE1126'],
        motes: { twinkle: ['✨'] }, moteCount: 10,
        scene: function () {
          return svg(DEFS +
            andes(0.9) +
            // soaring Andean condor
            '<path class="hb__bird" d="M560,56 q28,-20 56,-6 q10,-10 22,-3 q-14,10 -24,8 q-18,14 -40,6 q-10,8 -22,3 q10,-10 30,-11 Z" fill="#111827" opacity="0.8"/>' +
            flagCO(960, 34) +
            dots([[200,40,1.6,'#ffe27a',0.8],[360,70,1.4,'#fff',0.7],[760,60,1.5,'#fff',0.7],[460,110,1.3,'#ffe27a',0.7],[120,90,1.4,'#fff',0.6]]));
        }
      },
      verses: [
        { en: { t: 'Righteousness exalteth a nation: but sin is a reproach to any people.', r: 'Proverbs 14:34' }, es: { t: 'La justicia engrandece a la nación; mas el pecado es afrenta de las naciones.', r: 'Proverbios 14:34' } },
        { en: { t: 'Happy is that people, whose God is the LORD.', r: 'Psalm 144:15' }, es: { t: 'Bienaventurado el pueblo cuyo Dios es Jehová.', r: 'Salmo 144:15' } },
        { en: { t: 'Stand fast therefore in the liberty wherewith Christ hath made us free.', r: 'Galatians 5:1' }, es: { t: 'Estad, pues, firmes en la libertad con que Cristo nos hizo libres.', r: 'Gálatas 5:1' } }
      ] },

    /* ---------------- BATTLE OF BOYACÁ (Aug 6–8) ---------------- */
    { id: 'boyaca', name: { en: 'Battle of Boyacá · Colombia', es: 'Batalla de Boyacá · Colombia' },
      when: { kind: 'fixed', from: [8, 6], to: [8, 8] },
      theme: {
        grad: 'linear-gradient(160deg,#17306b,#5a4ea0 45%,#e8893f)', text: 'light', accent: '#ffd100',
        stripe: ['#FCD116', '#003893', '#CE1126'],
        motes: { twinkle: ['✨'] }, moteCount: 8,
        scene: function () {
          return svg(DEFS +
            '<circle cx="720" cy="170" r="66" fill="url(#hbSun)"/>' + sunRays(720, 170, 140, '#ffd27a') +
            andes(0.95) +
            // Puente de Boyacá — stone bridge silhouette
            '<g fill="#141b2e" opacity="0.92"><rect x="470" y="150" width="260" height="14"/>' +
            '<path d="M500,164 Q560,128 620,164 Z"/><path d="M620,164 Q680,128 740,164 Z" transform="translate(-30,0)"/>' +
            '<rect x="470" y="140" width="10" height="26"/><rect x="720" y="140" width="10" height="26"/></g>' +
            flagCO(70, 40));
        }
      },
      verses: [
        { en: { t: 'For the LORD your God is he that goeth with you, to fight for you against your enemies, to save you.', r: 'Deuteronomy 20:4' }, es: { t: 'Porque Jehová vuestro Dios va con vosotros, para pelear por vosotros contra vuestros enemigos, para salvaros.', r: 'Deuteronomio 20:4' } },
        { en: { t: 'Some trust in chariots, and some in horses: but we will remember the name of the LORD our God.', r: 'Psalm 20:7' }, es: { t: 'Estos confían en carros, y aquéllos en caballos; mas nosotros del nombre de Jehová nuestro Dios tendremos memoria.', r: 'Salmo 20:7' } },
        { en: { t: 'In all these things we are more than conquerors through him that loved us.', r: 'Romans 8:37' }, es: { t: 'En todas estas cosas somos más que vencedores por medio de aquel que nos amó.', r: 'Romanos 8:37' } }
      ] },

    /* ---------------- MEXICO INDEPENDENCE (Sep 15–16) ---------------- */
    { id: 'mxind', name: { en: 'Independence Day · Mexico', es: 'Día de la Independencia · México' },
      when: { kind: 'fixed', from: [9, 15], to: [9, 16] },
      theme: {
        grad: 'linear-gradient(160deg,#0a3d28,#0e5a39 50%,#7a1420)', text: 'light', accent: '#ffe08a',
        stripe: ['#006847', '#ffffff', '#ce1126'],
        motes: { twinkle: ['✨'] }, moteCount: 8,
        scene: function () {
          return svg(DEFS +
            papelPicado() +
            // agave / cactus silhouettes
            '<g fill="#0a2a1c" opacity="0.85"><path d="M120,200 q-10,-50 2,-70 q12,20 6,70 Z"/><path d="M120,200 q-40,-30 -40,-60 q30,16 40,60 Z"/><path d="M120,200 q40,-30 44,-62 q-26,18 -44,62 Z"/></g>' +
            '<g fill="#0a2a1c" opacity="0.8"><rect x="1080" y="150" width="14" height="50" rx="6"/><path d="M1087,166 q-26,0 -26,20 l6,0 q0,-14 20,-14 Z"/><path d="M1087,160 q26,0 26,22 l-6,0 q0,-16 -20,-16 Z"/></g>' +
            flagMX(958, 34) +
            firework(380, 66, 40, '#ffe08a', 0.4) +
            firework(620, 54, 32, '#ffffff', 1.5));
        }
      },
      verses: [
        { en: { t: 'For the kingdom is the LORD’s: and he is the governor among the nations.', r: 'Psalm 22:28' }, es: { t: 'Porque de Jehová es el reino, y él regirá las naciones.', r: 'Salmo 22:28' } },
        { en: { t: 'That thy way may be known upon earth, thy saving health among all nations.', r: 'Psalm 67:2' }, es: { t: 'Para que sea conocido en la tierra tu camino, en todas las naciones tu salvación.', r: 'Salmo 67:2' } },
        { en: { t: 'And hath made of one blood all nations of men for to dwell on all the face of the earth…', r: 'Acts 17:26' }, es: { t: 'Y de una sangre ha hecho todo el linaje de los hombres, para que habiten sobre toda la faz de la tierra…', r: 'Hechos 17:26' } }
      ] },

    /* ---------------- THANKSGIVING (US — 4th Thu Nov, Thu–Sun) ---------------- */
    { id: 'thanksgiving', name: { en: 'Happy Thanksgiving', es: 'Día de Acción de Gracias' },
      when: { kind: 'thanksgiving', before: 1, after: 3 },
      theme: {
        grad: 'linear-gradient(160deg,#b45309,#d9820a 48%,#6b2d12)', text: 'light', accent: '#ffe4b5',
        motes: { fall: ['🍂', '🍁'] }, moteCount: 16,
        scene: function () {
          return svg(DEFS +
            '<path d="M0,200 L0,172 Q300,150 600,166 Q900,150 1200,170 L1200,200 Z" fill="#7a3b14" opacity="0.8"/>' +
            // autumn tree
            '<g opacity="0.85"><path d="M150,200 L150,120" stroke="#5a3010" stroke-width="10" stroke-linecap="round"/>' +
            '<path d="M150,130 l-24,-18 M150,120 l22,-20 M150,112 l-14,-26" stroke="#5a3010" stroke-width="6" stroke-linecap="round"/>' +
            '<circle cx="128" cy="104" r="16" fill="#c2410c"/><circle cx="164" cy="96" r="18" fill="#b45309"/><circle cx="150" cy="84" r="16" fill="#d97706"/><circle cx="178" cy="112" r="13" fill="#9a3412"/></g>' +
            cornucopia(620, 150) +
            // wheat right
            '<g stroke="#e3a24a" stroke-width="3" stroke-linecap="round" opacity="0.8"><path d="M1090,200 L1090,132"/><path d="M1110,200 L1110,140"/><path d="M1070,200 L1070,144"/></g>');
        }
      },
      verses: [
        { en: { t: 'Enter into his gates with thanksgiving, and into his courts with praise: be thankful unto him, and bless his name.', r: 'Psalm 100:4' }, es: { t: 'Entrad por sus puertas con acción de gracias, por sus atrios con alabanza; alabadle, bendecid su nombre.', r: 'Salmo 100:4' } },
        { en: { t: 'In every thing give thanks: for this is the will of God in Christ Jesus concerning you.', r: '1 Thessalonians 5:18' }, es: { t: 'Dad gracias en todo, porque esta es la voluntad de Dios para con vosotros en Cristo Jesús.', r: '1 Tesalonicenses 5:18' } },
        { en: { t: 'O give thanks unto the LORD, for he is good: for his mercy endureth for ever.', r: 'Psalm 107:1' }, es: { t: 'Alabad a Jehová, porque él es bueno; porque para siempre es su misericordia.', r: 'Salmo 107:1' } }
      ] },

    /* ---------------- CHRISTMAS (Dec 20–27) ---------------- */
    { id: 'christmas', name: { en: 'Merry Christmas', es: 'Feliz Navidad' },
      when: { kind: 'fixed', from: [12, 20], to: [12, 27] },
      theme: {
        grad: 'linear-gradient(160deg,#071a2e,#0b2e1d 45%,#5a1420)', text: 'light', accent: '#f4b942',
        motes: { fall: ['❄️'], twinkle: ['✨'] }, moteCount: 16,
        scene: function () {
          return svg(DEFS +
            dots([[150,40,1.5,'#fff',0.8],[300,70,1.3,'#fff',0.7],[500,36,1.6,'#fff',0.8],[760,56,1.3,'#fff',0.7],[980,40,1.5,'#fff',0.8],[1080,80,1.3,'#fff',0.6],[650,90,1.2,'#fff',0.6],[400,110,1.2,'#fff',0.5]]) +
            // Star of Bethlehem with beam + glow
            '<g transform="translate(600,50)"><line class="hb__beam" x1="0" y1="8" x2="0" y2="150" stroke="#ffe9a8" stroke-width="6" opacity="0.5"/>' +
            '<circle class="hb__beam" cx="0" cy="0" r="22" fill="#fff6d6" opacity="0.5"/>' + star(0, 0, 18, '#ffe9a8', 1) + '</g>' +
            // Bethlehem town silhouette
            '<g fill="#09131f" opacity="0.92"><path d="M0,200 L0,176 Q260,158 520,172 Q820,156 1200,174 L1200,200 Z"/>' +
            '<rect x="470" y="150" width="46" height="26"/><path d="M470,150 h46 l-23,-16 Z"/>' +
            '<rect x="620" y="144" width="40" height="32"/><circle cx="640" cy="144" r="16"/>' +
            '<rect x="560" y="158" width="30" height="18"/></g>' +
            // pine trees
            '<g fill="#0c3a24" opacity="0.9"><path d="M120,176 l22,0 l-11,-26 Z"/><path d="M124,164 l14,0 l-7,-20 Z"/>' +
            '<path d="M1060,176 l26,0 l-13,-30 Z"/><path d="M1064,160 l18,0 l-9,-22 Z"/></g>');
        }
      },
      verses: [
        { en: { t: 'For unto you is born this day in the city of David a Saviour, which is Christ the Lord.', r: 'Luke 2:11' }, es: { t: 'Que os ha nacido hoy, en la ciudad de David, un Salvador, que es Cristo el Señor.', r: 'Lucas 2:11' } },
        { en: { t: 'For unto us a child is born, unto us a son is given… his name shall be called Wonderful, Counsellor, The mighty God.', r: 'Isaiah 9:6' }, es: { t: 'Porque un niño nos es nacido, hijo nos es dado… se llamará su nombre Admirable, Consejero, Dios Fuerte.', r: 'Isaías 9:6' } },
        { en: { t: 'For God so loved the world, that he gave his only begotten Son…', r: 'John 3:16' }, es: { t: 'Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito…', r: 'Juan 3:16' } }
      ] }
  ];

  /* ---------- composite scene pieces ---------- */
  function crosses(cx, hillY) {
    function c(x, y, h, w) {
      return '<rect x="' + (x - 3) + '" y="' + (y - h) + '" width="6" height="' + h + '" fill="#4a3826"/>' +
             '<rect x="' + (x - w) + '" y="' + (y - h + 14) + '" width="' + (2 * w) + '" height="6" fill="#4a3826"/>';
    }
    return '<g opacity="0.92">' + c(cx, hillY + 4, 72, 16) + c(cx - 70, hillY + 10, 52, 12) + c(cx + 70, hillY + 10, 52, 12) + '</g>';
  }
  function andes(op) {
    return '<g opacity="' + op + '"><path d="M0,200 L0,150 L160,96 L320,140 L470,92 L640,150 L820,86 L1000,140 L1200,104 L1200,200 Z" fill="#0a1733"/>' +
           '<path d="M0,200 L0,172 L220,128 L420,168 L620,120 L840,170 L1040,126 L1200,166 L1200,200 Z" fill="#0d2147"/></g>';
  }
  function statueOfLiberty(x) {
    var spikes = '';
    for (var i = 0; i < 7; i++) {
      var a = Math.PI * (0.15 + 0.7 * (i / 6));
      spikes += '<line x1="' + x + '" y1="66" x2="' + (x + Math.cos(-a) * 22).toFixed(1) + '" y2="' + (66 + Math.sin(-a) * -22).toFixed(1) + '" stroke="#2f7d74" stroke-width="3" stroke-linecap="round"/>';
    }
    return '<g opacity="0.9">' +
      '<rect x="' + (x - 34) + '" y="182" width="68" height="18" fill="#17324a"/>' +
      '<rect x="' + (x - 24) + '" y="168" width="48" height="16" fill="#1d3c56"/>' +
      '<path d="M' + (x - 22) + ',168 L' + (x + 22) + ',168 L' + (x + 14) + ',96 Q' + x + ',88 ' + (x - 14) + ',96 Z" fill="#2f7d74"/>' +
      '<circle cx="' + x + '" cy="78" r="12" fill="#2f7d74"/>' + spikes +
      '<rect x="' + (x - 26) + '" y="112" width="20" height="26" rx="2" transform="rotate(-14 ' + (x - 16) + ' 125)" fill="#17324a"/>' +
      '<path d="M' + (x + 8) + ',96 L' + (x + 30) + ',48" stroke="#2f7d74" stroke-width="9" stroke-linecap="round"/>' +
      '<circle cx="' + (x + 31) + '" cy="40" r="9" fill="#ffd27a"/><circle cx="' + (x + 31) + '" cy="40" r="16" fill="#ffd27a" opacity="0.25"/>' +
      '</g>';
  }
  function papelPicado() {
    var cols = ['#e84a8a', '#f4b942', '#3bc4c4', '#7ad13b', '#ef5350', '#f4f4f4', '#ff8c42', '#8b5cf6', '#e84a8a', '#3bc4c4'];
    var s = '<path d="M0,16 Q600,42 1200,16" stroke="#caa15a" stroke-width="2" fill="none"/><g class="hb__papel">';
    var n = cols.length, w = 1200 / n;
    for (var i = 0; i < n; i++) {
      var x = i * w + 8, fw2 = w - 16, dip = 20 + (i % 2) * 6, y0 = 18 + (i % 2) * 4;
      s += '<path d="M' + x + ',' + y0 + ' h' + fw2 + ' v34 l' + (-fw2 / 2) + ',' + dip + ' l' + (-fw2 / 2) + ',' + (-dip) + ' Z" fill="' + cols[i] + '" opacity="0.92"/>';
      s += '<circle cx="' + (x + fw2 / 2) + '" cy="' + (y0 + 20) + '" r="4" fill="rgba(0,0,0,0.18)"/>';
      s += '<circle cx="' + (x + fw2 / 3) + '" cy="' + (y0 + 12) + '" r="2.5" fill="rgba(0,0,0,0.16)"/>';
      s += '<circle cx="' + (x + 2 * fw2 / 3) + '" cy="' + (y0 + 12) + '" r="2.5" fill="rgba(0,0,0,0.16)"/>';
    }
    return s + '</g>';
  }
  function cornucopia(x, y) {
    return '<g opacity="0.92">' +
      '<path d="M' + x + ',' + y + ' q-70,-6 -120,26 q40,2 70,-6 q-30,26 -64,30 q70,8 120,-24 q18,-12 10,-30 q-8,-16 -16,-22 Z" fill="#8a5a2b"/>' +
      '<path d="M' + (x - 2) + ',' + (y - 2) + ' q-16,-10 -34,-6 q10,10 18,10" fill="#6e471f"/>' +
      '<circle cx="' + (x + 6) + '" cy="' + (y + 2) + '" r="15" fill="#e4751f"/>' +    /* pumpkin */
      '<circle cx="' + (x + 30) + '" cy="' + (y + 8) + '" r="11" fill="#c62828"/>' +   /* apple */
      '<circle cx="' + (x + 20) + '" cy="' + (y + 22) + '" r="9" fill="#f4b942"/>' +   /* squash */
      '<circle cx="' + (x + 44) + '" cy="' + (y + 20) + '" r="7" fill="#7b3fa0"/>' +   /* grapes */
      '<circle cx="' + (x + 38) + '" cy="' + (y + 28) + '" r="6" fill="#7b3fa0"/>' +
      '</g>';
  }

  /* --------------------------------------------------------------- */
  /* ====================  DATE / ROTATION LOGIC  ================== */
  function ymd(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
  function mk(y, m, d) { return new Date(y, m - 1, d); }
  function addDays(d, n) { var r = new Date(d); r.setDate(r.getDate() + n); return r; }
  function between(t, s, e) { return t >= s && t <= e; }
  function easterSunday(y) {
    var a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4,
        f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3),
        h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4,
        l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451),
        mo = Math.floor((h + l - 7 * m + 114) / 31), da = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(y, mo - 1, da);
  }
  function thanksgiving(y) {
    var d = new Date(y, 10, 1), first = 1 + ((4 - d.getDay() + 7) % 7);
    return new Date(y, 10, first + 21);
  }
  function activeInfo(h, today) {
    var t = ymd(today), y = today.getFullYear(), w = h.when;
    if (w.kind === 'wrap') {
      if (between(t, mk(y, w.from[0], w.from[1]), mk(y + 1, w.to[0], w.to[1]))) return { year: y };
      if (between(t, mk(y - 1, w.from[0], w.from[1]), mk(y, w.to[0], w.to[1]))) return { year: y - 1 };
      return null;
    }
    var s, e;
    if (w.kind === 'fixed') { s = mk(y, w.from[0], w.from[1]); e = mk(y, w.to[0], w.to[1]); }
    else if (w.kind === 'easter') { var es = easterSunday(y); s = addDays(es, -(w.before || 7)); e = addDays(es, (w.after || 1)); }
    else if (w.kind === 'thanksgiving') { var tg = thanksgiving(y); s = addDays(tg, -(w.before || 1)); e = addDays(tg, (w.after || 3)); }
    else return null;
    return between(t, ymd(s), ymd(e)) ? { year: y } : null;
  }

  /* --------------------------------------------------------------- */
  /* ====================  CSS (injected once)  ==================== */
  function injectCSS() {
    if (document.getElementById('hb-style')) return;
    var css =
      '.hb{position:relative;overflow:hidden;background:var(--hb-grad);color:#fff;min-height:168px;' +
        'display:flex;align-items:center;justify-content:center;padding:26px 56px;text-align:center;font-family:"Nunito Sans",-apple-system,sans-serif;}' +
      '.hb[data-text="dark"]{color:#20323f;}' +
      '.hb__svg{position:absolute;inset:0;width:100%;height:100%;z-index:0;}' +
      '.hb__scrim{position:absolute;inset:0;z-index:1;pointer-events:none;background:var(--hb-scrim);}' +
      '.hb__motes{position:absolute;inset:0;z-index:2;pointer-events:none;}' +
      '.hb__mote{position:absolute;top:-12%;will-change:transform,top,opacity;filter:drop-shadow(0 1px 2px rgba(0,0,0,.18));}' +
      '.hb__inner{position:relative;z-index:3;max-width:780px;}' +
      '.hb__eyebrow{display:inline-block;font-weight:800;font-size:.72rem;letter-spacing:.22em;text-transform:uppercase;' +
        'padding:6px 15px;border-radius:999px;margin-bottom:11px;background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.4);}' +
      '.hb[data-text="dark"] .hb__eyebrow{background:rgba(0,0,0,.08);border-color:rgba(0,0,0,.2);}' +
      '.hb__verse{font-family:"Fraunces",Georgia,serif;font-style:italic;line-height:1.35;margin:0 0 9px;' +
        'font-size:clamp(1.05rem,2.2vw,1.55rem);text-shadow:0 1px 14px rgba(0,0,0,.4);}' +
      '.hb[data-text="dark"] .hb__verse{text-shadow:0 1px 2px rgba(255,255,255,.5);}' +
      '.hb__ref{font-weight:800;font-size:.78rem;letter-spacing:.14em;text-transform:uppercase;color:var(--hb-accent);text-shadow:0 1px 8px rgba(0,0,0,.35);}' +
      '.hb[data-text="dark"] .hb__ref{text-shadow:none;}' +
      '.hb__close{position:absolute;top:10px;right:14px;z-index:4;width:30px;height:30px;border-radius:50%;border:0;cursor:pointer;' +
        'font-size:1.2rem;line-height:1;color:inherit;background:rgba(255,255,255,.22);transition:.15s;}' +
      '.hb__close:hover{background:rgba(255,255,255,.4);}' +
      '.hb[data-text="dark"] .hb__close{background:rgba(0,0,0,.12);}' +
      '.hb__stripe{position:absolute;left:0;right:0;bottom:0;height:5px;z-index:3;}' +
      '@keyframes hb-fall{0%{top:-14%;opacity:0}10%{opacity:1}90%{opacity:1}100%{top:116%;opacity:.15}}' +
      '@keyframes hb-rise{0%{top:116%;opacity:0}20%{opacity:1}100%{top:-14%;opacity:0}}' +
      '@keyframes hb-sway{0%{transform:translateX(-11px) rotate(-16deg)}100%{transform:translateX(11px) rotate(20deg)}}' +
      '@keyframes hb-twinkle{0%,100%{opacity:.25;transform:scale(.8)}50%{opacity:1;transform:scale(1.2)}}' +
      '.hb__fw{transform-box:fill-box;transform-origin:center;animation:hb-pop 3.6s ease-out infinite;}' +
      '@keyframes hb-pop{0%{opacity:0;transform:scale(.15)}12%{opacity:1}45%{opacity:.95}70%{opacity:0;transform:scale(1.15)}100%{opacity:0;transform:scale(1.15)}}' +
      '.hb__flag{transform-box:fill-box;transform-origin:left center;animation:hb-wave 5s ease-in-out infinite alternate;}' +
      '@keyframes hb-wave{0%{transform:rotate(-1.4deg) skewY(.6deg)}100%{transform:rotate(1.4deg) skewY(-.6deg)}}' +
      '.hb__rays{transform-box:fill-box;transform-origin:center;animation:hb-spin 70s linear infinite;}' +
      '@keyframes hb-spin{to{transform:rotate(360deg)}}' +
      '.hb__bird{transform-box:fill-box;transform-origin:center;animation:hb-float 6s ease-in-out infinite alternate;}' +
      '@keyframes hb-float{0%{transform:translateY(0)}100%{transform:translateY(-8px)}}' +
      '.hb__beam{animation:hb-glow 3s ease-in-out infinite;}' +
      '@keyframes hb-glow{0%,100%{opacity:.4}50%{opacity:.85}}' +
      '.hb__papel{transform-box:fill-box;transform-origin:top center;animation:hb-flutter 4s ease-in-out infinite alternate;}' +
      '@keyframes hb-flutter{0%{transform:skewX(-1.2deg)}100%{transform:skewX(1.2deg)}}' +
      '@media (max-width:600px){.hb{min-height:150px;padding:22px 40px;}}' +
      '@media (prefers-reduced-motion:reduce){.hb__mote,.hb__fw,.hb__flag,.hb__rays,.hb__bird,.hb__beam,.hb__papel{animation:none!important;}}';
    var st = document.createElement('style');
    st.id = 'hb-style';
    st.textContent = css;
    document.head.appendChild(st);
  }

  /* --------------------------------------------------------------- */
  /* ====================  BUILD A BANNER NODE  =================== */
  function buildBanner(h, optionIndex, lang) {
    injectCSS();
    var th = h.theme, v = h.verses[optionIndex % h.verses.length][lang] || h.verses[optionIndex % h.verses.length].en;
    var el = document.createElement('section');
    el.className = 'hb';
    el.setAttribute('data-text', th.text || 'light');
    el.setAttribute('role', 'note');
    el.style.setProperty('--hb-grad', th.grad);
    el.style.setProperty('--hb-accent', th.accent || '#f4b942');
    el.style.setProperty('--hb-scrim', th.scrim ||
      'radial-gradient(ellipse at center, rgba(0,0,0,.5), rgba(0,0,0,.22) 55%, rgba(0,0,0,.08))');

    var stripe = th.stripe ? '<div class="hb__stripe" style="background:linear-gradient(90deg,' +
      th.stripe.map(function (c, i) {
        var a = (100 / th.stripe.length * i).toFixed(1), b = (100 / th.stripe.length * (i + 1)).toFixed(1);
        return c + ' ' + a + '% ' + b + '%';
      }).join(',') + ')"></div>' : '';

    el.innerHTML =
      (th.scene ? th.scene() : '') +
      '<div class="hb__scrim"></div>' +
      '<div class="hb__motes" aria-hidden="true"></div>' +
      '<div class="hb__inner">' +
        '<span class="hb__eyebrow">' + h.name[lang] + '</span>' +
        '<p class="hb__verse">&ldquo;' + v.t + '&rdquo;</p>' +
        '<span class="hb__ref">' + v.r + '</span>' +
      '</div>' +
      '<button class="hb__close" type="button" aria-label="Dismiss banner">&times;</button>' +
      stripe;

    /* floating particles */
    var box = el.querySelector('.hb__motes');
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    var sets = [];
    if (th.motes) {
      if (th.motes.fall) th.motes.fall.forEach(function (e) { sets.push([e, 'fall']); });
      if (th.motes.rise) th.motes.rise.forEach(function (e) { sets.push([e, 'rise']); });
      if (th.motes.twinkle) th.motes.twinkle.forEach(function (e) { sets.push([e, 'twinkle']); });
    }
    if (sets.length && !reduce) {
      var N = th.moteCount || 14;
      for (var i = 0; i < N; i++) {
        var pair = sets[i % sets.length], emoji = pair[0], motion = pair[1];
        var sp = document.createElement('span');
        sp.className = 'hb__mote';
        sp.textContent = emoji;
        sp.style.fontSize = (12 + Math.random() * 16).toFixed(0) + 'px';
        sp.style.left = (Math.random() * 100).toFixed(1) + '%';
        if (motion === 'twinkle') {
          sp.style.top = (10 + Math.random() * 78).toFixed(0) + '%';
          sp.style.animation = 'hb-twinkle ' + (2 + Math.random() * 3).toFixed(2) + 's ease-in-out ' + (-Math.random() * 4).toFixed(2) + 's infinite';
        } else {
          var dur = 6 + Math.random() * 7, delay = (-Math.random() * dur).toFixed(2), sway = (2.5 + Math.random() * 2.5).toFixed(2);
          sp.style.animation = 'hb-' + motion + ' ' + dur.toFixed(2) + 's linear ' + delay + 's infinite, hb-sway ' + sway + 's ease-in-out infinite alternate';
        }
        box.appendChild(sp);
      }
    }
    return el;
  }

  /* --------------------------------------------------------------- */
  /* ====================  AUTO-RUN (date-gated)  ================= */
  function detectLang() {
    var l = (document.documentElement.lang || 'en').toLowerCase();
    return l.indexOf('es') === 0 ? 'es' : 'en';
  }
  function run() {
    var params = new URLSearchParams(location.search);
    var force = params.get('banner');
    if (force === 'off' || force === 'none') return;

    var lang = detectLang(), chosen = null, year = new Date().getFullYear();

    if (force && force !== 'auto') {
      for (var i = 0; i < HOLIDAYS.length; i++) if (HOLIDAYS[i].id === force) { chosen = HOLIDAYS[i]; break; }
    } else {
      var today = new Date();
      for (var j = 0; j < HOLIDAYS.length; j++) {
        var info = activeInfo(HOLIDAYS[j], today);
        if (info) { chosen = HOLIDAYS[j]; year = info.year; break; }
      }
    }
    if (!chosen) return;

    var dkey = 'hb-dismiss-' + chosen.id + '-' + year;
    if (!force) { try { if (localStorage.getItem(dkey)) return; } catch (e) {} }

    var idx = ((year % 3) + 3) % 3;
    var node = buildBanner(chosen, idx, lang);
    document.body.insertBefore(node, document.body.firstChild);
    node.querySelector('.hb__close').addEventListener('click', function () {
      node.style.display = 'none';
      try { localStorage.setItem(dkey, '1'); } catch (e) {}
    });
  }

  /* expose for the preview page */
  window.GoodallBanners = { HOLIDAYS: HOLIDAYS, build: buildBanner };

  if (window.__HB_NO_AUTO) return;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
