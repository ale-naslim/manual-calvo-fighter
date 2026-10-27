'use strict';
/* ==================================================================================
   CALVO FIGHTER (antes Calvos vs Cabeludos) - COROA CITY ARCADE (MANUAL, 2026)
   Motor: buffer 384x224 (CPS2) ampliado por fator inteiro; logica a 60Hz com passo fixo.
   Arte: sprites e cenarios vindos de folhas geradas por IA e pixelizadas em _arte/ (nada
   desenhado por codigo alem de HUD, texto e efeitos de tela).
   ================================================================================== */
/* largura do jogo (19/10, tela cheia no celular deitado): 384 no computador e em pe; deitado acompanha a tela ate 480 (a luta e o titulo
   usam a versao larga do cenario). Telas com diagramacao fixa (escolha, criador, barbearia, continue) ficam em 384 no meio (XB) e o
   fundo delas vai ate a borda. */
let W = 384; const H = 224, CHAO = 206, WB = 384, WMAX = 576; let XB = 0;
/* 19/10 tarde (pedido: "ainda existiam duas faixas pretas", "quadro sempre justificado a tela"): deitado o jogo cobre a tela INTEIRA,
   inclusive atras do entalhe e dos cantos; o placar e os textos de borda ficam dentro da area segura (MARGEM, em px do jogo).
   Dentro do app (Instagram, Facebook, TikTok), que nao gira a tela, o em pe e o formato principal. */
let MARGEM = 0;
const MENOS_MOVIMENTO = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
const EM_APP = /Instagram|FBAN|FBAV|FB_IAB|FBIOS|musical_ly|BytedanceWebview|TikTok/i.test(navigator.userAgent);
function naMargem(fn){ if (!MARGEM) return fn(); cx.save(); cx.translate(MARGEM, 0); const Wr = W; W -= 2 * MARGEM; try { return fn(); } finally { W = Wr; cx.restore(); } }
const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
const cx = cv.getContext('2d'); cx.imageSmoothingEnabled = false;
const view = document.getElementById('scr'); const vx = view.getContext('2d');
const tc = document.createElement('canvas'); tc.width = 256; tc.height = 256; const tx = tc.getContext('2d');   /* rascunho p/ flash de sprite */
let VK = 1;
const TOQUE = (window.matchMedia && matchMedia('(pointer: coarse)').matches) || ('ontouchstart' in window);
const Q = new URLSearchParams(location.search);

/* ---------------- GABINETE: arte do Magnific por formato (computador, celular deitado, celular em pe) ----------------
   A arte inteira cabe na tela (a borda de 1 px estica ate a beira), o jogo ocupa o vidro da TV e os controles
   sao janelas da propria arte. No computador a camera aproxima da TV durante a luta. Medidas: gabinete/layout.json. */
const GAB = /*GABINETE*/{"desk":{"W":2752,"H":1493,"tela":[832,452,1938,1097],"raio":62,"alavanca":{"sprite":[810,1039,190,283],"pivo":[929,1232],"bola":[928,1132,51],"zona":[820,1062,1000,1290],"alinhamento":[0,0,2.8]},"moldura":[762,382,1246,785],"cor_fundo":"#0b0f15","botoes":{"soco":{"anel":[1475,1194,130,75],"tampa":[1492,1200,96,45],"desce":8,"pilula":false},"chute":{"anel":[1600,1170,140,75],"tampa":[1618,1175,104,45],"desce":8,"pilula":false},"especial":{"anel":[1735,1154,130,72],"tampa":[1752,1159,96,43],"desce":7,"pilula":false},"hiper":{"anel":[1865,1166,130,72],"tampa":[1882,1171,96,43],"desce":7,"pilula":false},"start":{"anel":[1270,1150,70,35],"tampa":[1273,1151,64,25],"desce":5,"pilula":true},"som":{"anel":[1412,1143,75,38],"tampa":[1416,1145,69,27],"desce":5,"pilula":true}},"moedeiro":[1170,1357,1550,1493],"teclas":{"alavanca":[928,1300,"SETAS"],"start":[1305,1232,"ENTER"],"som":[1450,1200,"M"],"soco":[1540,1318,"Z"],"chute":[1670,1290,"X"],"especial":[1800,1276,"C"],"hiper":[1930,1284,"V"]}},"deitado":{"W":3427,"H":1344,"tela":[700,95,2749,1290],"raio":105,"alavanca":{"sprite":[100,395,370,545],"pivo":[289,729],"bola":[280,563,136],"zona":[0,0,575,1344],"alinhamento":[0,0,1.6]},"moldura":[630,25,2189,1319],"cor_fundo":"#244d4b","botoes":{"soco":{"anel":[2889,540,230,230],"tampa":[2919,554,170,170],"desce":13,"pilula":false},"chute":{"anel":[2889,815,230,230],"tampa":[2919,829,170,170],"desce":13,"pilula":false},"especial":{"anel":[3132,428,225,225],"tampa":[3161,441,166,166],"desce":12,"pilula":false},"hiper":{"anel":[3132,702,225,225],"tampa":[3161,716,166,166],"desce":12,"pilula":false},"start":{"anel":[2932,195,145,60],"tampa":[2936,197,136,41],"desce":7,"pilula":true},"som":{"anel":[3176,195,145,60],"tampa":[3181,197,136,41],"desce":7,"pilula":true}}},"em_pe":{"W":1536,"H":2562,"tela":[140,655,1392,1385],"raio":78,"alavanca":{"sprite":[160,1750,360,505],"pivo":[341,2095],"bola":[333,1892,112],"zona":[60,1740,560,2330],"alinhamento":[0,0,2.2]},"virar":{"sprite":[150,1480,398,230],"cor_faixa":"#15151a"},"moldura":[70,585,1392,870],"cor_fundo":"#1e2e2d","botoes":{"soco":{"anel":[912,1978,235,175],"tampa":[940,1965,181,116],"desce":16,"pilula":false},"chute":{"anel":[792,2145,245,180],"tampa":[821,2132,189,119],"desce":16,"pilula":false},"especial":{"anel":[1195,1890,230,170],"tampa":[1221,1878,177,112],"desce":15,"pilula":false},"hiper":{"anel":[1135,2068,240,175],"tampa":[1163,2055,185,116],"desce":16,"pilula":false},"start":{"anel":[602,1818,125,55],"tampa":[606,1820,118,37],"desce":7,"pilula":true},"som":{"anel":[816,1818,125,55],"tampa":[819,1820,118,37],"desce":7,"pilula":true}}}}/*/GABINETE*/;
/* aparelho de toque: ponteiro grosso OU tela de celular com toque (alguns Android e navegadores de app dizem 'hover'); um toque
   de verdade no computador tambem troca para o modo toque (sem o zoom na TV, que escondia os botoes) */
const MOVEL = !!(window.matchMedia && matchMedia('(pointer: coarse)').matches) || (navigator.maxTouchPoints > 0 && Math.min(screen.width, screen.height) < 820) || Q.get('formato') === 'movel';
let TOQUE_USADO = false;
let LAY = null, ESC = 1, ZOOM_ON = false, _geo = null, _painel = '';
const $id = id => document.getElementById(id);
function vista(){ const vv = window.visualViewport; return vv ? [vv.width, vv.height] : [innerWidth, innerHeight]; }
function escolheLayout(){
  const f = Q.get('formato'); if (f && (GAB[f] || f === 'toque')) return f;
  return (MOVEL || TOQUE_USADO) ? 'toque' : 'desk';
}
/* 27/10 (versao para o Webflow): os arquivos do jogo podem morar em outro endereco (jsDelivr). A base sai do proprio script quando ele
   vem de fora (jogo.js no CDN); no index.html o script e embutido, a base fica vazia e tudo segue relativo, como sempre. O endereco do
   cadastro vem de window.CVC_API (head da pagina do Webflow); sem ele, /api/lead do proprio site. */
const BASE_ARQ = (() => { try { const s = document.currentScript && document.currentScript.src; return s ? s.replace(/[^/]*$/, '') : ''; } catch(e){ return ''; } })();
const API_LEAD = (typeof window.CVC_API === 'string' && window.CVC_API) || '/api/lead';
function urlG(n){ return BASE_ARQ + 'gabinete/' + n + '?v=/*VSHEET*/4285/*/VSHEET*/'; }
function poe(el, x, y, w, h){ el.style.left = x + 'px'; el.style.top = y + 'px'; el.style.width = w + 'px'; el.style.height = h + 'px'; }
const CTL = [['b-p', 'soco', 'p'], ['b-k', 'chute', 'k'], ['b-s', 'especial', 's'], ['b-h', 'hiper', 'h'], ['p-start', 'start', 'start'], ['p-som', 'som', 'som']];
function aplicaLayout(lay){
  LAY = lay; const b = document.body;
  b.classList.remove('lay-desk', 'lay-deitado', 'lay-em_pe', 'lay-toque'); b.classList.add('lay-' + lay); b.classList.toggle('teclado', lay === 'desk');
  if (lay === 'toque'){
    b.style.background = '#0b0f15'; $id('arte').style.backgroundImage = 'none'; $id('moldura').style.backgroundImage = 'none'; $id('virar').style.backgroundImage = 'none';
    for (const id of ['ext-t', 'ext-b', 'ext-l', 'ext-r']) $id(id).style.backgroundImage = 'none';
    const fundo = 'url(' + urlG('deitado_botoes.webp') + ')';   /* so o recorte dos botoes (484x880, 30 KB) e nao a arte inteira (3427x1344, 18 MB na memoria) */
    document.querySelectorAll('.ctl[data-k]').forEach(el => { el.style.backgroundImage = fundo; el.firstElementChild.style.backgroundImage = fundo; });
    $id('dpad').querySelector('.bola').style.backgroundImage = 'url(' + urlG('deitado_alavanca.webp') + ')';
    document.querySelectorAll('.tecla').forEach(t => t.remove()); ZOOM_ON = false; _painel = ''; return;
  }
  const L = GAB[lay];
  document.querySelectorAll('.ctl[data-k]').forEach(el => { el.style.backgroundImage = 'none'; });
  b.style.background = L.cor_fundo;
  $id('arte').style.backgroundImage = 'url(' + urlG(lay + '.webp') + ')';
  $id('moldura').style.backgroundImage = 'url(' + urlG(lay + '_moldura.webp') + ')';
  $id('dpad').querySelector('.bola').style.backgroundImage = 'url(' + urlG(lay + '_alavanca.webp') + ')';
  $id('virar').style.backgroundImage = L.virar ? 'url(' + urlG('em_pe_virar.webp') + ')' : 'none';
  for (const [id, lado] of [['ext-t', 'topo'], ['ext-b', 'base'], ['ext-l', 'esq'], ['ext-r', 'dir']]) $id(id).style.backgroundImage = 'url(' + urlG(lay + '_' + lado + '.webp') + ')';
  document.querySelectorAll('.ctl .tampa').forEach(t => { t.style.backgroundImage = 'url(' + urlG(lay + '.webp') + ')'; });
  document.querySelectorAll('.tecla').forEach(t => t.remove());
  if (L.teclas) for (const k in L.teclas){ const d = document.createElement('div'); d.className = 'tecla'; d.dataset.k = k; d.textContent = L.teclas[k][2]; $id('arte').appendChild(d); }
  ZOOM_ON = false; _painel = '';
}
function zoomAlvo(L, s){
  const [vw, vh] = vista(), m = L.moldura, mw = m[2] * s, mh = m[3] * s;
  return { z: Math.max(1, Math.min(2.6, vw * 0.985 / mw, vh * 0.975 / mh)), cx: (m[0] + m[2] / 2) * s, cy: (m[1] + m[3] / 2) * s };
}
/* 26/10 (diagramacao no computador): fora da luta o gabinete inteiro deixava a tela do jogo com ~40% da largura e o texto miudo.
   Nos menus o quadro vai do letreiro aos rotulos das teclas (sai a porta das fichas e a base): a tela cresce ~25-30% e o letreiro
   e os comandos seguem a vista. Na luta continua o zoom na TV. */
const MENU_DESK = [700, 24, 2052, 1392];
function zoomMenu(s){ const [vw, vh] = vista(), r = MENU_DESK, rw = (r[2] - r[0]) * s, rh = (r[3] - r[1]) * s;
  return { z: Math.max(1, Math.min(1.6, vw * 0.995 / rw, vh * 0.995 / rh)), cx: (r[0] + r[2]) / 2 * s, cy: (r[1] + r[3]) / 2 * s }; }
function aplicaZoom(semAnim){
  const arte = $id('arte'); arte.classList.toggle('sem-anim', !!semAnim);
  document.body.classList.toggle('zoom', LAY === 'desk' && ZOOM_ON);
  if (LAY !== 'desk'){ arte.style.transform = 'none'; return; }
  const [vw, vh] = vista(), a = ZOOM_ON ? zoomAlvo(GAB.desk, ESC) : zoomMenu(ESC), ox = parseFloat(arte.style.left) || 0, oy = parseFloat(arte.style.top) || 0;
  arte.style.transform = 'translate(' + (vw / 2 - ox - a.cx * a.z).toFixed(1) + 'px,' + (vh / 2 - oy - a.cy * a.z).toFixed(1) + 'px) scale(' + a.z.toFixed(4) + ')';
  if (semAnim) requestAnimationFrame(() => arte.classList.remove('sem-anim'));
}
function fitCanvas(){
  const lay = escolheLayout(); if (lay !== LAY) aplicaLayout(lay);
  if (lay === 'toque'){ fitToque(); return; }
  mudaLargura(WB); HUD_SOBRE = false; ZONAS_TOQUE = []; document.body.classList.remove('sobre', 'em-pe', 'vire'); GIRADO = false; document.documentElement.classList.remove('girado');
  const L = GAB[lay]; if (!L) return;
  const [vw, vh] = vista(), s = Math.min(vw / L.W, vh / L.H); ESC = s;
  const w = L.W * s, h = L.H * s, ox = Math.round((vw - w) / 2), oy = Math.round((vh - h) / 2), X = v => v * s;
  poe($id('arte'), ox, oy, w, h);
  poe($id('ext-t'), ox, 0, w, oy + 1); poe($id('ext-b'), ox, oy + h - 1, w, vh - oy - h + 2);
  poe($id('ext-l'), 0, oy, ox + 1, h); poe($id('ext-r'), ox + w - 1, oy, vw - ox - w + 2, h);
  const t = L.tela; poe($id('tela'), X(t[0]), X(t[1]), X(t[2] - t[0]), X(t[3] - t[1]));
  const m = L.moldura; poe($id('moldura'), X(m[0]), X(m[1]), X(m[2]), X(m[3]));
  if (L.virar){ const v = L.virar.sprite; poe($id('virar'), X(v[0]), X(v[1]), X(v[2]), X(v[3])); }
  for (const [id, k] of CTL){
    const bt = L.botoes[k], el = $id(id), tp = el.firstElementChild, a = bt.anel, tt = bt.tampa;
    const kk = lay === 'desk' ? 1 : 1.14, mn = lay === 'desk' ? 24 : 46, aw = Math.max(X(a[2]) * kk, mn), ah = Math.max(X(a[3]) * kk, mn), ax = X(a[0] + a[2] / 2) - aw / 2, ay = X(a[1] + a[3] / 2) - ah / 2;
    poe(el, ax, ay, aw, ah); poe(tp, X(tt[0]) - ax, X(tt[1]) - ay, X(tt[2]), X(tt[3]));
    tp.style.backgroundSize = w + 'px ' + h + 'px';
    tp.style.setProperty('--bx', (-X(tt[0])).toFixed(2) + 'px'); tp.style.setProperty('--by', (-X(tt[1])).toFixed(2) + 'px');
    tp.style.setProperty('--by2', (-X(tt[1]) + X(bt.desce)).toFixed(2) + 'px');
    tp.style.setProperty('--sb', (X(bt.desce) * 0.9).toFixed(2) + 'px'); tp.style.setProperty('--sb2', (X(bt.desce) * 1.3).toFixed(2) + 'px');
    tp.style.setProperty('--halo', (X(a[2]) * 0.2).toFixed(2) + 'px');
  }
  const A = L.alavanca, z = A.zona, sp = A.sprite, dp = $id('dpad'), bola = dp.querySelector('.bola');
  poe(dp, X(z[0]), X(z[1]), X(z[2] - z[0]), X(z[3] - z[1])); poe(bola, X(sp[0] - z[0]), X(sp[1] - z[1]), X(sp[2]), X(sp[3]));
  bola.style.transformOrigin = X(A.pivo[0] - sp[0]).toFixed(1) + 'px ' + X(A.pivo[1] - sp[1]).toFixed(1) + 'px';
  _geo = { cx: X(A.bola[0] - z[0]), cy: X(A.bola[1] - z[1]), r: X(A.bola[2]) };
  document.querySelectorAll('.tecla').forEach(d => { const q = L.teclas[d.dataset.k]; d.style.left = X(q[0]) + 'px'; d.style.top = X(q[1]) + 'px'; d.style.setProperty('--ft', Math.max(7, X(17)).toFixed(1) + 'px'); });
  /* resolucao do canvas: fator inteiro do buffer, pelo maior tamanho que a TV chega a ter na tela */
  const zmax = lay === 'desk' ? zoomAlvo(L, s).z : 1, tw = X(t[2] - t[0]) * zmax;
  const k = Math.max(1, Math.min(8, Math.ceil(tw * (window.devicePixelRatio || 1) / W - 0.02)));
  if (k !== VK || view.width !== W * k){ VK = k; view.width = W * k; view.height = H * k; }
  aplicaZoom(true); _painel = '';
}
/* ---------------- MODO TOQUE: a tela do jogo direto (sem o fliperama), com a arte dos botoes do fliperama.
   Deitado (pedido de 18/10, "maximo aproveitamento da tela"): o jogo ocupa a altura toda e a alavanca e os botoes ficam POR CIMA
   dele, translucidos, como no Free Fire e no Street Fighter IV de celular; aparecem so na luta (nos menus o jogo fica limpo).
   Em pe: o jogo em cima, de borda a borda, e os controles embaixo, no alcance do polegar. ---------------- */
const TAMANHOS = { p: 0.86, m: 1, g: 1.16 };                      /* tamanho dos botoes (como no Free Fire: Configuracoes > HUD) */
const OPACIDADES = { baixa: 0.82, media: 0.6, alta: 0.4 };        /* transparencia dos controles por cima do jogo (SF IV de celular: pausa > botoes) */
const lePref = (k, ok, pad) => { try { const v = localStorage.getItem(k); return ok[v] !== undefined ? v : pad; } catch(e){ return pad; } };
const TQ = { R: 46, casa: [0, 0], usou: false, tamK: lePref('cvc_botoes', TAMANHOS, 'm'), opK: lePref('cvc_transparencia', OPACIDADES, 'media') };
let HUD_SOBRE = false, ZONAS_TOQUE = [];                          /* controles por cima do jogo; areas que eles cobrem, em coordenada do jogo (baloes fogem delas) */
function trocaTamanho(d){ const ks = ['p', 'm', 'g'], n = ks.length; TQ.tamK = ks[(ks.indexOf(TQ.tamK) + (d || 1) + n) % n]; try { localStorage.setItem('cvc_botoes', TQ.tamK); } catch(e){} fitCanvas(); }
function trocaOpacidade(d){ const ks = ['baixa', 'media', 'alta'], n = ks.length; TQ.opK = ks[(ks.indexOf(TQ.opK) + (d || 1) + n) % n]; try { localStorage.setItem('cvc_transparencia', TQ.opK); } catch(e){} document.body.style.setProperty('--op-ctl', OPACIDADES[TQ.opK]); }
function areaSegura(){ const p = $id('seguro'); if (!p) return { t: 0, r: 0, b: 0, l: 0 }; const s = getComputedStyle(p); return { t: parseFloat(s.paddingTop) || 0, r: parseFloat(s.paddingRight) || 0, b: parseFloat(s.paddingBottom) || 0, l: parseFloat(s.paddingLeft) || 0 }; }
/* botao com a arte do fliperama (anel + tampa que afunda); o nome vai DENTRO da tampa, como os icones do Free Fire */
const RECORTE_BOTOES = { x: 2880, y: 180, w: 484, h: 880 };   /* gabinete/deitado_botoes.webp = este pedaco de deitado.webp */
function poeBotaoToque(id, k, cx0, cy0, d, fora){
  const L = GAB.deitado, O = RECORTE_BOTOES, bt = L.botoes[k], a = bt.anel, tt = bt.tampa, sb = d / a[2], dh = a[3] * sb, el = $id(id), tp = el.firstElementChild;
  poe(el, cx0 - d / 2, cy0 - dh / 2, d, dh);
  el.style.backgroundSize = (O.w * sb).toFixed(1) + 'px ' + (O.h * sb).toFixed(1) + 'px'; el.style.backgroundPosition = (-(a[0] - O.x) * sb).toFixed(1) + 'px ' + (-(a[1] - O.y) * sb).toFixed(1) + 'px';
  poe(tp, (tt[0] - a[0]) * sb, (tt[1] - a[1]) * sb, tt[2] * sb, tt[3] * sb); tp.style.backgroundSize = el.style.backgroundSize;
  tp.style.setProperty('--bx', (-(tt[0] - O.x) * sb).toFixed(2) + 'px'); tp.style.setProperty('--by', (-(tt[1] - O.y) * sb).toFixed(2) + 'px'); tp.style.setProperty('--by2', (-(tt[1] - O.y) * sb + bt.desce * sb).toFixed(2) + 'px');
  tp.style.setProperty('--sb', (bt.desce * sb * 0.9).toFixed(2) + 'px'); tp.style.setProperty('--sb2', (bt.desce * sb * 1.3).toFixed(2) + 'px'); tp.style.setProperty('--halo', (d * 0.2).toFixed(2) + 'px');
  el.style.setProperty('--desce', (bt.desce * sb).toFixed(1) + 'px');
  const rot = el.querySelector('.rot');
  if (rot && fora){ rot.className = 'rot cima'; rot.style.left = ''; rot.style.top = ''; rot.style.fontSize = Math.max(7, Math.min(10, d * 0.12)).toFixed(1) + 'px'; }   /* nome comprido (ESPECIAL) fica em cima do botao */
  else if (rot){ rot.className = 'rot dentro'; rot.style.left = ((tt[0] - a[0] + tt[2] / 2) * sb).toFixed(1) + 'px'; rot.style.top = ((tt[1] - a[1] + tt[3] * 0.47) * sb).toFixed(1) + 'px';
    rot.style.fontSize = Math.max(6.5, Math.min(11, (bt.pilula ? tt[3] * sb * 0.34 : d * 0.115))).toFixed(1) + 'px'; }
}
/* arco estilo Free Fire: SOCO grande no canto de baixo; CHUTE a esquerda, HIPER na diagonal e ESPECIAL em cima.
   Encolhe ate caber na faixa livre (nunca por cima do jogo). Devolve o centro do SOCO. */
function arcoBotoes(x0, x1, yTopo, yBase, maxD){
  let dB = Math.max(54, Math.min((x1 - x0) * 0.47, (yBase - yTopo) * 0.34, maxD)) * TAMANHOS[TQ.tamK], dS, r, Sx, Sy;
  for (let k = 0; k < 12; k++){
    dS = dB * 0.78; r = dB / 2 + dS / 2 + 9; Sx = x1 - 10 - dB / 2; Sy = yBase - dB / 2;
    if (Sx - r - dS / 2 >= x0 + 6 && Sy - r - dS / 2 - 14 >= yTopo) break; dB *= 0.94;   /* 14: o nome do ESPECIAL fica em cima */
  }
  poeBotaoToque('b-p', 'soco', Sx, Sy, dB); poeBotaoToque('b-k', 'chute', Sx - r, Sy + r * 0.1, dS);
  poeBotaoToque('b-h', 'hiper', Sx - r * 0.74, Sy - r * 0.74, dS); poeBotaoToque('b-s', 'especial', Sx + r * 0.05, Sy - r, dS, true);
  return { x: Sx, y: Sy, d: dB };
}
/* modo deitado por dentro (19/10): em pe, depois do toque na tela de entrada, o jogo gira 90 graus (horario) e a pessoa vira o celular
   (topo para a esquerda). Coordenada da tela -> do jogo: x' = y, y' = largura real - x (paraPalco). */
let GIRADO = false, GIRAR_PEDIDO = false, VW_REAL = 0;
function retPalco(el){ const q = el.getBoundingClientRect(); return GIRADO ? { left: q.top, top: VW_REAL - q.right, right: q.bottom, bottom: VW_REAL - q.left } : q; }
function fitToque(){
  const de = document.documentElement; let vw = de.clientWidth || innerWidth, vh = de.clientHeight || innerHeight, sa = areaSegura();
  const emPe = vh > vw * 1.05, palco = $id('palco'), estava = document.body.classList.contains('vire');
  GIRADO = emPe && GIRAR_PEDIDO; VW_REAL = vw;
  de.classList.toggle('girado', GIRADO); document.body.classList.toggle('vire', emPe && !GIRAR_PEDIDO);
  if (emPe && !GIRAR_PEDIDO && !estava && typeof scFight !== 'undefined' && SCENE === scFight && !scFight.pausa && !LUTA.demo && (LUTA.fase === 'luta' || LUTA.fase === 'finaliza')) abrePausa(scFight);   /* voltou a ficar em pe no meio da luta */
  if (GIRADO){ palco.style.width = vh + 'px'; palco.style.height = vw + 'px'; palco.style.transform = 'translateX(' + vw + 'px) rotate(90deg)'; sa = { l: sa.t, r: sa.b, t: sa.r, b: sa.l }; [vw, vh] = [vh, vw]; }
  else if (palco.style.transform){ palco.style.width = palco.style.height = palco.style.transform = ''; }
  poe($id('arte'), 0, 0, vw, vh); $id('arte').style.transform = 'none';
  const ret = vh > vw * 1.05, gire = $id('gire');
  let g, soco, zE, ext = null;
  if (ret){                                             /* em pe: o jogo em cima, de borda a borda; os controles embaixo, no alcance do polegar */
    mudaLargura(WB); MARGEM = 0;
    let gw = vw, gh = gw * H / W; const livre = vh - sa.t - sa.b, minCtl = Math.min(330, livre * 0.5);
    if (livre - gh < minCtl){ gh = Math.max(140, livre - minCtl); gw = gh * W / H; }
    const noMeio = EM_APP && !document.body.classList.contains('hud-luta');   /* no app nao tem como girar: nos menus o jogo fica no meio */
    g = [Math.round((vw - gw) / 2), Math.round(noMeio ? sa.t + (livre - gh) / 2 : sa.t), Math.round(gw), Math.round(gh)];
    const topo = g[1] + g[3] + 8, fundo = vh - sa.b - 8, pw = Math.round(Math.max(60, Math.min(78, vw * 0.17)));
    /* PAUSA e SOM a direita, como a engrenagem do Free Fire; a dica de girar o celular a esquerda */
    poeBotaoToque('p-start', 'start', vw - sa.r - 12 - pw * 1.6, topo + 18, pw); poeBotaoToque('p-som', 'som', vw - sa.r - 12 - pw * 0.5, topo + 18, pw);
    if (gire){ gire.style.display = EM_APP ? 'none' : 'flex'; poe(gire, sa.l + 10, topo + 2, Math.max(120, vw - sa.r - pw * 2.3 - sa.l - 30), 34); }
    document.body.style.setProperty('--gire-y', Math.round((topo + 44 + vh - sa.b) / 2) + 'px');   /* nos menus em pe, o aviso de girar ocupa o espaco livre embaixo do jogo */
    const zt = topo + 44, alt = fundo - zt;
    soco = arcoBotoes(vw * 0.5 / TAMANHOS[TQ.tamK], vw - sa.r, zt + 8, fundo - Math.max(18, alt * 0.12), 104);   /* botoes grandes avancam para o meio */
    zE = [sa.l, zt, vw / 2 - sa.l, fundo - zt];
  } else {                                              /* deitado: o jogo na altura toda; alavanca e botoes POR CIMA dele (Free Fire, SF IV de celular) */
    if (gire) gire.style.display = 'none';
    /* 19/10: o jogo cobre a tela toda (ate 2,57:1); o placar e os textos de borda respeitam a area segura pela MARGEM */
    mudaLargura(H * vw / vh);
    let gh = vh, gw = gh * W / H; if (gw < vw){ gw = vw; gh = gw * H / W; }   /* mais largo que 2,57:1: o quadro COBRE (corta poucos px de cima e de baixo) */
    else if (gw > vw * 1.02){ gw = vw; gh = gw * H / W; }   /* 26/10: tela mais quadrada que 1,71:1 (tablet 4:3, iPad girado): encaixa pela largura, com faixas em cima e embaixo; antes cobria e cortava ~150 px de cada lado (VOLTAR, LUTAR!, baloes) */
    g = [Math.round((vw - gw) / 2), Math.round((vh - gh) / 2), Math.round(gw), Math.round(gh)];
    MARGEM = Math.round(Math.max(sa.l, sa.r, 0) * W / g[2]);
    /* PAUSA (na luta) e SOM (nos menus) no mesmo lugar: canto de cima a direita, como a engrenagem do Free Fire */
    const pw = Math.round(Math.max(48, Math.min(62, vh * 0.14))), px = vw - sa.r - 10 - pw / 2, py = sa.t + 10 + pw * 0.26;
    poeBotaoToque('p-start', 'start', px, py, pw); poeBotaoToque('p-som', 'som', px, py, pw);
    /* na luta, a pausa e um icone quadrado II (referencia de 18/10), embaixo do retrato do adversario (o jogo agora vai ate a borda) */
    const q = Math.round(pw * 0.7), ks = g[3] / H, qx = Math.min(vw - sa.r - 6 - q / 2, g[0] + (W - MARGEM - 24) * ks), qy = g[1] + 52 * ks;
    poe($id('p-start'), Math.round(qx - q / 2), Math.round(qy), q, q);
    soco = arcoBotoes(vw * 0.56, vw - sa.r - 4, sa.t + pw * 0.6 + 26, vh - sa.b - Math.max(8, vh * 0.03), Math.min(104, vh * 0.26));
    const mg = Math.round(vh * 0.17);                    /* a alavanca nasce em qualquer ponto da metade esquerda, abaixo das barras de vida */
    zE = [0, mg, Math.round(vw * 0.46), vh - mg];
  }
  HUD_SOBRE = !ret; document.body.classList.toggle('sobre', HUD_SOBRE); document.body.classList.toggle('em-pe', ret);
  document.body.style.setProperty('--op-ctl', OPACIDADES[TQ.opK]);
  poe($id('tela'), g[0], g[1], g[2], g[3]);
  const dp = $id('dpad'), ex = $id('dpad-ext'); poe(dp, zE[0], zE[1], zE[2], zE[3]);
  if (ex){ if (ext){ ex.style.display = ''; poe(ex, ext[0], ext[1], ext[2], ext[3]); } else ex.style.display = 'none'; }
  TQ.R = Math.round(Math.max(34, Math.min(HUD_SOBRE ? 54 : 60, soco.d * (HUD_SOBRE ? 0.6 : 0.66))));
  const bd = Math.round(TQ.R * 2.5), kd = Math.round(TQ.R * 1.3), base = dp.querySelector('.base'), bola = dp.querySelector('.bola');
  base.style.width = base.style.height = bd + 'px'; bola.style.width = bola.style.height = kd + 'px';
  /* a bola vem da arte da alavanca (370x545): circulo vermelho com centro (185.5, 160) e raio 124 */
  const kb = kd / 248; bola.style.backgroundSize = (370 * kb).toFixed(1) + 'px ' + (545 * kb).toFixed(1) + 'px'; bola.style.backgroundPosition = (-61.5 * kb).toFixed(1) + 'px ' + (-36 * kb).toFixed(1) + 'px';
  /* casa da alavanca: embaixo a esquerda, na altura do SOCO (como o direcional do Free Fire), longe da borda (gesto de voltar do iPhone) */
  const casaY = HUD_SOBRE ? Math.min(soco.y, vh - sa.b - bd / 2 - 6) : soco.y;
  TQ.casa = [Math.round(Math.max(sa.l + 18 + bd / 2, Math.min(zE[2] - bd / 2 - 6, sa.l + 30 + bd / 2))) - zE[0], Math.round(Math.min(zE[3] - bd / 2 - 8, casaY - zE[1]))];
  if (!dp.classList.contains('ativo')) alavancaToque(TQ.casa[0], TQ.casa[1], TQ.casa[0], TQ.casa[1], true);
  const di = dp.querySelector('.dica'); if (di){ di.style.left = TQ.casa[0] + 'px'; di.style.top = Math.round(TQ.casa[1] - bd / 2 - 24) + 'px'; di.style.maxWidth = Math.max(80, Math.min(170, zE[2] - 16)) + 'px'; }
  /* areas do jogo cobertas pelos controles (coordenada do jogo): os baloes de fala procuram lugar fora delas */
  ZONAS_TOQUE = [];
  if (HUD_SOBRE){
    const naTela = (x0, y0, x1, y1) => [Math.round((x0 - g[0]) * W / g[2]), Math.round((y0 - g[1]) * H / g[3]), Math.round((x1 - g[0]) * W / g[2]), Math.round((y1 - g[1]) * H / g[3]), 8];
    const cb = ['b-p', 'b-k', 'b-s', 'b-h'].map(id => retPalco($id(id)));
    ZONAS_TOQUE.push(naTela(Math.min(...cb.map(q => q.left)), Math.min(...cb.map(q => q.top)) - 14, Math.max(...cb.map(q => q.right)), Math.max(...cb.map(q => q.bottom))));
    const hx = zE[0] + TQ.casa[0], hy = zE[1] + TQ.casa[1]; ZONAS_TOQUE.push(naTela(hx - bd / 2, hy - bd / 2 - 30, hx + bd / 2, hy + bd / 2));   /* -30: a dica ARRASTE PARA ANDAR em cima dela */
    const pz = retPalco($id('p-start')); ZONAS_TOQUE.push(naTela(pz.left - 4, pz.top - 4, pz.right + 4, pz.bottom + 4));   /* botao de pausa */
  }
  /* resolucao do canvas: fator inteiro pelo tamanho da tela do jogo */
  /* 19/10: fator no maximo 4 (1536x896): acima disso o canvas de tela passava de 3 milhoes de pixels por quadro no celular de
     tela 3x; o resto da ampliacao e do navegador, sem suavizar (pixelated), o que nao se ve em tela de alta densidade */
  const kc = Math.max(1, Math.ceil(g[2] * (window.devicePixelRatio || 1) / W - 0.02)), k = Math.min(4, kc);
  if (k !== VK || view.width !== W * k){ VK = k; view.width = W * k; view.height = H * k; }
  view.style.imageRendering = kc > k ? 'pixelated' : 'auto';
  _painel = '';
}
function alavancaToque(bx, by, kx, ky, solto){
  const dp = $id('dpad'), base = dp.querySelector('.base'), bola = dp.querySelector('.bola');
  base.style.left = bx + 'px'; base.style.top = by + 'px'; bola.style.left = kx + 'px'; bola.style.top = ky + 'px'; dp.classList.toggle('ativo', !solto);
}
function mudaLargura(w){
  w = Math.max(WB, Math.min(WMAX, Math.round(w / 2) * 2)); if (w === W) return;
  const antes = W; W = w; XB = (W - WB) / 2; cv.width = W; cx.imageSmoothingEnabled = false;
  if (typeof alargaArena === 'function') alargaArena(antes);
}
function present(){ vx.imageSmoothingEnabled = false; vx.drawImage(cv, 0, 0, W * VK, H * VK); }
window.addEventListener('resize', fitCanvas);
window.addEventListener('orientationchange', () => setTimeout(fitCanvas, 120));
if (window.visualViewport) visualViewport.addEventListener('resize', fitCanvas);
/* painel acompanha o jogo: botao afunda com tecla ou toque, alavanca inclina, HIPER cheio acende, START pisca no titulo, zoom na luta */
function poseAlavanca(dx, dy){
  if (!dx && !dy) return 'none';
  const r = _geo ? _geo.r : 20, ang = dx * 15 * (dy ? 0.8 : 1), ty = dy < 0 ? -0.16 * r : dy > 0 ? 0.1 * r : 0, sc = dy < 0 ? 0.96 : dy > 0 ? 1.03 : 1;
  return 'translateY(' + ty.toFixed(1) + 'px) rotate(' + ang.toFixed(1) + 'deg) scale(' + sc + ')';
}
function sincronizaPainel(){
  if (!LAY) return;
  const p = IN.p1, luta = typeof scFight !== 'undefined' && SCENE === scFight && !LUTA.demo;
  const cheio = luta && L1 && L1.hiper >= 100, titulo = typeof scTitle !== 'undefined' && SCENE === scTitle;
  const emLuta = !!(luta && (LUTA.fase === 'luta' || LUTA.fase === 'finaliza') && !SCENE.pausa);
  if (document.body.classList.contains('em-luta') !== emLuta) document.body.classList.toggle('em-luta', emLuta);   /* a zona extra da alavanca so vale na luta */
  /* controles de luta so aparecem do LUTA! ao nocaute (fora da pausa e do momento da historia), como nos jogos de luta de celular */
  const hudLuta = !!(luta && !SCENE.pausa && (LUTA.fase === 'intro' || LUTA.fase === 'luta' || LUTA.fase === 'finaliza' || LUTA.fase === 'fatal'));
  if (document.body.classList.contains('hud-luta') !== hudLuta){ document.body.classList.toggle('hud-luta', hudLuta); if (EM_APP && document.body.classList.contains('em-pe')) fitCanvas(); }
  const hp = luta && L1 ? Math.round(Math.min(100, L1.hiper) / 4) * 4 : 0;   /* anel do HIPER: o medidor vai para o botao (Brawl Stars) */
  const chave = '' + p.left + p.right + p.up + p.down + p.p + p.k + p.s + p.h + p.start + (SOM ? 1 : 0) + (cheio ? 1 : 0) + (titulo ? 1 : 0) + (luta ? 1 : 0) + '|' + hp;
  if (chave === _painel) return; _painel = chave;
  $id('b-h').style.setProperty('--hp', hp);
  for (const [id, , k] of CTL){ if (k === 'som') continue; $id(id).classList.toggle('on', !!p[k]); }
  $id('b-h').classList.toggle('aceso', cheio); $id('p-start').classList.toggle('aceso', titulo); $id('p-som').classList.toggle('mudo', !SOM);
  if (LAY !== 'toque') $id('dpad').querySelector('.bola').style.transform = poseAlavanca((p.right ? 1 : 0) - (p.left ? 1 : 0), (p.down ? 1 : 0) - (p.up ? 1 : 0));
  else { const rs = $id('p-start').querySelector('.rot'), tx = luta ? 'PAUSA' : 'START'; if (rs && rs.textContent !== tx) rs.textContent = tx; }
  if (luta !== ZOOM_ON){ ZOOM_ON = luta; aplicaZoom(false); }
}

/* ---------------- ENTRADA (2 jogadores; a IA escreve no mesmo formato) ---------------- */
const NOVO = () => ({ left:0, right:0, up:0, down:0, p:0, k:0, s:0, h:0, start:0 });
const IN = { p1: NOVO(), p2: NOVO() };              /* estado fisico (segurando) */
const PREV = { p1: NOVO(), p2: NOVO() };
const HIT = { p1: NOVO(), p2: NOVO() };             /* borda: apertou neste passo */
let somPedido = false, ENTRADA_REAL = 0;      /* conta toques e teclas de verdade (o demo usa isso p/ saber se alguem chegou) */
function amostraEntrada(){
  for (const j of ['p1','p2']) for (const k in IN[j]){ HIT[j][k] = IN[j][k] && !PREV[j][k] ? 1 : 0; PREV[j][k] = IN[j][k]; }
  for (const [j, k] of SOLTAR) IN[j][k] = 0; SOLTAR.length = 0;
}
/* soltar: se o aperto ainda nao foi lido pelo jogo (toque ou tecla mais rapidos que 1 quadro), solta so depois da leitura */
const SOLTAR = [];
function solta(j, k){ if (IN[j][k] && !PREV[j][k]) SOLTAR.push([j, k]); else IN[j][k] = 0; }
const KEYMAP = { ArrowLeft:['p1','left'], ArrowRight:['p1','right'], ArrowUp:['p1','up'], ArrowDown:['p1','down'],
  z:['p1','p'], x:['p1','k'], c:['p1','s'], v:['p1','h'], Enter:['p1','start'], ' ':['p1','start'],
  a:['p2','left'], d:['p2','right'], w:['p2','up'], s:['p2','down'], f:['p2','p'], g:['p2','k'], h:['p2','s'], j:['p2','h'], Shift:['p2','start'] };
const EM_CAMPO = e => e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA');
window.addEventListener('keydown', e => {
  if (EM_CAMPO(e)) return;
  if (e.repeat) return;
  const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  if (k === 'm'){ somPedido = true; return; }
  if (k === 'Escape' || k === 'p'){ PEDE_PAUSA = true; e.preventDefault(); return; }
  const m = KEYMAP[k] || KEYMAP[e.key]; if (!m) return;
  IN[m[0]][m[1]] = 1; ENTRADA_REAL++; audio(); e.preventDefault();
});
window.addEventListener('keyup', e => {
  if (EM_CAMPO(e)) return;
  const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  const m = KEYMAP[k] || KEYMAP[e.key]; if (!m) return;
  solta(m[0], m[1]); e.preventDefault();
});
window.addEventListener('blur', ()=>{ for (const j of ['p1','p2']) for (const k in IN[j]) IN[j][k] = 0; });
/* toque (e mouse no computador): botoes da arte. Onde duas areas de toque se encostam (celular pequeno),
   vale o botao de centro mais proximo; cada dedo guarda o seu botao (dois dedos = dois botoes). */
const TOQUES = new Map();
/* no modo toque a area de toque passa da borda do botao (o polegar erra para fora) e vale o centro mais proximo */
function botaoMaisPerto(x, y, limite){
  let melhor = null, dm = limite || (LAY === 'toque' ? 1.7 : 1.0001);
  document.querySelectorAll('.ctl[data-k]').forEach(el => { const q = el.getBoundingClientRect(), rx = q.width / 2, ry = q.height / 2;
    const d = ((x - q.left - rx) / rx) ** 2 + ((y - q.top - ry) / ry) ** 2; if (d < dm){ dm = d; melhor = el; } });
  return melhor;
}
const DE_ACAO = el => el && el.dataset.k !== 'start' && el.dataset.k !== 'som';
function apertaBotao(el, id){ const k = el.dataset.k; audio(); el.classList.add('on'); ENTRADA_REAL++; if (k === 'som') somPedido = true; else IN.p1[k] = 1; vibra(8); TOQUES.set(id, el); }
function soltaBotao(id){
  const el = TOQUES.get(id); if (!el) return; TOQUES.delete(id); const k = el.dataset.k;
  if (![...TOQUES.values()].includes(el)){ el.classList.remove('on'); if (k !== 'som') solta('p1', k); }
}
document.querySelectorAll('.ctl[data-k]').forEach(el => {
  el.addEventListener('pointerdown', e => { e.preventDefault(); if (TOQUES.has(e.pointerId)) return; if (LAY === 'toque'){ try { el.setPointerCapture(e.pointerId); } catch(_){} }
    apertaBotao(botaoMaisPerto(e.clientX, e.clientY) || el, e.pointerId); });
  /* modo toque: o dedo desliza de um botao para o outro sem levantar (SOCO -> CHUTE), como nos jogos de luta de celular */
  el.addEventListener('pointermove', e => { if (LAY !== 'toque' || !TOQUES.has(e.pointerId)) return; const atual = TOQUES.get(e.pointerId), novo = botaoMaisPerto(e.clientX, e.clientY, 1);
    if (novo && novo !== atual && DE_ACAO(novo) && DE_ACAO(atual)){ soltaBotao(e.pointerId); apertaBotao(novo, e.pointerId); } });
  const off = e => { e.preventDefault(); soltaBotao(e.pointerId); };
  el.addEventListener('pointerup', off); el.addEventListener('pointercancel', off); el.addEventListener('pointerleave', e => { if (LAY !== 'toque') off(e); });
});
/* alavanca: zona do painel, direcao pelo centro da bola (8 direcoes com zona morta) */
(function(){
  const dp = $id('dpad'); if (!dp) return;
  const zonas = [dp, $id('dpad-ext')].filter(Boolean);    /* na luta deitado, a zona continua por cima do lado esquerdo do jogo (invisivel) */
  let ativo = null, org = null;
  function aplica(lx, ly){
    const g = LAY === 'toque' && org ? { cx: org[0], cy: org[1], r: TQ.R } : (_geo || { cx: dp.offsetWidth / 2, cy: dp.offsetHeight / 2, r: 20 });
    const dx = lx - g.cx, dy = ly - g.cy, r = Math.hypot(dx, dy), st = { up:0, left:0, right:0, down:0 };
    if (r > (LAY === 'toque' ? Math.max(9, g.r * 0.3) : Math.max(10, g.r * 0.42))){
      const a = Math.atan2(dy, dx);
      const v = LAY === 'toque' ? 0.6 : 0.38;           /* no toque, pular ou agachar pede o polegar mais na vertical (sem pulo sem querer) */
      if (Math.cos(a) > 0.38) st.right = 1; if (Math.cos(a) < -0.38) st.left = 1;
      if (Math.sin(a) > v) st.down = 1; if (Math.sin(a) < -v) st.up = 1;
    }
    let mudou = false;
    for (const d of ['up', 'left', 'right', 'down']){ if (IN.p1[d] !== st[d]) mudou = true; if (st[d]) IN.p1[d] = 1; else if (IN.p1[d]) solta('p1', d); }
    if (mudou && (st.up || st.left || st.right || st.down)) vibra(6);
  }
  function local(e){ const b = dp.getBoundingClientRect();
    if (GIRADO) return [(e.clientY - b.top) * dp.offsetWidth / (b.height || 1), (b.right - e.clientX) * dp.offsetHeight / (b.width || 1)];   /* jogo girado por dentro */
    const k = dp.offsetWidth / (b.width || 1); return [(e.clientX - b.left) * k, (e.clientY - b.top) * k]; }
  function segue(lx, ly){                               /* modo toque: a base nasce no polegar e vem atras dele se ele passar do raio */
    let dx = lx - org[0], dy = ly - org[1], r = Math.hypot(dx, dy); const R = TQ.R;
    if (r > R * 1.3){ const k = (r - R * 1.3) / r; org[0] += dx * k; org[1] += dy * k; dx = lx - org[0]; dy = ly - org[1]; r = Math.hypot(dx, dy); }
    const m = Math.min(1, R / Math.max(1, r)); alavancaToque(org[0], org[1], org[0] + dx * m, org[1] + dy * m, false);
  }
  for (const z of zonas){
    z.addEventListener('pointerdown', e => { e.preventDefault(); audio(); ENTRADA_REAL++; if (ativo !== null) return; ativo = e.pointerId; try { z.setPointerCapture(e.pointerId); } catch(_){}
      const [lx, ly] = local(e); if (LAY === 'toque'){ org = [lx, ly]; TQ.usou = true; dp.classList.add('usou'); segue(lx, ly); } aplica(lx, ly); });
    z.addEventListener('pointermove', e => { if (e.pointerId !== ativo) return; e.preventDefault(); const [lx, ly] = local(e); if (LAY === 'toque' && org) segue(lx, ly); aplica(lx, ly); });
    const larga = e => { if (e.pointerId !== ativo) return; ativo = null; org = null; for (const d of ['up', 'left', 'right', 'down']) solta('p1', d); if (LAY === 'toque') alavancaToque(TQ.casa[0], TQ.casa[1], TQ.casa[0], TQ.casa[1], true); };
    z.addEventListener('pointerup', larga); z.addEventListener('pointercancel', larga);
  }
})();
function vibra(ms){ try { if (navigator.vibrate) navigator.vibrate(ms || 8); } catch(e){} }
/* VOLTAR do sistema (gesto da borda no iPhone, botao ou gesto voltar no Android): no meio do jogo ele nao sai da pagina,
   abre a pausa (na luta) ou volta uma tela; no titulo o voltar e o do navegador. Armado ao sair do titulo. */
let VOLTAR_PEDIDO = false, HIST_ARMADO = false;
function armaVoltar(){ if (HIST_ARMADO) return; try { history.pushState({ cvc: 1 }, ''); HIST_ARMADO = true; } catch(e){} }
window.addEventListener('popstate', () => { HIST_ARMADO = false; if (typeof scTitle !== 'undefined' && (SCENE === scTitle || SCENE === scBoot)) return; VOLTAR_PEDIDO = true; armaVoltar(); });
/* tela cheia (Android e tablets; o iPhone nao deixa): pedida no primeiro toque do titulo, desligavel na pausa */
const TELA_CHEIA_OK = !!(document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen) && !/iPhone|iPod/.test(navigator.userAgent);
function telaCheiaAtiva(){ return !!(document.fullscreenElement || document.webkitFullscreenElement); }
function telaCheia(on, deitar){
  if (!TELA_CHEIA_OK) return; const d = document.documentElement;
  try {
    if (on && !telaCheiaAtiva()){ const pr = (d.requestFullscreen || d.webkitRequestFullscreen).call(d, { navigationUI: 'hide' });
      if (pr && pr.then) pr.then(() => { try { if (screen.orientation && screen.orientation.lock && (deitar || innerWidth > innerHeight)) screen.orientation.lock('landscape').catch(() => {}); } catch(e){} }).catch(() => {}); }
    else if (!on && telaCheiaAtiva()) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
  } catch(e){}
}
/* toque na tela do jogo: cada cena decide (menu, escolha, pular). Lido no passo da logica, nunca no meio dele. */
let TOQUE_TELA = null, PEDE_PAUSA = false;
view.addEventListener('pointerdown', e => {
  e.preventDefault(); audio(); ENTRADA_REAL++;
  if (LAY === 'toque' && typeof scTitle !== 'undefined' && SCENE === scTitle && !TQ.cheiaPedida){ TQ.cheiaPedida = true; telaCheia(true); }   /* dentro do gesto: o navegador so deixa assim */
  const r = view.getBoundingClientRect(); if (!r.width || !r.height) return;
  TOQUE_TELA = GIRADO ? { x: (e.clientY - r.top) * W / r.height, y: (r.right - e.clientX) * H / r.width } : { x: (e.clientX - r.left) * W / r.width, y: (e.clientY - r.top) * H / r.height };
});
/* computador que recebe um toque de verdade (tablet, notebook com tela de toque) passa para o modo toque */
document.addEventListener('pointerdown', e => { if (e.pointerType === 'touch' && LAY === 'desk' && !Q.get('formato')){ TOQUE_USADO = true; fitCanvas(); } }, true);
/* sem zoom do navegador: pinca, toque duplo e arrasto ficam com o jogo (o cartao por cima continua rolando e aceitando texto) */
const NO_CARTAO = e => !!(e.target && e.target.closest && e.target.closest('#over'));
for (const t of ['gesturestart', 'gesturechange', 'gestureend']) document.addEventListener(t, e => { if (!NO_CARTAO(e)) e.preventDefault(); }, { passive: false });
document.addEventListener('dblclick', e => { if (!NO_CARTAO(e)) e.preventDefault(); }, { passive: false });
let _ultToque = 0;
document.addEventListener('touchend', e => { if (NO_CARTAO(e)) return; const t = performance.now(); if (t - _ultToque < 350) e.preventDefault(); _ultToque = t; }, { passive: false });
document.addEventListener('touchmove', e => { if (!NO_CARTAO(e) || e.touches.length > 1) e.preventDefault(); }, { passive: false });
/* se mesmo assim o navegador ficou com zoom (iPhone), o viewport e reescrito para ele voltar a 1x */
function desfazZoom(){
  const vv = window.visualViewport; if (!vv || vv.scale <= 1.02) return;
  const ms = document.querySelectorAll('meta[name=viewport]'), m = ms[ms.length - 1]; if (!m) return;   /* no Webflow vale a ultima (a do jogo, no head da pagina) */ const c = m.getAttribute('content');
  m.setAttribute('content', c.replace(/maximum-scale=[\d.]+/, 'maximum-scale=1.0001').replace(/initial-scale=[\d.]+/, 'initial-scale=1.0001')); setTimeout(() => m.setAttribute('content', c), 80);
}
if (window.visualViewport) visualViewport.addEventListener('resize', desfazZoom);
/* 19/10 (pedido: "bloqueie zooms e outras respostas que podem desconfigurar o jogo", inclusive no navegador do Instagram):
   sem menu de toque longo, sem arrastar imagem, sem zoom de ctrl+roda ou ctrl+/-; a pagina nunca rola (o teclado do cadastro
   empurra a tela no iPhone: ao fechar, volta ao lugar e o jogo se reencaixa) */
document.addEventListener('contextmenu', e => { if (!NO_CARTAO(e)) e.preventDefault(); });
document.addEventListener('dragstart', e => e.preventDefault());
window.addEventListener('wheel', e => { if (e.ctrlKey) e.preventDefault(); }, { passive: false });
window.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && ['+', '-', '=', '0'].includes(e.key)) e.preventDefault(); });
const voltaAoLugar = () => { if (window.scrollX || window.scrollY) window.scrollTo(0, 0); };
window.addEventListener('scroll', () => { const ov = $id('over'); if (!(ov && ov.classList.contains('on'))) voltaAoLugar(); }, { passive: true });
document.addEventListener('focusout', e => { if (e.target && e.target.matches && e.target.matches('input')) setTimeout(() => { voltaAoLugar(); fitCanvas(); }, 80); });
if (EM_APP) document.documentElement.classList.add('em-app');
$id('vire').addEventListener('pointerdown', e => { e.preventDefault(); audio(); GIRAR_PEDIDO = true; ENTRADA_REAL++; telaCheia(true, true); avisaPagina('girou_por_dentro', { app: EM_APP }); fitCanvas(); });
/* 27/10 (pedido: "de a opcao da pessoa abrir no navegador na chamada principal", como no 2o ROUND): ABRIR NO NAVEGADOR na entrada em
   pe, so no navegador de app. Instagram (iPhone e Android): instagram://extbrowser/?url= dentro do toque (o proprio app pergunta se abre
   fora; esquema sem documentacao, testado em set-out/2026; redirecionar por JS na carga e ignorado, x-safari-https nao funciona mais).
   Outros apps no Android: intent:// do Chrome. iPhone fora do Instagram (Facebook, TikTok) ou app que ignorou o pedido (a pagina segue
   visivel 1,4 s depois): aviso com o caminho manual e COPIAR LINK. O endereco leva a mesma query (as utm da campanha seguem ate o lead)
   + abriu=navegador. */
(function(){
  const b = $id('b-navegador'), av = $id('abre-fora'); if (!b || !av) return;
  const alvo = () => { const u = new URL(location.href); u.searchParams.set('abriu', 'navegador'); u.hash = ''; return u.toString(); };
  b.addEventListener('pointerdown', e => e.stopPropagation());   /* o toque no botao nao liga o giro por dentro */
  b.addEventListener('click', e => {
    e.preventDefault(); e.stopPropagation();
    const ua = navigator.userAgent, ig = /Instagram/i.test(ua), android = /Android/i.test(ua), url = alvo();
    avisaPagina('abrir_navegador', { app: ig ? 'instagram' : 'outro', sistema: android ? 'android' : 'ios' });
    if (!ig && !android){ av.classList.add('on'); return; }
    let saiu = false; const vis = () => { if (document.visibilityState === 'hidden') saiu = true; };
    document.addEventListener('visibilitychange', vis);
    try { location.href = ig ? 'instagram://extbrowser/?url=' + encodeURIComponent(url)
      : 'intent://' + url.replace(/^https?:\/\//, '') + '#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=' + encodeURIComponent(url) + ';end'; } catch(err){}
    setTimeout(() => { document.removeEventListener('visibilitychange', vis); if (!saiu) av.classList.add('on'); }, 1400);
  });
  $id('af-fecha').addEventListener('click', () => av.classList.remove('on'));
  $id('af-copia').addEventListener('click', async () => { const bt = $id('af-copia'); try { await navigator.clipboard.writeText(alvo()); bt.textContent = 'LINK COPIADO'; } catch(e){ bt.textContent = location.host; } });
})();

/* ---------------- AUDIO (sintetizado, sem arquivo) ---------------- */
let AC = null, musicTimer = null, SOM = true;
/* 19/10: o audio so nasce no primeiro toque ou tecla (antes disso o navegador nao deixa tocar, e criar o AudioContext custava
   ~200 ms de CPU no titulo do celular lento). Volta a acordar quando a pagina volta do segundo plano (WKWebView do Instagram
   perde o audio). Antes do gesto o som fica mudo sem custo. */
let AUDIO_LIBERADO = false;
function liberaAudio(){
  if (!AC){ try { AC = new (window.AudioContext||window.webkitAudioContext)(); } catch(e){} }
  if (AC && AC.state !== 'running'){ try { AC.resume(); } catch(e){} }
  AUDIO_LIBERADO = !!AC;
}
['pointerdown', 'touchend', 'keydown'].forEach(ev => window.addEventListener(ev, liberaAudio, { capture: true, passive: true }));
document.addEventListener('visibilitychange', () => { if (!document.hidden && AC && AC.state !== 'running'){ try { AC.resume(); } catch(e){} } });
function audio(){ return AUDIO_LIBERADO ? AC : null; }
function tone(f, dur, type, vol, when, slide){
  if (!SOM) return;
  const a = audio(); if (!a) return;
  const t = (when||0) + a.currentTime;
  const o = a.createOscillator(), g = a.createGain();
  o.type = type||'square'; o.frequency.setValueAtTime(f, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, slide), t + dur);
  g.gain.setValueAtTime(vol||0.06, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t+dur);
  o.connect(g); g.connect(a.destination);
  o.start(t); o.stop(t+dur+0.02);
}
function ruido(dur, vol, when){
  if (!SOM) return; const a = audio(); if (!a) return;
  const n = Math.floor(a.sampleRate * dur), b = a.createBuffer(1, n, a.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random()*2-1) * (1 - i/n);
  const s = a.createBufferSource(); s.buffer = b; const g = a.createGain(); g.gain.value = vol || .08;
  s.connect(g); g.connect(a.destination); s.start(a.currentTime + (when||0));
}
const SFX = {
  blip(){ tone(880, .03, 'square', .035); },
  ok(){ tone(1046, .06, 'square', .05); tone(1568, .08, 'square', .04, .06); },
  back(){ tone(392, .07, 'square', .05); },
  whoosh(){ ruido(.09, .05); tone(300, .08, 'triangle', .03, 0, 120); },
  hit(){ ruido(.06, .12); tone(160, .09, 'square', .08, 0, 60); },
  hitForte(){ ruido(.12, .16); tone(110, .16, 'sawtooth', .1, 0, 40); tone(70, .2, 'square', .08, .02); },
  block(){ tone(420, .05, 'square', .05); tone(300, .06, 'square', .04, .04); },
  especial(){ [440, 660, 880].forEach((f,i)=>tone(f, .08, 'square', .05, i*.05)); ruido(.15, .05, .1); },
  hiper(){ [220, 330, 440, 660, 880, 1320].forEach((f,i)=>tone(f, .12, 'sawtooth', .06, i*.06)); ruido(.4, .08, .3); },
  ko(){ tone(200, .5, 'sawtooth', .1, 0, 40); ruido(.3, .1); [392,330,262].forEach((f,i)=>tone(f,.2,'square',.05,.4+i*.18)); },
  fight(){ [523, 659, 784, 1046].forEach((f,i)=>tone(f, .1, 'square', .06, i*.07)); tone(1046, .3, 'square', .06, .3); },
  win(){ [784,784,784,1046,932,1046,1318].forEach((f,i)=>tone(f,.11,'square',.05,i*.11)); },
  lose(){ [392,330,262,196].forEach((f,i)=>tone(f,.16,'square',.05,i*.15)); },
  moeda(){ tone(1568, .06, 'square', .05); tone(2093, .18, 'square', .05, .06); },
  timer(){ tone(1200, .04, 'square', .04); },
  pulo(){ tone(300, .1, 'square', .04, 0, 700); },
  zzz(){ [660, 520, 400].forEach((f,i)=>tone(f, .18, 'triangle', .04, i*.2)); },
  flash(){ tone(2400, .12, 'square', .05); ruido(.08, .06); },
  brilho(){ [1760, 2349, 2637].forEach((f,i)=>tone(f, .09, 'triangle', .04, i*.06)); },
  risada(){ [620, 540, 620, 540, 620].forEach((f,i)=>tone(f, .05, 'square', .03, i*.085)); },
  maquina(){ for (let i = 0; i < 10; i++) tone(90 + (i%2)*30, .07, 'sawtooth', .05, i*.07); },
  coracao(){ tone(72, .09, 'sine', .14, 0, 50); tone(64, .12, 'sine', .11, .17, 44); },
  carimbo(){ tone(96, .14, 'square', .07, 0, 48); ruido(.07, .09); }
};
let MUSICA_ATUAL = null;
function musica(qual){
  MUSICA_ATUAL = qual || null;
  if (musicTimer) { clearInterval(musicTimer); musicTimer = null; }
  if (!qual || !SOM) return;
  const pats = {
    titulo: { bpm:.17, seq:[196,0,247,0,294,0,247,0,196,0,247,0,330,0,294,0], type:'square', vol:.03 },
    luta:   { bpm:.13, seq:[131,131,0,156,131,0,175,156,131,131,0,156,196,0,175,156], type:'square', vol:.035, baixo:true },
    boss:   { bpm:.12, seq:[110,110,0,131,110,0,165,156,110,110,0,131,196,0,165,156], type:'sawtooth', vol:.03, baixo:true },
    vitoria:{ bpm:.2,  seq:[262,330,392,523,392,330,262,0], type:'square', vol:.035 },
    fim:    { bpm:.28, seq:[262,0,330,0,392,0,523,0,392,0,330,0], type:'triangle', vol:.035 }
  };
  const p = pats[qual]; if (!p) return;
  let i = 0;
  musicTimer = setInterval(()=>{
    const f = p.seq[i % p.seq.length];
    if (f) tone(f, p.bpm*.9, p.type, p.vol);
    if (p.baixo && i % 4 === 0) tone(f ? f/2 : 65, p.bpm*.8, 'triangle', .04);
    i++;
  }, p.bpm*1000);
}

/* ---------------- TEXTO: fonte bitmap 8x8 (Coroa City) ---------------- */
const INK = '#20242a', CREME = '#f3f1ee', CORAL = '#ff8d7d', MINT = '#9fe4b2', TEAL = '#0b3b3c', HERO = '#0c3c3c', AMARELO = '#f8d040', VERM = '#e04040', AZUL = '#63b6b5';
const FONT = {
  "A": ['.#####..','##...##.','##...##.','#######.','##...##.','##...##.','##...##.','........'],
  "B": ['######..','##...##.','##...##.','######..','##...##.','##...##.','######..','........'],
  "C": ['.#####..','##...##.','##......','##......','##......','##...##.','.#####..','........'],
  "D": ['######..','##...##.','##...##.','##...##.','##...##.','##...##.','######..','........'],
  "E": ['#######.','##......','##......','#####...','##......','##......','#######.','........'],
  "F": ['#######.','##......','##......','#####...','##......','##......','##......','........'],
  "G": ['.#####..','##...##.','##......','##..###.','##...##.','##...##.','.#####..','........'],
  "H": ['##...##.','##...##.','##...##.','#######.','##...##.','##...##.','##...##.','........'],
  "I": ['######..','..##....','..##....','..##....','..##....','..##....','######..','........'],
  "J": ['..#####.','....##..','....##..','....##..','....##..','##..##..','.####...','........'],
  "K": ['##...##.','##..##..','##.##...','####....','##.##...','##..##..','##...##.','........'],
  "L": ['##......','##......','##......','##......','##......','##......','#######.','........'],
  "M": ['##...##.','###.###.','#######.','##.#.##.','##...##.','##...##.','##...##.','........'],
  "N": ['##...##.','###..##.','####.##.','##.####.','##..###.','##...##.','##...##.','........'],
  "O": ['.#####..','##...##.','##...##.','##...##.','##...##.','##...##.','.#####..','........'],
  "P": ['######..','##...##.','##...##.','######..','##......','##......','##......','........'],
  "Q": ['.#####..','##...##.','##...##.','##...##.','##.#.##.','##..##..','.####.#.','........'],
  "R": ['######..','##...##.','##...##.','######..','##.##...','##..##..','##...##.','........'],
  "S": ['.######.','##......','##......','.#####..','.....##.','.....##.','######..','........'],
  "T": ['######..','..##....','..##....','..##....','..##....','..##....','..##....','........'],
  "U": ['##...##.','##...##.','##...##.','##...##.','##...##.','##...##.','.#####..','........'],
  "V": ['##...##.','##...##.','##...##.','##...##.','.##.##..','.##.##..','..###...','........'],
  "W": ['##...##.','##...##.','##...##.','##.#.##.','#######.','###.###.','##...##.','........'],
  "X": ['##...##.','.##.##..','..###...','..###...','..###...','.##.##..','##...##.','........'],
  "Y": ['##...##.','##...##.','.##.##..','..###...','..##....','..##....','..##....','........'],
  "Z": ['#######.','.....##.','....##..','...##...','..##....','.##.....','#######.','........'],
  "0": ['.#####..','##...##.','##..###.','##.#.##.','###..##.','##...##.','.#####..','........'],
  "1": ['..##....','.###....','..##....','..##....','..##....','..##....','######..','........'],
  "2": ['.#####..','##...##.','.....##.','...###..','..##....','.##.....','#######.','........'],
  "3": ['.#####..','##...##.','.....##.','...###..','.....##.','##...##.','.#####..','........'],
  "4": ['...###..','..####..','.##.##..','##..##..','#######.','....##..','....##..','........'],
  "5": ['######..','##......','##......','######..','.....##.','##...##.','.#####..','........'],
  "6": ['.#####..','##......','##......','######..','##...##.','##...##.','.#####..','........'],
  "7": ['#######.','.....##.','....##..','...##...','..##....','..##....','..##....','........'],
  "8": ['.#####..','##...##.','##...##.','.#####..','##...##.','##...##.','.#####..','........'],
  "9": ['.#####..','##...##.','##...##.','.######.','.....##.','.....##.','.#####..','........'],
  ".": ['........','........','........','........','........','..##....','..##....','........'],
  ",": ['........','........','........','........','........','..##....','..##....','.##.....'],
  "!": ['..##....','..##....','..##....','..##....','..##....','........','..##....','........'],
  "?": ['.#####..','##...##.','....##..','...##...','..##....','........','..##....','........'],
  ":": ['........','..##....','..##....','........','..##....','..##....','........','........'],
  ";": ['........','..##....','..##....','........','..##....','..##....','.##.....','........'],
  "-": ['........','........','........','.#####..','........','........','........','........'],
  "/": ['.....##.','....##..','...##...','..##....','.##.....','##......','##......','........'],
  "(": ['...##...','..##....','.##.....','.##.....','.##.....','..##....','...##...','........'],
  ")": ['..##....','...##...','....##..','....##..','....##..','...##...','..##....','........'],
  "%": ['##...##.','##..##..','...##...','..##....','.##.....','##..##..','##...##.','........'],
  "+": ['........','..##....','..##....','######..','..##....','..##....','........','........'],
  "'": ['..##....','..##....','.##.....','........','........','........','........','........'],
  "\"": ['.##.##..','.##.##..','##.##...','........','........','........','........','........'],
  "▼": ['........','........','#######.','.#####..','..###...','...#....','........','........'],
  "▶": ['##......','####....','######..','####....','##......','........','........','........'],
  "♥": ['.##.##..','#######.','#######.','.#####..','..###...','...#....','........','........']
};
const FCHARS = Object.keys(FONT);
const _atlas = new Map();
let _atlasBase = null;
function fontAtlas(col){
  let a = _atlas.get(col);
  if (a) return a;
  /* 19/10: a fonte e desenhada pixel a pixel UMA vez (branca); cada cor nova e so um tingimento dela (2 operacoes em vez de
     ~4 mil), o que tirou a trava de quando o titulo aparece no celular lento */
  if (!_atlasBase){ _atlasBase = document.createElement('canvas'); _atlasBase.width = FCHARS.length * 8; _atlasBase.height = 8; const gb = _atlasBase.getContext('2d'); gb.fillStyle = '#ffffff';
    FCHARS.forEach((ch, i) => { const rows = FONT[ch]; for (let y = 0; y < rows.length; y++) for (let x = 0; x < 8; x++) if (rows[y][x] === '#') gb.fillRect(i*8 + x, y, 1, 1); }); }
  const c = document.createElement('canvas');
  c.width = FCHARS.length * 8; c.height = 8;
  const g = c.getContext('2d');
  g.drawImage(_atlasBase, 0, 0); g.globalCompositeOperation = 'source-in'; g.fillStyle = col; g.fillRect(0, 0, c.width, c.height);
  a = { c: c, idx: {} };
  FCHARS.forEach((ch, i) => { a.idx[ch] = i; });
  _atlas.set(col, a);
  return a;
}
/* tempo de leitura: 0,8 s para achar o texto + 15 letras por segundo (ritmo de legenda), minimo de 1 s */
function leitura(s){ return Math.max(60, Math.round(60 * (0.8 + String(s || '').length / 15))); }
function larguraT(str, sc){ sc = sc || 1; let w = 0; for (const ch of String(str)) w += (ch === ' ' ? 5 : 8) * sc; return w - sc; }
/* texto centrado (espaco estreito) */
function txtT(str, cxX, y, col, sc){
  sc = sc || 1;
  const a = fontAtlas(col || CREME);
  str = String(str).toUpperCase();
  const adv = ch => (ch === ' ' ? 5 : 8) * sc;
  let w = 0; for (const ch of str) w += adv(ch);
  let x = Math.round(cxX - (w - sc) / 2);
  for (const ch of str){ const gi = a.idx[ch]; if (gi !== undefined) cx.drawImage(a.c, gi*8, 0, 8, 8, x, y, 8*sc, 8*sc); x += adv(ch); }
}
/* texto alinhado a esquerda */
function txtL(str, x, y, col, sc){
  sc = sc || 1; const a = fontAtlas(col || CREME); str = String(str).toUpperCase();
  for (const ch of str){ const gi = a.idx[ch]; if (gi !== undefined) cx.drawImage(a.c, gi*8, 0, 8, 8, x, y, 8*sc, 8*sc); x += (ch === ' ' ? 5 : 8) * sc; }
}
function txtR(str, x, y, col, sc){ sc = sc || 1; txtL(str, x - larguraT(str, sc), y, col, sc); }
/* com contorno de 1px (legivel sobre o cenario) */
function txtO(str, cxX, y, col, borda, sc){
  for (const [ox, oy] of [[-1,0],[1,0],[0,-1],[0,1],[1,1],[-1,-1],[1,-1],[-1,1]]) txtT(str, cxX + ox, y + oy, borda || INK, sc);
  txtT(str, cxX, y, col, sc);
}
function txtOL(str, x, y, col, borda, sc){
  for (const [ox, oy] of [[-1,0],[1,0],[0,-1],[0,1],[1,1],[-1,-1],[1,-1],[-1,1]]) txtL(str, x + ox, y + oy, borda || INK, sc);
  txtL(str, x, y, col, sc);
}
function txtOR(str, x, y, col, borda, sc){
  for (const [ox, oy] of [[-1,0],[1,0],[0,-1],[0,1],[1,1],[-1,-1],[1,-1],[-1,1]]) txtR(str, x + ox, y + oy, borda || INK, sc);
  txtR(str, x, y, col, sc);
}
/* fonte miuda 3x5 (avisos) */
const MINI35 = {
  A:['.#.','#.#','###','#.#','#.#'], B:['##.','#.#','##.','#.#','##.'], C:['.##','#..','#..','#..','.##'], D:['##.','#.#','#.#','#.#','##.'],
  E:['###','#..','##.','#..','###'], F:['###','#..','##.','#..','#..'], G:['.##','#..','#.#','#.#','.##'], H:['#.#','#.#','###','#.#','#.#'],
  I:['###','.#.','.#.','.#.','###'], J:['..#','..#','..#','#.#','.#.'], K:['#.#','#.#','##.','#.#','#.#'], L:['#..','#..','#..','#..','###'],
  M:['#.#','###','###','#.#','#.#'], N:['##.','#.#','#.#','#.#','#.#'], O:['.#.','#.#','#.#','#.#','.#.'], P:['##.','#.#','##.','#..','#..'],
  Q:['.#.','#.#','#.#','##.','.##'], R:['##.','#.#','##.','#.#','#.#'], S:['.##','#..','.#.','..#','##.'], T:['###','.#.','.#.','.#.','.#.'],
  U:['#.#','#.#','#.#','#.#','###'], V:['#.#','#.#','#.#','#.#','.#.'], W:['#.#','#.#','###','###','#.#'], X:['#.#','#.#','.#.','#.#','#.#'],
  Y:['#.#','#.#','.#.','.#.','.#.'], Z:['###','..#','.#.','#..','###'], '.':['...','...','...','...','.#.'], ',':['...','...','...','.#.','#..'],
  '0':['###','#.#','#.#','#.#','###'], '1':['.#.','##.','.#.','.#.','###'], '2':['##.','..#','.#.','#..','###'], '3':['##.','..#','.#.','..#','##.'],
  '4':['#.#','#.#','###','..#','..#'], '5':['###','#..','##.','..#','##.'], '6':['.##','#..','###','#.#','###'], '7':['###','..#','.#.','.#.','.#.'],
  '8':['###','#.#','###','#.#','###'], '9':['###','#.#','###','..#','##.'], '%':['#.#','..#','.#.','#..','#.#'], ':':['...','.#.','...','.#.','...'], '-':['...','...','###','...','...']
};
function txtMini(str, cxX, y, col){
  str = String(str).toUpperCase();
  const w = str.length * 4 - 1;
  let x = Math.round(cxX - w / 2);
  cx.fillStyle = col || CREME;
  for (const ch of str){
    const g = MINI35[ch];
    if (g) for (let r = 0; r < 5; r++) for (let c = 0; c < 3; c++) if (g[r][c] === '#') cx.fillRect(x + c, y + r, 1, 1);
    x += 4;
  }
}
/* quebra de linha pela regra da casa: escolhe as quebras de menor custo (menos linhas, linhas cheias por igual)
   e penaliza viuva (ultima linha com uma palavra so), conectora curta no fim da linha e palavra curta solta
   depois de pontuacao no fim da linha */
const CONECTORAS = new Set(['A','O','E','AS','OS','AO','AOS','UM','UMA','DE','DO','DA','DOS','DAS','EM','NO','NA','NOS','NAS','SE','QUE','COM','POR','PRA','PRO','PARA','MAS','OU','SEU','SUA','MEU','MINHA','TEU','NEM']);
function wrap(s, n){
  n = n || 44;
  const w = String(s).split(' ').filter(Boolean), k = w.length; if (!k) return [];
  const pendura = j => CONECTORAS.has(w[j]) || (j > 0 && /[.,!?:]$/.test(w[j - 1]) && w[j].length <= 4);
  const best = new Array(k + 1).fill(Infinity), prox = new Array(k + 1).fill(k); best[k] = 0;
  for (let i = k - 1; i >= 0; i--){
    let len = -1;
    for (let j = i + 1; j <= k; j++){
      len += w[j - 1].length + 1;
      if (len > n && j > i + 1) break;
      let c = 500;
      if (j < k){ c += (n - len) * (n - len); if (j - i >= 2 && pendura(j - 1)) c += 1000; if (j - i === 1 && CONECTORAS.has(w[i])) c += 1000; }
      else if (j - i === 1 && k > 1) c += 1000;
      if (c + best[j] < best[i]){ best[i] = c + best[j]; prox[i] = j; }
    }
  }
  const out = []; for (let i = 0; i < k; i = prox[i]) out.push(w.slice(i, prox[i]).join(' '));
  return out;
}

/* ---------------- FOLHA DE SPRITES ---------------- */
let SHEET = null, SHEET_OK = false;
const SHEETMAP = /*SHEETMAP*/{"logo_title":[0,0,196,154],"carlos_sp2_2":[198,0,47,135,22.3],"edson_walk":[247,0,82,133],"edson_sp1_0":[331,0,89,133,47.9],"edson_sp1_1":[422,0,89,133,47.9],"edson_arr_1":[513,0,73,132,38.3],"edson_idle":[588,0,84,131],"edson_win":[674,0,81,130],"carlos_arr_2":[757,0,89,129,34.8],"edson_punch":[848,0,124,129],"fabio_win":[974,0,59,129],"beto_special":[1035,0,108,128],"edson_jab":[1145,0,117,128],"edson_kick":[1264,0,111,128],"edson_block":[1377,0,84,128],"edson_arr_0":[1463,0,59,128,24.4],"carlos_special":[1524,0,66,127],"edson_sp1_2":[1592,0,120,127,42.3],"edson_sp1_3":[1714,0,86,127,37.3],"carlos_win":[1802,0,68,126],"edson_hit":[1872,0,75,126],"beto_kick":[0,156,102,125],"carlos_arr_1":[104,156,69,125,35.8],"carlos_arr_3":[175,156,70,125,35.6],"edson_sp2_0":[247,156,62,125,33.0],"peruca_sp2_2":[311,156,83,125,37.0],"tonho_sp1_2":[396,156,71,125,28.9],"edson_sp2_2":[469,156,66,124,34.9],"peruca_sp2_0":[537,156,72,124,36.4],"peruca_arr_1":[611,156,70,124,34.0],"tonho_walk":[683,156,60,124],"edson_arr_2":[745,156,67,123,31.7],"peruca_sp1_1":[814,156,73,123,37.9],"tonho_idle":[889,156,63,123],"tonho_kick":[954,156,89,123],"tonho_block":[1045,156,67,123],"edson_sp2_1":[1114,156,81,122,41.1],"edson_sp2_3":[1197,156,69,122,33.0],"fabio_sp1_0":[1268,156,70,122,32.0],"peruca_walk":[1340,156,62,122],"tonho_jab":[1404,156,82,122],"beto_idle":[1488,156,74,121],"beto_jab":[1564,156,94,121],"beto_block":[1660,156,73,121],"beto_win":[1735,156,82,121],"beto_sp1_0":[1819,156,65,121,31.7],"beto_sp1_1":[1886,156,65,121,31.7],"beto_sp2_0":[1953,156,65,121,31.7],"beto_sp2_1":[0,283,73,121,37.2],"beto_sp2_2":[75,283,70,121,35.7],"beto_sp2_3":[147,283,73,121,37.2],"beto_arr_0":[222,283,65,121,31.7],"carlos_idle":[289,283,67,121],"carlos_walk":[358,283,71,121],"carlos_arr_0":[431,283,73,121,36.3],"fabio_idle":[506,283,68,121],"fabio_walk":[576,283,66,121],"fabio_jab":[644,283,86,121],"fabio_block":[732,283,67,121],"fabio_sp1_1":[801,283,71,121,31.2],"fabio_sp2_0":[874,283,67,121,32.0],"fabio_sp2_3":[943,283,67,121,32.0],"fabio_arr_0":[1012,283,68,121,30.8],"peruca_kick":[1082,283,91,121],"peruca_hit":[1175,283,66,121],"peruca_sp2_1":[1243,283,72,121,35.4],"tonho_punch":[1317,283,96,121],"tonho_sp1_3":[1415,283,61,121,28.8],"beto_walk":[1478,283,80,120],"beto_punch":[1560,283,105,120],"beto_sp1_2":[1667,283,108,120,35.4],"carlos_jab":[1777,283,87,120],"carlos_kick":[1866,283,95,120],"fabio_hit":[1963,283,67,120],"fabio_special":[0,406,88,120],"fabio_sp1_3":[90,406,80,120,33.4],"fabio_arr_1":[172,406,79,120,36.1],"fabio_arr_2":[253,406,91,120,35.3],"fabio_arr_3":[346,406,91,120,35.3],"peruca_jab":[439,406,92,120],"peruca_win":[533,406,61,120],"peruca_sp2_3":[596,406,73,120,36.8],"tonho_sp2_0":[671,406,66,120,31.1],"tonho_sp2_3":[739,406,66,120,31.1],"beto_sp1_3":[807,406,76,119,35.8],"carlos_punch":[885,406,96,119],"carlos_block":[983,406,65,119],"edson_jump":[1050,406,78,119],"edson_special":[1130,406,126,119],"fabio_sp1_2":[1258,406,94,119,35.1],"fabio_sp2_1":[1354,406,82,119,34.0],"fabio_sp2_2":[1438,406,82,119,34.0],"peruca_idle":[1522,406,71,119],"peruca_punch":[1595,406,99,119],"peruca_sp1_0":[1696,406,71,119,34.5],"peruca_arr_0":[1769,406,66,119,33.1],"tonho_arr_0":[1837,406,59,119,26.1],"tonho_arr_1":[1898,406,59,119,26.1],"carlos_hit":[1959,406,67,118],"edson_arr_3":[0,528,69,118,33.1],"fabio_punch":[71,528,101,118],"peruca_block":[174,528,73,118],"peruca_arr_2":[249,528,105,118,55.7],"peruca_arr_3":[356,528,90,118,55.7],"tonho_win":[448,528,60,118],"tonho_special":[510,528,57,118],"tonho_sp1_0":[569,528,62,118,28.7],"tonho_arr_2":[633,528,86,118,36.0],"beto_arr_1":[721,528,78,117,44.8],"beto_arr_2":[801,528,105,117,40.8],"peruca_jump":[908,528,57,117],"fabio_kick":[967,528,95,115],"peruca_sp1_2":[1064,528,85,115,38.3],"peruca_sp1_3":[1151,528,82,115,39.1],"carlos_sp2_1":[1235,528,56,114,24.8],"peruca_special":[1293,528,83,114],"beto_hit":[1378,528,69,113],"tonho_arr_3":[1449,528,69,113,25.6],"beto_arr_3":[1520,528,72,108,31.8],"tonho_hit":[1594,528,64,108],"edson_crouch":[1660,528,82,107],"tonho_sp2_1":[1744,528,91,107,34.1],"tonho_sp2_2":[1837,528,112,107,43.1],"carlos_sp1_2":[1951,528,77,103,35.9],"carlos_sp1_3":[0,648,77,103,35.9],"tonho_sp1_1":[79,648,73,103,28.0],"carlos_sp1_0":[154,648,65,102,36.9],"carlos_sp2_3":[221,648,74,101,34.2],"tonho_jump":[297,648,89,101],"beto_jump":[388,648,61,100],"carlos_jump":[451,648,59,100],"carlos_sp1_1":[512,648,52,99,23.7],"tonho_crouch":[566,648,62,98],"fabio_jump":[630,648,59,97],"beto_face":[691,648,96,96],"carlos_face":[789,648,96,96],"edson_face":[887,648,96,96],"fabio_face":[985,648,96,96],"peruca_face":[1083,648,96,96],"tonho_face":[1181,648,96,96],"peruca_crouch":[1279,648,62,94],"carlos_sp2_0":[1343,648,61,91,29.4],"beto_crouch":[1406,648,63,89],"fabio_crouch":[1471,648,61,89],"carlos_crouch":[1534,648,53,87],"fx_flash":[1589,648,64,66],"fx_nuvem":[1655,648,50,53],"edson_ko":[1707,648,131,47],"peruca_ko":[1840,648,113,46],"fx_spark_l":[1955,648,43,45],"fx_feixe":[0,753,48,44],"fabio_ko":[50,753,118,43],"tonho_ko":[170,753,121,39],"carlos_ko":[293,753,121,38],"fx_lifeline":[416,753,41,37],"fx_vento":[459,753,48,37],"beto_ko":[509,753,125,36],"fx_toalha":[636,753,26,33],"fx_zzz":[664,753,31,33],"fx_maquina":[697,753,23,32],"fx_dust":[722,753,30,29],"fx_peruca":[754,753,24,29],"fx_espuma":[780,753,18,29],"fx_espuma_b":[800,753,21,29],"fx_celular_b":[823,753,18,29],"fx_celular":[843,753,18,28],"fx_spark_s":[863,753,23,26],"fx_lata":[888,753,12,26],"fx_sino":[902,753,21,24],"fx_mudo":[925,753,22,24],"fx_coroa":[949,753,33,24],"fx_coroa_b":[984,753,32,24],"fx_chinelo":[1018,753,21,22],"fx_bone":[1041,753,27,20],"fx_pente":[1070,753,20,18],"fx_aviao":[1092,753,26,18],"marca_w140":[1120,753,140,18],"fx_vapor":[1262,753,13,15],"fx_oculos":[1277,753,29,13],"fx_tufo_b":[1308,753,15,13],"marca_w96":[1325,753,96,13],"fx_tufo":[1423,753,16,12],"marca_w72":[1441,753,72,9],"marca_w56":[1515,753,56,7],"marca_w48":[1573,753,48,6],"marca_w40":[1623,753,40,5],"marca_w34":[1665,753,34,4],"marca_w26":[1701,753,26,3]}/*/SHEETMAP*/;
const STAGES = {};                    /* nome -> Image (cenarios 480x224) */
const IMGS_PRONTAS = { n:0, total:0 };
/* 19/10 (landing page de anuncio): a folha vai em WebP sem perda (304 KB contra 919 KB do PNG, pixels identicos onde ha cor;
   PNG so se o aparelho nao abrir WebP) e toda imagem e decodificada ANTES do primeiro desenho (decode), para o primeiro quadro
   que usa a imagem nao travar. O que nao e da primeira tela espera o titulo aparecer (adiaCarga). */
function decodifica(im, ok){ const f = () => ok(im); if (im.decode) im.decode().then(f, f); else f(); }
(function(){
  const im = new Image(); IMGS_PRONTAS.total++; let tentouPng = false;
  im.onload = ()=>{ decodifica(im, () => { SHEET = im; SHEET_OK = true; IMGS_PRONTAS.n++; }); };
  im.onerror = ()=>{ if (!tentouPng){ tentouPng = true; im.src = BASE_ARQ + 'sheet.png?v=/*VSHEET*/4285/*/VSHEET*/'; return; } IMGS_PRONTAS.n++; };
  im.src = BASE_ARQ + 'sheet.webp?v=/*VSHEET*/4285/*/VSHEET*/';
})();
function carregaCenario(nome){
  if (STAGES[nome] !== undefined) return;
  STAGES[nome] = null; const im = new Image(); IMGS_PRONTAS.total++;
  im.onload = ()=>{ decodifica(im, () => { STAGES[nome] = im; IMGS_PRONTAS.n++; }); }; im.onerror = ()=>{ IMGS_PRONTAS.n++; };
  im.src = BASE_ARQ + 'stages/' + nome + '.png?v=/*VSHEET*/4285/*/VSHEET*/';
}
/* carga adiada: roda depois do evento load + 1,2 s, no tempo ocioso (a pagina "termina de carregar" mais cedo no navegador do anuncio) */
const _ADIADAS = []; let _ADIA_OK = false;
function adiaCarga(fn){ if (_ADIA_OK) { try { fn(); } catch(e){} return; } _ADIADAS.push(fn); }
(function(){ const solta = () => { if (_ADIA_OK) return; _ADIA_OK = true; for (const fn of _ADIADAS.splice(0)) { try { fn(); } catch(e){} } };
  const agenda = () => setTimeout(() => { if (window.requestIdleCallback) requestIdleCallback(solta, { timeout: 1500 }); else solta(); }, 1200);
  if (document.readyState === 'complete') agenda(); else window.addEventListener('load', agenda); })();
function slot(name){ return SHEETMAP[name]; }
/* desenha um sprite pela ANCORA (centro dos pes). flip = olhando p/ esquerda. */
function drawSpr(name, fx, fy, flip, opts){
  const sl = mapaSlot(name); if (!sl || !SHEET) return false;
  opts = opts || {}; const FOLHA = folhaSlot(name);
  const [sx, sy, sw, sh] = sl; const sc = opts.sc || 1;
  const dw = Math.round(sw * sc * (opts.sx || 1)), dh = Math.round(sh * sc * (opts.sy || 1));
  const ax = sl.length > 4 ? sl[4] / sw : 0.5;                       /* ponto de apoio: centro dos pes nos quadros novos */
  const dx = Math.round(fx - dw * (flip ? 1 - ax : ax)), dy = Math.round(fy - dh);
  if (opts.alpha !== undefined) cx.globalAlpha = opts.alpha;
  if (opts.rot){                                      /* tombo/giro: roda em torno do centro do sprite */
    cx.save(); cx.translate(Math.round(fx), Math.round(fy - dh / 2)); cx.rotate(opts.rot); if (flip) cx.scale(-1, 1);
    cx.drawImage(FOLHA, sx, sy, sw, sh, -Math.round(dw / 2), -Math.round(dh / 2), dw, dh); cx.restore(); cx.globalAlpha = 1; return true;
  }
  if (opts.flash || opts.silh){                       /* flash branco (apanhou) ou silhueta escura (hiper) via rascunho */
    if (tc.width < dw || tc.height < dh){ tc.width = Math.max(tc.width, dw); tc.height = Math.max(tc.height, dh); }
    tx.clearRect(0, 0, dw, dh); tx.imageSmoothingEnabled = false;
    tx.drawImage(FOLHA, sx, sy, sw, sh, 0, 0, dw, dh);
    tx.globalCompositeOperation = 'source-atop'; tx.fillStyle = opts.flash ? 'rgba(255,255,255,.85)' : opts.silh; tx.fillRect(0, 0, dw, dh);
    tx.globalCompositeOperation = 'source-over';
    cx.save(); if (flip){ cx.translate(dx + dw, dy); cx.scale(-1, 1); cx.drawImage(tc, 0, 0, dw, dh, 0, 0, dw, dh); } else cx.drawImage(tc, 0, 0, dw, dh, dx, dy, dw, dh);
    cx.restore();
  } else {
    cx.save(); if (flip){ cx.translate(dx + dw, dy); cx.scale(-1, 1); cx.drawImage(FOLHA, sx, sy, sw, sh, 0, 0, dw, dh); } else cx.drawImage(FOLHA, sx, sy, sw, sh, dx, dy, dw, dh);
    cx.restore();
  }
  cx.globalAlpha = 1;
  return true;
}
/* wordmark oficial da MANUAL (slots marca_w40...w140, branco; outra cor = mascara, regra da marca) */
function marca(w, cxm, y, cor){
  const sl = SHEETMAP['marca_w' + w]; if (!sl || !SHEET) return false;
  if (!cor || cor === '#ffffff') return drawSlot('marca_w' + w, Math.round(cxm - sl[2] / 2), y);
  return drawSpr('marca_w' + w, cxm, y + sl[3], false, { silh: cor });
}
/* placa verde com a marca (HUD, VS, faixas) */
function placaMarca(w, cxm, y, pad){
  const sl = SHEETMAP['marca_w' + w]; if (!sl) return;
  pad = pad || 4; const pw = sl[2] + pad * 2, ph = sl[3] + pad * 2, x0 = Math.round(cxm - pw / 2);
  cx.fillStyle = '#041c1c'; cx.fillRect(x0 - 1, y - 1, pw + 2, ph + 2);
  cx.fillStyle = HERO; cx.fillRect(x0, y, pw, ph);
  cx.fillStyle = '#1d5654'; cx.fillRect(x0, y, pw, 1);
  cx.fillStyle = MINT; cx.fillRect(x0 + 2, y + ph - 2, pw - 4, 1);
  marca(w, cxm, y + pad - 1);
}
/* desenha slot pelo canto (HUD, retratos, logo) */
function drawSlot(name, dx, dy, opts){
  const sl = mapaSlot(name); if (!sl || !SHEET) return false;
  opts = opts || {}; const [sx, sy, sw, sh] = sl; const sc = opts.sc || 1;
  if (opts.alpha !== undefined) cx.globalAlpha = opts.alpha;
  cx.drawImage(folhaSlot(name), sx, sy, sw, sh, Math.round(dx), Math.round(dy), Math.round(sw*sc), Math.round(sh*sc));
  cx.globalAlpha = 1; return true;
}

/* ==================================================================================
   DADOS: lutadores, golpes, hiper, falas, cenarios
   Poses (12 por lutador, da folha): idle walk crouch jump jab punch kick block hit ko win special
   Golpe: { pose, ini (quadros de preparo), ativo (quadros com hitbox), rec (recuperacao), dano, alc (alcance px),
            alt (altura da hitbox: 'alto' | 'meio' | 'baixo'), empurra, stun, lunge (avanco px) }
   ================================================================================== */
const TIMES = { calvo: 'TIME CALVO', cabeludo: 'TIME CABELUDO' };
const CHARS = {
  carlos: { id:'carlos', nome:'CARLOS', apelido:'O COROA', time:'calvo', cor:'#0b3b3c', cor2:'#9fe4b2', vel:2.5, pulo:9.2, vida:160, escala:1.1,
    stage:'rua', hiperNome:'TRATAMENTO CERTO', hiperTxt:'FAZ MARAVILHAS COM O TEMPO',
    especial:{ nome:'ENTRADA ASSUMIDA', tipo:'projetil', proj:'lifeline', pose:'special', ini:8, ativo:2, rec:13, dano:12, velp:5.1, sobe:true },
    especial2:{ nome:'CABECA ERGUIDA', tipo:'subida', pose:'special', ini:4, ativo:14, rec:34, dano:18, alc:34, alt:'alto', vy:-9, empurra:3.5, flash:true },
    arremesso:{ nome:'BONE VOADOR', tipo:'projetil', proj:'bone', pose:'jab', ini:7, ativo:2, rec:12, dano:10, velp:5.5, vy:-1.4, grav:0.05, gira:true },
    fatal:{ nome:'RECOMENDACAO PRONTA', tipo:'notificacao', txt:'SUA RECOMENDACAO DE TRATAMENTO ESTA PRONTA' },
    hiper:{ tipo:'raio', fx:'lifeline', dano:39, dur:110 },
    falas:{ intro:'MINHAS ENTRADAS VIERAM PRA LUTA.', win:'NAO EXISTE CURA DA NOITE PRO DIA. MAS O TRATAMENTO CERTO FAZ MARAVILHAS COM O TEMPO.', lose:'PERDI A LUTA. A CALVICIE EU SIGO CUIDANDO.' } },
  edson: { id:'edson', nome:'SEU EDSON', apelido:'O BARBEIRO', time:'calvo', cor:'#c9503c', cor2:'#f3f1ee', vel:2.0, pulo:8.5, vida:190, escala:1.19,
    stage:'barbearia', hiperNome:'MAQUINA ZERO', hiperTxt:'ZERO NA MAQUINA',
    especial:{ nome:'LUSTRA CARECA', tipo:'chicote', pose:'special', ini:10, ativo:6, rec:17, dano:17, alc:88, alt:'meio', empurra:5, stun:16 },
    especial2:{ nome:'CARECA GIRATORIA', tipo:'giro', pose:'special', ini:5, ativo:34, rec:12, dano:8, alc:40, alt:'meio', empurra:2, lunge:1.4, armadura:true },
    arremesso:{ nome:'PENTE APOSENTADO', tipo:'projetil', proj:'pente', pose:'jab', ini:6, ativo:2, rec:10, dano:9, velp:7.8, vy:0, grav:0, gira:true },
    fatal:{ nome:'MAQUINA ZERO FINAL', tipo:'zero', txt:'ZERADO NA MAQUINA' },
    hiper:{ tipo:'agarra', fx:'maquina', dano:44, dur:120 },
    falas:{ intro:'SENTA AI. EU CONHECO ENTRADA DE LONGE.', win:'CALVICIE NAO SE ESCONDE. SE CUIDA, MEU FILHO.', lose:'PERDI. MAS A CARECA CONTINUA BRILHANDO.' } },
  fabio: { id:'fabio', nome:'FABIO', apelido:'CAMERA DESLIGADA', time:'calvo', cor:'#3c5f70', cor2:'#63b6b5', vel:2.4, pulo:9.0, vida:150, escala:1.1,
    stage:'escritorio', hiperNome:'REUNIAO SEM CAMERA', hiperTxt:'NINGUEM VE A CALVICIE',
    especial:{ nome:'FILTRO DE CABELO', tipo:'projetil', proj:'feixe', pose:'special', ini:10, ativo:2, rec:16, dano:13, velp:6.6, sobe:false },
    especial2:{ nome:'CAMERA DESLIGADA', tipo:'contra', pose:'block', ini:2, ativo:18, rec:7, dano:0, apaga:true },
    arremesso:{ nome:'E-MAIL: CAMERA OFF', tipo:'projetil', proj:'aviao', pose:'jab', ini:7, ativo:2, rec:12, dano:10, velp:2.9, vy:-0.3, grav:0, onda:true, acel:0.09 },
    fatal:{ nome:'CAMERA LIGADA', tipo:'sucao', txt:'SUA CAMERA FOI LIGADA' },
    hiper:{ tipo:'sono', fx:'zzz', dano:36, dur:130 },
    falas:{ intro:'CAMERA DESLIGADA. NINGUEM VE A CALVICIE.', win:'PODE LIGAR A CAMERA. ASSUMI A CALVICIE.', lose:'CAIU A CONEXAO. E MAIS UNS FIOS DE CABELO.' } },
  tonho: { id:'tonho', nome:'TONHO', apelido:'O TOPETE', time:'cabeludo', cor:'#d8488c', cor2:'#f0a8c0', vel:2.8, pulo:9.4, vida:145, escala:1.1,
    stage:'salao', hiperNome:'SELFIE DO TOPETE', hiperTxt:'TOPETE EM TODO ANGULO',
    especial:{ nome:'TOPETE DE COMERCIAL', tipo:'projetil', proj:'vento', pose:'special', ini:7, ativo:2, rec:12, dano:10, velp:5.7, sobe:false },
    especial2:{ nome:'PENTE ATRAS DA ORELHA', tipo:'dash', pose:'punch', ini:5, ativo:12, rec:12, dano:14, alc:30, alt:'meio', lunge:5, empurra:4 },
    arremesso:{ nome:'OCULOS DO TOPETE', tipo:'projetil', proj:'oculos', pose:'jab', ini:7, ativo:2, rec:12, dano:9, velp:6.0, volta:true, gira:true },
    fatal:{ nome:'SELFIE COM O DERROTADO', tipo:'selfie', txt:'MAIS UM SEGUIDOR' },
    hiper:{ tipo:'flash', fx:'flash', dano:35, dur:120 },
    falas:{ intro:'PODE BATER. SO NAO BAGUNCA O TOPETE.', win:'TOPETE EM PE. ENTRADA NENHUMA.', lose:'MEU TOPETE! ACHEI UM FIO NO CHAO!' } },
  peruca: { id:'peruca', nome:'ZE PERUCA', apelido:'O NATURAL', time:'cabeludo', cor:'#8a5a32', cor2:'#e2ca92', vel:2.2, pulo:8.7, vida:170, escala:1.1,
    stage:'fantasias', hiperNome:'PERUCAO', hiperTxt:'TEM PERUCA PRA TODO MUNDO',
    especial:{ nome:'PERUCA BUMERANGUE', tipo:'projetil', proj:'peruca', pose:'special', ini:8, ativo:2, rec:13, dano:13, velp:5.3, volta:true },
    especial2:{ nome:'CAIU NAO CAIU', tipo:'contra', pose:'block', ini:2, ativo:14, rec:10, dano:0, aparo:true },
    arremesso:{ nome:'QUEM OLHOU A PERUCA?', tipo:'projetil', proj:'chinelo', pose:'jab', ini:8, ativo:2, rec:13, dano:13, velp:5.1, vy:-2.6, grav:0.1, gira:true, teleguiado:true },
    fatal:{ nome:'AGORA SOMOS DOIS', tipo:'peruca', txt:'NATURAL. JURO.' },
    hiper:{ tipo:'queda', fx:'perucao', dano:39, dur:120 },
    falas:{ intro:'CALVO EU? ISSO AQUI E CABELO NATURAL.', win:'VIU? A CALVICIE NEM APARECEU. NATURAL, JURO.', lose:'CAIU A PERUCA. TA BOM, SOU CALVO.' } },
  beto: { id:'beto', nome:'BETO', apelido:'CABELO DE LATA', time:'cabeludo', cor:'#3a4048', cor2:'#a9cca0', vel:2.5, pulo:9.2, vida:150, escala:1.1,
    stage:'banca', hiperNome:'TEMPESTADE DE SPRAY', hiperTxt:'TUDO PRETO. FALHA NENHUMA.',
    especial:{ nome:'SPRAY NA FALHA', tipo:'projetil', proj:'nuvem', pose:'special', ini:10, ativo:2, rec:17, dano:14, velp:1.7, parado:true },
    especial2:{ nome:'RETOQUE NA FALHA', tipo:'buff', pose:'special', ini:5, ativo:12, rec:7, dano:0 },
    arremesso:{ nome:'LATA DE CABELO', tipo:'projetil', proj:'lata', pose:'jab', ini:7, ativo:2, rec:13, dano:8, velp:4.1, vy:-3.4, grav:0.13, gira:true, explode:true },
    fatal:{ nome:'CABELO DE TINTA', tipo:'pintura', txt:'CABELO DE TINTA!' },
    hiper:{ tipo:'escuro', fx:'tinta', dano:38, dur:120 },
    falas:{ intro:'TINTA NA FALHA E NINGUEM REPARA.', win:'A TINTA SECOU. NINGUEM VE A FALHA.', lose:'ESCORREU A TINTA. APARECEU A FALHA.' } }
};
/* 23/10 tarde (pedido: "ajuste o tamanho de todos os personagens, usando o tamanho das cabecas como referencia"): olho ao queixo
   medido no quadro parado de cada um (Edson 14,9 px, Beto 12,8, Tonho 11,5, Carlos 11,3, Ze Peruca 9,7, Fabio 8,7). A escala de
   desenho leva o rosto para ~11,4 px, presa entre 110 e 134 px de altura (igualar 100% deixaria o Fabio 1,6x mais alto que o Edson).
   So muda o desenho e o que se ancora na cabeca (C.ev); as caixas de golpe e de dano seguem C.escala. */
const VIS = { beto: 0.909, carlos: 1, edson: 0.84, fabio: 1.107, peruca: 0.97, tonho: 1 };   /* 26/10: Ze Peruca 1,126 -> 0,97 ("muito grande em relacao aos outros": corpo largo, 134 px; agora 115) */
for (const k in CHARS){ CHARS[k].vis = VIS[k] || 1; CHARS[k].ev = CHARS[k].escala * CHARS[k].vis; }
/* 26/10 (pedido: "deixe as lutas mais rapidas, os players podem desistir no meio"): vida de todos em 70% (a proporcao entre eles fica) */
const VIDA_LUTA = 0.7; for (const k in CHARS) CHARS[k].vida = Math.round(CHARS[k].vida * VIDA_LUTA / 5) * 5;
const ORDEM = ['carlos', 'edson', 'fabio', 'tonho', 'peruca', 'beto'];
/* golpes normais (iguais p/ todos; a pose vem da folha de cada um) */
const NORMAIS = {
  jab:   { pose:'jab',   ini:3,  ativo:4,  rec:7,  dano:5,  alc:32, alt:'alto', empurra:1.8, stun:12, lunge:0.8 },
  punch: { pose:'punch', ini:6,  ativo:5,  rec:13, dano:11, alc:42, alt:'meio', empurra:4.5, stun:20, lunge:1.9, forte:true },
  kick:  { pose:'kick',  ini:6,  ativo:6,  rec:12, dano:10, alc:48, alt:'alto', empurra:4,   stun:18, lunge:1.5, forte:true },
  lowk:  { pose:'crouch',ini:5,  ativo:4,  rec:10, dano:7,  alc:38, alt:'baixo',empurra:2.5, stun:14, lunge:0.6, baixo:true },
  airk:  { pose:'kick',  ini:3,  ativo:14, rec:5,  dano:9,  alc:42, alt:'alto', empurra:3.5, stun:16, ar:true }
};
const CENARIOS = {
  rua:        { nome:'RUA DO COMERCIO',    cor:'#8ecae6', chao:'#c9a26a', chao2:'#a8824e', luz:'#ffd9a0' },
  barbearia:  { nome:'BARBEARIA DO EDSON', cor:'#3a5a58', chao:'#c98a4e', chao2:'#a06a38', luz:'#ffe0b0' },
  escritorio: { nome:'ESCRITORIO',         cor:'#dfe4ea', chao:'#8e97a6', chao2:'#6f7887', luz:'#d8ecff' },
  salao:      { nome:'SALAO DO TONHO',     cor:'#f0a8c0', chao:'#d8d0c8', chao2:'#b4aaa0', luz:'#ffd6e4' },
  fantasias:  { nome:'LOJA DE FANTASIAS',  cor:'#6b4a8a', chao:'#8a6a52', chao2:'#6a4e3a', luz:'#e6d2ff' },
  banca:      { nome:'BANCA DA ESQUINA',   cor:'#f2e2c2', chao:'#b6b0a4', chao2:'#8e887c', luz:'#ffe6b8' }
};
const CTA_URL = 'https://www.manual.com.br/queda-de-cabelo/quiz/?utm_source=calvos_vs_cabeludos&utm_medium=jogo&utm_campaign=coroa_city_arcade';

/* ==================================================================================
   LUTA: lutadores, golpes, colisao, projeteis, hiper, IA
   ================================================================================== */
const ALTURA_BASE = 110;            /* altura do idle na folha (px); hurtbox deriva daqui */
let PROJS = [], FX = [], POPS = [], SHAKE = 0, HITSTOP = 0, CAM = 0, STAGE_W = 392, FLASH = 0, ESCURO = 0, ESCURO_ALVO = 0;

function novoLutador(id, lado, ctrl){
  const C = CHARS[id];
  return { id, C, x: lado > 0 ? 110 : 282, y: CHAO, vx:0, vy:0, face: lado, vida: C.vida, vidaMax: C.vida, vidaAtras: C.vida,
    hiper:0, estado:'idle', t:0, golpe:null, noAr:false, stun:0, hitT:0, ko:false, combo:0, comboT:0,
    ctrl, ia:{ t:0, dec:'nada', nivel:0, cool:0, reacao:0 }, trail:[], armadura:false, contra:0, buff:0, zerado:false, manchado:false,
    dormindo:0, agarrado:0, inv:0, andarT:0, winT:0, primeiro:false, rivalId:null };
}
function outro(l){ return l === L1 ? L2 : L1; }
function dist(){ return Math.abs(L1.x - L2.x); }
function hurt(l){        /* caixa de dano (x0,y0,x1,y1) */
  const s = l.C.escala, hw = 15 * s;
  let top = l.y - ALTURA_BASE * s;
  if (l.estado === 'crouch' || (l.golpe && l.golpe.baixo)) top = l.y - 62 * s;
  if (l.estado === 'ko' || l.estado === 'down') top = l.y - 30 * s;
  return [l.x - hw, top, l.x + hw, l.y];
}
function hitbox(l, g){   /* caixa de ataque do golpe ativo */
  const s = l.C.escala, f = l.face;
  const x0 = l.x + f * 6, x1 = l.x + f * (g.alc * s);
  let y0, y1;
  if (g.alt === 'alto'){ y0 = l.y - 112 * s; y1 = l.y - 56 * s; }
  else if (g.alt === 'baixo'){ y0 = l.y - 34 * s; y1 = l.y; }
  else { y0 = l.y - 96 * s; y1 = l.y - 28 * s; }
  if (l.noAr){ y0 = l.y - 70 * s; y1 = l.y + 10; }
  return [Math.min(x0, x1), y0, Math.max(x0, x1), y1];
}
function cruza(a, b){ return a[0] < b[2] && a[2] > b[0] && a[1] < b[3] && a[3] > b[1]; }
function podeAgir(l){ return l.estado === 'idle' || l.estado === 'walk' || l.estado === 'crouch'; }
function segurandoTras(l, inp){ return (l.face > 0 && inp.left) || (l.face < 0 && inp.right); }
function bloqueando(l, inp){ return podeAgir(l) && !l.noAr && segurandoTras(l, inp) && !l.golpe; }

function iniciaGolpe(l, g, nome){
  l.golpe = Object.assign({ nome, acertou:false, hits:0 }, g);
  l.estado = 'attack'; l.t = 0; l.vx = 0;
  if (g.tipo === 'subida'){ l.vy = g.vy; l.noAr = true; l.vx = l.face * 1.2; }
  if (g.armadura) l.armadura = true;
  if (g.nome && (g.tipo !== undefined)){                          /* anuncia o especial (comico): faixa com o nome entrando do lado de quem atacou; o arremesso sai em carimbo */
    if (l.C.arremesso && g.nome === l.C.arremesso.nome) pop(l, g.nome, null, 'carimbo'); else { anunciaGolpe(l, g.nome); estouroEspecial(l); }
  }
  if (g.tipo && g.tipo !== 'dash') zoomPara(1.07, l.x - CAM + l.face * 34, l.y - 64 * l.C.escala, 10);
  if (g.tipo) SFX.especial(); else SFX.whoosh();
}
function pop(l, texto, cor, estilo){
  const dur = Math.max(45, Math.min(105, Math.round(60 * (0.35 + String(texto).length / 15)))), w = larguraT(texto) + 4, base = (l.y - 112 * l.C.ev < -4) ? 88 : Math.max(74, Math.round(l.y - 118 * l.C.ev));
  const igual = POPS.find(p => p.texto === texto && Math.abs(p.x - l.x) < 40 && p.t < p.dur - 6); if (igual){ igual.t = Math.min(igual.t, 8); igual.dur = Math.max(igual.dur, dur); return; }
  const obst = OCUPADO_ANT.filter(o => o[4] >= 6).concat(LUTA.faixaT > 0 ? [[0, 60, W, 104]] : [], BALOES.map(r => [r[0] - 2, r[1] - 2, r[2] + 2, r[3] + 2]));
  /* 23/10: o pop sobe 12 px ao nascer; a faixa que cada um ocupa vai da altura atual ate o topo da subida (antes comparava so a altura de nascimento,
     e um pop novo caia na linha de um antigo que ja tinha subido: PRIMEIRO GOLPE! e O SPRAY ESCORREU! na mesma linha) */
  const sx = l.x - CAM, livre = y => !POPS.some(p => { if (p.t >= p.dur - 4) return false; const yc = p.y - Math.min(12, p.t * .8);
      return p.y - 15 < y + 9 && y - 15 < yc + 9 && Math.abs(p.x + p.vx * p.t - l.x) < (w + larguraT(p.texto)) / 2 + 6; })
    && !obst.some(o => o[1] < y + 10 && o[3] > y - 14 && o[0] < sx + w / 2 && o[2] > sx - w / 2);
  let y = base; for (const d of [0, -12, 12, -24, 24, 36, 48, 60, 72]){ if (base + d >= 74 && livre(base + d)){ y = base + d; break; } }
  POPS.push({ x: l.x, y, texto, t: 0, dur, cor: cor || l.C.cor2, vx: l.face * 0.15, estilo });
}
function limpaPops(y0, y1){ for (const p of POPS) if (p.y > y0 && p.y < y1) p.dur = Math.min(p.dur, p.t + 6); }
function fx(tipo, x, y, opts){ FX.push(Object.assign({ tipo, x, y, t:0, dur:10, sc:1, flip:false }, opts || {})); }

/* ---------------- entrada -> intencao ---------------- */
function controla(l, inp, hit){
  const r = outro(l);
  if (l.estado === 'ko' || l.estado === 'win' || l.agarrado || l.dormindo || l.estado === 'tonto' || l.estado === 'fatal') return;
  if (l.estado === 'hiper') return;
  /* hiper */
  if (hit.h && l.hiper >= 100 && podeAgir(l) && !r.ko){ lancaHiper(l); return; }
  if (l.noAr){
    if (inp.left) l.vx = Math.max(l.vx - 0.18, -l.C.vel * 1.5); if (inp.right) l.vx = Math.min(l.vx + 0.18, l.C.vel * 1.5);
    if (hit.k && !l.golpe){ l.golpe = Object.assign({ nome:'airk', acertou:false, hits:0 }, NORMAIS.airk); l.t = 0; SFX.whoosh(); }
    return;
  }
  if (!podeAgir(l)) return;
  const frente = l.face > 0 ? inp.right : inp.left, tras = l.face > 0 ? inp.left : inp.right;
  /* especiais */
  if (hit.s){
    const g = inp.up ? l.C.especial2 : (inp.down && l.C.arremesso) ? l.C.arremesso : l.C.especial;
    if (g.tipo === 'buff'){ l.buff = 1; l.estado = 'attack'; l.t = 0; l.golpe = Object.assign({ nome:g.nome, acertou:true, hits:0 }, g); anunciaGolpe(l, g.nome); estouroEspecial(l); SFX.ok(); return; }
    if (g.tipo === 'contra'){ l.estado = 'attack'; l.t = 0; l.golpe = Object.assign({ nome:g.nome, acertou:true, hits:0 }, g); l.contra = g.ini + g.ativo; anunciaGolpe(l, g.nome); estouroEspecial(l); SFX.blip(); return; }
    iniciaGolpe(l, g, g.nome); return;
  }
  if (hit.p){ iniciaGolpe(l, frente ? NORMAIS.punch : NORMAIS.jab, frente ? 'punch' : 'jab'); return; }
  if (hit.k){ iniciaGolpe(l, inp.down ? NORMAIS.lowk : NORMAIS.kick, inp.down ? 'lowk' : 'kick'); return; }
  if (inp.up){
    const superP = l.agachouT > 0;                          /* baixo e depois cima = SUPER PULO */
    l.vy = -l.C.pulo * (superP ? 1.22 : 1); l.noAr = true; l.estado = 'jump'; l.t = 0; l.vx = (inp.right ? 1 : inp.left ? -1 : 0) * l.C.vel * (superP ? 1.5 : 1.25); l.agachouT = 0;
    if (superP){ l.trail.length = 0; for (let i = 0; i < 4; i++) l.trail.push({ x:l.x, y:l.y, pose:'crouch', face:l.face, t:0 }); fx('dust', l.x, l.y, { dur: 14, sc: 1.4 }); }
    SFX.pulo(); return;
  }
  /* DASH: toque duplo na direcao (frente ou tras) */
  const agora = FRAME;
  for (const dir of ['left','right']){
    if (hit[dir]){
      if (l.ultTap && l.ultTap.dir === dir && agora - l.ultTap.t < 11 && !l.dashCool){
        const paraFrente = (dir === 'right') === (l.face > 0);
        l.golpe = Object.assign({ nome: paraFrente ? 'DASH' : 'RECUO', acertou:true, hits:0, tipo:'dash', pose: paraFrente ? 'walk' : 'jump', ini:0, ativo: paraFrente ? 11 : 9, rec:2, lunge:(paraFrente ? 5.2 : -4.6) , dano:0 });
        l.estado = 'attack'; l.t = 0; l.dashCool = 16; if (!paraFrente) l.inv = 8; l.ultTap = null; SFX.whoosh(); return;
      }
      l.ultTap = { dir, t: agora };
    }
  }
  if (inp.down){ l.estado = 'crouch'; l.vx = 0; l.agachouT = 8; return; }
  if (inp.left || inp.right){
    l.estado = 'walk'; l.vx = (inp.right ? 1 : -1) * l.C.vel * (tras ? 0.75 : 1);
    /* nao deixa os dois sairem da tela: distancia maxima */
    return;
  }
  l.estado = 'idle'; l.vx = 0;
}

/* ---------------- fisica e estados ---------------- */
function passoLutador(l){
  const r = outro(l);
  l.t++;
  if (l.hitT > 0) l.hitT--;
  if (l.pousouT > 0) l.pousouT--;
  if (l.agachouT > 0 && l.estado !== 'crouch') l.agachouT--;
  if (l.dashCool > 0) l.dashCool--;
  if (l.inv > 0) l.inv--;
  if (l.contra > 0) l.contra--;
  if (l.comboT > 0){ l.comboT--; if (l.comboT === 0) l.combo = 0; }
  if (l.vidaAtras > l.vida) l.vidaAtras = Math.max(l.vida, l.vidaAtras - 0.6);
  /* rastro (afterimage) em dash/giro/pulo */
  if ((l.golpe && (l.golpe.tipo === 'dash' || l.golpe.tipo === 'giro' || l.golpe.tipo === 'subida')) || (l.noAr && Math.abs(l.vx) > 1.5)){
    l.trail.push({ x:l.x, y:l.y, pose:poseDe(l), face:l.face, t:0 }); if (l.trail.length > 4) l.trail.shift();
  } else if (l.trail.length && l.t % 2 === 0) l.trail.shift();
  /* olhar sempre p/ o rival quando pode virar */
  if (podeAgir(l) && !l.noAr) l.face = r.x >= l.x ? 1 : -1;

  passoTratamento(l);
  if (l.dormindo > 0){ l.dormindo--; l.vx = 0; if (l.dormindo % 4 === 0) fx('zzz', l.x + l.face * -10, l.y - 120 * l.C.ev, { dur: 40, vy:-0.6 }); if (l.dormindo === 0){ l.estado = 'idle'; } }
  if (l.agarrado > 0){ l.agarrado--; l.vx = 0; if (l.agarrado === 0) l.estado = 'idle'; }

  /* golpe: preparo -> ativo -> recuperacao */
  if (l.golpe && l.estado === 'attack'){
    const g = l.golpe;
    if (g.tipo === 'projetil' && l.t === g.ini) lancaProjetil(l, g);
    if (g.tipo === 'dash' && l.t >= g.ini && l.t < g.ini + g.ativo) l.vx = l.face * g.lunge * (g.dano ? 1 : (1 - (l.t - g.ini) / (g.ativo + 6)));
    else if (g.tipo === 'giro' && l.t >= g.ini && l.t < g.ini + g.ativo) l.vx = l.face * g.lunge;
    else if (g.lunge && l.t >= g.ini && l.t < g.ini + g.ativo) l.vx = l.face * g.lunge;
    else if (!l.noAr) l.vx = 0;
    if (g.tipo === 'giro' && l.t >= g.ini && l.t < g.ini + g.ativo && l.t % 7 === 0){ g.acertou = false; }   /* multi-hit */
    if (g.tipo === 'chicote' && l.t >= g.ini - 2 && l.t < g.ini + g.ativo + 4){ FX.push({ tipo:'toalha', x: l.x + l.face * (30 + Math.min(1, (l.t - g.ini + 2) / 6) * 40), y: l.y - 70 * l.C.escala, t:0, dur:2, face:l.face }); }
    if (l.t >= g.ini + g.ativo + g.rec){ l.golpe = null; l.estado = 'idle'; l.armadura = false; if (!l.noAr) l.vx = 0; }
  } else if (l.golpe && l.noAr){
    const g = l.golpe; if (l.t >= g.ini + g.ativo + g.rec){ l.golpe = null; }
  }
  if (l.estado === 'hit'){ if (l.t >= l.stun){ l.estado = 'idle'; l.ia.saiuStun = true; } l.vx *= 0.82; }
  if (l.estado === 'block'){ if (l.t >= l.stun){ l.estado = 'idle'; } l.vx *= 0.8; }
  if (l.estado === 'down'){ l.vx *= 0.85; if (l.t >= 32){ l.estado = 'getup'; l.t = 0; l.inv = 18; } }
  if (l.estado === 'getup'){ l.vx = 0; if (l.t >= 9){ l.estado = 'idle'; } }
  if (l.estado === 'ko'){ l.vx *= 0.9; }
  if (l.estado === 'tonto'){ l.vx = 0; if (l.t % 10 === 0) fx('estrela', l.x + (Math.random()*30-15), l.y - 120 * l.C.ev, { dur: 30, vy: -0.3 }); }
  if (l.estado === 'fatal'){ l.vx = 0; }
  if (l.estado === 'win'){ l.vx = 0; }

  /* gravidade */
  if (l.noAr || l.y < CHAO){
    l.vy += 0.5; l.y += l.vy;
    if (l.y >= CHAO){
      l.y = CHAO; l.vy = 0; l.noAr = false; fx('dust', l.x, l.y, { dur: 14 }); l.pousouT = 5;
      if (l.estado === 'jump'){ l.estado = 'idle'; l.vx = 0; l.golpe = null; }
      if (l.estado === 'hit' && l.stun > 30){ l.estado = 'down'; l.t = 0; SFX.hitForte(); SHAKE = Math.max(SHAKE, 6); }
      if (l.estado === 'ko'){ SHAKE = Math.max(SHAKE, 5); }
      if (l.golpe && l.golpe.tipo === 'subida'){ l.golpe = null; l.estado = 'idle'; }
    }
  }
  l.x += l.vx;
  /* limites do cenario e distancia maxima entre os dois (os dois sempre na tela) */
  l.x = Math.max(24, Math.min(STAGE_W - 24, l.x));
  if (Math.abs(l.x - r.x) > 330) l.x = r.x + Math.sign(l.x - r.x) * 330;
  /* empurrao de corpo */
  if (!l.noAr && !r.noAr && l.estado !== 'ko' && r.estado !== 'ko' && l.estado !== 'down' && r.estado !== 'down'){
    const d = r.x - l.x, min = 26 * (l.C.escala + r.C.escala) / 2 + 4;
    if (Math.abs(d) < min){ const p = (min - Math.abs(d)) / 2, s = Math.sign(d) || 1; l.x -= s * p; r.x += s * p; }
  }
  if (l.estado === 'walk') l.andarT++;
}

/* ---------------- projeteis ---------------- */
function lancaProjetil(l, g){
  const s = l.C.escala; const pr = { tipo:g.proj, x: l.x + l.face * 26, y: l.y - 62 * s, vx: l.face * g.velp * (l.buff ? 1.15 : 1), vy: g.sobe ? -0.9 : 0,
    dono:l, dano: g.dano * (l.buff ? 1.8 : 1), t:0, vivo:true, w:34, h:26, face:l.face, volta:!!g.volta, parado:!!g.parado, sc: l.buff ? 1.5 : 1, acertou:false };
  if (g.proj === 'lifeline'){ pr.w = 40; pr.h = 30; pr.vy = -0.55; }
  if (g.vy !== undefined) pr.vy = g.vy; pr.grav = g.grav || 0; pr.gira = !!g.gira; pr.onda = !!g.onda; pr.acel = g.acel || 0; pr.teleguiado = !!g.teleguiado; pr.explode = !!g.explode; pr.rot = 0;
  if (g.vy !== undefined && !g.sobe){ pr.y = l.y - 80 * s; }
  if (g.proj === 'nuvem'){ pr.w = 44; pr.h = 44; }
  PROJS.push(pr); if (l.buff) l.buff = 0;
}
function passoProjeteis(){
  for (const p of PROJS){
    if (!p.vivo) continue;
    p.t++;
    if (p.parado){ if (p.t < 36) p.x += p.vx; else if (p.t > 96) p.vivo = false; }
    else if (p.volta){
      if (p.t < 34) p.x += p.vx; else { const dx = p.dono.x - p.x; p.x += Math.sign(dx) * Math.abs(p.vx) * 1.2; if (Math.abs(dx) < 12 && p.t > 40) p.vivo = false; }
    } else {
      const r0 = outro(p.dono);
      if (p.teleguiado && p.t > 6){ const ty = r0.y - 60 * r0.C.escala; p.vy += (ty - p.y) * 0.012 + p.grav; if (Math.sign(r0.x - p.x) !== Math.sign(p.vx)) p.vx *= 0.94; }
      else p.vy += p.grav;
      if (p.acel) p.vx += Math.sign(p.vx) * p.acel;
      p.x += p.vx; p.y += p.vy;
      if (p.tipo === 'vento') p.y += Math.sin(p.t * .3) * 0.8;
      if (p.onda) p.y += Math.sin(p.t * .25) * 1.2;
      if (p.gira) p.rot += 0.3 * Math.sign(p.vx);
      if (p.grav && p.y >= CHAO - 8){                       /* caiu no chao: explode (lata) ou some */
        p.vivo = false; fx('dust', p.x, CHAO, { dur: 14 });
        if (p.explode){ PROJS.push({ tipo:'nuvem', x:p.x, y:CHAO - 30, vx:0, vy:0, dono:p.dono, dano:9, t:40, vivo:true, w:44, h:44, face:p.face, volta:false, parado:true, sc:1.2, acertou:false, grav:0 }); SFX.especial(); }
      }
    }
    if (p.x < -60 || p.x > STAGE_W + 60 || p.y < -40) p.vivo = false;
    /* acerta o rival */
    const r = outro(p.dono);
    if (!p.acertou && r.inv <= 0 && r.estado !== 'ko' && r.estado !== 'down' && r.estado !== 'getup'){
      const caixa = [p.x - p.w/2 * p.sc, p.y - p.h/2 * p.sc, p.x + p.w/2 * p.sc, p.y + p.h/2 * p.sc];
      if (cruza(caixa, hurt(r))){
        p.acertou = true; if (!p.parado) p.vivo = false;
        aplicaGolpe(p.dono, r, { dano:p.dano, empurra:3, stun:18, alt:'meio', forte:false, nome:p.tipo, especial:true }, p.x, p.y);
      }
    }
  }
  /* projetil x projetil: cancelam */
  for (let i = 0; i < PROJS.length; i++) for (let j = i+1; j < PROJS.length; j++){
    const a = PROJS[i], b = PROJS[j]; if (!a.vivo || !b.vivo || a.dono === b.dono) continue;
    if (Math.abs(a.x - b.x) < 30 && Math.abs(a.y - b.y) < 40){ a.vivo = b.vivo = false; fx('spark_l', (a.x+b.x)/2, (a.y+b.y)/2, { dur:12, sc:1.4 }); SFX.block(); }
  }
  PROJS = PROJS.filter(p => p.vivo);
}

/* ---------------- colisao de golpes ---------------- */
function checaGolpes(){
  for (const l of [L1, L2]){
    const g = l.golpe; if (!g) continue;
    const ativo = l.t >= g.ini && l.t < g.ini + g.ativo;
    if (!ativo || g.acertou || g.tipo === 'projetil' || g.tipo === 'buff' || g.tipo === 'contra') continue;
    const r = outro(l);
    if (r.inv > 0 || r.estado === 'ko' || r.estado === 'down' || r.estado === 'getup') continue;
    const hb = hitbox(l, g);
    if (cruza(hb, hurt(r))){
      g.acertou = true; g.hits++;
      const px = l.x + l.face * (g.alc * l.C.escala - 8), py = (hb[1] + hb[3]) / 2;
      /* MUTE / CAIU NAO CAIU: contra-golpe do rival em janela ativa */
      if (r.contra > 0 && r.golpe && r.golpe.tipo === 'contra'){
        r.contra = 0; r.golpe = null; r.estado = 'idle';
        l.estado = 'hit'; l.t = 0; l.stun = 26; l.golpe = null; l.vx = -l.face * 3; l.hitT = 8;
        fx('spark_l', px, py, { dur: 12, sc: 1.3 }); pop(r, 'CONTRA!', AMARELO); SFX.hitForte(); HITSTOP = 8;
        r.hiper = Math.min(100, r.hiper + 12); continue;
      }
      aplicaGolpe(l, r, g, px, py);
    }
  }
}
/* equilibrio p/ jogo de captacao: a CPU bate mais fraco, o jogador bate mais forte; cada derrota deixa a CPU mais mansa */
/* calibrado por simulacao (_qa/teste_vitoria.js): um jogador casual que so aperta botao vence com ~60-80% de vida */
const DIFIC = { decisao:13, decisaoLvl:3, bloq:0.12, bloqLvl:0.12, reacao:18, cool:18, coolLvl:3, espCool:44, danoIA:0.75, danoIALvl:0.1, danoJog:1.0, contra:0.2, hiperProb:0.02, item:0.15 };
/* dificuldade escolhida (FACIL, NORMAL, DIFICIL em _src_5_cenas.js) multiplica a calibragem; 2 jogadores e demo ficam de fora */
function difIA(k){ if (LUTA.p2humano || LUTA.demo || typeof dif !== 'function') return k === 'lento' ? 0 : 1; return dif()[k]; }
function fatorDano(l){
  if (LUTA.p2humano || LUTA.demo) return 1;
  if (l.ctrl === 'ia') return Math.max(0.25, (DIFIC.danoIA + DIFIC.danoIALvl * l.ia.nivel - 0.08 * (LUTA.derrotas || 0)) * difIA('dano'));
  return DIFIC.danoJog;
}
function aplicaGolpe(l, r, g, px, py){
  const inp = r.ctrl === 'ia' ? IN.p2 : IN[r.ctrl];
  const bloq = !r.noAr && podeAgirOuBloq(r) && segurandoTras(r, inp) && !(g.baixo && r.estado !== 'crouch') && !(g.ar && r.estado === 'crouch');
  if (r.armadura && !g.forte){ /* giro do poste aguenta */ fx('spark_s', px, py, { dur:8 }); SFX.block(); return; }
  if (bloq){
    r.estado = 'block'; r.t = 0; r.stun = 10; r.vx = -r.face * (g.empurra || 2) * 0.8;
    l.vx = naParede(r, -r.face) ? l.face * -(g.empurra || 2) * 0.8 : -l.face * 0.6;
    fx('spark_s', px, py, { dur: 8, sc: 0.9 }); SFX.block(); HITSTOP = 3;
    r.hiper = Math.min(100, r.hiper + 3); l.hiper = Math.min(100, l.hiper + 4);
    if (g.tipo) { r.vida = Math.max(1, r.vida - Math.ceil(g.dano * 0.15)); }      /* chip */
    return;
  }
  /* acertou */
  const emCombo = r.estado === 'hit' || r.noAr && r.estado === 'hit';
  const escala = Math.max(0.5, 1 - l.combo * 0.08);
  const dano = Math.max(1, Math.round(g.dano * escala * fatorDano(l)));
  r.vida = Math.max(0, r.vida - dano);
  if (!LUTA.demo){ if (l.ctrl === 'p1') LUTA.pontos = (LUTA.pontos || 0) + dano * 10; else if (l.ctrl === 'p2') LUTA.pontos2 = (LUTA.pontos2 || 0) + dano * 10; }
  r.estado = 'hit'; r.t = 0; r.stun = g.stun || 16; r.hitT = 6; r.golpe = null; r.armadura = false; r.contra = 0; r.dormindo = 0;
  const dirEmp = r.x >= l.x ? 1 : -1;                                    /* p/ longe de quem bateu */
  r.vx = dirEmp * (g.empurra || 2);
  if (naParede(r, dirEmp)) l.vx = -dirEmp * (g.empurra || 2) * 0.9;     /* quina: quem bateu recua, a luta nao gruda no canto */
  if (r.noAr || g.tipo === 'subida'){ r.vy = -6.5; r.noAr = true; r.stun = 40; if (g.tipo === 'subida') r.vy = -9.5; }
  if (g.forte && r.vida <= 0){ r.vy = -6; r.noAr = true; }
  if (g.tipo === 'chicote'){ r.vy = -4; r.noAr = true; r.stun = 40; }
  l.combo = emCombo ? l.combo + 1 : 1; l.comboT = 70;
  if (!LUTA.primeiroGolpe){ LUTA.primeiroGolpe = true; pop(l, 'PRIMEIRO GOLPE!', AMARELO); l.hiper = Math.min(100, l.hiper + 8); }
  const hl = l.ctrl === 'ia' ? 0.7 : 1.35, hr = r.ctrl === 'ia' ? 0.7 : 1.35;
  l.hiper = Math.min(100, l.hiper + (dano * 0.9 + 3) * (l.tratamento ? 1.5 : 1) * hl); r.hiper = Math.min(100, r.hiper + dano * 0.45 * (r.tratamento ? 1.5 : 1) * hr);
  fx(g.forte || g.tipo || g.especial ? 'spark_l' : 'spark_s', px, py, { dur: g.forte ? 12 : 9, sc: g.forte || g.especial ? 1.3 : 1 });
  if (g.tipo || g.especial){ FX.push({ tipo:'anel', x:px, y:py, t:0, dur:14, cor:l.C.cor2, rx:26 }); zoomPara(1.1, px - CAM, py, 8); }   /* especial que entra: anel de choque e um soco de camera */
  if (g.forte || g.tipo || g.especial){ SFX.hitForte(); SHAKE = Math.max(SHAKE, g.tipo || g.especial ? 5 : 3); HITSTOP = g.tipo || g.especial ? 7 : 5; socoCamera(g.tipo || g.especial ? 0.05 : 0.025); } else { SFX.hit(); HITSTOP = 3; }
  if (l.combo >= 2) l.comboMostra = 60;
  if (l.combo === 4 || l.combo === 7 || l.combo === 10){   /* marcos do combo (23/10, aprendizado do 2o ROUND): estouro de luz na cor de quem bate, anel, tremor e um acorde */
    FX.push({ tipo:'estouro', x: px, y: py, t: 0, dur: 16, cor: l.C.cor2 }); FX.push({ tipo:'anel', x: px, y: py, t: 0, dur: 18, cor: '#fff3c8', rx: 40 + l.combo * 2 });
    SHAKE = Math.max(SHAKE, 4 + (l.combo >> 2)); if (l.combo >= 7) FLASH = Math.max(FLASH, 3); SFX.brilho(); }
  if (r.vida <= 0) nocaute(r, l);
}
function podeAgirOuBloq(r){ return podeAgir(r) || r.estado === 'block'; }
function naParede(l, dir){ return dir < 0 ? l.x < 24 + 40 : l.x > STAGE_W - 24 - 40; }
/* CENTRO: a dupla volta devagar p/ o meio da arena nos momentos calmos (mais rapido com alguem no chao);
   quem anda de proposito p/ a parede nao e puxado. Mantem a luta no centro da tela, junto da cena e da marca. */
function centraliza(){
  if (LUTA.fase !== 'luta' || HIPER || FATAL || L1.noAr || L2.noAr) return;
  const off = (L1.x + L2.x) / 2 - STAGE_W / 2; if (Math.abs(off) < 26) return;
  const rapido = ['down', 'getup', 'tonto'], calmo = ['idle', 'crouch', 'block', 'hit', 'walk'].concat(rapido);
  const ok = l => calmo.includes(l.estado) || (l.estado === 'attack' && l.golpe && !l.golpe.lunge && !/dash|giro|subida/.test(l.golpe.tipo || ''));
  if (!ok(L1) || !ok(L2)) return;
  for (const l of [L1, L2]) if (l.estado === 'walk' && Math.sign(l.vx) === Math.sign(off)) return;
  const vel = (rapido.includes(L1.estado) || rapido.includes(L2.estado)) ? 1.3 : 0.5;
  const d = -Math.sign(off) * Math.min(vel, Math.abs(off) * 0.03);
  L1.x += d; L2.x += d;
}

/* ---------------- HIPER ---------------- */
let HIPER = null;     /* { l, r, fase, t, tipo } */
function lancaHiper(l){
  const r = outro(l); l.hiper = 0; l.estado = 'hiper'; l.t = 0; l.vx = 0; l.golpe = null;
  HIPER = { l, r, t:0, fase:'cutin', tipo:l.C.hiper.tipo, hits:0, x0: r.x };
  SFX.hiper(); FLASH = 6; musica(null); zoomPara(1.38, l.x - CAM, l.y - 70 * l.C.escala, 58);
}
function passoHiper(){
  const h = HIPER; if (!h) return; h.t++;
  const l = h.l, r = h.r, H_ = l.C.hiper;
  if (h.fase === 'cutin'){
    l.estado = 'hiper'; if (h.t >= 58){ h.fase = 'efeito'; h.t = 0; l.t = 0; r.t = 0; zoomPara(1.12, (l.x + r.x) / 2 - CAM, CHAO - 70, 40); }
    return;
  }
  if (h.fase === 'efeito'){
    const t = h.t, dur = H_.dur;
    const fd = fatorDano(l);
    const bate = (dano, n, empurra, stun) => { if (r.estado === 'ko') return; r.vida = Math.max(0, r.vida - Math.max(1, Math.round(dano * fd))); r.hitT = 6; r.estado = 'hit'; r.t = 0; r.stun = stun || 30; r.vx = -l.face * (empurra || 0); h.hits++; l.combo = h.hits; l.comboT = 80; SHAKE = Math.max(SHAKE, 4); fx('spark_l', r.x + (Math.random()*20-10), r.y - 70 + (Math.random()*30-15), { dur:12, sc:1.3 }); SFX.hitForte(); if (r.vida <= 0) nocaute(r, l); };
    const alcance = Math.abs(r.x - l.x) < 150 && ((r.x - l.x) * l.face > 0);
    if (h.tipo === 'raio'){              /* LIFELINE gigante atravessa */
      if (t < 30) l.vx = 0;
      if (t === 12) FX.push({ tipo:'lifeline_hiper', x:l.x + l.face * 40, y:l.y - 40, t:0, dur:90, face:l.face, sc:3 });
      if (t >= 20 && t < 80 && t % 10 === 0 && (r.x - l.x) * l.face > 0 && Math.abs(r.x - l.x) < 300){ bate(6, 5, 1.5, 34); r.vy = -3.5; r.noAr = true; r.y -= 1; }
      if (t >= dur){ fim(); }
    } else if (h.tipo === 'agarra'){     /* MAQUINA ZERO: corre, agarra, passa a maquina */
      if (t < 40 && !alcance){ l.vx = l.face * 4; l.trail.push({ x:l.x, y:l.y, pose:'walk', face:l.face, t:0 }); if (l.trail.length > 4) l.trail.shift(); }
      else if (t < 40){ l.vx = 0; }
      if (t === 40){ l.vx = 0; if (Math.abs(r.x - l.x) < 70 && (r.x - l.x) * l.face > 0 && r.estado !== 'ko'){ h.pegou = true; l.poseHiper = 'jab'; r.agarrado = 70; r.estado = 'hit'; r.x = l.x + l.face * 34; r.y = CHAO; r.noAr = false; SFX.maquina(); } else { h.pegou = false; pop(l, 'ESCAPOU!', AMARELO); } }
      if (h.pegou && t > 44 && t < 100){
        if (t % 12 === 0){ r.vida = Math.max(0, r.vida - Math.max(1, Math.round(5 * fd))); r.hitT = 4; h.hits++; l.combo = h.hits; l.comboT = 80; SFX.hit(); for (let i = 0; i < 6; i++) FX.push({ tipo:'tufo', x:r.x + Math.random()*20-10, y:r.y - 105 * r.C.escala, vx:(Math.random()-0.5)*3, vy:-2 - Math.random()*2, t:0, dur:40, cor: r.C.time === 'cabeludo' ? '#5e3a1e' : '#8a5a32' }); }
        FX.push({ tipo:'maquina', x:r.x, y:r.y - 118 * r.C.ev + Math.sin(t*.6)*4, t:0, dur:2, face:l.face });
        if (r.vida <= 0){ r.agarrado = 0; nocaute(r, l); fim(); return; }
      }
      if (t === 100 && h.pegou){ r.agarrado = 0; r.zerado = true; pop(r, 'ZERADO!', AMARELO); bate(6, 1, 6, 40); r.vy = -6; r.noAr = true; }
      if (t >= (h.pegou ? 110 : 60)) fim();
    } else if (h.tipo === 'sono'){       /* REUNIAO QUE PODIA SER E-MAIL */
      if (t === 6){ FX.push({ tipo:'reuniao', x:W/2, y:0, t:0, dur:104 }); limpaPops(40, 150); }
      if (t === 10 && alcanceTela(l, r)){ h.pegou = true; r.dormindo = 96; r.estado = 'hit'; r.vx = 0; SFX.zzz(); }
      if (h.pegou && t > 10 && t < 100 && t % 9 === 0){ r.vida = Math.max(0, r.vida - Math.max(1, Math.round(3 * fd))); r.hitT = 3; h.hits++; l.combo = h.hits; l.comboT = 80; if (r.vida <= 0){ r.dormindo = 0; nocaute(r, l); fim(); return; } }
      if (h.pegou && t === 100){ r.dormindo = 0; bate(5, 1, 5, 40); r.vy = -5; r.noAr = true; pop(l, 'ALINHADO.', MINT); }
      if (t >= dur) fim();
    } else if (h.tipo === 'flash'){      /* SELFIE 360 */
      if (t === 8 || t === 40 || t === 72){ FLASH = 10; SFX.flash(); l.poseHiper = ['win','special','idle'][(t/32)|0]; if (alcanceTela(l, r)){ bate(9, 3, 2, 36); } }
      if (t >= 105) fim();
    } else if (h.tipo === 'queda'){      /* PERUCAO */
      if (t === 6) FX.push({ tipo:'perucao', x:h.x0, y:-80, t:0, dur:100, vy:0 });
      if (t === 40 && Math.abs(r.x - h.x0) < 44 && !r.noAr){ h.pegou = true; r.agarrado = 50; r.estado = 'hit'; r.vx = 0; SFX.hitForte(); SHAKE = 8; }
      if (h.pegou && t > 40 && t < 90 && t % 10 === 0){ r.vida = Math.max(0, r.vida - Math.max(1, Math.round(5 * fd))); r.hitT = 4; h.hits++; l.combo = h.hits; l.comboT = 80; SFX.hit(); if (r.vida <= 0){ r.agarrado = 0; nocaute(r, l); fim(); return; } }
      if (t === 90 && h.pegou){ r.agarrado = 0; bate(5, 1, 6, 40); r.vy = -6; r.noAr = true; }
      if (t === 40 && !h.pegou) pop(l, 'ERROU O ALVO', AMARELO);
      if (t >= dur) fim();
    } else if (h.tipo === 'escuro'){     /* TEMPESTADE DE SPRAY */
      if (t < 30) ESCURO_ALVO = 0.9; if (t > 95) ESCURO_ALVO = 0;
      if (t === 10) FX.push({ tipo:'nuvem_hiper', x:l.x + l.face * 30, y:l.y - 70, t:0, dur:90, vx:l.face * 3.4, sc:2.6 });
      if (t >= 20 && t < 80 && t % 12 === 0 && (r.x - l.x) * l.face > 0 && Math.abs(r.x - l.x) < 320){ bate(6, 5, 2, 30); }
      if (t === 82 && h.hits > 0){ r.manchado = true; pop(r, 'MANCHADO!', AMARELO); }
      if (t >= dur) fim();
    }
  }
  function fim(){ l.estado = 'idle'; l.t = 0; l.poseHiper = null; HIPER = null; ESCURO_ALVO = 0; CAMZ.alvo = 1; CAMZ.hold = 0; musica(LUTA.musica); }
}
function alcanceTela(l, r){ return Math.abs(r.x - l.x) < 300; }

/* ---------------- nocaute ---------------- */
function nocaute(r, l){
  if (r.estado === 'ko') return;
  /* FINALIZACAO (estilo fatality, so comico): o derrotado fica tonto em pe; o vencedor tem uns segundos p/ finalizar com H */
  if (l.C.fatal && !LUTA.finalizado && LUTA.fase === 'luta' && !HIPER && !LUTA.ko){
    LUTA.finalizado = true; r.vida = 0; r.estado = 'tonto'; r.t = 0; r.golpe = null; r.vx = 0; r.vy = 0; r.noAr = false; r.y = CHAO; r.dormindo = 0; r.agarrado = 0;
    l.golpe = null; l.estado = 'idle'; l.t = 0; l.vx = 0;
    LUTA.fase = 'finaliza'; LUTA.t = 0; limpaPops(40, 120); FAIXAS = []; if (LUTA.faixaT > 12) LUTA.faixaT = 12; LUTA.finalizador = l; LUTA.tonto = r; PROJS = []; musica(null); SFX.ko(); SHAKE = 8; HITSTOP = 10; pedeImpacto(3);
    return;
  }
  r.estado = 'ko'; r.t = 0; r.ko = true; r.vx = (r.x >= l.x ? 1 : -1) * 4; if (!r.noAr){ r.vy = -6; r.noAr = true; }
  r.golpe = null; r.dormindo = 0; r.agarrado = 0;
  LUTA.ko = { vencedor: l, perdedor: r, t: 0, hiper: !!HIPER }; SFX.ko(); zoomPara(1.2, r.x - CAM, r.y - 60, 70); SHAKE = 10; HITSTOP = 12; musica(null); if (!LUTA.fatalNome) pedeImpacto(3);   /* depois da finalizacao o nocaute ja vem com o cinema dela */
}

/* ---------------- IA ---------------- */
function passoIA(l){
  const inp = l === L1 ? IN.p1 : IN.p2, hit = l === L1 ? HIT.p1 : HIT.p2; for (const k in inp) inp[k] = 0;
  const r = outro(l), ia = l.ia, d = Math.abs(r.x - l.x), lvl = ia.nivel;
  if (LUTA.fase === 'finaliza' && LUTA.finalizador === l){
    ia.t++; if (d > 70) inp[r.x > l.x ? 'right' : 'left'] = 1; else if (ia.t > 30 && Math.random() < 0.06) hit.h = 1; return;
  }
  if (l.estado === 'ko' || r.estado === 'ko' || LUTA.fase !== 'luta') return;
  ia.t++; if (ia.cool > 0) ia.cool--;
  const frente = r.x > l.x ? 'right' : 'left', tras = frente === 'right' ? 'left' : 'right';
  const rAtaca = r.golpe && r.t < r.golpe.ini + r.golpe.ativo;
  const projVindo = PROJS.some(p => p.dono === r && (p.x - l.x) * (r.x > l.x ? -1 : 1) < 0 && Math.abs(p.x - l.x) < 110);
  /* reacao: bloquear ou pular projetil */
  if (ia.reacao > 0) ia.reacao--;
  const podeReagir = ia.reacao === 0;
  const bq = Math.max(0.03, (DIFIC.bloq + DIFIC.bloqLvl * lvl - 0.05 * (LUTA.derrotas || 0)) * difIA('bloq'));
  if (podeReagir && ((rAtaca && d < 70 && Math.random() < bq) || (projVindo && Math.random() < bq))){
    ia.reacao = DIFIC.reacao;
    if (projVindo && Math.random() < 0.35 + lvl*0.1 && podeAgir(l)) { ia.dec = 'pular'; ia.t = 0; }
    else { inp[tras] = 1; if (r.golpe && r.golpe.baixo) inp.down = 1; return; }
  }
  if (l.hiper >= 100 && lvl >= 1 && podeAgir(l) && ia.cool === 0){
    const perto = l.C.hiper.tipo === 'agarra' ? d < 130 : d < 260;
    if (perto && Math.random() < DIFIC.hiperProb){ hit.h = 1; ia.cool = 60; return; }
  }
  if (ITEM && ITEM.y >= CHAO - 6 && !l.tratamento && Math.abs(ITEM.x - l.x) < 110 && podeAgir(l) && (ia.dec === 'item' || (ia.t % 20 === 0 && Math.random() < DIFIC.item + lvl * 0.05))){ ia.dec = 'item'; inp[ITEM.x > l.x ? 'right' : 'left'] = 1; return; }
  if (ia.dec === 'item') ia.dec = 'nada';
  if (ia.saiuStun && podeAgir(l) && d < 70 && Math.random() < DIFIC.contra){ ia.saiuStun = false; hit.p = 1; ia.cool = DIFIC.cool; return; }
  ia.saiuStun = false;
  if (ia.t % Math.max(4, DIFIC.decisao - lvl * DIFIC.decisaoLvl + difIA('lento')) === 0 || ia.dec === 'nada'){
    const rnd = Math.random();
    if (d > 150) ia.dec = rnd < 0.4 ? 'andar' : rnd < 0.55 ? 'dash' : rnd < 0.75 + lvl * 0.06 ? 'proj' : rnd < 0.9 ? 'pular' : 'esperar';
    else if (d > 75) ia.dec = rnd < 0.45 ? 'andar' : rnd < 0.62 ? 'esp2' : rnd < 0.78 ? 'pular' : rnd < 0.9 ? 'chute' : 'recuar';
    else ia.dec = rnd < 0.3 ? 'jab' : rnd < 0.5 ? 'soco' : rnd < 0.68 ? 'chute' : rnd < 0.8 ? 'baixo' : rnd < 0.88 + lvl*0.04 ? 'esp' : rnd < 0.95 ? 'recuar' : 'esperar';
    if (ia.cool > 0 && /jab|soco|chute|baixo|esp|proj/.test(ia.dec)) ia.dec = 'andar';
    if (ia.dec === 'recuar' && naParede(l, tras === 'left' ? -1 : 1)) ia.dec = Math.random() < 0.5 ? 'pular' : 'andar';   /* sem canto */
    if (ia.dec === 'esperar' && Math.abs(l.x - STAGE_W / 2) > 110) ia.dec = 'andar';
  }
  switch (ia.dec){
    case 'andar': inp[frente] = 1; break;
    case 'dash': if (podeAgir(l) && !l.dashCool){ l.ultTap = { dir: frente, t: FRAME - 4 }; hit[frente] = 1; } ia.dec = 'nada'; break;
    case 'recuar': inp[tras] = 1; break;
    case 'pular': if (podeAgir(l)){ inp.up = 1; inp[frente] = 1; ia.dec = 'noar'; } break;
    case 'noar': if (l.noAr && d < 80 && Math.random() < 0.3) hit.k = 1; if (!l.noAr) ia.dec = 'nada'; break;
    case 'jab': hit.p = 1; ia.cool = DIFIC.cool - lvl * DIFIC.coolLvl; ia.dec = 'nada'; break;
    case 'soco': inp[frente] = 1; hit.p = 1; ia.cool = DIFIC.cool + 4 - lvl * DIFIC.coolLvl; ia.dec = 'nada'; break;
    case 'chute': hit.k = 1; ia.cool = DIFIC.cool + 4 - lvl * DIFIC.coolLvl; ia.dec = 'nada'; break;
    case 'baixo': inp.down = 1; hit.k = 1; ia.cool = DIFIC.cool + 2; ia.dec = 'nada'; break;
    case 'esp': hit.s = 1; ia.cool = DIFIC.espCool - lvl * 6; ia.dec = 'nada'; break;
    case 'esp2': inp.up = 1; hit.s = 1; ia.cool = DIFIC.espCool - lvl * 6; ia.dec = 'nada'; break;
    case 'proj': if (l.C.especial.tipo === 'projetil'){ hit.s = 1; ia.cool = DIFIC.espCool + 10 - lvl * 8; } ia.dec = 'nada'; break;
    default: break;
  }
}

/* ---------------- pose atual ---------------- */
function poseDe(l){
  if (LUTA.fase === 'momento' && l.poseMomento) return l.poseMomento;
  if (l.estado === 'ko') return l.noAr ? 'hit' : 'ko';
  if (l.estado === 'tonto') return 'hit';
  if (l.estado === 'fatal') return l.poseFatal || 'idle';
  if (l.estado === 'down') return 'ko';
  if (l.estado === 'getup') return 'crouch';
  if (l.estado === 'win') return l.winT > 20 ? 'win' : 'idle';
  if (l.estado === 'hiper'){ if (l.poseHiper) return l.poseHiper; return HIPER && HIPER.fase === 'efeito' && HIPER.tipo === 'agarra' && HIPER.t < 40 ? 'walk' : 'special'; }
  if (l.dormindo > 0 || l.agarrado > 0) return 'hit';
  if (l.estado === 'hit') return 'hit';
  if (l.estado === 'block') return 'block';
  if (l.golpe){
    const g = l.golpe;
    const qe = l.estado === 'attack' ? quadroEspecial(l, g) : null; if (qe) return qe;
    if (l.t < g.ini) return l.noAr ? 'jump' : (g.baixo ? 'crouch' : 'idle');
    return g.pose;
  }
  if (l.noAr) return 'jump';
  if (l.estado === 'crouch') return 'crouch';
  if (l.estado === 'walk') return (l.andarT >> 3) & 1 ? 'walk' : 'idle';
  return 'idle';
}

/* ==================================================================================
   FINALIZACOES (estilo fatality, mas comico e sem sangue): roteiro por lutador
   ================================================================================== */
let FATAL = null, FOTO = null;   /* 19/10: o nome da finalizacao sai datilografado na tarja de cinema de baixo (_src_5_cenas.js), nao em pop */
function iniciaFatal(l, r){
  FATAL = { l, r, tipo: l.C.fatal.tipo, t:0 }; LUTA.fase = 'fatal'; LUTA.t = 0; if (LUTA.faixaT > 12) LUTA.faixaT = 12;
  l.estado = 'fatal'; l.t = 0; l.vx = 0; l.golpe = null; l.poseFatal = 'idle'; l.face = r.x >= l.x ? 1 : -1;
  r.estado = 'tonto'; r.vx = 0; SFX.hiper(); FLASH = 4; zoomPara(1.25, (l.x + r.x) / 2 - CAM, CHAO - 72, 240);
}
function fimFatal(){
  const { l, r } = FATAL; LUTA.fatalNome = l.C.fatal.nome; l.estado = 'idle'; l.poseFatal = null; l.sug = null; CAMZ.hold = 0;
  r.sug = null; r.estado = 'hit'; nocaute(r, l); FATAL = null;
}
function passoFatal(){
  const f = FATAL; if (!f) return; f.t++; const { l, r, t } = f; l.t++; r.t++;
  const cabeca = () => r.y - 100 * r.C.ev;
  if (f.tipo === 'notificacao'){          /* CARLOS: o celular toca e a notificacao da avaliacao cai na cabeca do rival */
    l.poseFatal = t < 16 ? 'idle' : 'special';
    if (t === 16) SFX.ok();
    if (t === 30){ FX.push({ tipo:'notificacao', x: r.x, y: 0, alvo: Math.max(62, cabeca() - 46), txt: l.C.fatal.txt, t:0, dur: Math.max(90, leitura('MANUAL ' + l.C.fatal.txt) + 24) }); limpaPops(40, 150); SFX.blip(); }
    if (t === 54){ SHAKE = 8; SFX.hitForte(); fx('spark_l', r.x, cabeca(), { dur: 12, sc: 1.4 }); r.hitT = 6; }
    if (t === 70){ r.vy = -5; r.noAr = true; }
    if (t >= 100) fimFatal();
  } else if (f.tipo === 'zero'){           /* EDSON: zero na maquina */
    if (t < 30 && Math.abs(r.x - l.x) > 40){ l.x += l.face * 3; l.poseFatal = (t >> 3) & 1 ? 'walk' : 'idle'; }
    else { l.poseFatal = 'jab'; }
    if (t === 30) SFX.maquina();
    if (t > 30 && t < 100){
      FX.push({ tipo:'maquina', x:r.x, y:cabeca() - 14 + Math.sin(t * .6) * 4, t:0, dur:2, face:l.face });
      if (t % 6 === 0){ r.hitT = 3; for (let i = 0; i < 5; i++) FX.push({ tipo:'tufo', x:r.x + Math.random()*20-10, y:cabeca() - 6, vx:(Math.random()-0.5)*3, vy:-2 - Math.random()*2, t:0, dur:40, cor: r.C.time === 'cabeludo' ? '#5e3a1e' : '#8a5a32' }); }
      if (t % 18 === 0) SFX.hit();
    }
    if (t === 100){ r.zerado = true; pop(r, 'ZERADO!', AMARELO); r.vy = -4; r.noAr = true; SFX.hitForte(); }
    if (t >= 130) fimFatal();
  } else if (f.tipo === 'sucao'){          /* FABIO: o rival e sugado pro notebook e aparece no mudo na reuniao */
    l.poseFatal = 'special';
    if (t > 10 && t <= 50){ r.sug = { k: ease((t - 10) / 40), tx: l.x + l.face * 34, ty: l.y - 70 }; if (t % 6 === 0) SFX.blip(); }
    if (t === 50){ r.sug = { k: 1, tx: l.x, ty: l.y }; FX.push({ tipo:'reuniao', x:W/2, y:0, t:0, dur:110, rosto: r.id, mudo:true }); limpaPops(40, 150); SFX.zzz(); }
    if (t === 160){ r.sug = null; r.x = l.x + l.face * 60; r.y = l.y - 60; r.vy = -3; r.noAr = true; SFX.hitForte(); }
    if (t >= 190) fimFatal();
  } else if (f.tipo === 'selfie'){         /* TONHO: selfie com o derrotado, flash e foto com coracoes */
    if (t < 40 && Math.abs(r.x - l.x) > 44){ l.x += l.face * 3; l.poseFatal = (t >> 3) & 1 ? 'walk' : 'idle'; } else l.poseFatal = 'win';
    if (t === 44 || t === 62 || t === 80){ FLASH = 10; SFX.flash(); }
    if (t === 82){ FOTO = { x: Math.round(Math.min(l.x, r.x) - CAM - 40), y: 40, w: Math.round(Math.abs(l.x - r.x) + 80), h: 170 }; const s = document.createElement('canvas'); s.width = FOTO.w; s.height = FOTO.h; s.getContext('2d').drawImage(cv, FOTO.x, FOTO.y, FOTO.w, FOTO.h, 0, 0, FOTO.w, FOTO.h); FOTO.img = s; FOTO.t = 0; }
    if (t > 82 && t < 190 && t % 8 === 0) FX.push({ tipo:'coracao', x: CAM + W/2 + (Math.random()*100 - 50), y: 150, vy: -0.9, t:0, dur: 60 });
    if (t === 190){ FOTO = null; r.vy = -4; r.noAr = true; SFX.hitForte(); }
    if (t >= 215) fimFatal();
  } else if (f.tipo === 'peruca'){         /* PERUCA: joga a peruca na cabeca do rival */
    l.poseFatal = t < 14 ? 'idle' : 'special';
    if (t === 14){ SFX.whoosh(); f.px = l.x + l.face * 20; f.py = l.y - 100 * l.C.ev; }
    if (t > 14 && t < 50){ const k = ease((t - 14) / 36); f.wx = f.px + (r.x + r.face * -2 - f.px) * k; f.wy = f.py + (cabeca() - 4 - f.py) * k - Math.sin(k * Math.PI) * 40; FX.push({ tipo:'peruca_voo', x:f.wx, y:f.wy, t:0, dur:2, rot: t * 0.3 }); }
    if (t === 50){ r.perucaNaCabeca = true; pop(r, 'CAIU BEM!', AMARELO); SFX.hitForte(); SHAKE = 4; fx('spark_s', r.x, cabeca(), { dur: 10 }); }
    if (t === 90){ r.vy = -4; r.noAr = true; }
    if (t >= 120) fimFatal();
  } else if (f.tipo === 'pintura'){        /* TINTO: pinta o rival inteiro */
    l.poseFatal = 'special';
    if (t === 6) FX.push({ tipo:'nuvem_hiper', x:l.x + l.face * 30, y:l.y - 70, t:0, dur:80, vx:l.face * 1.6, sc:2.2 });
    if (t > 20 && t < 90){ r.pintado = Math.min(1, (t - 20) / 60); if (t % 5 === 0) FX.push({ tipo:'gota', x:r.x + Math.random()*24-12, y:cabeca() + Math.random()*40, vy:0.4, t:0, dur:40 }); if (t % 15 === 0) SFX.hit(); }
    if (t === 90){ pop(r, l.C.fatal.txt, AMARELO); r.vy = -4; r.noAr = true; SFX.hitForte(); }
    if (t >= 120) fimFatal();
  }
}
function desenhaFatal(){
  if (FOTO && FOTO.img){
    FOTO.t++; const k = Math.min(1, FOTO.t / 12), pw = 150, ph = 190;
    const px = Math.round(W/2 - pw/2), py = Math.round(H/2 - ph/2 - (1 - k) * 40);
    cx.fillStyle = INK; cx.fillRect(px - 5, py - 9, pw + 10, ph + 18); cx.fillStyle = '#2a2e36'; cx.fillRect(px - 3, py - 7, pw + 6, ph + 14);
    cx.fillStyle = '#000'; cx.fillRect(px, py, pw, ph);
    const s = Math.min(pw / FOTO.w, (ph - 30) / FOTO.h); const iw = Math.round(FOTO.w * s), ih = Math.round(FOTO.h * s);
    cx.imageSmoothingEnabled = false; cx.drawImage(FOTO.img, 0, 0, FOTO.w, FOTO.h, px + Math.round((pw - iw) / 2), py + 6, iw, ih);
    txtT('+1 SEGUIDOR', W/2, py + ph - 20, CORAL); txtMini('CURTIDAS 1.999', W/2, py + ph - 8, CREME);
  }
}

/* ==================================================================================
   MARCA NA LUTA: a caixa verde fechada da MANUAL cai na arena; quem pega inicia o
   TRATAMENTO (vida volta aos poucos, Lifeline sobe da coroa, coroa brilha, hiper enche
   mais rapido). Sem antes/depois de cabelo (trava Anvisa): a melhora e status de jogo.
   ================================================================================== */
const WORDMARK_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="27.5 5 73.5 11.5"><path fill="#ffffff" fill-rule="evenodd" clip-rule="evenodd" d="M46.4781 6.00879L41.681 15.0584H43.095L44.4033 12.5182H49.7291L51.0506 15.0584H52.4646L47.7071 6.00879H46.4781ZM45.0244 11.3803L47.0728 7.41121L49.1476 11.3803H45.0244ZM78.9084 15.0584L83.7056 6.00879H84.8949L89.6921 15.0584H88.278L86.9565 12.5182H81.6308L80.3225 15.0584H78.9084ZM84.287 7.41121L82.2387 11.3803H86.3618L84.287 7.41121ZM93.5509 13.8809V6.00879H92.2426V15.0584H100V13.8809H93.5509ZM56.2046 6.00879L63.0897 13.3252V6.00879H64.3452V15.0584H63.7901H63.1426L56.2706 7.78167V15.0584H55.0152V6.00879H56.2046ZM75.8293 11.0893C75.8293 13.1797 74.4152 14.1058 72.5122 14.1058C70.6092 14.1058 69.1952 13.1797 69.1952 11.0893V6.00879H67.8737V11.076C67.8737 13.9867 69.7899 15.2966 72.499 15.2966C75.2081 15.2966 77.1244 14 77.1244 11.076V6.00879H75.8028V11.0893H75.8293ZM29.6286 6.00879L33.8047 10.613L37.9807 6.00879H39.1701V15.0584H37.9146V7.78167L33.8047 12.2932L29.6947 7.78167V15.0584H28.4393V6.00879H29.6286Z"/></svg>';
const CAIXA = document.createElement('canvas'); CAIXA.width = 34; CAIXA.height = 24; let CAIXA_OK = false;
const WM = new Image();
WM.onload = ()=>{
  const g = CAIXA.getContext('2d');
  g.fillStyle = '#041c1c'; g.fillRect(0, 0, 34, 24);                       /* contorno */
  g.fillStyle = HERO; g.fillRect(1, 1, 32, 22);                             /* hero green chapado */
  g.fillStyle = '#165252'; g.fillRect(1, 1, 32, 2); g.fillRect(1, 1, 2, 22);  /* aresta de luz */
  g.fillStyle = '#062a2a'; g.fillRect(1, 21, 32, 2); g.fillRect(31, 1, 2, 22); /* aresta de sombra */
  g.imageSmoothingEnabled = true; g.drawImage(WM, 5, 9, 24, 3.8);           /* wordmark branco (mascara) */
  CAIXA_OK = true;
};
WM.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(WORDMARK_SVG);

let ITEM = null;
function passoItem(){
  if (LUTA.fase !== 'luta') return;
  const queda = (!LUTA.itemSaiu && ((LUTA.momentoIdx >= 1 && LUTA.desdeMomento > 90) || LUTA.timer <= TEMPO_LUTA - 6)) || (LUTA.itemSaiu === 1 && LUTA.timer <= TEMPO_LUTA - 26);   /* 26/10: pelo relogio de 60 s (era 86 e 62 no de 99: com 60 caia logo no comeco) */
  if (!ITEM && queda){
    LUTA.itemSaiu = (LUTA.itemSaiu || 0) + 1;
    /* cai num lugar livre: longe dos dois (ate 70 px) e o mais perto possivel do centro */
    let bx = STAGE_W / 2, melhor = -1e9;
    for (let x = 64; x <= STAGE_W - 64; x += 8){ const sc = Math.min(Math.abs(x - L1.x), Math.abs(x - L2.x), 70) - Math.abs(x - STAGE_W / 2) * 0.15; if (sc > melhor){ melhor = sc; bx = x; } }
    ITEM = { x: bx, y: -8, vy: 0, t: 0, pousou: false };
    SFX.ok();                                        /* o aviso INTERVALO MANUAL! desce junto com a caixa (drawItem) */
  }
  if (!ITEM) return;
  ITEM.t++;
  if (ITEM.y < CHAO - 2){ ITEM.vy += ITEM.t < 50 ? 0.07 : 0.24; ITEM.y += ITEM.vy; if (ITEM.y >= CHAO - 2){ ITEM.y = CHAO - 2; if (ITEM.vy > 2){ ITEM.vy = -ITEM.vy * 0.35; ITEM.y -= 1; fx('dust', ITEM.x, CHAO, { dur: 14, sc: 1.4 }); SFX.blip(); if (!ITEM.pousou){ ITEM.pousou = true; ITEM.tPouso = ITEM.t; SHAKE = Math.max(SHAKE, 4); zoomPara(1.07, ITEM.x - CAM, CHAO - 40, 45); } } else ITEM.vy = 0; } }
  for (const l of [L1, L2]){
    if (l.estado === 'ko' || l.estado === 'tonto' || l.noAr || l.tratamento) continue;
    if (Math.abs(l.x - ITEM.x) < 24 && ITEM.y >= CHAO - 6 && (podeAgir(l) || l.estado === 'attack')){ pegaItem(l); return; }
  }
  if (ITEM.t > 760) ITEM = null;
}
function pegaItem(l){
  ITEM = null; if (l.tratamento){ l.vida = Math.min(l.vidaMax, l.vida + Math.round(12 * VIDA_LUTA)); l.hiper = Math.min(100, l.hiper + 25); pop(l, 'CONSTANCIA EM DIA', MINT); SFX.ok(); return; }
  l.tratamento = 1; l.vidaAtras = l.vida; LUTA.faixaQuem = l; for (const p of POPS) if (p.y > 46 && p.y < 118) p.dur = Math.min(p.dur, p.t + 6); LUTA.faixaTot = LUTA.faixaT = 24 + leitura(l.C.nome + ' INICIOU O TRATAMENTO');
  pop(l, 'TRATAMENTO INICIADO', MINT); LUTA.avisoT = Math.max(170, leitura('RESULTADOS VARIAM DE PESSOA PARA PESSOA')); SFX.win(); FLASH = 3;
  FX.push({ tipo:'lifeline_sobe', x:l.x, y:l.y - 100 * l.C.ev, t:0, dur:60, face:l.face });
  const fala = l.id === 'edson' ? 'GUARDO PRA CLIENTELA' : l.id === 'fabio' ? 'CUIDANDO DA CALVICIE!' : l.C.time === 'calvo' ? 'TRATAMENTO EM DIA!' : l.id === 'tonho' ? 'CUIDAR CEDO VALE!' : 'CHEGA DE ESCONDER';   /* revisao de 19/10 */
  setTimeout(()=>pop(l, fala, AMARELO), 900);
}
function passoTratamento(l){
  if (!l.tratamento) return;
  l.tratamento++;
  if (l.estado === 'ko') return;
  if (l.tratamento % 31 === 0 && l.vida < l.vidaMax){   /* 26/10: 22 -> 31 quadros, a mesma cura proporcional com a vida em 70% */ l.vida = Math.min(l.vidaMax, l.vida + 1); if (l.vidaAtras < l.vida) l.vidaAtras = l.vida; }
  if (l.tratamento % 26 === 0) fx('estrela', l.x + l.face * 2 + (Math.random() * 12 - 6), l.y - 106 * l.C.ev, { dur: 22, vy: -0.4, cor: MINT });
  if (l.tratamento % 130 === 0) FX.push({ tipo:'lifeline_sobe', x:l.x, y:l.y - 100 * l.C.ev, t:0, dur:60, face:l.face });
}
function drawItem(){
  if (!ITEM) return;
  const x = Math.round(ITEM.x - CAM), y = Math.round(ITEM.y), bob = ITEM.y >= CHAO - 6 ? Math.round(Math.sin(ITEM.t * 0.12) * 2) : 0;
  if (ITEM.t > 640 && (ITEM.t & 8)) return;                                 /* piscando antes de sumir */
  const g = 0.35 + Math.sin(ITEM.t * 0.15) * 0.15, bw = 62, bh = 36, bx = x - bw / 2, by = y - bh + bob;
  cx.fillStyle = 'rgba(159,228,178,' + g.toFixed(2) + ')'; cx.fillRect(bx - 5, by - 5, bw + 10, bh + 10);
  cx.fillStyle = '#041c1c'; cx.fillRect(bx, by, bw, bh);                                   /* caixa verde fechada da MANUAL */
  cx.fillStyle = HERO; cx.fillRect(bx + 1, by + 1, bw - 2, bh - 2);
  cx.fillStyle = '#165252'; cx.fillRect(bx + 1, by + 1, bw - 2, 2); cx.fillRect(bx + 1, by + 1, 2, bh - 2);
  cx.fillStyle = '#062a2a'; cx.fillRect(bx + 1, by + bh - 3, bw - 2, 2); cx.fillRect(bx + bw - 3, by + 1, 2, bh - 2);
  marca(48, x, by + 15);
  const aviso = !ITEM.pousou || ITEM.t - (ITEM.tPouso || 0) < 50;
  if (aviso && LUTA.fase === 'luta'){ const lx = Math.max(76, Math.min(W - 76, x)); let ly = yTelaMin(Math.max(60, by - 16), 60);
    for (let v = 0; v < 4; v++){ const r = caixaTela(lx - 69, ly - 1, lx + 69, ly + 9), bate = OCUPADO_ANT.find(o => o[4] >= 5 && Math.min(r[2], o[2]) - Math.max(r[0], o[0]) > 1 && Math.min(r[3], o[3]) - Math.max(r[1], o[1]) > 1); if (!bate) break; ly += Math.round(bate[3] - r[1]) + 2; }
    ly = Math.min(ly, 158); txtO('INTERVALO MANUAL!', lx, ly, MINT, INK); ocupa(caixaTela(lx - 69, ly - 1, lx + 69, ly + 9), 6); }
  if (!aviso && ITEM.y >= CHAO - 6 && LUTA.fase === 'luta' && !HIPER){ const sy = Math.round(Math.sin(ITEM.t * 0.2) * 3); txtO('PEGA!', x, by - 26 + sy, MINT, INK); cx.fillStyle = INK; cx.fillRect(x - 5, by - 14 + sy, 11, 2); cx.fillStyle = MINT; for (let k = 0; k < 4; k++) cx.fillRect(x - 4 + k, by - 13 + sy + k, 9 - k * 2, 1); }
}

/* facho de luz e anel no chao: a caixa chama o olho mesmo com a briga em volta (desenhado atras dos lutadores) */
function drawItemLuz(){
  if (!ITEM) return;
  const x = Math.round(ITEM.x - CAM), caindo = ITEM.y < CHAO - 6, k = caindo ? 1 : Math.max(0, 1 - (ITEM.t - 60) / 90);
  if (k > 0){ cx.save(); cx.globalCompositeOperation = 'lighter'; cx.fillStyle = 'rgba(159,228,178,' + (0.22 * k).toFixed(2) + ')'; cx.beginPath(); cx.moveTo(x - 10, 0); cx.lineTo(x + 10, 0); cx.lineTo(x + 38, CHAO + 2); cx.lineTo(x - 38, CHAO + 2); cx.closePath(); cx.fill(); cx.restore(); }
  if (!caindo){ const p = (ITEM.t % 40) / 40, rw = Math.round(28 + p * 26), rh = Math.round(5 + p * 4); cx.strokeStyle = 'rgba(159,228,178,' + (0.8 * (1 - p)).toFixed(2) + ')'; cx.lineWidth = 2; cx.beginPath(); cx.ellipse(x, CHAO + 1, rw, rh, 0, 0, Math.PI * 2); cx.stroke(); }
}

/* faixa TRATAMENTO MANUAL (entra de lado, segura, sai) */
function drawFaixaMarca(){
  if (!LUTA.faixaT || HIPER || FATAL || LUTA.fase === 'ko') return;           /* pausa durante hiper e finalizacao (volta depois) */
  LUTA.faixaT--; const t = (LUTA.faixaTot || 96) - LUTA.faixaT; const entra = Math.min(1, t / 10), sai = LUTA.faixaT < 12 ? (12 - LUTA.faixaT) / 12 : 0;
  const ox = Math.round((1 - ease(entra)) * -W + ease(sai) * W), y = 60; ocupa([0, y, W, y + 44], 8);
  cx.save(); cx.translate(ox, 0);
  cx.fillStyle = 'rgba(4,28,28,.92)'; cx.fillRect(0, y, W, 44); cx.fillStyle = MINT; cx.fillRect(0, y, W, 2); cx.fillRect(0, y + 42, W, 2);
  cx.fillStyle = HERO; cx.fillRect(0, y + 2, W, 40);
  for (let i = 0; i < 12; i++){ cx.fillStyle = 'rgba(159,228,178,.08)'; cx.fillRect((i * 40 + t * 4) % (W + 40) - 40, y + 2, 16, 40); }
  marca(140, W / 2, y + 7);
  txtT(LUTA.faixaQuem ? LUTA.faixaQuem.C.nome + ' INICIOU O TRATAMENTO' : 'TRATAMENTO INICIADO', W / 2, y + 30, MINT);
  cx.restore();
}
/* ==================================================================================
   ANIMACAO FLUIDA: com 12 poses por lutador, o movimento vem de (1) quadros intermediarios
   montados com as poses existentes (idle > jab > punch > jab > idle), (2) antecipacao e
   esticada (squash & stretch) por escala X/Y, (3) afterimage nos quadros ativos e
   (4) respiro e balanco continuos. Tudo calculado aqui: quadroDe(l) -> {pose, sx, sy, dx, dy}.
   ================================================================================== */
const PRE_POSE = { punch:'jab', kick:'walk', jab:'idle', lowk:'crouch', airk:'jump', special:'jab' };
/* QUADROS DESENHADOS dos especiais e arremessos (tiras/folhas do Magnific): <id>_<sp1|sp2|arr>_<0..3>.
   Preparo = quadros 0 e 1, golpe = 2, depois = 3. No arremesso o objeto sai da mao no quadro em que o projetil nasce. */
function chaveAnim(l, g){ const C = l.C; if (g.nome === C.especial.nome) return 'sp1'; if (g.nome === C.especial2.nome) return 'sp2'; if (C.arremesso && g.nome === C.arremesso.nome) return 'arr'; return null; }
function quadroEspecial(l, g){
  const k = chaveAnim(l, g); if (!k || !SHEETMAP[l.id + '_' + k + '_0']) return null;
  let n = 0; while (n < 4 && SHEETMAP[l.id + '_' + k + '_' + n]) n++;
  const t = l.t, ini = g.ini, fa = g.ini + g.ativo; let f;
  if (g.tipo === 'giro') f = t >= ini && t < fa ? Math.floor((t - ini) / 3) % n : 0;
  else if (g.tipo === 'buff') f = Math.floor(t / 3) % n;
  else if (k === 'arr') f = t < ini - 2 ? (t < (ini - 2) / 2 ? 0 : 1) : t < ini + 5 ? 2 : 3;     /* soltura colada no nascimento do projetil */
  else if (g.tipo === 'projetil') f = t < ini - 3 ? (t < (ini - 3) / 2 ? 0 : 1) : t < ini + 6 ? 2 : 3;
  else if (g.tipo === 'subida') f = t < ini ? 0 : t < ini + 4 ? 1 : t < fa ? 2 : 3;
  else f = t < ini ? (t < ini / 2 ? 0 : 1) : t < fa ? 2 : 3;
  return k + '_' + Math.min(f, n - 1);
}
function quadroDe(l){
  const q = { pose: poseDe(l), sx: 1, sy: 1, dx: 0, dy: 0, ghost: 0, flip: false, rot: 0 };
  const t = l.t, f = l.face;
  if (l.estado === 'ko' && l.noAr){ q.rot = -f * Math.min(t * 0.16, Math.PI * 0.9); return q; }      /* tombo girando */
  /* SELFIE 360 do Tonho (23/10): tres poses trocando no flash, como no CONCEITO; nada de girar o desenho no eixo (parecia papel) */
  if (l.estado === 'hiper' && HIPER && HIPER.tipo === 'flash' && HIPER.fase === 'efeito'){ q.pose = ['win', 'special', 'jab'][((HIPER.t / 16) | 0) % 3]; q.flip = (((HIPER.t / 16) | 0) % 3) === 1; return q; }
  if (l.estado === 'hiper' || l.estado === 'fatal' || l.estado === 'ko' || l.estado === 'down') return q;
  if (l.golpe && l.estado === 'attack'){ const qe = quadroEspecial(l, l.golpe);
    if (qe){ const g = l.golpe; q.pose = qe; if (t >= g.ini && t < g.ini + 3){ q.sx = 1.05; q.ghost = 2; } else if (t < g.ini){ q.sy = 1.01; }
      if (g.tipo === 'giro' || g.tipo === 'dash') q.ghost = 2; return q; } }
  if (l.golpe && l.golpe.tipo === 'giro' && t >= l.golpe.ini && t < l.golpe.ini + l.golpe.ativo){ q.pose = 'special'; q.flip = (((t - l.golpe.ini) / 5) | 0) % 2 === 1; q.ghost = 2; return q; }   /* sem desenho do giro: espelha a cada 5 quadros, sem achatar */
  /* golpes: preparo (pose anterior + recuo), ativo (esticada + afterimage), retorno (pose anterior) */
  if (l.golpe){
    const g = l.golpe, ini = g.ini, fimAtivo = g.ini + g.ativo, fimTudo = g.ini + g.ativo + g.rec;
    const pre = PRE_POSE[g.tipo ? 'special' : (g.nome in PRE_POSE ? g.nome : 'jab')] || 'idle';
    if (g.tipo === 'dash' && !g.dano){ q.pose = g.pose; q.sx = 1.06; q.sy = 0.96; q.ghost = 3; q.dx = f * 2; return q; }
    if (g.tipo === 'projetil' || g.tipo === 'chicote' || g.tipo === 'subida' || g.tipo === 'giro' || g.tipo === 'dash' || g.tipo === 'buff' || g.tipo === 'contra'){
      if (t < ini){ q.pose = l.noAr ? 'jump' : (t < ini * 0.5 ? 'idle' : 'jab'); q.sx = 0.97; q.dx = -f * 2; q.sy = 1.02; }
      else if (t < fimAtivo){ const k = (t - ini); q.pose = g.pose; if (k < 3){ q.sx = 1.08 - k * 0.02; q.dx = f * 2; q.ghost = 2; } }
      else if (t > fimTudo - 4 && !g.tipo.match(/giro|subida/)){ q.pose = 'jab'; }
      if (g.tipo === 'giro') q.dx = Math.round(Math.sin(t * 0.9) * 2);
      return q;
    }
    if (t < ini){                                   /* antecipacao: pose anterior, corpo recua e comprime */
      const k = t / Math.max(1, ini); q.pose = l.noAr ? 'jump' : pre; q.sx = 1 - 0.05 * k; q.dx = -f * Math.round(3 * k); q.sy = 1 + 0.02 * k;
    } else if (t < fimAtivo){                        /* ativo: esticada e afterimage */
      const k = t - ini; q.pose = g.pose; if (k < 3){ q.sx = 1.1 - k * 0.03; q.sy = 0.98; q.dx = f * (3 - k); q.ghost = 2; }
    } else if (t >= fimTudo - 3 && !l.noAr){        /* retorno: pose anterior de novo (quadro intermediario) */
      q.pose = pre === 'jump' ? 'jump' : pre; q.sx = 0.98;
    }
    return q;
  }
  if (l.estado === 'hit'){ const k = Math.min(1, t / 4); q.sx = 0.9 + 0.1 * k; q.sy = 1.04 - 0.04 * k; q.dx = -f * Math.round(2 * (1 - k)); return q; }
  if (l.estado === 'block'){ q.dx = (t & 2) ? -f : 0; return q; }
  if (l.noAr){
    if (l.vy < -3){ q.sy = 1.08; q.sx = 0.95; } else if (l.vy > 3){ q.sy = 1.05; q.sx = 0.97; }
    if (l.estado === 'jump' && t < 3){ q.pose = 'crouch'; q.sy = 0.92; q.sx = 1.08; }   /* impulso */
    return q;
  }
  if (l.pousouT > 0){ q.pose = 'crouch'; q.sy = 0.9 + 0.1 * (1 - l.pousouT / 5); q.sx = 1.1 - 0.1 * (1 - l.pousouT / 5); return q; }
  if (l.estado === 'walk'){ const ph = (l.andarT % 10) / 10; q.pose = ph < 0.5 ? 'walk' : 'idle'; q.dy = -Math.round(Math.abs(Math.sin(ph * Math.PI * 2)) * 2); q.sx = 1 + 0.02 * Math.sin(ph * Math.PI * 2); return q; }
  if (l.estado === 'crouch'){ q.sy = 1 + 0.01 * Math.sin(FRAME * 0.2); return q; }
  if (l.estado === 'win'){ const w = l.winT; if (w > 20){ const hop = Math.max(0, Math.sin((w - 20) * 0.18)) * 6; q.dy = -Math.round(hop); q.sy = 1 + hop * 0.01; } return q; }
  if (l.estado === 'tonto'){ q.sx = 1 + 0.03 * Math.sin(t * 0.2); return q; }
  /* idle: respiro */
  q.sy = 1 + 0.015 * Math.sin(FRAME * 0.11 + (l === L1 ? 0 : 1.7)); q.sx = 1 - 0.008 * Math.sin(FRAME * 0.11);
  return q;
}

/* ==================================================================================
   CINEMA (pseudo-3D): camera com zoom e foco (fundo com menos zoom = 2.5D), sombras no chao,
   giro em toca-discos (escala X = cos), tombo girando no KO, grade em perspectiva nos hipers.
   ================================================================================== */
const CAMZ = { z: 1, alvo: 1, fx: W/2, fy: 150, tfx: W/2, tfy: 150, hold: 0 };
function zoomPara(z, fx, fy, hold){ CAMZ.alvo = z; CAMZ.tfx = Math.max(60, Math.min(W - 60, fx)); CAMZ.tfy = Math.max(60, Math.min(H - 40, fy)); CAMZ.hold = hold || 0; }
function passoZoom(){
  if (CAMZ.hold > 0) CAMZ.hold--; else if (!HIPER && !FATAL) { CAMZ.alvo = 1; diretorCamera(); }
  CAMZ.z += (CAMZ.alvo - CAMZ.z) * 0.16; CAMZ.fx += (CAMZ.tfx - CAMZ.fx) * 0.2; CAMZ.fy += (CAMZ.tfy - CAMZ.fy) * 0.2;
}
/* diretor de camera (23/10, aprendizado do 2o ROUND: "a camera nunca fica parada"): na luta, quanto mais perto os dois,
   mais a camera fecha (ate 8%), com um respiro lento; como o fundo usa so 55% do zoom, o cenario fica para tras e a
   cena ganha profundidade sem girar nenhum desenho. Com letreiro, faixa ou momento na tela a camera volta ao aberto. */
function diretorCamera(){
  if (typeof scFight === 'undefined' || SCENE !== scFight || LUTA.fase !== 'luta' || MOMENTO || !L1 || !L2) return;
  if (FAIXAS.length || LUTA.faixaT > 0 || (typeof falasPendentes === 'function' && FALAS.some(f => !f.l))) return;
  const d = Math.abs(L1.x - L2.x), perto = Math.max(0, Math.min(1, (210 - d) / 130)), max = MENOS_MOVIMENTO ? 0.03 : 0.08;
  CAMZ.alvo = 1 + perto * max + (MENOS_MOVIMENTO ? 0 : 0.008 * Math.sin(FRAME * 0.012));
  CAMZ.tfx = Math.max(60, Math.min(W - 60, (L1.x + L2.x) / 2 - CAM)); CAMZ.tfy = Math.max(60, Math.min(H - 40, Math.min(L1.y, L2.y) - 70));
}
/* soco de zoom no golpe forte (some sozinho em ~10 quadros, porque o zoom volta para o alvo) */
function socoCamera(k){ if (!MENOS_MOVIMENTO) CAMZ.z = Math.min(1.22, CAMZ.z + k); }
/* desenha `fn` com uma fracao do zoom da camera (fundo 0.55, lutadores 1) */
function comZoom(fator, fn){
  const z = 1 + (CAMZ.z - 1) * fator;
  if (z < 1.002){ fn(); return; }
  cx.save(); cx.translate(Math.round(CAMZ.fx), Math.round(CAMZ.fy)); cx.scale(z, z); cx.translate(-Math.round(CAMZ.fx), -Math.round(CAMZ.fy)); fn(); cx.restore();
}
/* brilho suave e eliptico (contraluz, halo, poca de luz): cor como 'rgba(r,g,b,' e a = opacidade do centro */
function brilho(g, x, y, rx, ry, a, cor){
  if (a <= 0.003) return; cor = cor || 'rgba(255,238,188,';
  g.save(); g.translate(Math.round(x), Math.round(y)); g.scale(rx / ry, 1);
  const gr = g.createRadialGradient(0, 0, 0, 0, 0, ry); gr.addColorStop(0, cor + a.toFixed(3) + ')'); gr.addColorStop(0.45, cor + (a * 0.5).toFixed(3) + ')'); gr.addColorStop(1, cor + '0)');
  g.fillStyle = gr; g.beginPath(); g.arc(0, 0, ry, 0, Math.PI * 2); g.fill(); g.restore();
}
/* profundidade sem 3D (23/10): nevoa na linha do horizonte entre o cenario e os lutadores, e vinheta escura nas bordas
   (o olho vai para o centro e o fundo recua); a cor da nevoa e a luz do cenario */
let _VINH = null, _VINH_W = 0;
function nevoaHorizonte(cen){
  const luz = (CENARIOS[cen] && CENARIOS[cen].luz) || '#ffe6c0', y0 = CHAO - 150, y1 = CHAO + 6;
  const g = cx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, luz + '00'); g.addColorStop(0.62, luz + '24'); g.addColorStop(1, luz + '00');
  cx.fillStyle = g; cx.fillRect(-8, y0, W + 16, y1 - y0);
}
function vinhetaBordas(){
  if (!_VINH || _VINH_W !== W){ _VINH = document.createElement('canvas'); _VINH.width = W; _VINH.height = H; _VINH_W = W; const g = _VINH.getContext('2d');
    const gr = g.createRadialGradient(W / 2, H * 0.55, H * 0.42, W / 2, H * 0.55, W * 0.62); gr.addColorStop(0, 'rgba(6,8,16,0)'); gr.addColorStop(1, 'rgba(6,8,16,.38)');
    g.fillStyle = gr; g.fillRect(0, 0, W, H); }
  cx.drawImage(_VINH, 0, 0);
}
/* primeiro plano (23/10, layout da luta): postes de rua escuros e desfocados nas bordas, na frente dos lutadores;
   com o zoom da camera eles crescem mais que a cena (fator 1.35), o que da a sensacao de camera no meio da rua */
const FRENTE = { rua: [0.03, 0.97], banca: [0.04, 0.96] };
let _POSTE = null;
function postePrimeiroPlano(){
  if (_POSTE) return _POSTE; const w = 22, h = 96, c = document.createElement('canvas'); c.width = w + 8; c.height = h + 8; const g = c.getContext('2d');
  const s = document.createElement('canvas'); s.width = w; s.height = h; const q = s.getContext('2d');
  q.fillStyle = '#17110f'; q.fillRect(3, 10, w - 6, h - 10); q.beginPath(); q.ellipse(w / 2, 10, w / 2 - 3, 6, 0, 0, Math.PI * 2); q.fill();   /* frade de calcada: corpo e cabeca arredondada */
  q.fillStyle = '#2b201b'; q.fillRect(4, 12, 3, h - 14); q.fillStyle = '#0c0807'; q.fillRect(w - 7, 12, 3, h - 14); q.fillStyle = '#3a2a22'; q.fillRect(3, 26, w - 6, 3);
  try { g.filter = 'blur(1.6px)'; } catch(e){} g.drawImage(s, 4, 4); _POSTE = c; return c;
}
function drawPrimeiroPlano(cen){
  const pos = FRENTE[cen]; if (!pos) return; const im = postePrimeiroPlano();
  for (const f of pos){ const x = Math.round(f * W - im.width / 2), y = H - im.height + 22; cx.globalAlpha = 0.92; cx.drawImage(im, x, y); }
  cx.globalAlpha = 1;
}
/* contorno de luz (rim light) de 1 px em volta do sprite: desenhado ANTES do sprite, some por baixo dele */
function contornoLuz(nome, x, y, flip, a, cor, o){
  o = o || {}; const c = (cor || 'rgba(255,238,188,') + a.toFixed(3) + ')';
  for (const [ox, oy] of [[-1, 0], [1, 0], [0, -1]]) drawSpr(nome, x + ox, y + oy, flip, { sx: o.sx, sy: o.sy, silh: c });
}
/* sombra eliptica no chao: menor e mais clara quanto mais alto */
function drawSombra(l){
  if (l.estado === 'ko' && !l.noAr) return;
  const alt = Math.max(0, CHAO - l.y), k = Math.max(0.3, 1 - alt / 260);
  const rx = 16 * (l.C.ev || l.C.escala) * k * (l.estado === 'crouch' ? 1.15 : 1), ry = 3.5 * k;
  cx.fillStyle = 'rgba(10,20,20,' + (0.3 * k).toFixed(2) + ')';
  cx.beginPath(); cx.ellipse(Math.round(l.x - CAM), CHAO + 4, rx, ry, 0, 0, Math.PI * 2); cx.fill();
}
/* grade em perspectiva rolando (fundo de hiper e finalizacao) */
function drawGrade3D(t, cor){
  const hz = 92; cx.save(); cx.globalAlpha = 0.32; cx.strokeStyle = cor || MINT; cx.lineWidth = 1;
  cx.beginPath();
  for (let i = 0; i < 10; i++){ const k = ((i + (t * 0.02) % 1) / 10); const y = hz + k * k * (H - hz); cx.moveTo(0, Math.round(y) + 0.5); cx.lineTo(W, Math.round(y) + 0.5); }
  for (let i = -8; i <= 8; i++){ cx.moveTo(W/2 + i * 8, hz); cx.lineTo(W/2 + i * 70, H); }
  cx.stroke();
  cx.globalAlpha = 0.5; cx.fillStyle = cor || MINT; cx.fillRect(0, hz, W, 1);
  cx.restore();
}

/* ==================================================================================
   HISTORIA NA LUTA: a calvicie no meio da briga.
   - Conversa antes da luta (tela de VS), por confronto.
   - MOMENTOS COROA: 2 por luta (timer ~72 e ~40), situacoes do dia a dia de quem tem entrada e coroa
     (situacoes aprovadas no Coroa City: ventania, sol a pino, foto de cima, sobrinho sincero, a roda).
     A luta pausa ~3 s, cada lutador reage do seu jeito (quem esconde se entrega, quem cuida segue).
   - Falas curtas em balao quando a vida cai da metade.
   Humor mira o comportamento (esconder, negar, fugir), nunca o corpo.
   ================================================================================== */
let FALAS = [], FILA_FALAS = [];
/* cada fala fica no ar pelo menos o tempo de leitura (leitura()); fala nova da mesma pessoa espera a anterior
   terminar, e numa transicao (momento, nocaute) as falas saem esmaecendo, nunca somem no meio */
function falar(l, texto, dur){
  const d = Math.max(dur || 0, leitura(texto)), atual = FALAS.find(f => f.l === l && !f.saindo);
  if (atual && atual.t < atual.dur - 8){ FILA_FALAS = FILA_FALAS.filter(q => q.l !== l); FILA_FALAS.push({ l, texto, dur: d }); return; }
  FALAS = FALAS.filter(f => f.l !== l); FALAS.push({ l, texto, t:0, dur: d });
}
function voz(lado, rotulo, texto, dur){ FALAS.push({ l:null, lado, rotulo, texto, t:0, dur: Math.max(dur || 0, leitura(rotulo + ' ' + texto)) }); }
function passoFalas(){
  if (LUTA.faixaT > 0 && SCENE === scFight && LUTA.fase === 'luta') return;    /* faixa TRATAMENTO no ar: as falas esperam (voltam depois, com o tempo que faltava) */
  for (const f of FALAS) f.t++; FALAS = FALAS.filter(f => f.t < f.dur);
  for (const q of FILA_FALAS.slice()) if (!FALAS.some(f => f.l === q.l)){ FILA_FALAS.splice(FILA_FALAS.indexOf(q), 1); FALAS.push({ l: q.l, texto: q.texto, t: 0, dur: q.dur }); }
}
function encerraFalas(n){ for (const f of FALAS){ f.dur = Math.min(f.dur, f.t + (n || 10)); f.saindo = true; } FILA_FALAS = []; }
function falasPendentes(){ return FILA_FALAS.length > 0 || FALAS.some(f => !f.saindo && f.t < f.dur - 6); }
/* areas ocupadas neste quadro por letreiros que os baloes devem evitar (pops, combo, faixa, aviso, caixa, notificacao) */
let OCUPADO = [], OCUPADO_ANT = [];
function ocupa(r, peso){ OCUPADO.push([r[0], r[1], r[2], r[3], peso || 6]); }
/* y do mundo que garante, na tela (com o zoom da camera), no minimo 'min' */
function yTelaMin(y, min){ const m = cx.getTransform(), k = m.d || 1, ty = m.d * y + m.f; return ty >= min ? y : y + (min - ty) / k; }
function caixaTela(x0, y0, x1, y1){ const m = cx.getTransform(); const p = (x, y) => [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f]; const a = p(x0, y0), b = p(x1, y1); return [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[0], b[0]), Math.max(a[1], b[1])]; }
/* ---------------- baloes: cada fala procura um lugar livre ----------------
   Candidatos: faixa de cima no lado de quem fala (entre o HUD e as cabecas), faixa do outro lado,
   ao lado da cabeca (esquerda/direita) e rodape. Ganha o que menos cobre lutador, HUD, texto grande,
   polaroide e outro balao; a cauda sempre aponta p/ quem fala. */
function telaX(x){ const z = CAMZ.z; return z < 1.002 ? x - CAM : CAMZ.fx + (x - CAM - CAMZ.fx) * z; }
function telaY(y){ const z = CAMZ.z; return z < 1.002 ? y : CAMZ.fy + (y - CAMZ.fy) * z; }
function caixaLutador(l){
  const z = CAMZ.z < 1.002 ? 1 : CAMZ.z, q = quadroDe(l), k = mapaSlot(l.id + '_' + q.pose) || mapaSlot(l.id + '_idle');
  const v = l.C.vis || 1, w = (k ? k[2] : 70) * z * v, h = (k ? k[3] : 125) * z * v, ax = (k && k.length > 4 ? k[4] : (k ? k[2] : 70) / 2) * z * v;
  const x = telaX(l.x), y = telaY(l.y), esq = l.face < 0 ? x - (w - ax) : x - ax;
  return [esq - 3, y - h - 4, esq + w + 3, y];
}
function sobrepoe(a, b){ const w = Math.min(a[2], b[2]) - Math.max(a[0], b[0]), h = Math.min(a[3], b[3]) - Math.max(a[1], b[1]); return w > 0 && h > 0 ? w * h : 0; }
function reservas(){
  /* 26/10: abaixo das barras so os nomes (nas pontas) e a plaquinha do relogio (no meio) sao reservados; antes a faixa inteira tirava o
     espaco em cima da cabeca e mandava o balao para a borda da tela */
  const nomes = [[0, 38, 128, 53, 4], [W - 128, 38, W, 53, 4], [W / 2 - 32, 38, W / 2 + 32, 54, 4]];   /* peso baixo: encostar no canto do nome e melhor que cobrir alguem */
  const R = HUD_SOBRE ? [[0, 0, W, 38, 8]].concat(nomes, ZONAS_TOQUE) : [[0, 0, W, 38, 8]].concat(nomes, [[0, 176, 126, H, 4], [W - 126, 176, W, H, 4]]);   /* controles por cima do jogo: os baloes fogem deles */
  if (LUTA.fase === 'momento' && MOMENTO){ R.length = 0; R.push([0, 0, W, 22, 8]); if (MOMENTO.painel) R.push(MOMENTO.painel.concat([8])); if (MOMENTO.tipo === 'foto' && FOTO && MOMENTO.t >= MOMENTO.flash){ const ph = FOTO.arte ? 132 : 110, py0 = FOTO.arte ? 22 : 28; R.push([W / 2 - 98, py0 - 8, W / 2 + 98, py0 + ph + 26, 10]); } }
  for (const o of OCUPADO) R.push(o);
  if (LUTA.fase === 'intro'){ R.push([118, 58, 266, 90], [96, 92, 288, 107], [148, 108, 236, 135]); }
  if (LUTA.fase === 'ko' && LUTA.t >= (LUTA.koT || 70)){ R.push([92, 94, 292, 118, 8], [0, 150, W, H, 8]); if (LUTA.ko && LUTA.ko.vencedor.vida === LUTA.ko.vencedor.vidaMax && LUTA.perfeitoR) R.push(LUTA.perfeitoR.concat([8])); }
  if (LUTA.fase === 'ko' && LUTA.t < (LUTA.koT || 70)) R.push([60, 40, 324, 150, 8]);
  return R;
}
function medeBalao(texto, n, rotulo){
  const linhas = wrap(texto, n), lw = Math.max(rotulo ? larguraT(rotulo) : 0, ...linhas.map(s => larguraT(s))) + 12, lh = linhas.length * 10 + (rotulo ? 18 : 8);
  let feio = 0;                                   /* quebras que a regra de tipografia nao aceita */
  linhas.forEach((s, i) => { const ws = s.split(' '), f = ws[ws.length - 1];
    if (i < linhas.length - 1 && (CONECTORAS.has(f) || (ws.length >= 2 && /[.,!?:]$/.test(ws[ws.length - 2]) && f.length <= 4))) feio++;
    if (i === linhas.length - 1 && linhas.length > 1 && ws.length === 1) feio++; });
  return { linhas, lw, lh, feio };
}
let BALOES = [];                                  /* baloes ja postos neste quadro */
function falaLivre(l, texto, opts){
  opts = opts || {};
  const alvoX = l ? telaX(l.x) : (opts.lado < 0 ? 8 : W - 8), cab = l ? caixaLutador(l) : [alvoX, 120, alvoX, 120];
  const alvoY = l ? cab[1] + 8 : 60, ladoFala = l ? (telaX(l.x) <= telaX(outro(l).x) ? -1 : 1) : opts.lado;
  const R = reservas(), corpos = [L1, L2].filter(o => o && (o.estado !== 'ko' || !o.noAr)).map(caixaLutador), cands = [];
  const faixa = (lado) => {                      /* faixa de cima, metade da tela: centrado em quem fala ou encostado na borda */
    const a = lado < 0 ? 6 : W / 2 + 26, b = lado < 0 ? W / 2 - 26 : W - 6, m = medeBalao(texto, opts.n || 19, opts.rotulo);
    const lw = Math.min(b - a, m.lw), base = l ? Math.max(40, Math.min(88, Math.round(cab[1]) - 4)) : 88, pena = lado === ladoFala ? 0 : 400;
    cands.push({ m, x0: Math.round(Math.max(a, Math.min(b - lw, alvoX - lw / 2))), y0: base - m.lh, lw, cauda: 'baixo', pena });
    cands.push({ m, x0: lado < 0 ? a : Math.round(b - lw), y0: base - m.lh, lw, cauda: 'baixo', pena: pena + 60 });
  };
  const lateral = (lado) => {                    /* ao lado da cabeca */
    const livre = lado < 0 ? cab[0] - 10 - 6 : W - 6 - (cab[2] + 10); if (livre < 70) return;
    const n = Math.max(8, Math.min(19, Math.floor((livre - 12) / 7))), m = medeBalao(texto, n, opts.rotulo);
    const x0 = lado < 0 ? Math.round(cab[0] - 10 - m.lw) : Math.round(cab[2] + 10), y0 = Math.round(Math.max(58, Math.min(172 - m.lh, alvoY - 4)));
    cands.push({ m, x0, y0, lw: m.lw, cauda: lado < 0 ? 'dir' : 'esq', pena: 150 });
  };
  const rodape = (lado) => { const m = medeBalao(texto, 16, opts.rotulo), cabe = m.lw <= W - 256; const x0 = cabe ? Math.round(Math.max(128, Math.min(W - 128 - m.lw, alvoX - m.lw / 2))) : Math.round(Math.max(6, Math.min(W - 6 - m.lw, alvoX - m.lw / 2))); cands.push({ m, x0, y0: cabe ? H - 4 - m.lh : 172 - m.lh, lw: m.lw, cauda: null, pena: 600 }); };
  const faixaEstreita = (lado) => {              /* mesma faixa, texto mais estreito e mais alto (foge de texto grande no centro) */
    const m = medeBalao(texto, 14, opts.rotulo); if (88 - m.lh < 44) return;
    const a = lado < 0 ? 6 : W / 2 + 26, b = lado < 0 ? W / 2 - 26 : W - 6;
    cands.push({ m, x0: lado < 0 ? a : Math.round(b - m.lw), y0: 88 - m.lh, lw: m.lw, cauda: 'baixo', pena: (lado === ladoFala ? 0 : 400) + 90 });
  };
  const coluna = (lado) => {                     /* coluna estreita na borda da tela (foge da polaroide e de texto grande no centro) */
    const m = medeBalao(texto, 10, opts.rotulo); if (m.lh > 116) return;
    cands.push({ m, x0: lado < 0 ? 4 : Math.round(W - 4 - m.lw), y0: 58, lw: m.lw, cauda: lado < 0 ? 'dir' : 'esq', pena: (lado === ladoFala ? 0 : 400) + 200 });
  };
  if (l){
    /* pedido de 18/10: o balao acompanha o personagem. Candidatos presos a cabeca de quem fala: em cima dela (centrado ou
       puxado para o lado de fora da luta) e, se nao couber, ao lado dela; o resto da tela so como ultimo recurso */
    const fora = telaX(l.x) <= telaX(outro(l).x) ? -1 : 1, cxl = lw => x => Math.round(Math.max(4, Math.min(W - 4 - lw, x)));
    [[22, 0], [16, 35], [12, 70]].forEach(([n, p]) => { const m = medeBalao(texto, n, opts.rotulo), c = cxl(m.lw), y0 = Math.round(Math.max(40, cab[1] - 10 - m.lh));
      cands.push({ m, x0: c(alvoX - m.lw / 2), y0, lw: m.lw, cauda: 'baixo', pena: p });
      cands.push({ m, x0: c(fora < 0 ? alvoX - m.lw + 16 : alvoX - 16), y0, lw: m.lw, cauda: 'baixo', pena: p + 12 }); });
    const pesa = (fn, p) => { const i0 = cands.length; fn(); for (let i = i0; i < cands.length; i++) cands[i].pena = p + (cands[i].pena >= 400 ? 400 : 0); };
    pesa(() => lateral(fora), 140); pesa(() => lateral(-fora), 260);                  /* ao lado da cabeca: primeiro o lado de fora da luta */
    pesa(() => { faixa(ladoFala); coluna(ladoFala); rodape(ladoFala); }, 700);         /* lugares fixos da tela: ultimo recurso */
  } else { faixa(ladoFala); faixa(-ladoFala); faixaEstreita(ladoFala); coluna(ladoFala); coluna(-ladoFala); rodape(ladoFala); }
  cands.forEach((c, i) => { c.chave = i; });
  let melhor = null; const memo = opts.memo;
  for (const c of cands){
    const r = [c.x0 - 1, c.y0 - 1, c.x0 + c.lw + 1, c.y0 + c.m.lh + 7];
    let custo = c.pena + c.m.feio * 120 - (memo && memo.chave === c.chave ? 260 : 0);
    for (const k of corpos) custo += sobrepoe(r, k) * 3;
    for (const k of R) custo += sobrepoe(r, k) * (k[4] || 2);
    for (const k of BALOES) custo += sobrepoe(r, k) * 4;
    if (r[0] < 0 || r[2] > W || r[1] < 0 || r[3] > H) custo += 5000;
    if (!melhor || custo < melhor.custo) melhor = Object.assign({ custo, r }, c);
  }
  /* o balao desliza atras do personagem (sem saltar de um lugar para outro); troca de tamanho ou de lado da cauda entra direto */
  if (memo){
    if (memo.bx !== undefined && memo.bw === melhor.lw && memo.bh === melhor.m.lh && memo.cauda === melhor.cauda){ memo.bx += (melhor.x0 - memo.bx) * 0.3; memo.by += (melhor.y0 - memo.by) * 0.3; }
    else { memo.bx = melhor.x0; memo.by = melhor.y0; }
    memo.bw = melhor.lw; memo.bh = melhor.m.lh; memo.cauda = melhor.cauda; memo.chave = melhor.chave;
    melhor.x0 = Math.round(memo.bx); melhor.y0 = Math.round(memo.by); melhor.r = [melhor.x0 - 1, melhor.y0 - 1, melhor.x0 + melhor.lw + 1, melhor.y0 + melhor.m.lh + 7];
  }
  BALOES.push(melhor.r);
  desenhaBalao(melhor, alvoX, alvoY, opts.rotulo, l && !opts.semCauda);
}
function desenhaBalao(c, alvoX, alvoY, rotulo, comCauda){
  const { x0, y0, lw } = c, lh = c.m.lh;
  cx.fillStyle = INK; cx.fillRect(x0 - 1, y0 - 1, lw + 2, lh + 2); cx.fillStyle = CREME; cx.fillRect(x0, y0, lw, lh);
  if (comCauda && c.cauda === 'baixo'){ const tx = Math.round(Math.max(x0 + 6, Math.min(x0 + lw - 10, alvoX - 3))); cx.fillStyle = INK; cx.fillRect(tx - 1, y0 + lh, 8, 2); cx.fillRect(tx, y0 + lh + 2, 5, 2); cx.fillRect(tx + 1, y0 + lh + 4, 2, 2); cx.fillStyle = CREME; cx.fillRect(tx, y0 + lh - 1, 6, 2); cx.fillRect(tx + 1, y0 + lh + 1, 3, 2); }
  if (comCauda && (c.cauda === 'esq' || c.cauda === 'dir')){                /* cauda lateral apontando p/ a cabeca */
    const ty = Math.round(Math.max(y0 + 3, Math.min(y0 + lh - 9, alvoY - 3)));
    if (c.cauda === 'dir'){ const bx = x0 + lw; cx.fillStyle = INK; cx.fillRect(bx, ty - 1, 2, 8); cx.fillRect(bx + 2, ty, 2, 6); cx.fillRect(bx + 4, ty + 1, 2, 4); cx.fillRect(bx + 6, ty + 2, 1, 2); cx.fillStyle = CREME; cx.fillRect(bx - 1, ty, 3, 6); cx.fillRect(bx + 2, ty + 1, 2, 4); cx.fillRect(bx + 4, ty + 2, 1, 2); }
    else { const bx = x0; cx.fillStyle = INK; cx.fillRect(bx - 2, ty - 1, 2, 8); cx.fillRect(bx - 4, ty, 2, 6); cx.fillRect(bx - 6, ty + 1, 2, 4); cx.fillRect(bx - 7, ty + 2, 1, 2); cx.fillStyle = CREME; cx.fillRect(bx - 2, ty, 3, 6); cx.fillRect(bx - 4, ty + 1, 2, 4); cx.fillRect(bx - 5, ty + 2, 1, 2); }
  }
  let y = y0 + 5; if (rotulo){ txtL(rotulo, x0 + 6, y - 1, '#c9503c'); y += 9; }   /* nome de quem fala na letra do jogo (19/10: o miudo nao se lia no celular) */
  c.m.linhas.forEach((s, i) => txtL(s, x0 + 6, y + i * 10, INK));
}
/* balao simples da tela de VS (sobre os retratos) */
function balao(texto, cxb, baseY, cauda, rotulo, minY){
  const linhas = wrap(texto, 20), lw = Math.max(...linhas.map(s => larguraT(s))) + 12, lh = linhas.length * 10 + (rotulo ? 18 : 8);
  const x0 = Math.round(Math.max(4, Math.min(W - 4 - lw, cxb - lw / 2))), y0 = Math.round(Math.max(minY === undefined ? 40 : minY, baseY - lh - 6));
  cx.fillStyle = INK; cx.fillRect(x0 - 1, y0 - 1, lw + 2, lh + 2); cx.fillStyle = CREME; cx.fillRect(x0, y0, lw, lh);
  if (cauda !== null){ const tx = Math.round(Math.max(x0 + 6, Math.min(x0 + lw - 10, cauda))); cx.fillStyle = INK; cx.fillRect(tx - 1, y0 + lh, 8, 2); cx.fillRect(tx, y0 + lh + 2, 5, 2); cx.fillRect(tx + 1, y0 + lh + 4, 2, 2); cx.fillStyle = CREME; cx.fillRect(tx, y0 + lh - 1, 6, 2); cx.fillRect(tx + 1, y0 + lh + 1, 3, 2); }
  let y = y0 + 5; if (rotulo){ txtMini(rotulo, x0 + 6 + larguraT(rotulo) / 4, y, CORAL); y += 9; }
  linhas.forEach((s, i) => txtL(s, x0 + 6, y + i * 10, INK));
}
/* balao do VS abaixo do nome, com a ponta para cima (fala de quem esta em cima dele) */
function balaoAbaixo(texto, cxb, topo){
  const linhas = wrap(texto, 22), lw = Math.max(...linhas.map(s => larguraT(s))) + 12, lh = linhas.length * 10 + 8;
  const x0 = Math.round(Math.max(4, Math.min(W - 4 - lw, cxb - lw / 2))), y0 = Math.round(topo + 6);
  cx.fillStyle = INK; cx.fillRect(x0 - 1, y0 - 1, lw + 2, lh + 2); cx.fillStyle = CREME; cx.fillRect(x0, y0, lw, lh);
  const tx = Math.round(Math.max(x0 + 6, Math.min(x0 + lw - 10, cxb - 3)));
  cx.fillStyle = INK; cx.fillRect(tx - 1, y0 - 2, 8, 2); cx.fillRect(tx, y0 - 4, 6, 2); cx.fillRect(tx + 1, y0 - 6, 4, 2); cx.fillRect(tx + 2, y0 - 7, 2, 1);
  cx.fillStyle = CREME; cx.fillRect(tx, y0 - 1, 6, 2); cx.fillRect(tx + 1, y0 - 3, 4, 2); cx.fillRect(tx + 2, y0 - 5, 2, 2);
  linhas.forEach((s, i) => txtL(s, x0 + 6, y0 + 5 + i * 10, INK));
}
/* 19/10 (pedido: "os baloes ficam confusos na luta; o balao segue o personagem de forma suave, leitura facil"):
   cada fala tem UM lugar, em cima de quem fala, com o nome dele no balao e o mesmo tamanho do comeco ao fim (a quebra de linha
   e escolhida uma vez). O balao desliza atras do personagem, nao sobe junto com o pulo e nunca troca de lugar no meio da leitura.
   Com duas falas no ar (a fala e a resposta), elas se afastam para os lados; se nao couberem lado a lado, a mais antiga sai. */
function preparaFala(f){
  if (f.m) return; f.rot = f.l.C.nome; let m = null;
  for (const n of [18, 16, 20, 14]){ const mm = medeBalao(f.texto, n, f.rot); if (!m || mm.feio < m.feio) m = mm; if (!mm.feio) break; }
  f.m = m;
}
/* corpos na tela que nenhum balao pode cobrir: os dois lutadores e o figurante do momento (menino ou estagiario) */
function corposNaTela(){
  const c = [L1, L2].filter(o => o && (o.estado !== 'ko' || !o.noAr)).map(caixaLutador);
  const m = MOMENTO; if (m && m.tipo === 'sobrinho' && m.crianca){ const k = m.crianca, sl = HISTMAP[(k.quem === 'kid' ? 'kid_' : 'estag_') + 'aponta'];
    if (sl){ const z = CAMZ.z < 1.002 ? 1 : CAMZ.z, w = sl[2] * z, h = sl[3] * z, x = telaX(k.x), y = telaY(CHAO); c.push([x - w / 2 - 3, y - h - 4, x + w / 2 + 3, y]); } }
  return c;
}
/* 23/10 tarde (pedido: "em varios momentos os baloes se sobrepoem aos personagens"): antes o balao so ia para cima da cabeca e,
   sem espaco ate o HUD, ficava preso na altura minima, em cima do rosto; e ignorava a foto de cima e o figurante. Agora cada fala
   escolhe entre: em cima da cabeca, ao lado dela (primeiro o lado de fora da luta, com cauda lateral) e uma coluna estreita na borda
   da tela. Ganha o que menos cobre lutador, figurante, foto, painel, letreiro e o outro balao. O tipo escolhido fica (histerese). */
function alvoFala(f, postos){
  const l = f.l, cab = caixaLutador(l), pulo = Math.max(0, telaY(CHAO) - telaY(l.y)), topo = cab[1] + pulo, hx = telaX(l.x), hy = topo + 6;   /* 26/10 noite: sobe 65% do pulo (parado, a cabeca entrava no balao) */
  const yMin = LUTA.fase === 'momento' ? 26 : 40, x0m = 4 + MARGEM, x1m = W - 4 - MARGEM, fora = hx <= telaX(outro(l).x) ? -1 : 1;
  const prende = lw => x => Math.round(Math.max(x0m, Math.min(x1m - lw, x)));
  const mede = n => medeBalao(f.texto, n, f.rot), cands = [];
  { const m = f.m, c = prende(m.lw), y = Math.round(topo - 12 - m.lh);
    cands.push({ tipo: 'cima', m, x: c(hx - m.lw / 2), y, cauda: 'baixo', pena: 0 });
    cands.push({ tipo: 'cimaFora', m, x: c(fora < 0 ? hx - m.lw + 16 : hx - 16), y, cauda: 'baixo', pena: 14 });
    cands.push({ tipo: 'cimaDentro', m, x: c(fora < 0 ? hx - 16 : hx - m.lw + 16), y, cauda: 'baixo', pena: 24 });   /* 26/10 noite: para dentro, quando o nome do placar esta em cima do lado de fora */
    cands.push({ tipo: 'cimaPreso', m, x: c(hx - m.lw / 2), y: Math.max(yMin, y), cauda: 'baixo', pena: 40 }); }
  for (const [n, p] of [[26, 10], [34, 22], [44, 34]]){                /* mais largo e mais baixo: cabe entre o HUD e a cabeca (44 = uma linha so, para os mais altos) */
    const m = mede(n); if (m.lw > x1m - x0m) continue; const c = prende(m.lw), y = Math.round(topo - 9 - m.lh);
    cands.push({ tipo: 'cimaLargo' + n, m, x: c(hx - m.lw / 2), y, cauda: 'baixo', pena: p }); }
  /* ao lado da cabeca: a largura para antes dos controles de toque e a altura fica abaixo da faixa do HUD */
  const zs = (typeof ZONAS_TOQUE !== 'undefined' ? ZONAS_TOQUE : []).filter(z => z[1] < 150), limE = Math.max(x0m, ...zs.filter(z => z[2] < W / 2).map(z => z[2] + 3)), limD = Math.min(x1m, ...zs.filter(z => z[0] > W / 2).map(z => z[0] - 3));
  const yLado = LUTA.fase === 'momento' ? yMin : 56;
  const corrida = LUTA.fase === 'luta';                              /* 26/10: na luta corrida o lado de dentro e para onde o adversario anda: so o de fora */
  for (const [lado, p] of corrida ? [[fora, 30]] : [[fora, 30], [-fora, 90]]){
    const livre = lado < 0 ? cab[0] - 9 - limE : limD - (cab[2] + 9); if (livre < 100) continue;   /* 26/10: no minimo ~11 letras por linha (coluna de 8 virava 6 linhas com palavra solta) */
    const m = mede(Math.max(11, Math.min(18, Math.floor((livre - 12) / 8)))), x = lado < 0 ? Math.round(cab[0] - 9 - m.lw) : Math.round(cab[2] + 9);
    cands.push({ tipo: 'lado' + lado, m, x, y: Math.round(Math.max(yLado, Math.min(H - 8 - m.lh, topo - 4))), cauda: lado < 0 ? 'dir' : 'esq', pena: p });
  }
  /* 26/10 noite (pedido: "os baloes sempre seguem os personagens"): saiu a coluna fixa na borda da tela, que deixava o balao longe de quem fala */
  for (const [lado, p] of []){
    const m = mede(12); cands.push({ tipo: 'borda' + lado, m, x: lado < 0 ? x0m : Math.round(x1m - m.lw), y: Math.round(Math.max(yMin, Math.min(H - 8 - m.lh, topo - 4))), cauda: lado < 0 ? 'dir' : 'esq', pena: p });
  }
  const R = reservas(), corpos = corposNaTela(); let melhor = null, travado = null;
  const longe = r => { const dx = Math.max(r[0] - hx, 0, hx - r[2]), dy = Math.max(r[1] - (topo + 10), 0, (topo + 10) - r[3]); return Math.hypot(dx, dy); };   /* da cabeca ate a borda mais perto do balao */
  for (const c of cands){
    const r = [c.x - 1, c.y - 1, c.x + c.m.lw + 1, c.y + c.m.lh + 7];
    if (f.tipo === c.tipo){ const area = (r[2] - r[0]) * (r[3] - r[1]), cobre = corpos.reduce((s, k) => s + sobrepoe(r, k), 0) / area;   /* o tipo nasce com a fala e fica: */
      const tampa = R.filter(k => (k[4] || 0) >= 6).reduce((s, k) => s + sobrepoe(r, k), 0) / area;                                          /* so muda se passar a cobrir alguem, */
      if (cobre < (corrida ? 0.1 : 0.3) && tampa < 0.12 && longe(r) < 30 && r[0] >= 0 && r[2] <= W) travado = Object.assign({ custo: 0, r }, c); }          /* um controle ou o HUD */
    let custo = c.pena + c.m.feio * 120 + Math.max(0, longe(r) - 22) * 40;   /* longe de quem fala custa mais que encostar em alguem */
    if (c.y < yMin) custo += (yMin - c.y) * 60;
    for (const k of corpos) custo += sobrepoe(r, k) * 3;
    for (const k of R) custo += sobrepoe(r, k) * (k[4] === 3 ? 0.8 : (k[4] || 2));   /* placa do cenario (peso 3) pesa menos que personagem */
    for (const o of OCUPADO_ANT) if ((o[4] || 0) >= 5) custo += sobrepoe(r, o) * 5;
    for (const k of postos) custo += sobrepoe(r, k) * 6;
    if (r[0] < 0 || r[2] > W || r[1] < 0 || r[3] > H) custo += 5000;
    if (window.DBG_BALAO) (f.dbg = f.dbg && f.dbgT === FRAME ? f.dbg : (f.dbgT = FRAME, [])).push([c.tipo, Math.round(custo), r.map(Math.round)]);   /* QA: custo de cada lugar */
    if (!melhor || custo < melhor.custo) melhor = Object.assign({ custo, r }, c);
  }
  if (travado) melhor = travado; f.tipo = melhor.tipo;
  return { x: melhor.x, y: melhor.y, hx, hy, lw: melhor.m.lw, lh: melhor.m.lh, m: melhor.m, cauda: melhor.cauda, r: melhor.r };
}
function drawFalas(){
  BALOES = [];
  if (HIPER || FATAL || LUTA.fase === 'finaliza' || (LUTA.faixaT > 0 && LUTA.fase === 'luta')) return;   /* pausadas: passoFalas tambem nao anda nessas fases */
  const alfa = f => Math.min(1, (f.t + 1) / 5, (f.dur - f.t) / 8);
  const vivas = FALAS.filter(f => alfa(f) > 0.03), comL = vivas.filter(f => f.l);
  const postos = []; for (const f of comL){ preparaFala(f); f.alvo = alvoFala(f, postos); postos.push(f.alvo.r); }
  if (comL.length >= 2){
    const [A, B] = comL.slice(-2).map(f => f.alvo), velha = comL[comL.length - 2];
    const sobre = () => A.x < B.x + B.lw + 6 && B.x < A.x + A.lw + 6 && A.y < B.y + B.lh + 10 && B.y < A.y + A.lh + 10;
    if (sobre()){
      const e = A.hx <= B.hx ? A : B, d = e === A ? B : A, falta = e.x + e.lw + 6 - d.x;
      if (falta > 0){ e.x = Math.max(4 + MARGEM, e.x - falta / 2); d.x = Math.min(W - 4 - MARGEM - d.lw, e.x + e.lw + 6); e.x = Math.max(4 + MARGEM, Math.min(e.x, d.x - 6 - e.lw)); }
      if (sobre() && !velha.saindo){ velha.dur = Math.min(velha.dur, velha.t + 10); velha.saindo = true; }   /* nao cabem lado a lado: a mais antiga sai */
    }
  }
  for (const f of vivas){
    cx.save(); cx.globalAlpha = alfa(f);
    if (f.l){
      const A = f.alvo;
      if (f.bx === undefined){ f.bx = A.x; f.by = A.y; } else { f.bx += (A.x - f.bx) * 0.26; f.by += (A.y - f.by) * 0.26; }   /* segue suave e colado (26/10 noite: 0,16 -> 0,26) */
      if (f.bx === undefined){ f.mb = A.m; f.bx = A.x; f.by = A.y; }
      const c = { x0: Math.round(f.bx), y0: Math.round(f.by), lw: A.lw, m: A.m, cauda: A.cauda };
      BALOES.push([c.x0 - 1, c.y0 - 1, c.x0 + c.lw + 1, c.y0 + c.m.lh + 7]); desenhaBalao(c, A.hx, A.hy + 4, f.rot, true);
    } else falaLivre(null, f.texto, { lado: f.lado, rotulo: f.rotulo, memo: f });
    cx.restore();
  }
}

/* ---------------- conversa antes da luta (VS) ---------------- */
const PRE_LUTA = {
  'carlos|tonho':  [['tonho', 'NUNCA ACHEI UM FIO NO TRAVESSEIRO.'], ['carlos', 'EU JA ACHEI. POR ISSO COMECEI A CUIDAR.']],
  'carlos|peruca': [['peruca', 'CALVO EU? CABELO NATURAL, JURO.'], ['carlos', 'ESCONDER NAO ADIANTA. EU ASSUMI E CUIDO.']],
  'carlos|beto':   [['beto', 'UM SPRAY COBRE A FALHA.'], ['carlos', 'ATE A PRIMEIRA CHUVA.']],
  'edson|tonho':   [['edson', 'TOPETE ALTO ASSIM ESCONDE ENTRADA.'], ['tonho', 'AQUI NAO TEM ENTRADA NENHUMA!']],
  'edson|peruca':  [['edson', 'ESSA PERUCA EU NAO CORTO. EU TIRO.'], ['peruca', 'NAO TIRA! A CALVICIE APARECE!']],
  'edson|beto':    [['edson', 'NA MINHA CADEIRA, TINTA NA FALHA NAO.'], ['beto', 'SO UM RETOQUE NA FALHA, SEU EDSON!']],
  'fabio|tonho':   [['tonho', 'LIGA A CAMERA, FABIO.'], ['fabio', 'NAO. MINHA CALVICIE NAO ENTRA NA CALL.']],
  'fabio|peruca':  [['fabio', 'ESSE CABELO AI E PERUCA?'], ['peruca', 'DE FABRICA! QUER DIZER... NATURAL!']],
  'fabio|beto':    [['beto', 'NA CALL NINGUEM VE A FALHA.'], ['fabio', 'POR ISSO EU NUNCA LIGO A CAMERA.']]
};
/* a conversa muda quando a fala original so faz sentido no cenario do outro */
const PRE_LUTA_LUGAR = {
  'edson|beto|banca':  [['edson', 'TINTA NA FALHA? PASSA A MAQUINA ZERO!'], ['beto', 'NAO! SO UM RETOQUE NA FALHA.']],
  'fabio|tonho|salao': [['tonho', 'BORA UMA SELFIE DE CIMA, FABIO?'], ['fabio', 'DE CIMA NAO. APARECE A CALVICIE.']]
};
function conversa(a, b){
  const calvo = CHARS[a].time === 'calvo' ? a : b, cab = calvo === a ? b : a;
  const c = PRE_LUTA_LUGAR[calvo + '|' + cab + '|' + LUTA.cenario] || PRE_LUTA[calvo + '|' + cab] || null;
  return c ? c.map(([id, s]) => [id, s]) : null;
}

/* ---------------- falas por situacao ---------------- */
const REACAO = {
  ventania: { carlos:'AS ENTRADAS EU NAO ESCONDO MAIS.', edson:'VENTO NAO DESPENTEIA CARECA.', fabio:'NAO! O VENTO VAI MOSTRAR A CALVICIE!', tonho:'MEU TOPETE!', peruca:'SEGURA, PERUCA!', beto:'ESCORREU A TINTA DA FALHA!' },
  espelho:  { carlos:'EU JA VI A FALHA. E JA TO CUIDANDO.', edson:'ESSA CARECA EU MOSTRO TODO DIA.', fabio:'NAO PRECISAVA MOSTRAR A CALVICIE.', tonho:'AGORA MOSTRA O MEU TOPETE!', peruca:'NAO VIRA! ATRAS APARECE A CALVICIE!', beto:'NAO VIRA! ATRAS A FALHA TA SEM TINTA!' },
  foto:     { carlos:'DE CIMA A FALHA APARECE. DA PRA CUIDAR.', edson:'CARECA SAI BEM EM QUALQUER ANGULO.', fabio:'APAGA! DA PRA VER A CALVICIE!', tonho:'MANDA NO GRUPO!', peruca:'NAO POSTA! DE CIMA APARECE A CALVICIE!', beto:'DE CIMA DA PRA VER A FALHA PINTADA!' },
  sobrinho: { carlos:'TA RAREANDO. E TA SENDO CUIDADO.', edson:'TIREI TUDO NA MAQUINA, MEU FILHO.', fabio:'CALVICIE NAO E PAUTA DA REUNIAO.', tonho:'O MEU TA AQUI, OLHA!', peruca:'NAO OLHA PRA MIM! O MEU E NATURAL!', beto:'O MEU TA AQUI. EM SPRAY.' },
  roda:     { carlos:'TO PERDENDO SIM. E JA TO CUIDANDO.', edson:'EU JA PERDI TUDO. E RASPEI O RESTO.', fabio:'CALVICIE NAO, MUDA A PAUTA!', tonho:'O MEU TA TODO AQUI.', peruca:'EU NAO! AQUI E TUDO NATURAL!', beto:'NINGUEM REPAROU NA FALHA, NE?' },
  /* momentos com close-up (19/10): so quem aparece no close fala, em letreiro grande; a chuva ainda nao tem fala aprovada */
  telao:    { carlos:'PODE DAR ZOOM. EU JA CUIDO.', edson:'ESSE BRILHO E DE FABRICA.', fabio:'TIRA A CAMERA DA MINHA COROA!', beto:'A TINTA ESCORREU AO VIVO?', peruca:'ESSE ANGULO NAO!' },
  chuva:    {}
};
/* quebra das falas no letreiro do close-up (sem viuva e sem conectora no fim da linha) */
const CLOSE_QUEBRA = { 'PODE DAR ZOOM. EU JA CUIDO.':'PODE DAR ZOOM.|EU JA CUIDO.', 'ESSE BRILHO E DE FABRICA.':'ESSE BRILHO|E DE FABRICA.',
  'TIRA A CAMERA DA MINHA COROA!':'TIRA A CAMERA|DA MINHA COROA!', 'A TINTA ESCORREU AO VIVO?':'A TINTA|ESCORREU|AO VIVO?', 'ESSE ANGULO NAO!':'ESSE|ANGULO NAO!' };
/* ajustes por cenario, p/ a fala casar com o lugar */
function reacao(tipo, id, st){
  if (tipo === 'ventania' && id === 'fabio' && st === 'escritorio') return 'QUEM LIGOU O AR? VAI MOSTRAR A CALVICIE!';
  return REACAO[tipo][id];
}
const MEIA_VIDA = { carlos:'ISSO AI? JA PERDI MAIS FIO NO RALO.', edson:'ISSO AI E CAFUNE NA CARECA.', fabio:'NAO NA FALHA DO TOPO!', tonho:'NAO NO CABELO!', peruca:'OPA! QUASE SOLTOU... O CABELO!', beto:'BORROU! APARECEU A FALHA!' };
const FORA = { rua:true, banca:true };
const ESPELHINHO = { barbearia:'DA BARBEARIA', salao:'DO SALAO', fantasias:'DO PROVADOR' };   /* onde tem espelhinho de mao (a loja de fantasias tem provador) */
function textoMomento(tipo, st){
  const fora = !!FORA[st];
  if (tipo === 'ventania'){
    const nome = { rua:'VENTANIA', banca:'VENTANIA', barbearia:'VENTILADOR NO MAXIMO', escritorio:'AR-CONDICIONADO', salao:'SECADORES NO MAXIMO', fantasias:'PORTA ABERTA' }[st] || 'VENTANIA';
    const cap = { rua:'O ONIBUS PASSOU E O VENTO EXPOS AS FALHAS.', banca:'A VENTANIA DA ESQUINA DESMANCHOU TODO DISFARCE DE CALVICIE.', barbearia:'SEU EDSON LIGOU O VENTILADOR NO MAXIMO. NENHUMA ENTRADA ESCAPOU.', escritorio:'O AR-CONDICIONADO DISPAROU. NENHUM DISFARCE DE CALVICIE AGUENTOU.', salao:'ALGUEM LIGOU TODOS OS SECADORES. AS ENTRADAS APARECERAM.', fantasias:'A PORTA ABRIU E O VENTO MOSTROU AS FALHAS.' }[st];
    return { nome, cap };
  }
  if (tipo === 'telao') return { nome:'CAMERA DO TELAO', cap:'A CAMERA DO TELAO DEU ZOOM AO VIVO NA CALVICIE.' };
  if (tipo === 'chuva') return { nome:'CHUVA DE VERAO', cap:'CAIU A CHUVA DE VERAO. NENHUM DISFARCE DE CALVICIE AGUENTA AGUA.' };   /* so na rua e na banca */
  if (tipo === 'espelho') return { nome:'ESPELHINHO', cap:'O ESPELHINHO ' + (ESPELHINHO[st] || 'DA BARBEARIA') + ' MOSTROU A FALHA NO TOPO QUE SO OS OUTROS VIAM.' };   /* so sai onde tem espelhinho */
  if (tipo === 'foto'){
    const onde = { rua:'NO BANCO', banca:'NA BANCA', escritorio:'NA MESA', salao:'NA CADEIRA', barbearia:'NA CADEIRA', fantasias:'NO BALCAO' }[st] || 'NA CADEIRA';
    return { nome:'FOTO DE CIMA', cap:'ALGUEM SUBIU ' + onde + ' E TIROU A FOTO DE CIMA. A CALVICIE APARECEU.' };
  }
  if (tipo === 'sobrinho'){
    if (st === 'escritorio') return { nome:'ESTAGIARIO SINCERO', cap:'PERGUNTOU TAO ALTO QUE O ANDAR INTEIRO OUVIU.', rotulo:'ESTAGIARIO:', voz:'CHEFE, CADE SEU CABELO?' };
    const quem = { rua:'A RUA INTEIRA', banca:'A ESQUINA INTEIRA', barbearia:'A BARBEARIA INTEIRA', salao:'O SALAO INTEIRO', fantasias:'A LOJA INTEIRA' }[st] || 'O BAIRRO INTEIRO';
    return { nome:'SOBRINHO SINCERO', cap:'GRITOU TAO ALTO QUE ' + quem + ' OUVIU.', rotulo:'SOBRINHO:', voz:'TIO, CADE SEU CABELO?' };
  }
  const roda = { rua:'PAPO DE CALCADA', banca:'PAPO DE BANCA', escritorio:'PAPO DO CAFEZINHO', barbearia:'PAPO DA ESPERA', salao:'PAPO DA ESPERA', fantasias:'PAPO DE BALCAO' }[st] || 'PAPO DO BAIRRO';
  const lugar = { rua:'DO BAIRRO', banca:'DO BAIRRO', escritorio:'DO ESCRITORIO', barbearia:'DA BARBEARIA', salao:'DO SALAO', fantasias:'DA LOJA' }[st] || 'DO BAIRRO';
  return { nome: roda, cap:'A PERGUNTA QUE NINGUEM QUER OUVIR.', rotulo:'O PESSOAL:', voz:'QUEM AQUI TA PERDENDO CABELO?' };
}
/* ---------------- fotos de cima ilustradas: uma por confronto calvo x cabeludo EM CADA CENARIO possivel
   (o do calvo e o do cabeludo), para o chao da foto ser o chao da luta. Na arte o calvo fica a esquerda;
   se na cena ele estiver a direita, a foto sai espelhada. ---------------- */
const FOTOS = {};
function chaveFoto(a, b, st){
  const ca = CHARS[a].time === 'calvo', cb = CHARS[b].time === 'calvo'; if (ca === cb) return null;
  const calvo = ca ? a : b, cab = ca ? b : a;
  if (st !== CHARS[calvo].stage && st !== CHARS[cab].stage) return null;
  return calvo + '_' + cab + '_' + st;
}
function carregaFoto(a, b, st){
  const k = chaveFoto(a, b, st); if (!k || FOTOS[k] !== undefined) return;
  FOTOS[k] = null; const im = new Image(); im.onload = () => { FOTOS[k] = im; }; im.onerror = () => {}; im.src = BASE_ARQ + 'fotos/' + k + '.png?v=/*VSHEET*/4285/*/VSHEET*/';
}

/* ---------------- MOMENTO COROA ---------------- */
let MOMENTO = null;
function sorteiaMomentos(){
  /* dupla do mesmo time (so no 2 jogadores) nao tem foto de cima ilustrada: a foto fica no baralho e sai outro momento */
  const semFoto = !chaveFoto(L1.id, L2.id, LUTA.cenario);
  const serve = x => !(semFoto && x === 'foto') && !(x === 'espelho' && !ESPELHINHO[LUTA.cenario]) && x !== 'luz'
    && !(x === 'chuva' && !FORA[LUTA.cenario]) && !(CLOSE_EST[x] && !alvoClose());   /* close-up so com alguem que tenha a ilustracao */
  if (!LUTA.baralho || new Set(LUTA.baralho.filter(serve)).size < 2){
    const pool = ['ventania', 'espelho', 'foto', 'sobrinho', 'roda', 'telao', 'chuva'];
    for (let i = pool.length - 1; i > 0; i--){ const j = (Math.random() * (i + 1)) | 0; [pool[i], pool[j]] = [pool[j], pool[i]]; }
    LUTA.baralho = (LUTA.baralho || []).concat(pool);
  }
  const pega = [];
  for (let i = 0; i < LUTA.baralho.length && pega.length < 1;){   /* um momento por luta, antes do LUTA! */ const x = LUTA.baralho[i]; if (!serve(x) || pega.includes(x)){ i++; continue; } pega.push(LUTA.baralho.splice(i, 1)[0]); }
  LUTA.momentos = pega; LUTA.momentoIdx = 0; LUTA.meiaVida = {}; LUTA.desdeMomento = 0;
  const a = CLOSE_EST[pega[0]] && alvoClose(); if (a) carregaClose(a.id + '_' + pega[0]);   /* a ilustracao chega antes do momento */
}
/* quem aparece no close-up do telao e da chuva: quem esconde a calvicie (Beto, Ze Peruca); sem eles, o calvo da luta */
const ESCONDE = { peruca:true, beto:true };
function alvoClose(){
  const ls = [L1, L2].filter(l => l);
  return ls.find(l => ESCONDE[l.id]) || ls.find(l => CHARS[l.id] && CHARS[l.id].time === 'calvo') || null;
}
function checaMomento(){
  if (MOMENTO || HIPER || FATAL || LUTA.ko || !LUTA.momentos) return;
  const i = LUTA.momentoIdx; LUTA.desdeMomento = (LUTA.desdeMomento || 0) + 1;
  const baixa = L1.vida < L1.vidaMax * 0.6 || L2.vida < L2.vidaMax * 0.6;
  const hora = i === 0 ? LUTA.timer <= TEMPO_LUTA - 4 : (LUTA.desdeMomento > 100 && (baixa || LUTA.timer <= TEMPO_LUTA - 24));   /* 26/10: pelo relogio de 60 s */
  if (i < 2 && i < LUTA.momentos.length && hora){
    LUTA.querMomento = (LUTA.querMomento || 0) + 1;
    const neutro = L1.estado !== 'attack' && L2.estado !== 'attack' && L1.estado !== 'hit' && L2.estado !== 'hit' && !L1.noAr && !L2.noAr;
    if ((neutro && !falasPendentes() && !LUTA.faixaT && !(ITEM && ITEM.y < CHAO - 6)) || LUTA.querMomento > 240){ LUTA.querMomento = 0; LUTA.momentoIdx++; iniciaMomento(LUTA.momentos[i]); }
  }
  /* vida abaixo da metade: fala curta, uma vez por lutador */
  for (const l of [L1, L2]) if (!LUTA.meiaVida[l.id + (l === L1 ? 1 : 2)] && l.vida > 0 && l.vida < l.vidaMax * 0.4 && !l.noAr && l.estado !== 'hit' && l.estado !== 'ko' && !LUTA.faixaT){ LUTA.meiaVida[l.id + (l === L1 ? 1 : 2)] = true; falar(l, MEIA_VIDA[l.id], 100); }
}
function iniciaMomento(tipo){
  const tx = textoMomento(tipo, LUTA.cenario);
  MOMENTO = { tipo, t:0, nome: tx.nome, cap: tx.cap, rotulo: tx.rotulo, voz: tx.voz };
  const m = MOMENTO;
  /* 19/10 (revisao das falas): quem e o alvo da situacao (o calvo da luta) responde primeiro; o outro comenta depois */
  const calvos = [L1, L2].filter(l => l.C.time === 'calvo'); m.pa = calvos.length === 1 ? calvos[0] : L2; m.pb = m.pa === L1 ? L2 : L1;
  /* telao e chuva: o close-up de quem esconde (ou do calvo) e a fala dele em letreiro; a fala fica tambem no painel de baixo */
  const a = CLOSE_EST[tipo] && alvoClose();
  if (a){ m.pa = a; m.pb = outro(a); m.close = { nome: a.id + '_' + tipo, t0: MOM_TIT + 6, fala: REACAO[tipo][a.id] || null }; carregaClose(m.close.nome);
    if (m.close.fala){ m.rotulo = a.C.nome + ':'; m.voz = m.close.fala; } }
  /* linha do tempo pelo tempo de leitura: a legenda (e a voz de fora) primeiro, depois o rival reage e o jogador responde;
     a legenda fica no topo ate o fim e cada balao fica ate ser lido */
  const linhas = wrap(tx.cap, 44);
  m.topo = 20; m.altLeg = 10 + linhas.length * 10 + (m.voz ? 12 : 0);
  /* 26/10 (pedido: "encurte o tempo automatico"): leitura mais rapida no momento (~18 letras por segundo) e as falas entram enquanto a legenda
     ainda esta na tela (antes era uma depois da outra, 6 a 12 s no total); um toque segue pulando logo depois do titulo */
  const leM = s => Math.max(45, Math.round(60 * (0.4 + String(s || '').length / 18)));
  m.capFim = MOM_TIT + 2 + leM(tx.cap + (m.voz ? ' ' + m.rotulo + ' ' + m.voz : ''));   /* a legenda so entra depois do cartao de titulo */
  if (tipo === 'foto') m.flash = Math.max(90, m.capFim - 10);
  if (m.close){ m.f1 = m.f2 = null; m.t1 = m.t2 = -1; m.fim = Math.max(m.capFim + 10, m.close.t0 + CLOSE_DUR + 6); }   /* sem baloes: a fala esta no close */
  else {
    m.f1 = reacao(tipo, m.pa.id, LUTA.cenario); m.f2 = reacao(tipo, m.pb.id, LUTA.cenario);
    m.d1 = leM(m.f1); m.d2 = leM(m.f2);
    m.t1 = tipo === 'foto' ? Math.max(m.flash + 20, Math.round(m.capFim * 0.7)) : MOM_TIT + 14 + Math.round((m.capFim - MOM_TIT) * 0.45);
    m.t2 = m.t1 + Math.round(m.d1 * 0.65); m.fim = Math.max(m.capFim + 6, m.t2 + m.d2);
  }
  LUTA.fase = 'momento'; LUTA.t = 0; PROJS = []; encerraFalas(8); LUTA.faixaT = 0;
  for (const l of [L1, L2]){ l.vx = 0; l.vy = 0; l.y = CHAO; l.noAr = false; l.golpe = null; l.estado = 'idle'; l.t = 0; l.poseMomento = null; l.trail.length = 0; l.sug = null; l.hitT = 0; l.pousouT = 0; }   /* sem clarao de golpe nem agachada de pouso presos na pausa */
  const c = STAGE_W / 2, lado = L1.x <= L2.x ? 1 : -1;
  MOMENTO.alvo = [c - lado * 78, c + lado * 78];                 /* os dois caminham ate o centro da cena */
  L1.face = lado; L2.face = -lado;
  SFX.ok(); zoomPara(1.06, c - CAM, CHAO - 70, 160); musica(null);
}
function fimMomento(){
  const m = MOMENTO; if (!m) return; MOMENTO = null; LUTA.fase = m.pre ? 'intro' : 'luta'; LUTA.t = 0; encerraFalas(8); FOTO = null; LUTA.desdeMomento = 0;   /* momento de abertura: depois dele vem o LUTA! */
  for (const l of [L1, L2]){ l.poseMomento = null; l.estado = 'idle'; l.t = 0; }
  /* consequencias leves */
  /* no momento de abertura o aviso da consequencia espera o LUTA! sair da tela (senao cai em cima do letreiro) */
  const avisa = (l, tx, cor) => { if (m.pre) (LUTA.popsAdiados = LUTA.popsAdiados || []).push([l, tx, cor]); else pop(l, tx, cor); };
  if (m.tipo === 'ventania') for (const l of [L1, L2]){ if (l.id === 'peruca' || l.id === 'beto'){ l.vida = Math.max(1, l.vida - 4); avisa(l, l.id === 'peruca' ? 'A PERUCA VOOU!' : 'O SPRAY ESCORREU!', AMARELO); } else if (l.C.time === 'calvo') l.hiper = Math.min(100, l.hiper + 12); }
  CAMZ.hold = 0; if (!m.pre) musica(LUTA.musica);
}
function passoMomento(){
  const m = MOMENTO; if (!m) return; m.t++;
  const t = m.t, [pa, pb] = [m.pa || L2, m.pb || L1];              /* o alvo da situacao (o calvo) reage primeiro, depois o outro */
  if (m.alvo && t <= 24){                          /* caminhada curta ate o centro */
    [L1, L2].forEach((l, i) => { const dx = m.alvo[i] - l.x;
      if (Math.abs(dx) > 0.5){ l.x += Math.sign(dx) * Math.min(8, Math.abs(dx), Math.max(2, Math.abs(dx) / 5)); l.poseMomento = 'walk'; }
      else if (l.poseMomento === 'walk') l.poseMomento = null; });
    if (t === 24) for (const l of [L1, L2]) if (l.poseMomento === 'walk') l.poseMomento = null;
  }
  if (m.tipo === 'ventania'){
    for (const l of [L1, L2]){
      if (t > 20 && t < 150){
        l.x += Math.sin(t * 0.3) * 0.6 - 0.25;
        if (l.id === 'peruca') l.poseMomento = 'special'; else if (l.id === 'tonho' || l.id === 'beto') l.poseMomento = (t >> 3) & 1 ? 'hit' : 'block'; else l.poseMomento = 'block';
      }
    }
    if (t % 3 === 0) FX.push({ tipo:'rajada', x: CAM + W + 10, y: 50 + Math.random() * 140, vx: -7 - Math.random() * 4, t:0, dur: 70, larg: 12 + Math.random() * 30 });
    if (t % 9 === 0) FX.push({ tipo:'folha', x: CAM + W + 10, y: 60 + Math.random() * 120, vx: -4 - Math.random() * 3, vy: Math.sin(t) * 0.8, t:0, dur: 120, cor: ['#7c9a5c', '#bb9b6a', '#a6b878'][(Math.random() * 3) | 0] });
    if (t === 40) for (const l of [L1, L2]) if (l.id === 'peruca') FX.push({ tipo:'peruca_voo', x: l.x, y: l.y - 110 * l.C.ev, t:0, dur: 70, rot: 0, vx: -4, vy: -1.5 });
    if (t % 6 === 0) for (const l of [L1, L2]) if (l.id === 'beto' && t > 30 && t < 140) FX.push({ tipo:'gota', x: l.x + (Math.random() * 16 - 8), y: l.y - 108 * l.C.ev, vy: 0.3, t:0, dur: 40 });
    if (t % 20 === 0) SFX.whoosh();
  } else if (m.tipo === 'espelho'){
    /* o espelhinho aparece atras da cabeca do calvo (barbearia e salao); a coroa brilha; quem esconde se protege */
    if (!m.alvoEsp) m.alvoEsp = [L1, L2].find(l => l.C.time === 'calvo') || L2;
    /* quem gosta do que ve (Seu Edson, Tonho) posa; quem esconde (Fabio, Ze Peruca, Beto) se protege; o Carlos, que ja cuida, fica tranquilo */
    for (const l of [L1, L2]) if (t > 26) l.poseMomento = (l.id === 'edson' || l.id === 'tonho') ? 'win' : (l.id === 'carlos' ? null : 'block');
    if (t === 30) SFX.brilho();
    const a = m.alvoEsp; if (t > 30 && t % 12 === 0) fx('estrela', a.x - a.face * 7 * a.C.ev + (Math.random() * 6 - 3), topoCabeca(a) + 3, { dur: 24, vy: -0.2, cor: '#ffffff' });   /* brilho na coroa */
  } else if (m.tipo === 'foto'){
    if (t === m.flash - 60 || t === m.flash - 40 || t === m.flash - 20) SFX.timer();
    if (t === m.flash){
      FLASH = 12; SFX.flash(); const k = chaveFoto(L1.id, L2.id, LUTA.cenario);
      const calvoL = CHARS[L1.id].time === 'calvo' ? L1 : L2, cabL = calvoL === L1 ? L2 : L1;
      if (k && FOTOS[k]) FOTO = { img: FOTOS[k], arte: true, t: 0, espelho: calvoL.x > cabL.x };
      else { const mx = Math.max(0, Math.min(W - 240, Math.round((L1.x + L2.x) / 2 - CAM - 120))); FOTO = { x: mx, y: 50, w: 240, h: 150 }; const s = document.createElement('canvas'); s.width = 240; s.height = 150; s.getContext('2d').drawImage(cv, mx, 50, 240, 150, 0, 0, 240, 150); FOTO.img = s; FOTO.t = 0; }
    }
    /* quem posa (Tonho, Seu Edson e o Carlos, que ja cuida) x quem se defende da camera (Fabio, Ze Peruca, Beto): igual a foto */
    for (const l of [L1, L2]) if (t > m.flash - 50 && t < m.flash) l.poseMomento = (l.id === 'tonho' || l.id === 'edson' || l.id === 'carlos') ? 'win' : 'block';
  } else if (m.tipo === 'sobrinho'){
    /* o sobrinho (no escritorio, o estagiario) entra correndo, aponta e ri do calvo, e sai correndo no fim */
    if (!m.crianca){ const alvo = [L1, L2].find(l => l.C.time === 'calvo' && outro(l).C.time !== 'calvo') || [L1, L2].find(l => l.C.time === 'calvo') || L2;
      const lado = (alvo.x - CAM) < W / 2 ? -1 : 1; m.crianca = { quem: LUTA.cenario === 'escritorio' ? 'estag' : 'kid', alvo, lado, x: lado < 0 ? CAM - 30 : CAM + W + 30, pose: 'corre', face: -lado }; }
    const c = m.crianca, destino = c.alvo.x + c.lado * (c.quem === 'kid' ? 56 : 68);
    if (t < m.fim - 26){ const dx = destino - c.x; if (Math.abs(dx) > 1){ c.x += Math.sign(dx) * Math.min(5, Math.abs(dx)); c.pose = 'corre'; c.face = Math.sign(dx); }
      else { if (!c.chegou){ c.chegou = t; SFX.risada(); } const k = (t - c.chegou) % 60; c.pose = k < 36 ? 'aponta' : 'ri'; c.face = -c.lado; } }   /* aponta, depois se dobra de rir */
    else { c.x += c.lado * 6; c.pose = 'corre'; c.face = c.lado; }
    if (t === 24) SFX.blip();                       /* a voz aparece no painel de baixo */
    if (c.chegou && t === Math.max(c.chegou + 4, MOM_TIT + 6) + 10) SHAKE = Math.max(SHAKE, 5);   /* a pergunta bate na tela no close-up */
    for (const l of [L1, L2]) if (t > 30 && t < 80) l.poseMomento = 'idle';
    if (t > 34 && t < m.fim - 26 && c.alvo.id === 'fabio') c.alvo.poseMomento = 'block';   /* o Fabio se encolhe; Carlos e Seu Edson respondem de cabeca erguida */
  } else if (m.close){
    /* telao e chuva: quem esta no close se protege (quem esconde, o Fabio) ou posa (Carlos, Seu Edson); o outro so assiste */
    for (const l of [L1, L2]) if (t > 26) l.poseMomento = l === m.pa ? ((ESCONDE[l.id] || l.id === 'fabio') ? 'block' : 'win') : null;
    if (t === m.close.t0){ if (m.tipo === 'telao') SFX.flash(); else SFX.whoosh(); }
    if (m.tipo === 'telao' && m.close.fala && t === m.close.t0 + 14) SHAKE = Math.max(SHAKE, 4);   /* a fala bate na tela */
  } else if (m.tipo === 'roda'){
    if (t === 24) SFX.blip();
  }
  /* reacoes: rival primeiro (fica ate o fim), depois o jogador; o momento acaba quando as duas foram lidas */
  if (t === m.t1) falar(pa, m.f1, (m.t2 - m.t1) + m.d2 + 6);
  if (t === m.t2) falar(pb, m.f2, m.d2);
  if (t > m.fim || (t > momentoPulavel(m) && (HIT.p1.start || HIT.p1.p || HIT.p1.k))) fimMomento();
}
/* extras do momento, desenhados com os lutadores: o espelhinho atras da cabeca e o sobrinho (ou estagiario) */
function drawMomentoExtras(){
  const m = MOMENTO; if (!m) return;
  if (m.tipo === 'espelho' && m.alvoEsp && m.t > 18 && m.t < m.fim - 4){
    /* sobe de tras do ombro ate a altura da cabeca, com o vidro inclinado para a nuca e um balanco leve de mao */
    const a = m.alvoEsp, k = Math.min(1, (m.t - 18) / 12), sobe = Math.round((1 - k) * 26);
    const rot = a.face * (0.2 + Math.sin(m.t * 0.08) * 0.05);
    drawHist('espelho_frente', a.x - CAM - a.face * 30, topoCabeca(a) + 34 + sobe, a.face < 0, { rot, alpha: k });   /* centro do vidro na altura da coroa */
  }
  if (m.tipo === 'sobrinho' && m.crianca){
    const c = m.crianca, nome = (c.quem === 'kid' ? 'kid_' : 'estag_') + (c.pose === 'corre' ? (c.quem === 'kid' ? 'corre' : 'anda') : c.pose);
    drawSombraX(c.x, c.quem === 'kid' ? 10 : 14); drawHist(nome, c.x - CAM, CHAO, c.face < 0);
  }
}
function drawSombraX(x, rx){ cx.fillStyle = 'rgba(10,20,20,.3)'; cx.beginPath(); cx.ellipse(Math.round(x - CAM), CHAO + 4, rx, 3, 0, 0, Math.PI * 2); cx.fill(); }
/* folha dos extras de historia (extras/historia.png): desenha pela base, no centro */
const HISTMAP = /*HISTMAP*/{"estag_anda":[0,0,48,115,24],"estag_aponta":[50,0,71,115,24],"estag_ri":[123,0,46,107,20],"kid_aponta":[171,0,56,80,18],"kid_corre":[229,0,50,76,36],"kid_ri":[281,0,42,72,12],"espelho_costas":[325,0,20,40,10],"espelho_frente":[347,0,20,40,10]}/*/HISTMAP*/;
const HIST = new Image(); adiaCarga(() => { if (!HIST.src) HIST.src = BASE_ARQ + 'extras/historia.png?v=/*VSHEET*/4285/*/VSHEET*/'; });   /* figurantes dos momentos: depois do titulo */
function drawHist(nome, x, y, flip, o){
  const sl = HISTMAP[nome]; if (!sl || !HIST.complete || !HIST.naturalWidth) return false;
  o = o || {}; const [sx, sy, sw, sh, ax] = sl, sc = o.sc || 1, dw = Math.round(sw * sc), dh = Math.round(sh * sc), px = Math.round(x), py = Math.round(y);
  cx.save(); if (o.alpha !== undefined) cx.globalAlpha = o.alpha;
  cx.translate(px, py); if (o.rot) cx.rotate(o.rot); if (flip) cx.scale(-1, 1);     /* gira em torno do ponto de apoio (a base) */
  cx.drawImage(HIST, sx, sy, sw, sh, -Math.round(ax * sc), -dh, dw, dh);
  cx.restore(); return true;
}
/* topo da cabeca do lutador, pela altura do quadro parado dele (vale para o lutador criado tambem) */
function topoCabeca(l){ const s = mapaSlot(l.id + '_idle'); return l.y - (s ? s[3] : 121) * (l.C.vis || 1); }   /* o sprite ja vem na escala do lutador */
function drawMomentoFundo(){
  const m = MOMENTO; if (!m) return; const t = m.t;
  if (m.tipo === 'foto' && t < m.flash){ const t0 = m.flash - 60, n = 3 - Math.floor((t - t0) / 20); if (t >= t0 && n > 0){ txtO(String(n), W / 2, 118, CREME, INK, 4); } drawSpr('fx_celular', W / 2, 112, false, { sc: 1.6 }); }
}
function drawMomentoFoto(){
  const m = MOMENTO; if (!m) return; const t = m.t;
  if (m.tipo === 'foto' && FOTO && FOTO.img && t >= m.flash){
    FOTO.t++; const k = Math.min(1, FOTO.t / 10), pw = 176, ph = FOTO.arte ? 132 : 110, px0 = Math.round(W / 2 - pw / 2), py0 = Math.round((FOTO.arte ? 22 : 28) - (1 - k) * 20);
    const rot = FOTO.arte ? (1 - k) * -0.12 + 0.02 : 0;
    cx.save(); cx.translate(W / 2, py0 + ph / 2); cx.rotate(rot); cx.translate(-W / 2, -(py0 + ph / 2));
    cx.fillStyle = 'rgba(0,0,0,.35)'; cx.fillRect(px0 - 2, py0 - 1, pw + 10, ph + 26);
    cx.fillStyle = INK; cx.fillRect(px0 - 5, py0 - 5, pw + 10, ph + 26); cx.fillStyle = CREME; cx.fillRect(px0 - 4, py0 - 4, pw + 8, ph + 24);
    cx.imageSmoothingEnabled = false;
    if (FOTO.arte && FOTO.espelho){ cx.save(); cx.translate(px0 + pw, py0); cx.scale(-1, 1); cx.drawImage(FOTO.img, 0, 0, pw, ph); cx.restore(); }
    else if (FOTO.arte) cx.drawImage(FOTO.img, px0, py0, pw, ph); else cx.drawImage(FOTO.img, 0, 0, 240, 150, px0, py0, pw, ph);
    cx.restore();
    txtMini('A FOTO DE CIMA SEMPRE ACHA A CALVICIE', W / 2, py0 + ph + 7, INK);
  }
}
/* 19/10 (pedido: "a cena da crianca merece um close-up com destaque na fala; a piada e boa"): corte de tela de jogo de luta.
   O rosto da crianca (ou do estagiario, no escritorio) em close numa faixa diagonal e a pergunta em letreiro grande, ~2 s.
   Ilustracao: extras/close_<sobrinho|estagiario>.png (Magnific); enquanto ela nao existe, o desenho da propria cena, ampliado. */
const CLOSE = {};
function carregaClose(n){ if (CLOSE[n] !== undefined) return; CLOSE[n] = null; const im = new Image(); im.onload = () => decodifica(im, () => { CLOSE[n] = im; }); im.onerror = () => {}; im.src = BASE_ARQ + 'extras/close_' + n + '.png?v=/*VSHEET*/4285/*/VSHEET*/'; }
const MOM_TIT = 46;   /* 26/10: 56 -> 46 quadros (lutas mais rapidas) */
/* o momento pode ser pulado com um toque logo que o titulo assenta (antes so depois de toda a legenda) */
function momentoPulavel(m){ return MOM_TIT + 14; }                                        /* quadros do cartao de titulo do momento */
const CLOSE_DUR = 104,   /* 26/10: 126 -> 104 (momento mais curto) */ CLOSE_BY = 30, CLOSE_BH = 128, CLOSE_IW = 176, CLOSE_IH = 132;
/* close-up (23/10, layout do Magnific): um cartao com moldura na cor do momento, levemente torto NO PLANO da tela (como uma
   foto colada; nunca girando no eixo), que entra pelo lado 'dir' (1 = da esquerda) com sobra elastica e um clarao.
   O fundo escurece pouco: a cena continua visivel atras (a chuva caindo nos lutadores). img(x, y) desenha a ilustracao
   no canto de cima do cartao, ja recortada nele. Devolve o deslocamento da entrada/saida (dx). */
function corteClose(t, dir, cor, cor2, img, ix){
  const kin = easeBack(Math.min(1, t / 10)), sai = t > CLOSE_DUR - 12 ? easeOut((t - (CLOSE_DUR - 12)) / 12) : 0, dx = Math.round(-dir * (1 - kin) * W * 0.75 + dir * sai * W * 0.85);
  cx.fillStyle = 'rgba(0,0,0,' + (0.42 * Math.min(1, t / 6) * (1 - sai)).toFixed(2) + ')'; cx.fillRect(0, 0, W, H);
  const iw = CLOSE_IW, ih = CLOSE_IH, x0 = ix === undefined ? (dir > 0 ? 12 + MARGEM : W - 12 - MARGEM - iw) : ix, cxm = x0 + iw / 2, cy = CLOSE_BY + CLOSE_BH / 2;
  cx.save(); cx.translate(Math.round(cxm + dx), Math.round(cy)); cx.rotate(-0.055 * dir);
  cx.fillStyle = 'rgba(0,0,0,.45)'; cx.fillRect(-iw / 2 - 2, -ih / 2 + 1, iw + 12, ih + 12);                       /* sombra dura */
  cx.fillStyle = '#140c0a'; cx.fillRect(-iw / 2 - 6, -ih / 2 - 6, iw + 12, ih + 12);
  cx.fillStyle = cor2; cx.fillRect(-iw / 2 - 4, -ih / 2 - 4, iw + 8, ih + 8);
  cx.fillStyle = cor; cx.fillRect(-iw / 2 - 2, -ih / 2 - 2, iw + 4, ih + 4);
  cx.beginPath(); cx.rect(-iw / 2, -ih / 2, iw, ih); cx.clip();
  img(-iw / 2, -ih / 2);
  if (t < 4){ cx.fillStyle = 'rgba(255,255,255,' + (0.7 - t * 0.17).toFixed(2) + ')'; cx.fillRect(-iw / 2, -ih / 2, iw, ih); }   /* clarao de entrada */
  cx.restore();
  return dx;
}
/* centro da metade livre da faixa (o lado sem o rosto) */
function closeTx(dir){ return dir > 0 ? Math.round((W + 10 + MARGEM + CLOSE_IW) / 2) + 6 : Math.round((10 + MARGEM + W - CLOSE_IW) / 2) - 6; }
function drawCloseCrianca(m){
  const c0 = m.crianca && m.crianca.chegou; if (!c0) return; const t = m.t - Math.max(c0 + 4, MOM_TIT + 6); if (t < 0 || t > CLOSE_DUR) return;   /* comeca quando ela chega e aponta (e o titulo ja saiu) */
  const estag = m.crianca.quem === 'estag', nome = estag ? 'estagiario' : 'sobrinho', dir = m.crianca.lado < 0 ? 1 : -1;   /* entra pelo lado de onde a crianca veio */
  carregaClose(nome);
  const by = CLOSE_BY, bh = CLOSE_BH, cor = estag ? '#d9e4f2' : '#ffd23a', cor2 = estag ? '#2a6fd1' : '#e8441c';
  const dx = corteClose(t, dir, cor, cor2, (ix, iy) => {
    const im = CLOSE[nome];
    const z = 1 + Math.min(t, 120) * 0.0007, zw = Math.round(CLOSE_IW * z), zh = Math.round(CLOSE_IH * z);   /* aproxima devagar */
    if (im){ cx.imageSmoothingEnabled = false; cx.drawImage(im, ix - (zw - CLOSE_IW) / 2, iy - (zh - CLOSE_IH) / 2, zw, zh); }
    else drawHist(estag ? 'estag_ri' : 'kid_ri', ix + CLOSE_IW / 2, iy + CLOSE_IH + (estag ? 60 : 30), dir < 0, { sc: estag ? 1.5 : 2.2 });   /* sem a ilustracao: o desenho da cena, de perto */
  });
  /* a pergunta, em letreiro grande, do outro lado; bate na tela (entra grande e assenta) */
  const linhas = (m.voz || '').replace(/(CADE) /, '$1|').split('|'), tx = closeTx(dir), sc = t < 10 ? 3 - t / 10 : 2;
  linhas.forEach((ln, i) => letreiro(ln, tx + dx, by + 28 + i * 40 - Math.round((sc - 2) * 10), sc, 'fogo'));
  if (t > 14) txtO(estag ? 'ESTAGIARIO' : 'SOBRINHO', tx + dx, by + bh - 16, cor2, INK);
}
/* 19/10 (pedido: "novos momentos e imagens que destaquem a calvicie, com close-ups nos calvos"): CAMERA DO TELAO e CHUVA DE VERAO.
   O close-up entra como o da crianca. No telao o rosto vira imagem de tela (linhas de varredura e luz de gravacao) e a fala
   bate em letreiro do outro lado; na chuva (ainda sem fala) o rosto fica no meio da faixa, com chuva por cima. */
const CLOSE_EST = { telao: { cor:'#262b3f', cor2:'#ffd23a', pal:'fogo' }, chuva: { cor:'#35566a', cor2:'#62c6f2', pal:'gelo' } };
function chuvaPx(x0, y0, w, h, t, n, cor, comp){   /* riscos de chuva na diagonal, sem acaso por quadro */
  cx.fillStyle = cor; const c = comp || 4;
  for (let i = 0; i < n; i++){ const x = x0 + ((i * 37 + t * 5) % (w + 20)) - 10, y = y0 + ((i * 53 + t * (13 + i % 3)) % (h + 10)) - 10;
    cx.fillRect(Math.round(x), Math.round(y), 1, c); cx.fillRect(Math.round(x) - 1, Math.round(y) + c, 1, c); }
}
function drawCloseMomento(m){
  const k = m.close; if (!k) return; const t = m.t - k.t0; if (t < 0 || t > CLOSE_DUR) return;
  const a = m.pa, e = CLOSE_EST[m.tipo], dir = telaX(a.x) < W / 2 ? 1 : -1, linhas = k.fala ? (CLOSE_QUEBRA[k.fala] || k.fala).split('|') : null;
  const by = CLOSE_BY, bh = CLOSE_BH;
  const dx = corteClose(t, dir, e.cor, e.cor2, (ix, iy) => {
    const im = CLOSE[k.nome], iw = CLOSE_IW, ih = CLOSE_IH, x = ix;
    cx.fillStyle = '#140c0a'; cx.fillRect(x - 2, iy, iw + 4, ih);
    if (im){ cx.imageSmoothingEnabled = false; cx.drawImage(im, x, iy, iw, ih); }
    else { cx.fillStyle = a.C.cor; cx.fillRect(x, iy, iw, ih); }                                  /* sem a ilustracao: so a cor do lutador */
    if (m.tipo === 'telao'){
      cx.fillStyle = 'rgba(10,14,30,.22)'; for (let y = iy + (t % 3); y < iy + ih; y += 3) cx.fillRect(x, y, iw, 1);   /* linhas de tela */
      if (((t >> 4) & 1) === 0){ cx.fillStyle = '#140c0a'; cx.fillRect(x + 7, iy + 9, 8, 8); cx.fillStyle = '#e0241a'; cx.fillRect(x + 8, iy + 10, 6, 6); }   /* luz de gravacao */
      cx.fillStyle = e.cor2; cx.fillRect(x + 4, iy + 4, 10, 2); cx.fillRect(x + 4, iy + 4, 2, 10); cx.fillRect(x + iw - 14, iy + ih - 6, 10, 2); cx.fillRect(x + iw - 6, iy + ih - 14, 2, 10);   /* cantos do visor */
    } else chuvaPx(x, iy, iw, ih, t, 26, 'rgba(225,240,255,.6)');
  }, linhas ? undefined : Math.round(W / 2 - CLOSE_IW / 2));
  if (linhas){
    /* a fala do outro lado, do maior tamanho que cabe na metade livre; bate na tela (entra grande e assenta) */
    const tx = closeTx(dir), livre = W - CLOSE_IW - 10 - 2 * MARGEM - 44, larg = Math.max(...linhas.map(s => larguraT(s, 1)));
    const base = Math.min(2, livre / larg), sc = t < 10 ? base * (1.5 - t / 20) : base, lh = Math.round(8 * base + 12), alto = linhas.length * lh - 12;
    const y0 = by + Math.round((bh - 18 - alto) / 2);
    linhas.forEach((ln, i) => letreiro(ln, tx + dx, y0 + i * lh - Math.round((sc - base) * 4), sc, e.pal));
    if (t > 14) txtO(a.C.nome, tx + dx, by + bh - 16, e.cor2, INK);
  } else if (t > 14) txtO(a.C.nome, W / 2 + dx, by + bh - 14, e.cor2, INK);
}
/* chuva por cima do cenario durante o momento (os lutadores ficam molhados na frente da camera) */
function drawChuvaMomento(m){
  const t = m.t, k = Math.min(1, t / 20);
  cx.fillStyle = 'rgba(24,44,78,' + (0.4 * k).toFixed(2) + ')'; cx.fillRect(0, 0, W, H);          /* o dia fecha */
  chuvaPx(0, 0, W, H, t, Math.round(150 * k), 'rgba(205,225,250,.55)', 7);
}
function drawMomento(){
  const m = MOMENTO; if (!m) return; const t = m.t;
  /* pausa: o HUD sai de cena; titulo na faixa coral do topo e a legenda embaixo, como legenda de TV (fica ate o fim,
     para quem le mais devagar); os baloes ficam livres acima das cabecas */
  if (m.tipo === 'chuva') drawChuvaMomento(m);
  /* 23/10 (pedido: "reveja o formato em que os banners e titulos sao inseridos"): o momento abre com um cartao de titulo
     no meio da tela (a gramatica dos anuncios); lido o titulo, ele encolhe para a faixa coral do topo e so entao vem a legenda */
  if (t < MOM_TIT){ const sc = larguraT(m.nome, 3) <= W - 2 * MARGEM - 30 ? 3 : 2;   /* manchete (layout): o maior que cabe, mais inclinada */
    anuncio(m.nome, W / 2, 84, sc, { chuva: 'gelo', telao: 'fogo' }[m.tipo] || 'ouro', t, MOM_TIT, { chapeu: 'MOMENTO COROA', cor: CORAL, incl: -0.07 }); }
  const k = Math.min(1, Math.max(0, t - MOM_TIT + 8) / 12), dy = Math.round(-(1 - ease(k)) * 22);
  if (k > 0){ cx.fillStyle = INK; cx.fillRect(0, dy, W, 20); cx.fillStyle = CORAL; cx.fillRect(0, dy, W, 18); cx.fillStyle = '#c9503c'; cx.fillRect(0, dy + 16, W, 2);
    txtT('MOMENTO COROA: ' + m.nome, W / 2, dy + 5, '#ffffff'); }
  m.painel = null;
  if (t > MOM_TIT - 6){
    const kl = Math.min(1, (t - MOM_TIT + 6) / 12), h = m.altLeg + 14, y0 = Math.round(H - 3 - h + (1 - ease(kl)) * (h + 8));   /* +10: linha do aviso de seguir dentro da caixa */
    const mx = MARGEM; caixaDialogo(5 + mx, y0, W - 10 - 2 * mx, h, MINT);               /* a mesma caixa de dialogo do final e da frase do vencedor */
    const linhas = wrap(m.cap, 44); let yy = y0 + 8;
    if (m.voz){ if (t >= (m.close ? m.close.t0 + 14 : 22)){ txtL(m.rotulo, 16 + mx, yy, CORAL); txtL(m.voz, 16 + mx + larguraT(m.rotulo) + 6, yy, CREME); } yy += 12; }
    linhas.forEach((s, i) => txtL(s, 16 + mx, yy + i * 10, CREME));
    /* 23/10 tarde: o aviso de seguir entra DENTRO da caixa, na linha de baixo a direita (solto em cima dela, cobria os pes dos lutadores e o estagiario) */
    if (t > momentoPulavel(m)){ txtR(LAY === 'toque' ? 'TOQUE PARA SEGUIR' : LAY !== 'desk' ? 'SOCO AVANCA' : 'Z AVANCA', W - 26 - mx, y0 + h - 13, (FRAME & 16) ? 'rgba(243,241,238,.8)' : 'rgba(243,241,238,.4)'); txtT('\u25bc', W - 17 - mx, y0 + h - 13 + ((FRAME >> 3) & 1), AMARELO); }
    m.painel = [5, y0 - 1, W - 5, y0 + h + 1];
  }

  if (m.tipo === 'sobrinho') drawCloseCrianca(m);
  else if (m.close) drawCloseMomento(m);
}

/* ---------------- HUD de fliperama (arte do Magnific, tela do gabinete no computador) ----------------
   Moldura prateada de 4 px (contorno, 2 de luz, contorno interno), barra de vida de 10 tons ancorada no
   relogio (o dano aparece em vermelho na ponta de fora), retrato em moldura, 1P + pontos, lampadas de
   vitoria, medidor HIPER em aco azulado com caixa LEVEL. Cores medidas na arte (_arte/hud). */
const HUDC = {
  prata: ['#2a2124', '#e0e0db', '#abaeb2', '#423f3e', '#aaacaa', '#8b8e8f'],
  aco:   ['#1f1a22', '#a5a8ad', '#acb8c6', '#181b2e', '#8198b5', '#42587e'],
  amarelo: ['#cca522','#ffdd27','#fcea6b','#ffef7b','#fce23f','#fdda13','#fcda1a','#fee118','#f6c914','#ffb11f'],
  fraco:   ['#d1702a','#ff9a3a','#ffb05c','#ffbd70','#ffa24a','#ff8f30','#ff8a2a','#ff9433','#f07a22','#d85e16'],
  vermelho:['#c01008','#dd2e27','#e04d4d','#e64e4a','#d91a11','#de1207','#db1407','#df1407','#ce1208','#960600'],
  vazio:   ['#2e1c1e','#34201f','#2f1d1e','#2b1a1c','#28181a','#261618','#241517','#221416','#201315','#1c1113'],
  medAm: ['#bba430','#fff247','#fbed50','#f8cc31','#f8b61e','#ffc627','#cb9727'],
  medVm: ['#792b23','#ff6d56','#fb705b','#f44f37','#e73215','#f23c1d','#d93c25'],
  medVz: ['#1c1a24','#232130','#201e2c','#1e1c29','#1c1a26','#1a1823','#181620']
};
const HUDL = { ret: { x: 6, y: 9, w: 36, h: 36 }, barra: { x: 45, y: 17, w: 126, h: 18 }, relogio: { x: 173, y: 9, w: 38, h: 30 },
               nomeY: 38, pontosY: 7, rotY: 180, nivel: { x: 6, y: 191, w: 22, h: 22 }, medidor: { x: 31, y: 201, w: 90, h: 15 } };
const espX = (x, w) => W - x - w;                           /* espelha um retangulo para o lado direito */
function hudMoldura(x, y, w, h, tom){
  const P = HUDC[tom || 'prata'];
  cx.fillStyle = P[0]; cx.fillRect(x, y, w, h);
  cx.fillStyle = P[1]; cx.fillRect(x + 1, y + 1, w - 2, 1); cx.fillRect(x + 1, y + 1, 1, h - 2);
  cx.fillStyle = P[2]; cx.fillRect(x + 2, y + 2, w - 4, 1); cx.fillRect(x + 2, y + 2, 1, h - 4);
  cx.fillStyle = P[5]; cx.fillRect(x + 1, y + h - 2, w - 2, 1); cx.fillRect(x + w - 2, y + 1, 1, h - 2);
  cx.fillStyle = P[4]; cx.fillRect(x + 2, y + h - 3, w - 4, 1); cx.fillRect(x + w - 3, y + 2, 1, h - 4);
  cx.fillStyle = P[3]; cx.fillRect(x + 3, y + 3, w - 6, h - 6);
}
function hudFaixa(x, y, w, cores){ if (w <= 0) return; for (let i = 0; i < cores.length; i++){ cx.fillStyle = cores[i]; cx.fillRect(x, y + i, w, 1); } }
/* texto de fliperama: contorno escuro e duas cores (metade de cima clara, de baixo quente) */
function txt2(str, x, y, cima, baixo, borda, sc, alinh){
  sc = sc || 1; str = String(str); const w = larguraT(str, sc);
  const x0 = alinh === 'R' ? x - w : alinh === 'C' ? Math.round(x - w / 2) : x;
  for (const [ox, oy] of [[-1,0],[1,0],[0,-1],[0,1],[1,1],[-1,-1],[1,-1],[-1,1]]) txtL(str, x0 + ox, y + oy, borda || '#1a1210', sc);
  txtL(str, x0, y, cima, sc);
  cx.save(); cx.beginPath(); cx.rect(x0 - 1, y + Math.round(4 * sc), w + 2, 8 * sc); cx.clip(); txtL(str, x0, y, baixo, sc); cx.restore();
}
const LAMPADA = ['..###..', '.#...#.', '#.....#', '#.....#', '#.....#', '.#...#.', '..###..'];
function hudLampada(x, y, acesa){
  for (let r = 0; r < 7; r++) for (let c = 0; c < 7; c++){
    const ch = LAMPADA[r][c]; const dentro = (r > 0 && r < 6 && c > 0 && c < 6 && !(ch === '#')) && !((r === 1 || r === 5) && (c === 1 || c === 5));
    if (ch === '#'){ cx.fillStyle = r < 3 ? '#e0e0db' : '#8b8e8f'; cx.fillRect(x + c, y + r, 1, 1); }
    else if (dentro){ cx.fillStyle = acesa ? (r < 3 ? '#fff3a0' : '#ffd21f') : (r < 3 ? '#5a3a1e' : '#3e2714'); cx.fillRect(x + c, y + r, 1, 1); }
  }
  cx.fillStyle = '#2a2124'; cx.fillRect(x + 2, y - 1, 3, 1); cx.fillRect(x + 2, y + 7, 3, 1); cx.fillRect(x - 1, y + 2, 1, 3); cx.fillRect(x + 7, y + 2, 1, 3);
  if (acesa){ cx.fillStyle = '#ffffff'; cx.fillRect(x + 2, y + 2, 1, 1); }
}
function drawHUD(){
  const lado = (l, esq) => {
    const R = HUDL.ret, B = Object.assign({}, HUDL.barra, { w: W / 2 - 66 });   /* barra vai ate o relogio, na largura que a tela tiver */
    /* retrato */
    const rx = esq ? R.x : espX(R.x, R.w); hudMoldura(rx, R.y, R.w, R.h, 'prata');
    cx.fillStyle = l.C.cor; cx.fillRect(rx + 4, R.y + 4, R.w - 8, R.h - 8);
    const r = retrato(l.id);
    if (r){ const [sx, sy, sw, sh] = mapaSlot(r); const d = R.w - 8; cx.save(); cx.beginPath(); cx.rect(rx + 4, R.y + 4, d, d); cx.clip();
      if (!esq){ cx.translate(rx + 4 + d, R.y + 4); cx.scale(-1, 1); cx.drawImage(folhaSlot(r), sx, sy, sw, sh, 0, 0, d, d); } else cx.drawImage(folhaSlot(r), sx, sy, sw, sh, rx + 4, R.y + 4, d, d); cx.restore(); }
    /* barra de vida: ancorada no relogio, dano recente em vermelho para fora, o resto escuro */
    const bx = esq ? B.x : espX(B.x, B.w); hudMoldura(bx, B.y, B.w, B.h, 'prata');
    const iw = B.w - 8, ix = bx + 4, iy = B.y + 4;
    const fv = Math.round(iw * Math.max(0, l.vida) / l.vidaMax), fa = Math.max(fv, Math.round(iw * Math.max(0, l.vidaAtras) / l.vidaMax));
    const baixa = l.vida / l.vidaMax <= .25, pisca = baixa && (FRAME & 8);
    if (esq){ hudFaixa(ix, iy, iw - fa, HUDC.vazio); hudFaixa(ix + iw - fa, iy, fa - fv, HUDC.vermelho); hudFaixa(ix + iw - fv, iy, fv, pisca ? HUDC.fraco : HUDC.amarelo); }
    else { hudFaixa(ix, iy, fv, pisca ? HUDC.fraco : HUDC.amarelo); hudFaixa(ix + fv, iy, fa - fv, HUDC.vermelho); hudFaixa(ix + fa, iy, iw - fa, HUDC.vazio); }
    /* nome (amarelo que esquenta para baixo) e lampadas de vitoria */
    const nx = esq ? B.x + 2 : W - B.x - 2, nw = larguraT(l.C.nome);
    txt2(l.C.nome, nx, HUDL.nomeY, '#ffe75a', '#ff9d1c', '#1a1210', 1, esq ? 'L' : 'R');
    const acesas = LUTA.p2humano ? 0 : (esq ? Math.min(2, LUTA.vitorias || 0) : Math.min(2, LUTA.derrotas || 0));
    for (let i = 0; i < 2; i++){ const lx = esq ? nx + nw + 6 + i * 11 : nx - nw - 13 - i * 11; hudLampada(lx, HUDL.nomeY, i < acesas); }
    if (l.tratamento){ const tx0 = esq ? nx : nx - 44; cx.fillStyle = (FRAME & 32) ? MINT : '#5fb07f'; cx.fillRect(tx0, HUDL.nomeY + 11, 44, 7); txtMini('TRATAMENTO', tx0 + 22, HUDL.nomeY + 12, TEAL); }
    /* 1P / 2P + pontos: 23/10 (layout do Magnific) o placar saiu da tela (quase sempre mostrava 000000 e embolava o topo);
       a pontuacao continua contando em LUTA.pontos */
    if (false && (l.ctrl === 'p1' || l.ctrl === 'p2')){
      const pts = String(Math.min(999999, (l.ctrl === 'p1' ? LUTA.pontos : LUTA.pontos2) || 0)).padStart(6, '0'), rot = l.ctrl === 'p1' ? '1P' : '2P';
      if (esq){ txt2(rot, nx, HUDL.pontosY, '#ffffff', '#b9bcc4', '#1a1210'); txt2(pts, nx + 22, HUDL.pontosY, '#ffffff', '#b9bcc4', '#1a1210'); }
      else { txt2(pts, nx, HUDL.pontosY, '#ffffff', '#b9bcc4', '#1a1210', 1, 'R'); txt2(rot, nx - larguraT(pts) - 6, HUDL.pontosY, '#ffffff', '#b9bcc4', '#1a1210', 1, 'R'); }
    }
    /* HIPER: rotulo, caixa LEVEL e medidor de aco (enche de fora para dentro, comeca vermelho); some quando entra a citacao do vencedor */
    const fimLuta = LUTA.fase === 'ko' && LUTA.t > (LUTA.koT || 70) + 16;
    const cheio = l.hiper >= 100, brilha = cheio && (FRAME & 4);
    if (!fimLuta && !HUD_SOBRE){                        /* com os controles por cima do jogo, o medidor vira o anel do botao HIPER */
      const N = HUDL.nivel, M = HUDL.medidor, nvx = esq ? N.x : espX(N.x, N.w), mx = esq ? M.x : espX(M.x, M.w);
      txt2('HIPER', esq ? N.x + 1 : W - N.x - 1, HUDL.rotY, cheio && (FRAME & 8) ? '#ffffff' : '#fff0b8', '#f2b24a', '#1a1210', 1, esq ? 'L' : 'R');
      hudMoldura(nvx, N.y, N.w, N.h, 'aco'); cx.fillStyle = '#3c2928'; cx.fillRect(nvx + 4, N.y + 4, N.w - 8, N.h - 8);
      txt2(cheio ? '1' : '0', nvx + N.w / 2 + 1, N.y + 7, cheio ? (brilha ? '#ffffff' : '#ffe14a') : '#7dff8a', cheio ? '#ffb21f' : '#2fc24a', '#1a1210', 1, 'C');
      txt2('LEVEL', esq ? M.x + 1 : W - M.x - 1, N.y + 1, '#fff6dc', '#e8cf98', '#1a1210', 1, esq ? 'L' : 'R');
      hudMoldura(mx, M.y, M.w, M.h, 'aco');
      const mw = M.w - 8, hf = Math.round(mw * Math.min(100, l.hiper) / 100), vm = Math.min(hf, Math.round(mw * 0.2)), my = M.y + 4, mix = mx + 4;
      if (esq){ hudFaixa(mix, my, vm, HUDC.medVm); hudFaixa(mix + vm, my, hf - vm, brilha ? HUDC.medAm.map(() => '#fff6b0') : HUDC.medAm); hudFaixa(mix + hf, my, mw - hf, HUDC.medVz); }
      else { hudFaixa(mix + mw - vm, my, vm, HUDC.medVm); hudFaixa(mix + mw - hf, my, hf - vm, brilha ? HUDC.medAm.map(() => '#fff6b0') : HUDC.medAm); hudFaixa(mix, my, mw - hf, HUDC.medVz); }
    }
    /* combo */
    if (l.comboT > 0 && l.combo >= 2 && LUTA.fase !== 'ko'){
      const cxp = esq ? 30 : W - 30, k = Math.min(1, (70 - l.comboT) / 6);
      let yy = Math.round(104 - (1 - k) * 10); const bx0 = esq ? cxp - 2 : cxp - 72, bx1 = esq ? cxp + 70 : cxp + 2;
      for (let v = 0; v < 3; v++){ const o = OCUPADO.find(q => q[4] === 6 && q[0] < bx1 && q[2] > bx0 && q[1] < yy + 18 && q[3] > yy - 2); if (!o) break; yy = Math.min(150, Math.round(o[3]) + 2); }
      /* 19/10: numero em letreiro 3D que salta a cada acerto (ouro, fogo a partir de 5, sangue a partir de 8) */
      if (esq){ const nw = numeroCombo(l, cxp, yy - 1, 'L'); txtOL('HITS', cxp + nw + 4, yy + 8, CREME, INK); ocupa([cxp - 2, yy - 2, cxp + 70, yy + 18], 8); }
      else { txtOR('HITS', cxp, yy + 8, CREME, INK); numeroCombo(l, cxp - 36, yy - 1, 'R'); ocupa([cxp - 72, yy - 2, cxp + 2, yy + 18], 8); }
    }
  };
  lado(L1, true); lado(L2, false);
  /* relogio */
  /* 23/10 (layout da luta): relogio num selo redondo de metal, como nos fliperamas de luta */
  const T = Object.assign({}, HUDL.relogio, { x: Math.round(W / 2 - HUDL.relogio.w / 2) }), rcx = W / 2, rcy = T.y + 15;
  const disco = (r, cor) => { cx.fillStyle = cor; cx.beginPath(); cx.arc(rcx, rcy, r, 0, Math.PI * 2); cx.fill(); };
  disco(20, '#1a1416'); { const g = cx.createLinearGradient(0, rcy - 19, 0, rcy + 19); g.addColorStop(0, '#f2f2ee'); g.addColorStop(0.5, '#abaeb2'); g.addColorStop(1, '#5e6163'); cx.fillStyle = g; cx.beginPath(); cx.arc(rcx, rcy, 19, 0, Math.PI * 2); cx.fill(); }
  disco(16, '#2a2124'); disco(15, '#2b2d33'); cx.fillStyle = 'rgba(255,255,255,.08)'; cx.beginPath(); cx.arc(rcx, rcy - 4, 13, Math.PI, Math.PI * 2); cx.fill();
  const alarme = LUTA.timer <= 10 && (FRAME & 8);
  txt2(LUTA.timer < 10 ? '0' + LUTA.timer : String(LUTA.timer), W / 2, rcy - 8, alarme ? '#ffc3b8' : '#fff4d6', alarme ? CORAL : '#f5b447', '#140e0c', 2, 'C');
  /* marca embaixo do relogio */
  placaMarca(40, W / 2, rcy + 22, 2);
  if (LUTA.avisoT > 0){ LUTA.avisoT--; cx.fillStyle = 'rgba(11,59,60,.85)'; cx.fillRect(W/2 - 96, 168, 192, 9); txtMini('RESULTADOS VARIAM DE PESSOA PARA PESSOA', W/2, 170, CREME); ocupa([W/2 - 96, 168, W/2 + 96, 177], 6); }
}

/* ---------------- VARIANTES DE BASE: o capacete de tinta do Beto ----------------
   23/10: o CRIE SEU LUTADOR saiu do jogo (pedido: "remova a secao de personalizar o personagem"; o codigo ficou em
   _arte/backups/2026-10-23_pre_layouts/). Fica so o visual padrao que nasceu de uma folha de corte (pedido do time, 05/10):
   o Beto pinta o topo inteiro (capacete de tinta) e deixa de parecer careca no time cabeludo. Vale no jogo todo
   (luta, retratos, VS, HUD). A folha e o mapa continuam em criador/cortes/beto_pintado.{png,json}. */
const CORTESMAP = /*CORTESMAP*/{"beto_pintado":{"beto_arr_0":[448,0,64,121,31.7],"beto_arr_1":[415,130,78,117,44.8],"beto_arr_2":[495,130,104,117,39.8],"beto_arr_3":[672,130,72,109,31.8],"beto_block":[514,0,72,121,36.5],"beto_crouch":[906,130,64,90,31.5],"beto_hit":[601,130,69,113,34.5],"beto_idle":[214,0,74,122,37.0],"beto_jab":[588,0,94,121,47.0],"beto_jump":[746,130,60,101,29.5],"beto_kick":[110,0,102,126,51.0],"beto_ko":[0,253,125,36,62.5],"beto_punch":[684,0,104,121,52.5],"beto_sp1_0":[790,0,64,121,31.7],"beto_sp1_1":[856,0,64,121,31.7],"beto_sp1_2":[228,130,107,120,35.4],"beto_sp1_3":[337,130,76,119,35.8],"beto_sp2_0":[922,0,64,121,31.7],"beto_sp2_1":[0,130,72,121,36.2],"beto_sp2_2":[74,130,70,121,35.7],"beto_sp2_3":[290,0,72,122,36.2],"beto_special":[0,0,108,128,54.0],"beto_walk":[146,130,80,121,40.0],"beto_win":[364,0,82,122,41.0],"beto_face":[808,130,96,96,48.0]}}/*/CORTESMAP*/;         /* "<folha>": { quadro: [x, y, w, h, ancora] } */
const BASE_VAR = { beto: 'beto_pintado' }, BVAR = {};
function carregaBaseVar(){
  for (const lut in BASE_VAR){ const k = BASE_VAR[lut]; if (!CORTESMAP[k] || BVAR[lut]) continue;
    const o = BVAR[lut] = { ok: false }, im = new Image(); im.onload = () => { o.img = im; o.ok = true; }; im.src = BASE_ARQ + 'criador/cortes/' + k + '.png?v=/*VSHEET*/4285/*/VSHEET*/'; }
}
function slotBase(nome){ if (!nome) return null; const i = nome.indexOf('_'); if (i < 0) return null; const lut = nome.slice(0, i), v = BVAR[lut]; if (!v || !v.ok) return null; const m = CORTESMAP[BASE_VAR[lut]]; return (m && m[nome]) ? [v.img, m[nome]] : null; }
/* qual folha e qual mapa desenham um quadro: a do capacete do Beto quando ela ja chegou, senao o sheet */
function mapaSlot(nome){ const b = slotBase(nome); return b ? b[1] : SHEETMAP[nome]; }
function folhaSlot(nome){ const b = slotBase(nome); return b ? b[0] : SHEET; }
adiaCarga(carregaBaseVar);                                /* o capacete de tinta do Beto chega depois do titulo (e na escolha, se ainda nao chegou) */

/* ==================================================================================
   ESPETACULO (19/10): letreiro em 3D (extrusao, contorno do bloco, degrade e sombra dura) pre-renderizado em cache,
   animacoes de texto de jogo de luta e os efeitos dos golpes especiais. Cada anuncio tem a sua gramatica:
     carimbo (escala 3x -> 0,9 -> 1 com tremor e anel de poeira) ..... LUTA n, K.O., letreiros de golpe arremessado
     queda letra a letra (estica ao pousar) .......................... FINALIZA!, FINALIZACAO!, nome do HIPER
     colisao (as duas metades vem dos lados e batem no meio) .......... TEMPO!, placa da finalizacao
     giro 3D (escala X = cosseno, verso escuro) ...................... PERFEITO!
     aberracao cromatica (copia vermelha e ciano convergindo) ......... K.O.
     maquina de escrever (cursor piscando) ........................... instrucao da finalizacao, legenda de cinema
     estilhaco (o letreiro quebra em cacos) .......................... saida do LUTA!
     onda (letras sobem e descem) .................................... VOCE VENCEU!
   Efeitos de golpe: faixa inclinada com o nome do especial, clarao no lutador, anel de choque, quadro de impacto,
   raios de fundo na cor do lutador, luz de palco e tarjas de cinema na finalizacao, fios de cabelo caindo das letras.
   Tudo sai de imagem pronta: no celular nao se paga contorno nem degrade a cada quadro (custo medido em _qa/mede_desempenho.js).
   ================================================================================== */
const PROFUNDO = { fogo: ['#a1300e', '#5c1407'], ouro: ['#a3570f', '#542606'], gelo: ['#1b4596', '#0b1c48'], sangue: ['#64100b', '#2c0403'],
  menta: ['#2d7350', '#133826'], cromo: ['#4a5466', '#1c222e'] };
const hs = i => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };   /* acaso fixo por indice */
function txtG(g, str, x, y, col, sc){
  sc = sc || 1; const a = fontAtlas(col); str = String(str).toUpperCase(); g.imageSmoothingEnabled = false;
  for (const ch of str){ const gi = a.idx[ch]; if (gi !== undefined) g.drawImage(a.c, gi * 8, 0, 8, 8, x, y, 8 * sc, 8 * sc); x += (ch === ' ' ? 5 : 8) * sc; }
}
const _LETC = new Map();
/* imagem do letreiro: { c, w, h, ox, oy } (ox, oy = onde fica o canto da face dentro da imagem) */
function letreiroImg(str, sc, pal, prof){
  str = String(str).toUpperCase(); sc = Math.max(1, Math.round(sc || 2)); pal = PALETAS[pal] ? pal : 'fogo';
  prof = prof == null ? Math.max(1, Math.round(sc * 0.75)) : prof;
  const k = str + '|' + sc + '|' + pal + '|' + prof; let e = _LETC.get(k);
  if (e){ _LETC.delete(k); _LETC.set(k, e); return e; }
  const b = Math.max(1, Math.round(sc / 2)), w = Math.max(1, larguraT(str, sc)), h = 8 * sc, m = b + 1;
  const c = document.createElement('canvas'); c.width = w + 2 * m + prof + 3; c.height = h + 2 * m + prof + 3;
  const g = c.getContext('2d'); g.imageSmoothingEnabled = false;
  const cores = PALETAS[pal], fundo = PROFUNDO[pal] || ['#3a1a10', '#1a0a06'];
  g.globalAlpha = 0.42; txtG(g, str, m + prof + b + 2, m + prof + b + 2, '#000000', sc); g.globalAlpha = 1;          /* sombra dura (sem blur) */
  for (let d = 0; d <= prof; d++) for (let ox = -b; ox <= b; ox++) for (let oy = -b; oy <= b; oy++) if (d || ox || oy) txtG(g, str, m + d + ox, m + d + oy, '#140c0a', sc);   /* contorno do bloco */
  for (let d = prof; d >= 1; d--) txtG(g, str, m + d, m + d, d === 1 ? fundo[0] : fundo[1], sc);                   /* extrusao: mais escura no fundo */
  const hb = h / cores.length;
  cores.forEach((cor, i) => { g.save(); g.beginPath(); g.rect(0, m + Math.floor(i * hb), c.width, Math.ceil(hb) + 1); g.clip(); txtG(g, str, m, m, cor, sc); g.restore(); });
  g.save(); g.beginPath(); g.rect(0, m, c.width, Math.max(1, Math.round(sc / 2))); g.clip(); g.globalAlpha = 0.55; txtG(g, str, m, m, '#ffffff', sc); g.restore();   /* brilho em cima */
  e = { c, w, h, ox: m, oy: m, sc };
  _LETC.set(k, e); if (_LETC.size > 90) _LETC.delete(_LETC.keys().next().value);
  return e;
}
/* silhueta de cor unica de um letreiro (copias da aberracao cromatica, verso do giro) */
function letreiroSilh(e, cor){
  let s = e.silh && e.silh[cor]; if (s) return s;
  s = document.createElement('canvas'); s.width = e.c.width; s.height = e.c.height; const g = s.getContext('2d');
  g.drawImage(e.c, 0, 0); g.globalCompositeOperation = 'source-in'; g.fillStyle = cor; g.fillRect(0, 0, s.width, s.height);
  (e.silh = e.silh || {})[cor] = s; return s;
}
/* desenha a imagem pelo centro da face, com escala, inclinacao e transparencia */
function poeImg(img, e, cxm, cy, sx, sy, alfa, incl){
  if (alfa !== undefined && alfa <= 0.01) return;
  cx.save(); if (alfa !== undefined && alfa < 1) cx.globalAlpha = alfa;
  cx.translate(Math.round(cxm), Math.round(cy)); if (incl) cx.transform(1, 0, incl, 1, 0, 0); cx.scale(sx, sy === undefined ? sx : sy);
  cx.drawImage(img, -Math.round(e.ox + e.w / 2), -Math.round(e.oy + e.h / 2)); cx.restore();
}
const easeOut = k => 1 - (1 - k) * (1 - k), easeBack = k => { const s = 1.7; k -= 1; return k * k * ((s + 1) * k + s) + 1; };
/* anel de poeira/choque (elipse que abre e some) */
function anelChoque(x, y, k, rx, cor){
  if (k <= 0 || k >= 1) return; cx.save(); cx.globalAlpha = 0.7 * (1 - k); cx.strokeStyle = cor || '#ffffff'; cx.lineWidth = Math.max(1, Math.round(3 * (1 - k)));
  cx.beginPath(); cx.ellipse(Math.round(x), Math.round(y), rx * (0.5 + k * 0.8), rx * (0.5 + k * 0.8) * 0.28, 0, 0, Math.PI * 2); cx.stroke(); cx.restore();
}
/* ---------- animacoes de texto (t em quadros desde o inicio) ---------- */
/* carimbo: bate de cima (3x) e assenta com tremor e anel de poeira */
function anCarimbo(str, cxm, cy, sc, pal, t, o){
  o = o || {}; const e = letreiroImg(str, sc, pal, o.prof);
  const s = t < 6 ? 3 - 2.1 * (t / 6) : t < 9 ? 0.9 + 0.1 * ((t - 6) / 3) : 1, tre = t >= 6 && t < 16 ? (16 - t) * 0.45 : 0;
  const dx = tre ? Math.round((hs(t) - 0.5) * tre * 2) : 0, dy = tre ? Math.round((hs(t + 7) - 0.5) * tre) : 0;
  if (t >= 6 && t < 20) anelChoque(cxm, cy + e.h / 2 + 2, (t - 6) / 14, e.w * 0.7, o.anel || '#fff3c8');
  poeImg(e.c, e, cxm + dx, cy + dy, s * (o.esc || 1), undefined, Math.min(1, (t + 1) / 3), o.incl);
  return [cxm - e.w / 2 - 4, cy - e.h / 2 - 4, cxm + e.w / 2 + 6, cy + e.h / 2 + 8];
}
/* queda letra a letra: cada letra cai de cima, estica ao pousar e assenta (3 quadros entre letras) */
function anQueda(str, cxm, y, sc, pal, t, o){
  o = o || {}; str = String(str).toUpperCase(); const passo = o.passo || 3, w = larguraT(str, sc); let x = Math.round(cxm - w / 2), i = 0;
  for (const ch of str){
    const adv = (ch === ' ' ? 5 : 8) * sc;
    if (ch !== ' '){
      const ti = t - i * passo;
      if (ti >= 0){
        const e = letreiroImg(ch, sc, pal, o.prof), k = Math.min(1, ti / 7), yy = y - Math.round(48 * (1 - easeOut(k)));
        let sx = 1, sy = 1; if (ti >= 7 && ti < 10){ sx = 1.22 - (ti - 7) * 0.07; sy = 0.8 + (ti - 7) * 0.065; }
        const pul = o.pulso ? 1 + o.pulso : 1;
        poeImg(e.c, e, x + e.w / 2, yy + e.h / 2 + (1 - sy) * e.h / 2, sx * pul, sy * pul, Math.min(1, ti / 2 + 0.2));
      }
      i++;
    }
    x += adv;
  }
  return [cxm - w / 2 - 4, y - 4, cxm + w / 2 + 6, y + 8 * sc + 8];
}
/* colisao: a primeira parte vem da esquerda, a segunda da direita, batem no meio com clarao e tremor */
function anColisao(a, b, cxm, y, sc, pal, t, o){
  o = o || {}; const ea = letreiroImg(a, sc, pal, o.prof), eb = letreiroImg(b, sc, pal, o.prof), gap = o.gap === undefined ? sc : o.gap;   /* sem folga: as metades viram uma palavra so */
  const tot = ea.w + gap + eb.w, xa = cxm - tot / 2 + ea.w / 2, xb = cxm + tot / 2 - eb.w / 2, k = Math.min(1, t / 8), ki = k * k;
  const tre = t >= 8 && t < 18 ? (18 - t) * 0.5 : 0, dx = tre ? Math.round((hs(t) - 0.5) * tre * 2) : 0;
  const ya = y + ea.h / 2;
  if (t >= 8 && t < 12){ cx.fillStyle = 'rgba(255,255,255,' + (0.6 - (t - 8) * 0.15).toFixed(2) + ')'; cx.fillRect(Math.round(cxm - tot / 2 - 10), Math.round(y - 6), Math.round(tot + 20), Math.round(ea.h + 12)); }
  poeImg(ea.c, ea, xa - (1 - ki) * (W * 0.7) + dx, ya, 1, 1, 1, o.incl);
  poeImg(eb.c, eb, xb + (1 - ki) * (W * 0.7) + dx, ya, 1, 1, 1, o.incl);
  return [cxm - tot / 2 - 4, y - 4, cxm + tot / 2 + 6, y + ea.h + 8];
}
/* giro 3D: vira no eixo vertical 1,5 volta ate parar de frente; o verso sai escuro */
function anGiro(str, cxm, cy, sc, pal, t, o){
  o = o || {}; const e = letreiroImg(str, sc, pal, o.prof), k = Math.min(1, t / 18), ang = (1 - easeOut(k)) * Math.PI * 3, c = Math.cos(ang);
  const sx = Math.max(0.05, Math.abs(c)), verso = c < 0;
  poeImg(verso ? letreiroSilh(e, '#3a2a40') : e.c, e, cxm, cy, sx * (verso ? -1 : 1), 1 + (1 - sx) * 0.12, Math.min(1, (t + 2) / 4));
  return [cxm - e.w / 2 - 4, cy - e.h / 2 - 4, cxm + e.w / 2 + 6, cy + e.h / 2 + 8];
}
/* aberracao cromatica: copia vermelha e ciano afastadas que convergem, com tremor de 1 px no comeco */
function anCromatico(str, cxm, cy, sc, pal, t, o){
  o = o || {}; const e = letreiroImg(str, sc, pal, o.prof), d = Math.max(0, Math.round(8 - t * 0.55)), j = t < 14 ? Math.round((hs(t * 3) - 0.5) * 2) : 0;
  const s = t < 5 ? 1.6 - t * 0.12 : 1;
  if (d > 0){ cx.save(); cx.globalCompositeOperation = 'lighter';
    poeImg(letreiroSilh(e, '#ff2a2a'), e, cxm - d + j, cy, s, s, 0.75, o.incl); poeImg(letreiroSilh(e, '#21e6ff'), e, cxm + d + j, cy + (d >> 1), s, s, 0.75, o.incl); cx.restore(); }
  poeImg(e.c, e, cxm + j, cy, s, s, 1, o.incl);
  return [cxm - e.w * s / 2 - 10, cy - e.h * s / 2 - 4, cxm + e.w * s / 2 + 12, cy + e.h * s / 2 + 8];
}
/* maquina de escrever: uma letra a cada `passo` quadros, com cursor de bloco */
function anMaquina(str, x, y, col, t, o){
  o = o || {}; str = String(str).toUpperCase(); const n = Math.min(str.length, Math.max(0, Math.floor(t / (o.passo || 2)))), parte = str.slice(0, n);
  const w = larguraT(str), x0 = o.alinh === 'L' ? x : Math.round(x - w / 2);
  if (o.borda){ for (const [ox, oy] of [[-1,0],[1,0],[0,-1],[0,1],[1,1],[-1,-1],[1,-1],[-1,1]]) txtL(parte, x0 + ox, y + oy, o.borda); }
  txtL(parte, x0, y, col);
  if (n < str.length || ((t >> 4) & 1)){ cx.fillStyle = col; cx.fillRect(x0 + (n ? larguraT(parte) + 2 : 0), y, 5, 7); }
  if (o.som && n > (o.som.n || 0)){ o.som.n = n; if (n % 2 === 0) tone(1400 + (n % 3) * 90, 0.015, 'square', 0.02); }
  return [x0 - 2, y - 2, x0 + w + 9, y + 10];
}
/* estilhaco: o letreiro quebra em cacos que voam e caem */
function anEstilhaco(str, cxm, cy, sc, pal, t, o){
  o = o || {}; const e = letreiroImg(str, sc, pal, o.prof), cw = Math.max(6, Math.ceil(e.c.width / 9)), ch = Math.ceil(e.c.height / 2);
  const x0 = Math.round(cxm - e.ox - e.w / 2), y0 = Math.round(cy - e.oy - e.h / 2);
  cx.save(); cx.globalAlpha = Math.max(0, 1 - t / 22);
  for (let r = 0; r < 2; r++) for (let q = 0; q * cw < e.c.width; q++){
    const i = r * 20 + q, vx = (hs(i) - 0.5) * 7 + (q * cw - e.c.width / 2) * 0.04, vy = -1.5 - hs(i + 5) * 3.5 + r, rot = (hs(i + 9) - 0.5) * 0.5 * t;
    const px = x0 + q * cw + vx * t, py = y0 + r * ch + vy * t + 0.32 * t * t;
    cx.save(); cx.translate(Math.round(px + cw / 2), Math.round(py + ch / 2)); cx.rotate(rot); cx.drawImage(e.c, q * cw, r * ch, cw, ch, -cw / 2, -ch / 2, cw, ch); cx.restore();
  }
  cx.restore();
}
/* onda: as letras entram uma a uma e ficam subindo e descendo */
function anOnda(str, cxm, y, sc, pal, t, o){
  o = o || {}; str = String(str).toUpperCase(); const w = larguraT(str, sc); let x = Math.round(cxm - w / 2), i = 0;
  for (const ch of str){
    const adv = (ch === ' ' ? 5 : 8) * sc;
    if (ch !== ' '){ const ti = t - i * 2; if (ti >= 0){ const e = letreiroImg(ch, sc, pal, o.prof), s = ti < 5 ? 0.4 + ti * 0.16 : 1;
      const dy = Math.round(Math.sin(t * 0.14 - i * 0.55) * 2.5 * Math.min(1, ti / 12)); poeImg(e.c, e, x + e.w / 2, y + e.h / 2 + dy, s, s); } i++; }
    x += adv;
  }
  return [cxm - w / 2 - 4, y - 6, cxm + w / 2 + 6, y + 8 * sc + 10];
}
/* ---------- ANUNCIO (23/10): a gramatica unica dos letreiros grandes ----------
   Pedido: "reveja o formato em que os banners e titulos sao inseridos no game"; aprendizado do 2o ROUND (Lula x Flavio):
   um letreiro por vez e sempre do mesmo jeito. Uma faixa escura abre atras (6 quadros), as letras chegam uma a uma
   (2 quadros entre elas) descendo de leve com sobra elastica, tudo inclinado 2 graus; no ar o letreiro respira; na saida
   encolhe no lugar e some (cair cruzava os lutadores). Linha pequena em cima (chapeu) e embaixo (sub), opcionais.
   t = quadros desde o inicio; dur = quadros no ar (Infinity: titulo de tela, sem saida). Devolve a caixa ocupada. */
function anuncio(str, cxm, cy, sc, pal, t, dur, o){
  o = o || {}; if (t < 0) return null; str = String(str).toUpperCase();
  const sai = isFinite(dur) && t > dur - 10 ? easeOut(Math.min(1, (t - (dur - 10)) / 10)) : 0; if (sai >= 1) return null;
  const hT = 8 * sc, w = larguraT(str, sc), kick = o.chapeu ? 13 : 0, sub = o.sub ? 13 : 0;
  const y0 = cy - hT / 2 - 9 - kick, y1 = cy + hT / 2 + 9 + sub, a = 1 - sai;
  const resp = t > 40 && !sai && !MENOS_MOVIMENTO ? 0.012 * Math.sin(t * 0.12) : 0, esc = (1 - 0.3 * sai) * (1 + resp + (o.pulso || 0));
  cx.save(); cx.translate(Math.round(cxm), Math.round(cy)); if (!o.reto) cx.rotate(o.incl !== undefined ? o.incl : -0.035); cx.scale(esc, esc); cx.translate(-Math.round(cxm), -Math.round(cy));
  if (o.faixa !== false){                                   /* faixa escura atras, abrindo do meio */
    const k = easeOut(Math.min(1, t / 6)), mid = (y0 + y1) / 2, hh = Math.round((y1 - y0) * k / 2);
    cx.globalAlpha = a; cx.fillStyle = 'rgba(8,8,20,.78)'; cx.fillRect(-60, Math.round(mid - hh), W + 120, hh * 2);
    cx.fillStyle = o.cor || CORAL; cx.fillRect(-60, Math.round(mid - hh), W + 120, 2); cx.fillRect(-60, Math.round(mid + hh) - 2, W + 120, 2);
  }
  if (o.cromatico && t < 16){                               /* copias vermelha e ciano que convergem (o impacto do K.O.) */
    const e = letreiroImg(str, sc, pal, o.prof), d = Math.round((16 - t) * 0.6);
    cx.save(); cx.globalCompositeOperation = 'lighter'; poeImg(letreiroSilh(e, '#ff2a2a'), e, cxm - d, cy, 1, 1, 0.7 * a); poeImg(letreiroSilh(e, '#21e6ff'), e, cxm + d, cy + (d >> 1), 1, 1, 0.7 * a); cx.restore();
  }
  let x = Math.round(cxm - w / 2), i = 0;
  for (const ch of str){
    const adv = (ch === ' ' ? 5 : 8) * sc;
    if (ch !== ' '){ const ti = t - 3 - i * 2;
      if (ti >= 0){ const e = letreiroImg(ch, sc, pal, o.prof), k = Math.min(1, ti / 8), s = 0.3 + 0.7 * easeBack(k), dy = -Math.round((1 - easeOut(k)) * 10);
        poeImg(e.c, e, x + e.w / 2, cy + dy, s, s, Math.min(1, ti / 3) * a); }
      i++; }
    x += adv;
  }
  const pronto = t - 3 - i * 2 - 4;
  cx.globalAlpha = a;
  if (o.chapeu && t > 4) letreiro(o.chapeu, cxm, y0 + 5, 1, o.palChapeu || 'ouro');
  if (o.sub && pronto > 0) txtO(o.sub, cxm, cy + hT / 2 + 6, o.corSub || CREME, INK);
  cx.restore();
  return [0, Math.round(y0 - 4), W, Math.round(y1 + 4)];
}
/* 23/10 (layout do Magnific, 07 K.O.): anel eletrico atras do K.O. (circulo de raio tremido, laranja com miolo branco e faiscas)
   e rajada de tracos de velocidade em volta, como quadro de manga; tudo no plano da tela */
function anelEletrico(cxm, cy, r, t, a, ry){
  if (a <= 0) return; const n = 44, sem = t >> 1, pts = [], fy = (ry || r) / r;
  for (let i = 0; i <= n; i++){ const an = i / n * Math.PI * 2, rr = r * (1 + (hs(i % n + sem * 7) - 0.5) * 0.12); pts.push([cxm + Math.cos(an) * rr, cy + Math.sin(an) * rr * fy]); }
  cx.save(); cx.globalAlpha = a; cx.lineJoin = 'miter';
  for (const [cor, lw] of [['rgba(255,140,30,.55)', 6], ['#ff9a1f', 3], ['#fff6d8', 1]]){ cx.strokeStyle = cor; cx.lineWidth = lw; cx.beginPath(); pts.forEach(([x, y], i) => i ? cx.lineTo(x, y) : cx.moveTo(x, y)); cx.stroke(); }
  cx.strokeStyle = '#fff6d8'; cx.lineWidth = 1;
  for (let j = 0; j < 6; j++){ const an = hs(j + sem * 3) * Math.PI * 2, x0 = cxm + Math.cos(an) * r, y0 = cy + Math.sin(an) * r * fy; cx.beginPath(); cx.moveTo(x0, y0);
    let x = x0, y = y0; for (let k = 0; k < 3; k++){ const d = 4 + hs(j * 5 + k + sem) * 4, desv = (hs(j * 3 + k + sem * 2) - 0.5) * 1.2; x += Math.cos(an + desv) * d; y += Math.sin(an + desv) * d; cx.lineTo(x, y); } cx.stroke(); }
  cx.restore();
}
function rajadaVelocidade(cxm, cy, r0, t, a, fy){
  if (a <= 0) return; fy = fy || 1; cx.save(); cx.globalAlpha = a; cx.fillStyle = 'rgba(14,10,12,.9)';
  for (let i = 0; i < 40; i++){ const an = i / 40 * Math.PI * 2 + (hs(i) - 0.5) * 0.1, r1 = r0 + hs(i + 9) * 8, L = 16 + hs(i + 21) * 34, c = Math.cos(an), s = Math.sin(an) * fy, lb = 2.4;
    cx.beginPath(); cx.moveTo(cxm + c * r1 - s * lb, cy + s * r1 + c * lb); cx.lineTo(cxm + c * r1 + s * lb, cy + s * r1 - c * lb); cx.lineTo(cxm + c * (r1 + L), cy + s * (r1 + L)); cx.closePath(); cx.fill(); }
  cx.restore();
}
/* fios de cabelo caindo das letras (a "gota" da finalizacao, no tema do jogo) */
function fiosCaindo(x0, y0, w, t, n){
  for (let j = 0; j < (n || 18); j++){
    const tj = t - Math.floor(hs(j) * 36); if (tj < 0) continue;
    const yy = y0 + tj * (0.45 + hs(j + 11) * 0.35), a = Math.max(0, 1 - tj / 70); if (a <= 0) continue;
    const xx = x0 + hs(j + 3) * w, bal = Math.sin(tj * 0.12 + j) * 2;
    cx.globalAlpha = a; cx.fillStyle = j & 1 ? '#3a2414' : '#5e3a1e';
    cx.fillRect(Math.round(xx), Math.round(yy), 1, 2); cx.fillRect(Math.round(xx + bal * 0.5), Math.round(yy + 2), 1, 2); cx.fillRect(Math.round(xx + bal), Math.round(yy + 4), 1, 2);
  }
  cx.globalAlpha = 1;
}
/* ---------- fundos e telas ---------- */
const _RAIOS = new Map();
/* leque de raios na cor do lutador (pre-renderizado, girado a cada quadro) */
function raiosFundo(cor, t, alfa, cxm, cy){
  let c = _RAIOS.get(cor);
  if (!c){ c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d'); g.fillStyle = cor;
    for (let i = 0; i < 18; i++){ const a = i * Math.PI * 2 / 18; g.beginPath(); g.moveTo(128, 128); g.arc(128, 128, 182, a, a + Math.PI / 30); g.closePath(); g.fill(); }
    _RAIOS.set(cor, c); }
  cx.save(); cx.globalAlpha = alfa; cx.translate(Math.round(cxm === undefined ? W / 2 : cxm), Math.round(cy === undefined ? H / 2 : cy)); cx.rotate(t * 0.006); cx.scale(2.4, 2.4); cx.drawImage(c, -128, -128); cx.restore();
}
let _VINHETA = null;
/* luz de palco: tudo escuro menos uma elipse (finalizacao, a la fatality) */
function luzPalco(x, y, rx, a){
  if (!_VINHETA){ _VINHETA = document.createElement('canvas'); _VINHETA.width = 256; _VINHETA.height = 128; const g = _VINHETA.getContext('2d');
    const gr = g.createRadialGradient(128, 64, 10, 128, 64, 128); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(0.42, 'rgba(0,0,0,0)'); gr.addColorStop(0.75, 'rgba(6,2,4,.82)'); gr.addColorStop(1, 'rgba(6,2,4,.96)');
    g.fillStyle = gr; g.fillRect(0, 0, 256, 128); }
  const w = rx * 2.3, h = w / 2, x0 = Math.round(x - w / 2), y0 = Math.round(y - h / 2);
  cx.save(); cx.globalAlpha = a; cx.drawImage(_VINHETA, x0, y0, Math.round(w), Math.round(h)); cx.fillStyle = 'rgba(6,2,4,.96)';
  if (x0 > 0) cx.fillRect(0, 0, x0, H); if (x0 + w < W) cx.fillRect(Math.round(x0 + w), 0, W, H); if (y0 > 0) cx.fillRect(x0, 0, Math.round(w), y0); if (y0 + h < H) cx.fillRect(x0, Math.round(y0 + h), Math.round(w), H);
  cx.restore();
}
/* tarjas de cinema (entram de cima e de baixo); devolve a altura de cada uma */
function tarjasCinema(k){ const h = Math.round(24 * easeOut(Math.max(0, Math.min(1, k)))); if (h <= 0) return 0; cx.fillStyle = '#000'; cx.fillRect(0, 0, W, h); cx.fillRect(0, H - h, W, h); ocupa([0, 0, W, h], 9); ocupa([0, H - h, W, H], 9); return h; }
/* quadro de impacto: a tela vira negativo por 2 quadros, lutadores em silhueta branca (golpe que decide) */
let IMPACTO = 0, _IMPACTO_ULT = -99;                                    /* IMPACTO = ultimo quadro de logica com o negativo na tela */
function pedeImpacto(n){ if (FRAME - _IMPACTO_ULT < 24) return; _IMPACTO_ULT = FRAME; IMPACTO = FRAME + (n || 2); }   /* no maximo 2,5 claroes por segundo (WCAG 2.3.1) */
function drawImpacto(){
  if (!IMPACTO || FRAME > IMPACTO) return;
  cx.fillStyle = 'rgba(12,6,16,.9)'; cx.fillRect(0, 0, W, H);
  comZoom(1, () => { for (const l of [L1, L2]) if (l) drawLutador(l, { silh: 'rgba(255,250,236,.98)' }); });
}
/* ---------- faixa com o nome do golpe especial (entra do lado de quem atacou, como nos jogos de luta) ---------- */
let FAIXAS = [];
function anunciaGolpe(l, nome){
  const lado = l === L1 ? -1 : 1, dur = Math.max(54, Math.min(96, Math.round(leitura(nome) * 0.75)));
  FAIXAS = FAIXAS.filter(f => f.lado !== lado); FAIXAS.push({ l, nome: String(nome).toUpperCase(), lado, t: 0, dur });
}
function passoFaixas(){ for (const f of FAIXAS) f.t++; FAIXAS = FAIXAS.filter(f => f.t < f.dur); }
function drawFaixas(){
  for (const f of FAIXAS){
    const e = letreiroImg(f.nome, 1, f.l.C.time === 'calvo' ? 'menta' : 'ouro', 1), w = e.w + 30, h = 15, y = 52;
    const kin = easeBack(Math.min(1, f.t / 8)), kout = f.t > f.dur - 8 ? easeOut((f.t - (f.dur - 8)) / 8) : 0;
    const dir = W - 4 - MARGEM - (HUD_SOBRE ? 34 : 0);   /* 26/10: no toque deitado a faixa da direita para antes do botao de pausa (cobria o II) */
    const x = f.lado < 0 ? Math.round(MARGEM - w + (w + 4) * kin - kout * (w + 8)) : Math.round(dir - w + (1 - kin) * (w + 8) + kout * (w + 8));
    const inc = -0.32;
    cx.save(); cx.translate(x, y); cx.transform(1, 0, inc, 1, 0, 0);
    cx.fillStyle = 'rgba(0,0,0,.45)'; cx.fillRect(3, 3, w, h);                                       /* sombra dura */
    cx.fillStyle = '#140c0a'; cx.fillRect(-1, -1, w + 2, h + 2);
    cx.fillStyle = f.l.C.cor; cx.fillRect(0, 0, w, h); cx.fillStyle = 'rgba(255,255,255,.28)'; cx.fillRect(0, 0, w, 2); cx.fillStyle = 'rgba(0,0,0,.3)'; cx.fillRect(0, h - 3, w, 3);
    cx.fillStyle = f.l.C.cor2; cx.fillRect(f.lado < 0 ? w - 6 : 2, 0, 4, h);                          /* friso na ponta de entrada */
    for (let i = 0; i < 3; i++){ cx.fillStyle = 'rgba(255,255,255,' + (0.18 - i * 0.05) + ')'; cx.fillRect(f.lado < 0 ? -10 - i * 9 : w + 4 + i * 9, 3 + i * 3, 6, 2); }   /* rastro */
    cx.restore();
    const tx = x + w / 2 + inc * h / 2, ty = y + h / 2;
    poeImg(e.c, e, Math.round(tx - 2), Math.round(ty), 1, 1, Math.min(1, f.t / 4), -0.22);
    ocupa([Math.min(x, x - 6), y - 2, x + w + 6, y + h + 3], 6);
  }
}
/* clarao de quem solta o especial + estouro de linhas em volta (efeito no mundo do jogo, sob o zoom) */
function estouroEspecial(l){
  l.brilhoT = 3; FX.push({ tipo: 'estouro', x: l.x, y: l.y - 58 * l.C.escala, t: 0, dur: 12, cor: l.C.cor2 });
  FX.push({ tipo: 'anel', x: l.x, y: l.y - 4, t: 0, dur: 14, cor: l.C.cor2, rx: 34 });
}
function drawFXShow(f, x, y, k){
  if (f.tipo === 'anel'){ anelChoque(x, y, k, f.rx || 30, f.cor); return true; }
  if (f.tipo === 'estouro'){
    cx.save(); cx.strokeStyle = f.cor || '#ffffff'; cx.globalAlpha = 1 - k; cx.lineWidth = 2; cx.beginPath();
    for (let i = 0; i < 10; i++){ const a = i * Math.PI / 5 + 0.3, r0 = 14 + k * 26, r1 = r0 + 10 * (1 - k) + 4; cx.moveTo(Math.round(x + Math.cos(a) * r0), Math.round(y + Math.sin(a) * r0 * 0.8)); cx.lineTo(Math.round(x + Math.cos(a) * r1), Math.round(y + Math.sin(a) * r1 * 0.8)); }
    cx.stroke(); cx.restore(); return true;
  }
  if (f.tipo === 'poeira'){ f.x += f.vx || 0; f.y -= 0.25; cx.fillStyle = 'rgba(236,226,206,' + (0.55 * (1 - k)).toFixed(2) + ')'; const r = Math.round(2 + k * 4); cx.fillRect(Math.round(x - r), Math.round(y - r / 2), r * 2, r); return true; }
  return false;
}
/* contador de combo: o numero salta (1,6x -> 1x) a cada acerto, em letreiro 3D */
function numeroCombo(l, x, y, alinh){
  if (l._comboAnt !== l.combo){ l._comboAnt = l.combo; l._comboPop = 0; } else l._comboPop = (l._comboPop || 0) + 1;
  const e = letreiroImg(String(l.combo), 2, l.combo >= 8 ? 'sangue' : l.combo >= 5 ? 'fogo' : 'ouro', 2), k = Math.min(1, l._comboPop / 6), s = 1.6 - 0.6 * easeOut(k);
  const cxm = alinh === 'L' ? x + e.w / 2 : x - e.w / 2; poeImg(e.c, e, cxm, y + e.h / 2, s, s); return e.w;
}
/* ponto do mundo -> ponto da tela com o zoom da camera (luz de palco acompanha os lutadores no zoom) */
function telaZoom(x, y){ const z = CAMZ.z; return [(x - Math.round(CAMZ.fx)) * z + Math.round(CAMZ.fx), (y - Math.round(CAMZ.fy)) * z + Math.round(CAMZ.fy)]; }
/* placa da finalizacao: as duas metades do nome vem dos lados e batem no meio */
function placaColisao(str, y, t){ const ps = String(str).split(' '); if (ps.length < 2){ anCarimbo(str, W / 2, y + 6, 1, 'ouro', t); return; } const m = Math.ceil(ps.length / 2); anColisao(ps.slice(0, m).join(' '), ps.slice(m).join(' '), W / 2, y, 1, 'ouro', t, { gap: 5 }); }
/* brilho de metal passando pelo logo (a cada 200 quadros, 40 de passagem), recortado pelo proprio desenho do logo */
let _LOGOB = null;
function brilhoLogo(img, cxm, y, larg, t){
  const k = (t % 200) / 40; if (k >= 1 || !img || !img.complete || !img.naturalWidth) return;
  const s = Math.min(1, larg / img.naturalWidth), w = Math.round(img.naturalWidth * s), h = Math.round(img.naturalHeight * s);
  if (!_LOGOB){ _LOGOB = document.createElement('canvas'); } if (_LOGOB.width !== w || _LOGOB.height !== h){ _LOGOB.width = w; _LOGOB.height = h; }
  const g = _LOGOB.getContext('2d'); g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, w, h); g.drawImage(img, 0, 0, w, h); g.globalCompositeOperation = 'source-in';
  const bx = -40 + k * (w + 80); g.fillStyle = 'rgba(255,255,255,.62)'; g.beginPath(); g.moveTo(bx, 0); g.lineTo(bx + 16, 0); g.lineTo(bx + 16 - h * 0.45, h); g.lineTo(bx - h * 0.45, h); g.closePath(); g.fill();
  cx.drawImage(_LOGOB, Math.round(cxm - w / 2), y);
}

/* ==================================================================================
   CENAS, HUD, DESENHO E LOOP
   ================================================================================== */
let SCENE = null, FRAME = 0, L1 = null, L2 = null, CREDITOS = 3;
/* 26/10: relogio de 60 s (era 99): luta curta, sem cara de maratona no celular */
const TEMPO_LUTA = 60;
const LUTA = { fase:'intro', t:0, timer:TEMPO_LUTA, ko:null, musica:'luta', indice:0, lista:[], jogador:'carlos', vitorias:0, modo:'arcade', p2humano:false, cenario:'rua' };
function go(s, arg){ SCENE = s; s.t = 0; FX = []; POPS = []; PROJS = []; FAIXAS = []; IMPACTO = 0; if (typeof scTitle !== 'undefined' && s !== scTitle && s !== scBoot) armaVoltar(); if (s.enter) s.enter(arg); }
function ease(t){ return t < .5 ? 2*t*t : -1 + (4 - 2*t)*t; }
function retrato(id){ return (SHEET && SHEETMAP[id + '_face']) ? id + '_face' : null; }

/* ---------------- fundo / cenario ---------------- */
const PLACAS = /*PLACAS*/{"rua":[[218,82,64,15,"placa"]],"barbearia":[[190,57,64,14,"placa"]],"escritorio":[[163,64,82,33,"tela"]],"salao":[[171,63,48,13,"placa"]],"fantasias":[[293,128,60,15,"placa"]],"banca":[[96,58,80,14,"placa_clara"],[3,90,54,36,"cartaz"]]}/*/PLACAS*/;
/* placa da arte normal (392x224) no lugar dela na arte larga (480x224, teto cortado): a mesma conta do _arte/cenario.py */
const LARGO = { _largo: { w: 480, topo: 252 }, _largo2: { w: 576, topo: 466 }, fh: 1536 };   /* _largo2: celular deitado mais largo que 480 */
function placaLarga(x, y, w, h, tipo, v){ const P = LARGO[v || '_largo'], ky = LARGO.fh / (LARGO.fh - P.topo), kx = P.w / 392, yy = Math.round((y * LARGO.fh / H - P.topo) * H / (LARGO.fh - P.topo));
  if (yy < 60 && tipo === 'tela') return null; return [Math.round(x * kx), Math.max(60, yy), Math.round(w * kx), Math.round(h * ky)]; }   /* abaixo do placar, como no _arte/cenario.py */
function drawStage(nome, escuro){
  const c = CENARIOS[nome] || CENARIOS.rua;
  let im = STAGES[nome], largo = false;
  if (W > 400 || STAGE_W > 400){
    for (const v of (W > 480 || STAGE_W > 480) ? ['_largo2', '_largo'] : ['_largo']){ const kl = nome + v; if (STAGES[kl] === undefined) carregaCenario(kl); if (STAGES[kl]){ im = STAGES[kl]; largo = v; break; } }
  }
  if (im){ const folga = STAGE_W - W, ox = folga > 0 ? -Math.round(CAM * (im.width - W) / folga) : -Math.round((im.width - W) / 2);
    if (im.width < W){ const k = W / im.width; cx.drawImage(im, 0, 0, im.width, im.height, 0, Math.round(H - im.height * k), W, Math.round(im.height * k)); }   /* enquanto a arte larga carrega */
    else cx.drawImage(im, 0, 0, im.width, im.height, ox, 0, im.width, im.height);
    if (SCENE === scFight) for (const p of (PLACAS[nome] || [])){ const q = largo ? placaLarga(p[0], p[1], p[2], p[3], p[4], largo) : p; if (!q) continue; const [x, y, w, h] = q; ocupa(caixaTela(x + ox, y, x + ox + w, y + h), 3); } }
  else {
    cx.fillStyle = c.cor; cx.fillRect(0, 0, W, CHAO - 12);
    cx.fillStyle = c.chao; cx.fillRect(0, CHAO - 12, W, H - CHAO + 12);
    cx.fillStyle = c.chao2; cx.fillRect(0, CHAO + 8, W, 2);
  }
  if (escuro) { cx.fillStyle = 'rgba(0,0,0,' + escuro + ')'; cx.fillRect(0, 0, W, H); }
}

/* ---------------- lutador ---------------- */
function drawLutador(l, opts){
  opts = opts || {};
  const q = quadroDe(l), pose = q.pose, nome = l.id + '_' + pose;
  const sc = l.C.vis || 1;              /* tamanho assado no sprite x escala por cabeca (23/10); l.C.escala so na logica */
  for (const tr of l.trail){ drawSpr(l.id + '_' + tr.pose, tr.x - CAM, tr.y, tr.face < 0, { sc, alpha: 0.22 }); }
  if (q.ghost){ for (let g = 1; g <= q.ghost; g++) drawSpr(nome, l.x - CAM - l.face * g * 7 + q.dx, l.y, l.face < 0, { sc, sx: q.sx, sy: q.sy, alpha: 0.3 / g }); }
  let bob = q.dy;
  const o = { sc, sx: q.sx, sy: q.sy }; if (q.rot) o.rot = q.rot;
  drawSombra(l);
  /* contorno de luz do cenario (23/10): 1 px do lado de cima e da esquerda, de onde vem a luz; separa o lutador do fundo */
  const luz = SCENE === scFight && !opts.silh && !q.rot && !l.sug && CENARIOS[LUTA.cenario] && CENARIOS[LUTA.cenario].luz;
  if (luz){ const fl = (l.face < 0) !== !!q.flip, lx = l.x - CAM + q.dx, ly = l.y + q.dy, cor = luz + '9c';
    drawSpr(nome, lx - 1, ly, fl, { sc, sx: q.sx, sy: q.sy, silh: cor }); drawSpr(nome, lx, ly - 1, fl, { sc, sx: q.sx, sy: q.sy, silh: cor }); }
  if (l.hitT > 0 && (l.hitT & 1)) o.flash = true;
  if (l.brilhoT > 0){ l.brilhoT--; o.flash = true; }               /* clarao de quem solta o especial */
  if (opts.silh) o.silh = opts.silh;
  let x = l.x - CAM + q.dx, y = l.y + bob;
  if (l.estado === 'tonto') x += Math.round(Math.sin(l.t * 0.15) * 3);
  if (l.sug){ o.sc = Math.max(0.08, 1 - l.sug.k) * sc; x = x + (l.sug.tx - l.x) * l.sug.k; y = y + (l.sug.ty - l.y) * l.sug.k; if (l.sug.k >= 1) return; }
  const flipar = (l.face < 0) !== !!q.flip;
  if (!drawSpr(nome, x, y, flipar, o)){
    /* sem sprite ainda: caixa de posicao (so em desenvolvimento) */
    const e = l.C.escala; cx.fillStyle = l.C.cor; cx.fillRect(Math.round(x - 14 * e), Math.round(y - 100 * e), Math.round(28 * e), Math.round(100 * e));
    txtT(pose, x, y - 110 * e, CREME);
  }
  if (l.manchado) drawSpr(nome, x, y, l.face < 0, { sc, silh: 'rgba(20,10,30,.4)' });
  if (l.pintado) { drawSpr(nome, x, y, l.face < 0, { sc, silh: 'rgba(16,14,20,' + l.pintado.toFixed(2) + ')' }); if (l.pintado > 0.9 && pose !== 'ko'){ cx.fillStyle = '#fff'; cx.fillRect(Math.round(x + l.face * 4), Math.round(y - 96 * l.C.ev), 2, 2); cx.fillRect(Math.round(x + l.face * 9), Math.round(y - 96 * l.C.ev), 2, 2); } }
  if (l.perucaNaCabeca){ const hy = pose === 'ko' ? y - 24 : y - 104 * l.C.ev; const hx = pose === 'ko' ? x + l.face * 34 : x + l.face * 2; if (!drawSpr('fx_peruca', hx, hy + 12, l.face < 0, { sc: 0.9 })){ cx.fillStyle = '#8a5a32'; cx.fillRect(hx - 12, hy - 6, 24, 12); } }
  if (l.zerado && pose !== 'ko' && LUTA.fase !== 'ko' && !POPS.some(p => p.texto === 'ZERADO!' && Math.abs(p.x - l.x) < 70) && !(ITEM && (!ITEM.pousou || ITEM.t - (ITEM.tPouso || 0) < 50))){ const zy = yTelaMin(y - 118 * l.C.ev, 62), zr = caixaTela(x - 13, zy - 1, x + 13, zy + 6);
    if (!OCUPADO_ANT.some(o => o[4] === 6 && o[0] < zr[2] && o[2] > zr[0] && o[1] < zr[3] && o[3] > zr[1])){ txtMini('ZERADO', x, zy, AMARELO); ocupa(zr, 5); } }
}

/* ---------------- efeitos ---------------- */
function drawProjeteis(){
  for (const p of PROJS){
    const nome = 'fx_' + p.tipo; const x = p.x - CAM, y = p.y + (p.tipo === 'lifeline' ? Math.sin(p.t * .4) * 2 : 0);
    if (p.tipo === 'peruca' || p.gira){
      cx.save(); cx.translate(Math.round(x), Math.round(y)); cx.rotate(p.tipo === 'peruca' ? p.t * 0.35 * p.face : p.rot);
      if (!drawSpr(nome, 0, 12, p.face < 0, { sc: p.sc })){                     /* gira so no plano da tela (23/10: o pulso de perto e longe mostrava a imagem chapada) */ cx.fillStyle = p.tipo === 'peruca' ? '#8a5a32' : p.dono.C.cor2; cx.fillRect(-12, -7, 24, 14); }
      cx.restore(); continue;
    }
    if (p.tipo === 'lifeline'){                        /* deixa a linha (a Lifeline da marca) atras de si e cresce ao avancar */
      p.rastro = p.rastro || []; p.rastro.push([x, y]); if (p.rastro.length > 16) p.rastro.shift();
      if (p.rastro.length > 1){ cx.save(); cx.strokeStyle = MINT; cx.lineWidth = 3; cx.lineJoin = 'round'; cx.beginPath(); p.rastro.forEach(([rx, ry], i) => { if (i === 0) cx.moveTo(Math.round(rx), Math.round(ry)); else cx.lineTo(Math.round(rx), Math.round(ry)); }); cx.stroke(); cx.restore(); }
    }
    const sc3 = p.tipo === 'lifeline' ? p.sc * Math.min(1.35, 0.8 + p.t * 0.02) : p.tipo === 'nuvem' ? p.sc * (1 + 0.08 * Math.sin(p.t * 0.25)) : p.sc;
    const sx3 = p.tipo === 'feixe' ? Math.min(2.2, 1 + p.t * 0.05) : 1;
    if (!drawSpr(nome, x, y + p.h / 2 * sc3, p.face < 0, { sc: sc3, sx: sx3, alpha: p.parado && p.t > 80 ? (96 - p.t) / 16 : 1 })){
      cx.fillStyle = p.dono.C.cor2; cx.fillRect(Math.round(x - 12), Math.round(y - 8), 24, 16);
    }
  }
}
function drawFX(){
  for (const f of FX){
    const x = f.x - CAM, y = f.y, k = f.t / f.dur;
    if (drawFXShow(f, x, y, k)) continue;                      /* anel de choque, estouro do especial, poeira (_src_4i_show.js) */
    if (f.tipo === 'spark_s' || f.tipo === 'spark_l'){
      const s = (f.sc || 1) * (k < .4 ? 0.5 + k * 1.6 : 1.14 - (k - .4) * 0.8);
      if (!drawSpr('fx_' + f.tipo, x, y + 14 * s, (f.t & 2) > 0, { sc: s, alpha: k > .7 ? (1 - k) / .3 : 1 })){
        cx.fillStyle = f.tipo === 'spark_l' ? '#ffe680' : '#ffffff'; const r = 6 * s; cx.fillRect(x - r, y - 2, r * 2, 4); cx.fillRect(x - 2, y - r, 4, r * 2);
      }
    } else if (f.tipo === 'dust'){
      const s = 0.6 + k * 0.8;
      if (!drawSpr('fx_dust', x, y + 4, false, { sc: s, alpha: 1 - k })){ cx.fillStyle = 'rgba(240,235,220,' + (1-k)*.7 + ')'; cx.fillRect(x - 10 * s, y - 4, 20 * s, 4); }
    } else if (f.tipo === 'zzz'){
      f.y += f.vy || -0.6;
      if (!drawSpr('fx_zzz', x, y, false, { sc: 0.6 + k * 0.4, alpha: 1 - k })) txtT('Z', x, y - 8, CREME);
    } else if (f.tipo === 'tufo'){
      f.x += f.vx; f.y += f.vy; f.vy += 0.15; cx.fillStyle = f.cor; cx.fillRect(Math.round(x), Math.round(y), 3, 2);
    } else if (f.tipo === 'estrela'){
      f.y += f.vy || 0; const a = f.t * 0.4; const sx = x + Math.cos(a) * 12, sy = y + Math.sin(a) * 4;
      cx.fillStyle = (f.t & 4) ? (f.cor || AMARELO) : CREME; cx.fillRect(Math.round(sx) - 1, Math.round(sy) - 3, 3, 7); cx.fillRect(Math.round(sx) - 3, Math.round(sy) - 1, 7, 3);
    } else if (f.tipo === 'lifeline_sobe'){
      f.y -= 0.9; if (!drawSpr('fx_lifeline', x + f.face * 6, y, f.face < 0, { sc: 0.6, alpha: 1 - k })){ cx.fillStyle = MINT; cx.globalAlpha = 1 - k; cx.fillRect(x - 10, y - 4, 20, 3); cx.globalAlpha = 1; }
    } else if (f.tipo === 'rajada'){
      f.x += f.vx; cx.fillStyle = 'rgba(255,255,255,' + (0.55 * (1 - k)).toFixed(2) + ')'; cx.fillRect(Math.round(x), Math.round(y), Math.round(f.larg), 1);
    } else if (f.tipo === 'folha'){
      f.x += f.vx; f.y += f.vy + Math.sin(f.t * 0.3) * 0.6; cx.fillStyle = f.cor; cx.fillRect(Math.round(x), Math.round(y), 3, 2); cx.fillRect(Math.round(x) + 1, Math.round(y) - 1, 1, 1);
    } else if (f.tipo === 'peruca_voo'){
      if (f.vx){ f.x += f.vx; f.y += f.vy; f.vy += 0.03; f.rot = (f.rot || 0) - 0.25; }
      cx.save(); cx.translate(Math.round(x), Math.round(y)); cx.rotate(f.rot || 0); if (!drawSpr('fx_peruca', 0, 10, false, { sc: 0.9 })){ cx.fillStyle = '#8a5a32'; cx.fillRect(-12, -6, 24, 12); } cx.restore();
    } else if (f.tipo === 'notificacao'){
      const yy = yTelaMin(f.alvo - Math.round((1 - ease(Math.min(1, f.t / 14))) * 18) + (f.t >= 14 && f.t < 22 ? Math.round(Math.sin((f.t - 14) * 1.2) * 3) : 0), 62);
      const x = Math.max(124, Math.min(W - 124, f.x - CAM));
      const lin = wrap(f.txt, 24), hb = 22 + lin.length * 10;             /* texto longo quebra em linhas e a caixa cresce */
      cx.fillStyle = INK; cx.fillRect(x - 122, yy - 1, 244, hb + 2); cx.fillStyle = CREME; cx.fillRect(x - 120, yy, 240, hb); cx.fillStyle = MINT; cx.fillRect(x - 120, yy, 4, hb);
      if (!drawSpr('fx_sino', x - 100, yy + 30, false, { sc: 1 })){ cx.fillStyle = CORAL; cx.fillRect(x - 108, yy + 8, 14, 16); }
      txtL('MANUAL', x - 86, yy + 6, TEAL); lin.forEach((s, i) => txtL(s, x - 86, yy + 18 + i * 10, INK)); ocupa(caixaTela(x - 122, yy - 1, x + 122, yy + hb + 1), 8); f.baixo = yy + hb + 1;
      cx.fillStyle = CORAL; cx.fillRect(x + 100, yy + 6, 6, 6);
    } else if (f.tipo === 'gota'){
      f.y += f.vy; f.vy += 0.12; cx.fillStyle = '#16141a'; cx.fillRect(Math.round(x), Math.round(y), 2, 4);
    } else if (f.tipo === 'coracao'){
      f.y += f.vy; f.x += Math.sin(f.t * .2) * .5; cx.fillStyle = k > .7 ? '#ffb3a6' : CORAL; cx.fillRect(Math.round(x) - 2, Math.round(y) - 1, 2, 2); cx.fillRect(Math.round(x) + 1, Math.round(y) - 1, 2, 2); cx.fillRect(Math.round(x) - 3, Math.round(y), 7, 2); cx.fillRect(Math.round(x) - 2, Math.round(y) + 2, 5, 1); cx.fillRect(Math.round(x) - 1, Math.round(y) + 3, 3, 1); cx.fillRect(Math.round(x), Math.round(y) + 4, 1, 1);
    } else if (f.tipo === 'toalha'){
      if (!drawSpr('fx_toalha', x, y + 14, f.face < 0, { sc: 1 })){ cx.fillStyle = CREME; cx.fillRect(x - 22, y - 5, 44, 8); }
    } else if (f.tipo === 'maquina'){
      if (!drawSpr('fx_maquina', x, y + 16, f.face < 0, { sc: 1 })){ cx.fillStyle = '#3a4048'; cx.fillRect(x - 10, y - 6, 20, 12); }
    } else if (f.tipo === 'lifeline_hiper'){
      f.x += f.face * 2.2;
      for (let i = 0; i < 4; i++){ const xx = x - f.face * i * 46 * 1.2; const yy = y - i * 8 - Math.sin((f.t + i * 6) * .3) * 3;
        if (!drawSpr('fx_lifeline', xx, yy, f.face < 0, { sc: 2.4, alpha: 0.95 })){ cx.fillStyle = MINT; cx.fillRect(xx - 40, yy - 10, 80, 10); } }
    } else if (f.tipo === 'reuniao'){
      const yy = yTelaMin(60 - Math.round((1 - ease(Math.min(1, f.t / 12))) * 14), 60); cx.save(); cx.globalAlpha = Math.min(1, f.t / 8, (f.dur - f.t) / 8);
      cx.fillStyle = 'rgba(8,28,40,.92)'; cx.fillRect(40, yy, W - 80, 70); ocupa(caixaTela(40, yy, W - 40, yy + 70), 8);
      cx.fillStyle = AZUL; cx.fillRect(40, yy, W - 80, 2); cx.fillRect(40, yy + 68, W - 80, 2);
      if (!drawSpr('fx_feixe', W / 2 - 100, yy + 62, false, { sc: 1.4 })) {}
      if (f.rosto){ const r = retrato(f.rosto); if (r){ const [sx, sy, sw, sh] = mapaSlot(r); cx.drawImage(folhaSlot(r), sx, sy, sw, sh, W/2 - 24, yy + 8, 48, 48); } if (!drawSpr('fx_mudo', W/2 + 24, yy + 58, false, { sc: 1 })){ cx.fillStyle = '#e04040'; cx.fillRect(W/2 + 16, yy + 44, 10, 10); cx.fillStyle = CREME; cx.fillRect(W/2 + 19, yy + 46, 4, 5); cx.fillStyle = '#e04040'; cx.fillRect(W/2 + 17, yy + 52, 8, 1); }
        txtT('SUA CAMERA FOI LIGADA', W / 2 + 90, yy + 16, CREME); txtT('CAMERA LIGADA', W / 2 + 90, yy + 32, AZUL); txtMini('DESLIGAR CAMERA: INDISPONIVEL', W / 2 + 90, yy + 50, CORAL); }
      else { txtT('REUNIAO DE ALINHAMENTO', W / 2 + 20, yy + 12, CREME); txtT('SLIDE ' + (1 + ((f.t / 12) | 0)) + ' DE 99', W / 2 + 20, yy + 28, AZUL); }
      txtMini('GRAVANDO', W / 2 + 20, yy + 46, CORAL); cx.fillStyle = (f.t & 16) ? '#e04040' : '#600'; cx.fillRect(W / 2 - 4, yy + 46, 4, 4); cx.restore();
    } else if (f.tipo === 'perucao'){
      if (f.t < 34) f.y = -80 + ease(f.t / 34) * (CHAO - 30 + 80); else f.y = CHAO - 30 + Math.sin(f.t * .5) * 1.5;
      if (!drawSpr('fx_peruca', x, f.y + 40, false, { sc: 3.6 })){ cx.fillStyle = '#8a5a32'; cx.fillRect(x - 50, f.y - 30, 100, 70); }
    } else if (f.tipo === 'nuvem_hiper'){
      f.x += f.vx;
      if (!drawSpr('fx_nuvem', x, y + 40, f.vx < 0, { sc: f.sc, alpha: k > .8 ? (1 - k) / .2 : 1 })){ cx.fillStyle = '#20242a'; cx.fillRect(x - 50, y - 40, 100, 80); }
    }
  }
}
function passoFX(){ for (const f of FX) f.t++; FX = FX.filter(f => f.t < f.dur); for (const p of POPS) p.t++; POPS = POPS.filter(p => p.t < p.dur); passoFaixas(); }
function drawPops(){
  let desce = 0; for (const p of POPS){ const y = p.y - Math.min(12, p.t * .8); desce = Math.max(desce, yTelaMin(y, 60) - y); }
  for (const p of POPS){ const k = p.t / p.dur, y = p.y - Math.min(12, p.t * .8) + desce, x = p.x - CAM + p.vx * p.t, w = larguraT(p.texto); ocupa(caixaTela(x - w / 2 - 2, y - 2, x + w / 2 + 2, y + 9), 6); if (k > .85 && (p.t & 1)) continue;
    if (p.estilo === 'carimbo'){ const e = letreiroImg(p.texto, 1, 'ouro', 1), s = p.t < 5 ? 2.2 - p.t * 0.26 : p.t < 8 ? 0.9 + (p.t - 5) * 0.033 : 1; poeImg(e.c, e, x, y + 4, s, s, Math.min(1, (p.t + 1) / 3), -0.2); continue; }   /* arremesso: carimbo inclinado */
    plaquinha(x, y, w); txtO(p.texto, x, y, p.cor, INK); }
}
/* plaquinha escura atras de texto curto sobre o cenario (23/10: "simplifique o que esta truncado"; o pop encavalava na placa do cenario) */
function plaquinha(cxm, y, w){ cx.fillStyle = 'rgba(8,10,22,.6)'; cx.fillRect(Math.round(cxm - w / 2 - 4), Math.round(y - 3), Math.round(w + 8), 13); }

/* ---------------- HUD ---------------- */
/* HUD: _src_4g_hud.js */

/* ---------------- cut-in do hiper ---------------- */
function drawCutin(){
  /* 19/10 (referencias KOF, SF Alpha, MvC): a luta congela, o fundo vira leque de raios na cor do lutador, uma faixa diagonal
     atravessa a tela com o rosto correndo dentro (corte nos olhos) e o nome do HIPER cai letra a letra em 3D;
     a frase de efeito sai na maquina de escrever. Mesma duracao de antes (58 quadros). */
  const h = HIPER; if (!h || h.fase !== 'cutin') return;
  const l = h.l, t = h.t, esq = l.face > 0, dir = esq ? 1 : -1;
  cx.fillStyle = 'rgba(0,0,0,.7)'; cx.fillRect(0, 0, W, H);
  raiosFundo(l.C.cor2, t * 3, 0.14, esq ? W * 0.28 : W * 0.72, 150);
  comZoom(1, () => drawLutador(l, { silh: t < 6 ? 'rgba(255,255,255,.9)' : null }));
  const kin = easeBack(Math.min(1, t / 8)), sai = t > 48 ? easeOut((t - 48) / 10) : 0, dx = Math.round(-dir * (1 - kin) * W + dir * sai * W);
  const by = 60, bh = 56, inc = -0.2 * dir, T0 = cx.getTransform();
  cx.save(); cx.translate(dx, 0); cx.translate(0, by + bh / 2); cx.transform(1, 0, inc, 1, 0, 0); cx.translate(0, -(by + bh / 2));
  cx.fillStyle = '#140c0a'; cx.fillRect(-40, by - 3, W + 80, bh + 6);
  cx.fillStyle = l.C.cor; cx.fillRect(-40, by, W + 80, bh);
  cx.fillStyle = 'rgba(255,255,255,.22)'; cx.fillRect(-40, by, W + 80, 2); cx.fillStyle = 'rgba(0,0,0,.32)'; cx.fillRect(-40, by + bh - 6, W + 80, 6);
  cx.fillStyle = l.C.cor2; cx.fillRect(-40, by - 3, W + 80, 1); cx.fillRect(-40, by + bh + 2, W + 80, 1);
  cx.beginPath(); cx.rect(-40, by, W + 80, bh); cx.clip();
  for (let i = 0; i < 12; i++){ const yy = by + 4 + (i * 13) % (bh - 6), comp = 24 + (i * 29) % 50, v = ((t * (14 + i % 4) + i * 53) % (W + 120)) - 60;   /* linhas de velocidade dentro da faixa */
    cx.fillStyle = 'rgba(255,255,255,' + (0.1 + (i % 3) * 0.06).toFixed(2) + ')'; cx.fillRect(Math.round(esq ? v : W - v - comp), yy, comp, 1); }
  cx.setTransform(T0); cx.translate(dx, 0);                    /* o rosto fica reto dentro da faixa inclinada (23/10: inclinado ele parecia um papel) */
  const r = retrato(l.id);
  if (r){ const [sx, sy, sw, sh] = mapaSlot(r), d = 136, px = Math.round(esq ? 34 + t * 0.7 : W - 34 - d - t * 0.7), py = by + bh / 2 - Math.round(d * 0.47);
    cx.save(); if (!esq){ cx.translate(px + d, py); cx.scale(-1, 1); cx.drawImage(folhaSlot(r), sx, sy, sw, sh, 0, 0, d, d); } else cx.drawImage(folhaSlot(r), sx, sy, sw, sh, px, py, d, d); cx.restore(); }
  cx.restore();
  /* nome do HIPER: em cima da faixa, letra a letra; frase de efeito embaixo dela */
  const tx0 = esq ? W * 0.64 : W * 0.36, linhas = wrap(l.C.hiperNome, 17), sobe = Math.round(sai * 30);
  cx.save(); cx.globalAlpha = 1 - sai;
  const ny = by + bh + 8, ty = ny + linhas.length * 22 + 2;            /* tudo embaixo da faixa: em cima fica o HUD */
  linhas.forEach((ln, i) => anuncio(ln, tx0, ny + 8 + i * 22 + sobe, 2, 'fogo', t - 6 - i * 10, Infinity, { faixa: false }));
  anMaquina(l.C.hiperTxt, tx0, ty + sobe, CREME, t - 18, { borda: INK, passo: 1 });
  if (l.id === 'carlos') placaMarca(72, tx0, ty + 13 + sobe, 4);
  cx.restore();
}

/* fita escura com pontas recortadas atras de uma frase (layout do titulo, 23/10): a frase le em cima do cenario */
function fitaTitulo(str, cxm, y){
  const w = larguraT(str) + 30, x0 = Math.round(cxm - w / 2), h = 16;
  cx.fillStyle = 'rgba(0,0,0,.35)'; cx.fillRect(x0 + 3, y + 3, w, h);
  cx.fillStyle = '#0d1430'; cx.beginPath(); cx.moveTo(x0 - 8, y); cx.lineTo(x0 + w + 8, y); cx.lineTo(x0 + w, y + h / 2); cx.lineTo(x0 + w + 8, y + h); cx.lineTo(x0 - 8, y + h); cx.lineTo(x0, y + h / 2); cx.closePath(); cx.fill();
  cx.fillStyle = 'rgba(243,236,214,.55)'; cx.fillRect(x0, y + 1, w, 1); cx.fillRect(x0, y + h - 2, w, 1);
  letreiro(str, cxm, y + 4, 1, 'ouro');
}
/* ---------------- logo do CALVO FIGHTER (nome novo, 18/10): arte do Magnific recortada em extras/logo_cf.png, desenhada
   no tamanho dela (sem reamostrar); enquanto nao carrega, o nome sai em letra de fliperama com degrade ---------------- */
const LOGO_CF = (() => { const im = new Image(); im.src = BASE_ARQ + 'extras/logo_cf.png?v=/*VSHEET*/4285/*/VSHEET*/'; return im; })();
function logoCF(cxm, y, larg, g){
  g = g || cx; const ok = LOGO_CF.complete && LOGO_CF.naturalWidth;
  if (ok){ const k = Math.min(1, larg / LOGO_CF.naturalWidth), w = Math.round(LOGO_CF.naturalWidth * k), h = Math.round(LOGO_CF.naturalHeight * k); g.drawImage(LOGO_CF, Math.round(cxm - w / 2), y, w, h); return h; }
  if (g !== cx) return 0;
  txt2('CALVO', cxm, y + 2, '#fff3a0', '#ff9d1c', '#1a1210', 4, 'C'); txt2('FIGHTER', cxm, y + 38, '#ffe75a', '#e0512a', '#1a1210', 4, 'C'); return 72;
}
/* letreiro de fliperama de luta (18/10): degrade em faixas horizontais, contorno escuro e sombra, o mesmo em todo anuncio
   (LUTA!, K.O., VOCE VENCEU, CONTINUAR?, PAUSA, titulos de tela), para todas as telas falarem a mesma lingua */
const PALETAS = { fogo: ['#fff7b0', '#ffd23a', '#ff9a1f', '#e8441c'], ouro: ['#ffffff', '#ffe96a', '#ffc21f', '#d9781a'], gelo: ['#ffffff', '#c6f1ff', '#62c6f2', '#2a6fd1'],
  sangue: ['#ffd6c8', '#ff6a4a', '#e0241a', '#8a0f0a'], menta: ['#ffffff', '#d4f7df', '#9fe4b2', '#3f9a6a'],
  cromo: ['#ffffff', '#d5dce8', '#6c7890', '#c7d0de'] };   /* metal cromado: claro, faixa escura no meio, claro de novo */
function letreiro(str, x, y, sc, pal, alinh, italico, prof){
  /* 19/10: sai da imagem pronta em 3D (extrusao + contorno do bloco, _src_4i_show.js); escala quebrada (zoom de entrada)
     desenha a imagem inteira mais proxima esticada, para nao montar um letreiro novo a cada quadro */
  sc = sc || 2; const base = Math.max(1, Math.ceil(sc - 0.001)), k = sc / base, e = letreiroImg(str, base, pal, prof);
  const w = e.w * k, x0 = alinh === 'L' ? x : alinh === 'R' ? x - w : x - w / 2;
  cx.save(); if (italico){ cx.translate(x, y + 4 * sc); cx.transform(1, 0, -0.22, 1, 0, 0); cx.translate(-x, -(y + 4 * sc)); }   /* inclinado, como os anuncios de luta */
  if (k === 1) cx.drawImage(e.c, Math.round(x0) - e.ox, Math.round(y) - e.oy);
  else cx.drawImage(e.c, Math.round(x0 - e.ox * k), Math.round(y - e.oy * k), Math.round(e.c.width * k), Math.round(e.c.height * k));
  cx.restore();
}
/* ---------------- componentes de menu (padrao dos jogos de celular deitados: Brawl Stars, Mortal Kombat, SF IV) ----------------
   VOLTAR sempre no canto de cima a esquerda, do mesmo tamanho; a acao principal grande, embaixo a direita (zona do polegar);
   no toque as dicas saem em letra normal (a miuda some na tela do celular). */
function setaPx(x, y, dir, cor, t){ cx.fillStyle = cor; for (let q = 0; q < (t || 4); q++) cx.fillRect(dir < 0 ? x + q : x - q, y - q, 1, 1 + q * 2); }
/* 19/10: botao com espessura (lateral de 3 px mais escura, sombra dura, chanfro de luz) que AFUNDA no toque, como os botoes
   gordinhos dos jogos de celular (Brawl Stars, Clash); o toque fica marcado por 140 ms em UI_APERTO */
let UI_APERTO = null;
function escurece(cor, k){ const m = /^#([0-9a-f]{6})$/i.exec(cor || ''); if (!m) return 'rgba(0,0,0,.55)'; const n = parseInt(m[1], 16); return 'rgb(' + [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.round(v * k)).join(',') + ')'; }
function apertado(r){ return UI_APERTO && performance.now() - UI_APERTO.ms < 140 && dentro(UI_APERTO.x, UI_APERTO.y, r); }
function botaoUI(r, rotulo, cor, corTxt, o){
  o = o || {}; const [x, y0, w, h] = r, sc = o.sc || 1, p = apertado(r) ? 2 : 0, y = y0 + p, lat = 3 - p;
  cx.fillStyle = 'rgba(0,0,0,.4)'; cx.fillRect(x + 2, y0 + 3, w + 1, h + 3);                       /* sombra dura no chao */
  cx.fillStyle = INK; cx.fillRect(x - 1, y - 1, w + 2, h + lat + 2);                                /* contorno do bloco */
  cx.fillStyle = escurece(cor, 0.5); cx.fillRect(x, y + h - 1, w, lat + 1);                          /* lateral */
  cx.fillStyle = cor; cx.fillRect(x, y, w, h - 1);
  cx.fillStyle = 'rgba(255,255,255,.34)'; cx.fillRect(x, y, w, 1); cx.fillStyle = 'rgba(255,255,255,.14)'; cx.fillRect(x, y + 1, 1, h - 3); cx.fillRect(x, y + 1, w, 1);   /* chanfro de luz */
  cx.fillStyle = 'rgba(0,0,0,.22)'; cx.fillRect(x, y + h - 3, w, 2); cx.fillRect(x + w - 1, y + 1, 1, h - 3);
  if (o.sel){ cx.fillStyle = (FRAME & 8) ? CREME : AMARELO; cx.fillRect(x - 3, y - 3, w + 6, 1); cx.fillRect(x - 3, y + h + lat + 2, w + 6, 1); cx.fillRect(x - 3, y - 3, 1, h + lat + 6); cx.fillRect(x + w + 2, y - 3, 1, h + lat + 6); }
  if (rotulo){ const ty = y + Math.round((h - 2 - 8 * sc) / 2) + 1; txtT(rotulo, x + w / 2 + (o.dx || 0) + 1, ty + 1, o.sombra || 'rgba(8,6,12,.85)', sc); txtT(rotulo, x + w / 2 + (o.dx || 0), ty, corTxt || '#ffffff', sc); }   /* 23/10 (layouts): sombra dura no rotulo */
}
const UI_VOLTAR = [4, 4, 64, 16];
function botaoVoltar(){ if (LAY !== 'toque') return; botaoUI(UI_VOLTAR, 'VOLTAR', '#123332', CREME, { dx: 4 }); setaPx(UI_VOLTAR[0] + 6, UI_VOLTAR[1] + 7, -1, CREME); }
const tocouVoltar = (x, y) => LAY === 'toque' && x < 78 && y < 26;
function dica(str, cxX, y, cor){ txtT(str, cxX + 1, y + 1, 'rgba(8,6,12,.7)'); txtT(str, cxX, y, cor || 'rgba(243,241,238,.75)'); }   /* 23/10: com sombra, le sobre qualquer fundo */
/* seletor de valor (< FACIL >): toque na metade esquerda volta, na direita avanca */
function seletorUI(r, rotulo, valor, corValor, sel){
  const [x, y, w, h] = r; cx.fillStyle = 'rgba(0,0,0,.4)'; cx.fillRect(x + 2, y + 3, w + 1, h + 2);   /* sombra dura e lateral: o seletor tambem tem espessura */
  cx.fillStyle = sel ? ((FRAME & 8) ? CREME : AMARELO) : INK; cx.fillRect(x - 1, y - 1, w + 2, h + 4);
  cx.fillStyle = '#081232'; cx.fillRect(x, y + h - 1, w, 3);
  cx.fillStyle = '#0e1d44'; cx.fillRect(x, y, w, h - 1); cx.fillStyle = 'rgba(255,255,255,.12)'; cx.fillRect(x, y, w, 1);
  /* 23/10 ("simplifique o que esta truncado"): o rotulo sai na letra normal quando cabe (antes era miudo e parecia cortado) */
  const cabe = h >= 22 && larguraT(rotulo) <= w - 4, vy = cabe ? y + Math.round((h - 18) / 2) + 10 : y + h - 12;
  /* 23/10 (layout da pausa): rotulo apagado em cima, valor em destaque com sombra dura, setas amarelas maiores */
  if (cabe){ txtT(rotulo, x + w / 2, vy - 10, sel ? AMARELO : 'rgba(243,241,238,.55)'); txtT(valor, x + w / 2 + 1, vy + 1, 'rgba(8,6,12,.85)'); txtT(valor, x + w / 2, vy, corValor || CREME); }
  else { txtMini(rotulo, x + w / 2, y + 4, sel ? AMARELO : 'rgba(243,241,238,.7)'); txtT(valor, x + w / 2 + 1, vy + 1, 'rgba(8,6,12,.85)'); txtT(valor, x + w / 2, vy, corValor || CREME); }
  const k = (FRAME >> 4) & 1; setaPx(x + 6 - k, vy + 4, -1, AMARELO, 5); setaPx(x + w - 7 + k, vy + 4, 1, AMARELO, 5);
}
/* ---------------- CENA: boot ---------------- */
const scBoot = {
  enter(){ musica(null); },
  update(){ this.t++; if (this.t > 96 || HIT.p1.start || this.tocou) go(scTitle); },   /* 1,6 s (era 2,5 s): quem vem do anuncio chega mais rapido no titulo; um toque pula */
  toque(){ this.tocou = true; },
  draw(){
    cx.fillStyle = HERO; cx.fillRect(0, 0, W, H);
    /* 23/10 (layout do Magnific, 01 ABERTURA): refletor oval no centro e bordas no escuro, linhas de TV; MANUALSOFT grande com sombra dura,
       filete coral com pontas recortadas, SAUDE DO HOMEM com sombra e barra de carga com moldura */
    cx.save(); cx.globalCompositeOperation = 'lighter'; brilho(cx, W / 2, 100, 190, 96, 0.3, 'rgba(120,230,200,'); cx.restore();
    if (!this.vinh || this.vinhW !== W){ this.vinhW = W; this.vinh = cx.createRadialGradient(W / 2, 100, 70, W / 2, 100, W * 0.62); this.vinh.addColorStop(0, 'rgba(2,14,16,0)'); this.vinh.addColorStop(1, 'rgba(2,14,16,.62)'); }
    cx.fillStyle = this.vinh; cx.fillRect(0, 0, W, H);
    cx.fillStyle = 'rgba(0,0,0,.14)'; for (let y = 0; y < H; y += 3) cx.fillRect(0, y, W, 1);
    const k = Math.min(1, this.t / 30);
    { const str = 'MANUALSOFT', sc = 3, y0 = 66; let x = Math.round(W / 2 - larguraT(str, sc) / 2);   /* letra a letra, caindo no lugar */
      for (let i = 0; i < str.length; i++){ const lt = this.t - i * 2; if (lt >= 0){ const e = Math.min(1, lt / 7), y = y0 - Math.round((1 - easeOut(e)) * 12);
          cx.globalAlpha = e; for (const d of [3, 2, 1]) txtL(str[i], x + d, y + d, '#04201f', sc); for (const [ox, oy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) txtL(str[i], x + ox, y + oy, INK, sc); txtL(str[i], x, y, CREME, sc); cx.globalAlpha = 1; }
        x += 8 * sc; } }
    { const hw = Math.round(122 * easeOut(k)), y = 98;   /* filete coral: corpo, sombra e tres riscos inclinados em cada ponta */
      if (hw > 2){ cx.fillStyle = '#04201f'; cx.fillRect(W / 2 - hw + 2, y + 2, hw * 2, 4); cx.fillStyle = CORAL; cx.fillRect(W / 2 - hw, y, hw * 2, 4); cx.fillStyle = '#ffd0c4'; cx.fillRect(W / 2 - hw, y, hw * 2, 1);
        if (k >= 1) for (const sd of [-1, 1]) for (let j = 0; j < 3; j++){ const bx = W / 2 + sd * (hw + 3 + j * 5); for (let r = 0; r < 4; r++){ cx.fillStyle = CORAL; cx.fillRect(Math.round(bx + (3 - r) * sd * 0.6) - (sd < 0 ? 2 : 0), y + r, 2, 1); } } } }
    if (this.t > 34){ const a = Math.min(1, (this.t - 34) / 8); cx.globalAlpha = a; txtT('SAUDE DO HOMEM', W / 2 + 1, 112, '#04201f'); txtO('SAUDE DO HOMEM', W / 2, 111, MINT, INK); cx.globalAlpha = 1; }
    { const bw = 132, bx = Math.round(W / 2 - bw / 2), y = 132, pr = Math.min(1, this.t / 90);   /* barra de carga com moldura creme */
      cx.fillStyle = INK; cx.fillRect(bx - 2, y - 2, bw + 4, 9); cx.fillStyle = 'rgba(243,241,238,.85)'; cx.fillRect(bx - 1, y - 1, bw + 2, 7); cx.fillStyle = '#062624'; cx.fillRect(bx, y, bw, 5);
      const f = Math.round(bw * pr); cx.fillStyle = MINT; cx.fillRect(bx, y, f, 5); cx.fillStyle = '#d6f7df'; cx.fillRect(bx, y, f, 1); if (f > 3 && pr < 1){ cx.fillStyle = CORAL; cx.fillRect(bx + f - 3, y, 3, 5); } }
    if (this.t > 80) txtT('1999 . COROA CITY ARCADE', W/2, 152, 'rgba(243,241,238,.6)');
  }
};
/* ---------------- CENA: titulo ---------------- */
const scTitle = {
  enter(){ musica('titulo'); carregaCenario('rua_limpo'); adiaCarga(() => carregaCenario('rua')); this.a = novoLutador('carlos', 1, 'ia'); this.b = novoLutador('tonho', -1, 'ia'); this.a.x = 54; this.b.x = 330; this.a.y = this.b.y = 206; CAM = 0; },
  update(){
    this.t++; FRAME++;
    if (HIT.p1.start || HIT.p1.p || this.tocou){ this.tocou = false; LUTA.p2humano = false; SFX.moeda(); go(scSelect); }
    else if (HIT.p2.start && LAY === 'desk'){ LUTA.p2humano = true; SFX.moeda(); go(scSelect); }
    else if (this.t > 720){ const a = ORDEM[(Math.random() * 6) | 0]; const outros = ORDEM.filter(id => CHARS[id].time !== CHARS[a].time); const b = outros[(Math.random() * outros.length) | 0]; /* demo sempre calvo x cabeludo */ LUTA.jogador = a; LUTA.lista = [b, b, b]; LUTA.indice = (Math.random() * 3) | 0; LUTA.demo = true; LUTA.demoEntrada = ENTRADA_REAL; go(scFight); }
  },
  toque(){ this.tocou = true; },
  draw(){
    drawStage('rua_limpo', 0.3);
    /* 23/10 (layout do Magnific): dia quente com nevoa no lugar do veu roxo, base escurecida para o texto ler */
    if (!this.ceu){ this.ceu = cx.createLinearGradient(0, 0, 0, H); this.ceu.addColorStop(0, 'rgba(255,214,160,.12)'); this.ceu.addColorStop(0.55, 'rgba(255,214,160,0)'); this.ceu.addColorStop(0.78, 'rgba(8,8,20,.16)'); this.ceu.addColorStop(1, 'rgba(8,8,20,.66)'); }
    cx.fillStyle = this.ceu; cx.fillRect(0, 0, W, H);
    L1 = this.a; L2 = this.b; this.b.x = W - 54;
    drawLutador(this.a); drawLutador(this.b);
    vinhetaBordas();
    /* logo (23/10, versao nova): entra batendo com anel de choque (a gramatica dos letreiros), flutua, um brilho de metal passa
       e, de tempos em tempos, caem fios de cabelo das letras (o efeito da FINALIZACAO! do jogo) */
    const te = this.t || 0, LW = 214, lk = LOGO_CF.naturalWidth ? Math.min(1, LW / LOGO_CF.naturalWidth) : 1, LH = LOGO_CF.naturalHeight ? Math.round(LOGO_CF.naturalHeight * lk) : 120;
    const ly = 4 + Math.round(Math.sin(te * 0.05) * 2), le = te < 14 ? 0.4 + 0.6 * easeBack(te / 14) : 1;
    cx.save(); cx.globalAlpha = Math.min(1, (te + 1) / 4); cx.translate(W / 2, ly + LH / 2); cx.scale(le, le); cx.translate(-W / 2, -(ly + LH / 2)); logoCF(W / 2, ly, LW); cx.restore();
    if (te >= 10 && te < 28) anelChoque(W / 2, ly + LH - 14, (te - 10) / 18, 130, '#fff3c8');
    if (te > 14) brilhoLogo(LOGO_CF, W / 2, ly, LW, te);
    const tf = (te - 40) % 300; if (te > 40 && tf < 140) fiosCaindo(W / 2 - 70, ly + LH - 30, 140, tf, 10);
    fitaTitulo('VENCA AS 3 LUTAS E LIBERE 30% OFF', W / 2, 160);
    if (this.t & 32) letreiro(LAY === 'toque' ? 'TOQUE PARA JOGAR' : LAY !== 'desk' ? 'APERTE START' : 'APERTE ENTER', W/2, 188, 1, 'cromo');
    /* rodape de fliperama: a marca e o ano a esquerda, os creditos a direita */
    placaMarca(40, 30 + MARGEM, 207, 2); txtMini('1999', 66 + MARGEM, 212, 'rgba(243,241,238,.75)');
    txtOR('CREDITOS ' + (CREDITOS < 10 ? '0' : '') + CREDITOS, W - 8 - MARGEM, 210, AMARELO, INK);
    if (LAY === 'desk') txtMini('SHIFT: 2 JOGADORES', W/2, 213, 'rgba(243,241,238,.6)');
  }
};
/* ---------------- CENA: escolha ----------------
   0-5 retratos, 6 DIFICULDADE. No toque: um toque escolhe o retrato, outro toque nele (ou em LUTAR!) confirma.
   23/10: o CRIE SEU LUTADOR saiu (pedido: "remova a secao de personalizar o personagem"). */
/* diagramacao de 18/10 (jogos de luta de celular): vitrine do lutador a esquerda, de corpo inteiro; grade de retratos a direita;
   dificuldade e LUTAR! na zona do polegar, LUTAR! embaixo a direita */
/* 23/10 (layout do Magnific): grade num painel com os times nomeados; vitrine sem caixa, no palco com refletor; painel de golpes legivel */
const SEL_GRADE = n => [196 + (n % 3) * 62, 40 + ((n / 3) | 0) * 64, 56, 56];
const SEL_DIF = [190, 182, 92, 28], SEL_LUTAR = [288, 182, 92, 28], SEL_VITRINE = [4, 22, 184, 130], SEL_PAINEL = [190, 20, 190, 158];
const dentro = (x, y, r) => x >= r[0] && x < r[0] + r[2] && y >= r[1] && y < r[1] + r[3];
const scSelect = {
  base: true,
  fundo(x0, x1){ const g = cx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#16336e'); g.addColorStop(1, '#0a1838'); cx.fillStyle = g; cx.fillRect(x0, 0, x1 - x0, H);
    cx.fillStyle = 'rgba(120,170,255,.07)'; for (let x = Math.floor(x0 / 16) * 16; x < x1; x += 16) cx.fillRect(x, 0, 1, H); for (let y = 0; y < H; y += 16) cx.fillRect(x0, y, x1 - x0, 1);
    for (let y = 0; y < H; y += 8){ cx.fillStyle = 'rgba(0,0,0,.12)'; cx.fillRect(x0, y, x1 - x0, 1); } },
  enter(arg){ carregaBaseVar(); if (!HIST.src) HIST.src = BASE_ARQ + 'extras/historia.png?v=/*VSHEET*/4285/*/VSHEET*/'; this.i = (arg && arg.i) || 0; this.col = 0; this.j = 3; this.ok = 0; this.ok2 = 0; musica('titulo'); this.grid = ORDEM; },
  voltar(){ SFX.back(); go(scTitle); },
  confirma(){ if (this.i === 6){ trocaDif(1); SFX.blip(); return; } this.ok = 1; SFX.ok(); avisaPagina('escolheu', { lutador: this.grid[this.i], dificuldade: LUTA.dif }); },
  toque(x, y){
    if (this.ok || LUTA.p2humano) return;
    if (tocouVoltar(x, y)){ this.voltar(); return; }
    const folga = (r, m) => [r[0] - m, r[1] - m, r[2] + 2 * m, r[3] + 2 * m];   /* o polegar erra para fora: area de toque um pouco maior que o desenho */
    for (let n = 0; n < 6; n++) if (dentro(x, y, folga(SEL_GRADE(n), 3))){ if (this.i === n) this.confirma(); else { this.i = n; SFX.blip(); } return; }
    if (dentro(x, y, folga(SEL_DIF, 3))){ trocaDif(x < SEL_DIF[0] + SEL_DIF[2] / 2 ? -1 : 1); SFX.blip(); return; }   /* no toque a escolha do lutador nao muda */
    if (dentro(x, y, folga(SEL_LUTAR, 4))){ if (this.i > 5) this.i = this.ult || 0; this.confirma(); return; }
    if (dentro(x, y, SEL_VITRINE) && this.i < 6) this.confirma();      /* tocar no lutador em destaque tambem escolhe */
  },
  update(){
    this.t++; FRAME++;
    if (LUTA.p2humano){
      if (!this.ok2){
        if (HIT.p2.right) { this.j = (this.j + 1) % 6; SFX.blip(); }
        if (HIT.p2.left) { this.j = (this.j + 5) % 6; SFX.blip(); }
        if (HIT.p2.down || HIT.p2.up) { this.j = (this.j + 3) % 6; SFX.blip(); }
        if (HIT.p2.p || HIT.p2.start || HIT.p2.k){ this.ok2 = 1; SFX.ok(); }
      }
      if (this.ok && this.ok2){ this.ok++; if (this.ok > 40){ LUTA.jogador = this.grid[this.i]; LUTA.lista = [this.grid[this.j]]; LUTA.indice = 0; LUTA.vitorias = 0; go(scVs); } }
      if (this.ok) return;
    } else if (this.ok){ this.ok++; if (this.ok > 40){ LUTA.jogador = this.grid[this.i]; montaArcade(); go(scVs); } return; }
    if (LUTA.p2humano){
      if (HIT.p1.right) { this.i = (this.i + 1) % 6; SFX.blip(); }
      if (HIT.p1.left) { this.i = (this.i + 5) % 6; SFX.blip(); }
      if (HIT.p1.down || HIT.p1.up) { this.i = (this.i + 3) % 6; SFX.blip(); }
      if (HIT.p1.p || HIT.p1.start || HIT.p1.k){ this.ok = 1; SFX.ok(); }
      return;
    }
    if (this.i === 6){ if (HIT.p1.right || HIT.p1.left){ trocaDif(HIT.p1.left ? -1 : 1); SFX.blip(); } }
    else { if (HIT.p1.right) { this.i = (this.i + 1) % 6; SFX.blip(); } if (HIT.p1.left) { this.i = (this.i + 5) % 6; SFX.blip(); } }
    if (HIT.p1.down){ if (this.i < 6) this.col = this.i % 3; this.i = this.i < 3 ? this.i + 3 : this.i < 6 ? 6 : this.col; SFX.blip(); }
    else if (HIT.p1.up){ if (this.i < 6) this.col = this.i % 3; this.i = this.i === 6 ? 3 + this.col : this.i >= 3 ? this.i - 3 : 6; SFX.blip(); }
    if (HIT.p1.p || HIT.p1.start || HIT.p1.k) this.confirma();
  },
  draw(){
    /* referencia da escolha (Magnific, 18/10): fundo azul de mapa, quadras em grade e rotas acesas */
    const fundo = cx.createLinearGradient(0, 0, 0, H); fundo.addColorStop(0, '#16336e'); fundo.addColorStop(1, '#0a1838'); cx.fillStyle = fundo; cx.fillRect(0, 0, W, H);
    cx.fillStyle = 'rgba(120,170,255,.07)'; for (let x = 0; x < W; x += 16) cx.fillRect(x, 0, 1, H); for (let y = 0; y < H; y += 16) cx.fillRect(0, y, W, 1);
    for (let y = 0; y < H; y += 8) { cx.fillStyle = 'rgba(0,0,0,.12)'; cx.fillRect(0, y, W, 1); }
    if (this.i < 6) this.ult = this.i;
    const toque = LAY === 'toque', so1 = !LUTA.p2humano;
    { const tx = 'ESCOLHA SEU LUTADOR', toque = LAY === 'toque', e0 = toque ? 72 : 8, d0 = (W + 2 * XB) - XB - (toque ? 46 : 8), sc = Math.min(2, (d0 - e0) / (larguraT(tx, 1) + 1));   /* 26/10: entre VOLTAR e o botao SOM em qualquer largura (no celular pequeno o R encostava no SOM) */
      anuncio(tx, Math.round(Math.min(226, d0 - larguraT(tx, sc) / 2)), 11, sc, 'gelo', this.t || 0, Infinity, { faixa: false, reto: true }); }   /* 23/10: titulos de tela entram letra a letra, como os anuncios */
    if (so1) botaoVoltar();
    /* vitrine: o escolhido de corpo inteiro, com contraluz; na troca ele sobe no pedestal (23/10: sem a volta de 360, que mostrava o desenho chapado) */
    const iv = this.i < 6 ? this.i : (this.ult || 0);
    if (iv !== this._iAnt){ this._iAnt = iv; this._giro = 0; } else this._giro = (this._giro || 0) + 1;
    vitrineLutador(this.grid[iv], SEL_VITRINE, this.ok ? 'win' : null, this.t || 0, Math.min(1, this._giro / 14));
    /* painel da grade: TIME CALVO em cima, TIME CABELUDO embaixo, na letra normal */
    { const [px, py, pw, ph] = SEL_PAINEL; cx.fillStyle = 'rgba(0,0,0,.4)'; cx.fillRect(px + 3, py + 3, pw, ph); cx.fillStyle = INK; cx.fillRect(px - 1, py - 1, pw + 2, ph + 2);
      cx.fillStyle = '#0b2a2c'; cx.fillRect(px, py, pw, ph); cx.fillStyle = 'rgba(159,228,178,.5)'; cx.fillRect(px, py, pw, 1); cx.fillStyle = 'rgba(0,0,0,.35)'; cx.fillRect(px, py + ph - 2, pw, 2);
      txtT('TIME CALVO', px + pw / 2, py + 4, MINT); txtT('TIME CABELUDO', px + pw / 2, py + ph - 13, CORAL); }
    /* grade 3x2 de retratos: faixa do time embaixo, moldura piscando no escolhido */
    for (let n = 0; n < 6; n++){
      const cid = this.grid[n], [x, y0, w, h] = SEL_GRADE(n), sel = n === this.i, sel2 = LUTA.p2humano && n === this.j, y = y0 - (sel || sel2 ? 3 : 0);
      cx.fillStyle = 'rgba(0,0,0,.45)'; cx.fillRect(x + 3, y0 + 4, w, h);   /* sombra dura: o cartao escolhido levanta 3 px e a sombra fica */
      hudMoldura(x, y, w, h, 'prata');                    /* moldura de metal em todo retrato; o cursor do jogador por cima */
      if (sel || sel2){ cx.fillStyle = sel ? ((FRAME & 4) ? '#ff3b2b' : '#ffd23a') : ((FRAME & 4) ? '#3b8bff' : '#bfefff'); cx.fillRect(x, y, w, 3); cx.fillRect(x, y + h - 3, w, 3); cx.fillRect(x, y, 3, h); cx.fillRect(x + w - 3, y, 3, h); }
      cx.fillStyle = CHARS[cid].cor; cx.fillRect(x + 4, y + 4, 48, 48);
      const r = retrato(cid); if (r) { const [sx, sy, sw, sh] = mapaSlot(r); cx.drawImage(folhaSlot(r), sx, sy, sw, sh, x + 4, y + 4, 48, 48); }
      else txtT(CHARS[cid].nome.slice(0, 5), x + 28, y + 24, CREME);
      cx.fillStyle = CHARS[cid].time === 'calvo' ? MINT : CORAL; cx.fillRect(x + 4, y + 48, 48, 4);
      if (!sel && !sel2 && this.ok){ cx.fillStyle = 'rgba(4,20,22,.5)'; cx.fillRect(x + 4, y + 4, 48, 48); }
      if (sel || sel2){ const tag = sel ? '1P' : '2P', tx = sel ? x - 2 : x + w - 16; cx.fillStyle = sel ? '#e0241a' : '#2a6fd1'; cx.fillRect(tx, y - 6, 18, 10); txtMini(tag, tx + 9, y - 3, '#ffffff'); }   /* etiqueta do jogador, como nos fliperamas */
    }
    if (so1){
      const s6 = this.i === 6 && !toque;
      seletorUI(SEL_DIF, 'DIFICULDADE', dif().nome, { facil: MINT, normal: AMARELO, dificil: CORAL }[LUTA.dif] || CREME, s6);
      if (this.ok) letreiro('PRONTO!', SEL_LUTAR[0] + SEL_LUTAR[2] / 2, SEL_LUTAR[1] + 6, 2, 'ouro');
      else botaoUI(SEL_LUTAR, 'LUTAR!', (FRAME >> 4) & 1 ? '#ff9d8f' : CORAL, '#ffffff', { sel: !toque && this.i < 6, sc: 1 });
    } else {
      const C2 = CHARS[this.grid[this.j]]; txtT('P2: ' + C2.nome + (this.ok2 ? ' PRONTO' : ''), 285, 186, AMARELO);
      txtMini('P1 SETAS + Z . P2 WASD + F', 285, 200, 'rgba(243,241,238,.7)');
    }
    /* uma linha so de dica, no rodape (23/10: eram duas linhas miudas espremidas embaixo da vitrine) */
    txtMini(toque ? 'TOQUE DUPLO NA ALAVANCA: DASH . BAIXO E CIMA: SUPER PULO' : LAY !== 'desk' ? 'ALAVANCA ESCOLHE . SOCO CONFIRMA' : 'SETAS ESCOLHEM . Z CONFIRMA', W / 2, 215, 'rgba(243,241,238,.62)');
  }
};
/* vitrine da escolha (23/10, layout do Magnific): o lutador no palco, sem caixa. Torre de trelica com refletor a esquerda,
   cone de luz ate o pedestal, o lutador sobe nele na troca; embaixo, o painel com nome, apelido, especial e hiper legiveis */
function vitrineLutador(id, r, pose, t, giro){
  const C = CHARS[id], [x, y, w, h] = r, gx = x + w / 2 + 8, gy = y + h - 6;
  cx.fillStyle = '#121a2c'; cx.fillRect(x + 6, y, 3, h + 2); cx.fillRect(x + 16, y, 3, h + 2);                      /* torre do refletor */
  cx.fillStyle = '#26324f'; for (let yy = y + 3; yy < y + h - 8; yy += 11) for (let k = 0; k < 8; k++){ cx.fillRect(x + 8 + k, yy + k, 1, 1); cx.fillRect(x + 16 - k, yy + 3 + k, 1, 1); }
  cx.fillStyle = '#0a0f1c'; cx.fillRect(x + 12, y + 12, 22, 15); cx.fillStyle = '#34405e'; cx.fillRect(x + 12, y + 12, 22, 2); cx.fillStyle = '#fff1c8'; cx.fillRect(x + 31, y + 15, 4, 10);
  cx.save(); cx.globalCompositeOperation = 'lighter';                                                             /* cone de luz */
  const lx = x + 35, ly = y + 20, gr = cx.createLinearGradient(lx, ly, gx, gy); gr.addColorStop(0, 'rgba(255,236,190,.34)'); gr.addColorStop(1, 'rgba(255,236,190,.05)');
  cx.fillStyle = gr; cx.beginPath(); cx.moveTo(lx, ly - 5); cx.lineTo(gx + 56, gy); cx.lineTo(gx - 50, gy + 4); cx.lineTo(lx, ly + 5); cx.closePath(); cx.fill();
  brilho(cx, gx, gy, 54, 9, 0.3, 'rgba(255,240,205,'); cx.restore();
  const ped = (yy, rx, ry, cor) => { cx.fillStyle = cor; cx.beginPath(); cx.ellipse(gx, yy, rx, ry, 0, 0, Math.PI * 2); cx.fill(); };   /* pedestal em perspectiva */
  ped(gy + 5, 50, 10, 'rgba(0,0,0,.45)'); ped(gy + 3, 46, 9, '#10161f'); cx.fillStyle = '#10161f'; cx.fillRect(gx - 46, gy - 1, 92, 4); ped(gy - 1, 46, 9, '#2b3546');
  ped(gy - 1, 42, 7.5, '#3c495e'); cx.strokeStyle = C.cor2; cx.globalAlpha = 0.85; cx.lineWidth = 1; cx.beginPath(); cx.ellipse(gx, gy - 1, 44, 8.2, 0, 0, Math.PI * 2); cx.stroke(); cx.globalAlpha = 1;
  for (let i = 0; i < 12; i++){ const a = i * Math.PI / 6 + t * 0.02, sx2 = gx + Math.cos(a) * 38, sy2 = gy - 1 + Math.sin(a) * 6.5; cx.fillStyle = Math.sin(a) > 0 ? 'rgba(243,236,214,.55)' : 'rgba(243,236,214,.18)'; cx.fillRect(Math.round(sx2), Math.round(sy2), 2, 1); }
  const p = pose || ((t >> 5) % 5 === 4 ? 'walk' : 'idle'), vy = gy - 2 + (p === 'idle' ? Math.round(Math.sin(t * 0.08)) : 0);
  /* entrada na troca: sobe do escuro para o pedestal com um clarao de luz por tras; nada de girar o desenho no eixo,
     que mostrava que ele e chapado como uma folha de papel */
  const ent = easeOut(giro === undefined ? 1 : giro), sobe = Math.round((1 - ent) * 10);
  if (ent < 1){ cx.save(); cx.globalCompositeOperation = 'lighter'; brilho(cx, gx, gy - 60, 70 * (1.3 - 0.3 * ent), 90, 0.5 * (1 - ent), 'rgba(255,240,200,'); cx.restore(); }
  cx.save(); cx.globalAlpha = 0.35 + 0.65 * ent;
  cx.globalCompositeOperation = 'lighter'; contornoLuz(id + '_' + p, gx, vy + sobe, false, 0.5, 'rgba(243,236,214,'); cx.globalCompositeOperation = 'source-over';
  if (!drawSpr(id + '_' + p, gx, vy + sobe, false)) drawSpr(id + '_idle', gx, vy + sobe, false);
  cx.restore();
  /* painel de dados */
  const py = y + h + 4, pw = w, ph = 52;
  cx.fillStyle = 'rgba(0,0,0,.4)'; cx.fillRect(x + 3, py + 3, pw, ph); cx.fillStyle = INK; cx.fillRect(x - 1, py - 1, pw + 2, ph + 2);
  cx.fillStyle = 'rgba(8,18,30,.95)'; cx.fillRect(x, py, pw, ph); cx.fillStyle = C.cor2; cx.fillRect(x, py, pw, 1);
  const nw = larguraT(C.nome) + 8; hudMoldura(x + 4, py + 4, nw, 14, 'prata'); txt2(C.nome, x + 8, py + 7, '#ffb3a6', '#e0241a', '#1a1210', 1, 'L');
  txtL(C.apelido, x + pw - 5 - larguraT(C.apelido), py + 7, C.cor2);
  txtMini('ESPECIAL', x + 18, py + 27, MINT); txtL(C.especial.nome, x + 38, py + 25, CREME);
  txtMini('HIPER', x + 18, py + 41, AMARELO); txtL(C.hiperNome, x + 38, py + 39, CREME);
}
/* carreira (pedido do time, 29/09): ordem fixa, cada rival mais cabeludo (ou mais calvo) e mais dificil que o anterior; o terceiro e o chefe */
const ESCADA = { calvo: ['beto', 'peruca', 'tonho'], cabeludo: ['carlos', 'fabio', 'edson'] };
function montaArcade(){
  const C = CHARS[LUTA.jogador];
  LUTA.lista = ESCADA[C.time].slice(); LUTA.indice = 0; LUTA.vitorias = 0; LUTA.derrotas = 0; LUTA.baralho = null; LUTA.pontos = 0; LUTA.pontos2 = 0; LUTA.momentoFeito = {};
}
/* escadinha da carreira na tela de VS: os 3 rivais, o atual piscando, os vencidos apagados */
function drawEscada(cx0, y0){
  if (LUTA.p2humano || !LUTA.lista || LUTA.lista.length < 3) return;
  /* 23/10: sem os rotulos miudos (CARREIRA, CHEFE); o chefe e a terceira, com moldura dourada */
  LUTA.lista.forEach((id, n) => {
    const x = cx0 - 39 + n * 28, y = y0 + 8, atual = n === LUTA.indice, feito = n < LUTA.indice, r = retrato(id);
    if (n === 2){ cx.fillStyle = '#ffc21f'; cx.fillRect(x - 3, y - 3, 28, 28); cx.fillStyle = '#7a4b0a'; cx.fillRect(x - 2, y - 2, 26, 26); }
    cx.fillStyle = atual ? ((FRAME & 8) ? CORAL : AMARELO) : INK; cx.fillRect(x - 1, y - 1, 24, 24);
    cx.fillStyle = CHARS[id].cor; cx.fillRect(x, y, 22, 22);
    if (r){ const [sx, sy, sw, sh] = mapaSlot(r); cx.drawImage(folhaSlot(r), sx, sy, sw, sh, x, y, 22, 22); }
    if (feito){ cx.fillStyle = 'rgba(4,20,22,.7)'; cx.fillRect(x, y, 22, 22); txtMini('OK', x + 11, y + 8, MINT); }
  });
}
/* retrato com contorno de luz de 2 px (esquerda, direita e topo) na cor do lado: o busto se descola do fundo (23/10) */
const _CONTORNO = new Map();
function retratoContorno(slot, x, y, d, flip, cor){
  const [sx, sy, sw, sh] = mapaSlot(slot), folha = folhaSlot(slot), k = slot + '|' + d + '|' + cor + '|' + (folha === SHEET ? 's' : 'v');
  let c = _CONTORNO.get(k);
  if (!c){ c = document.createElement('canvas'); c.width = d; c.height = d; const g = c.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(folha, sx, sy, sw, sh, 0, 0, d, d); g.globalCompositeOperation = 'source-in'; g.fillStyle = cor; g.fillRect(0, 0, d, d); _CONTORNO.set(k, c); }
  cx.save(); if (flip){ cx.translate(x + d, y); cx.scale(-1, 1); } else cx.translate(x, y);
  cx.globalAlpha = 0.9; for (const [ox, oy] of [[-2, 0], [2, 0], [0, -2], [-1, -1], [1, -1]]) cx.drawImage(c, ox, oy); cx.globalAlpha = 1;
  cx.drawImage(folha, sx, sy, sw, sh, 0, 0, d, d); cx.restore();
}
/* labareda atras do VS (layout do Magnific): linguas de fogo nas cores do letreiro 'fogo', subindo e tremulando */
function chamasVS(cxm, base, t, k){
  if (k <= 0) return; const cores = ['#e8441c', '#ff9a1f', '#ffd23a', '#fff7b0'];
  cx.save(); cx.globalAlpha = Math.min(1, k * 1.2);
  for (let c = 0; c < 4; c++){ cx.fillStyle = cores[c]; const esc = 1 - c * 0.2;
    for (let i = 0; i < 7; i++){ const x = cxm + (i - 3) * 15 * esc, hb = (44 + 30 * hs(i + c * 9) + 9 * Math.sin(t * 0.3 + i * 1.7 + c)) * esc * (1 - Math.abs(i - 3) * 0.13), w = 22 * esc, bal = Math.sin(t * 0.21 + i * 2) * 5 * esc;
      cx.beginPath(); cx.moveTo(x - w / 2, base); cx.bezierCurveTo(x - w * 0.62, base - hb * 0.45, x - w * 0.15 + bal, base - hb * 0.75, x + bal, base - hb); cx.bezierCurveTo(x + w * 0.15 + bal, base - hb * 0.75, x + w * 0.62, base - hb * 0.45, x + w / 2, base); cx.closePath(); cx.fill(); }
    cx.beginPath(); cx.ellipse(cxm, base, 50 * esc, 9 * esc, 0, 0, Math.PI * 2); cx.fill(); }
  cx.restore();
}
/* balao do VS no topo (26/10): a coluna do lado de quem fala, entre a borda e o meio (placa da luta e escadinha); ponta para baixo */
function colunaTopo(lado){ const meio = 52,   /* placa LUTA n DE 3 tem +-48 */ x0 = lado < 0 ? 6 + MARGEM : Math.round(W / 2 + meio), x1 = lado < 0 ? Math.round(W / 2 - meio) : W - 6 - MARGEM; return [x0, x1]; }
function medeBalaoTopo(texto, lado){ const [x0, x1] = colunaTopo(lado); let m = null, melhor = Infinity;
  for (let n = Math.max(10, Math.floor((x1 - x0 - 12) / 6)); n >= 10; n--){ const mm = medeBalao(texto, n); if (mm.lw > x1 - x0) continue; const sozinha = mm.linhas.filter(l => l.indexOf(' ') < 0 && l.length <= 6).length;   /* "QUER" sozinho numa linha */
    const custo = mm.feio * 100 + sozinha * 30 + mm.linhas.length * 10; if (custo < melhor){ melhor = custo; m = mm; } }
  return m || medeBalao(texto, 10); }
function balaoTopo(texto, lado, hx, topoCab){
  const [x0, x1] = colunaTopo(lado), m = medeBalaoTopo(texto, lado), lw = m.lw, lh = m.lh;
  const bx = Math.round(Math.max(x0, Math.min(x1 - lw, hx - lw / 2))), by = Math.round(Math.max(5, Math.min(topoCab - 9 - lh, 8)));
  desenhaBalao({ x0: bx, y0: by, lw, m, cauda: 'baixo' }, hx, topoCab, null, true);
}
/* ---------------- CENA: VS ---------------- */
const scVs = {
  enter(){ musica(null); this.a = LUTA.jogador; this.b = LUTA.lista[LUTA.indice]; LUTA.cenario = CHARS[this.b].stage; carregaCenario(LUTA.cenario); carregaFoto(this.a, this.b, LUTA.cenario); SFX.ok();
    const conv = conversa(this.a, this.b); this.t1 = 40; this.t2 = conv ? this.t1 + Math.round(leitura(conv[0][1]) * 0.85) : 0; this.fim = conv ? this.t2 + leitura(conv[1][1]) + 16 : 130; this.pula = conv ? this.t1 + Math.round(leitura(conv[0][1]) * 0.6) : 30; },
  toque(){ if (this.t > this.pula) this.tocou = true; },
  voltar(){ SFX.back(); go(scSelect); },
  update(){ this.t++; FRAME++; if (this.t > this.fim || (this.t > this.pula && (HIT.p1.start || HIT.p1.p || this.tocou))){ this.tocou = false; go(scFight); } },
  draw(){
    cx.fillStyle = INK; cx.fillRect(0, 0, W, H);
    const k = ease(Math.min(1, this.t / 16));
    const A = CHARS[this.a], B = CHARS[this.b];
    /* fundo de confronto de fliperama de luta (18/10): metades cortadas na diagonal, cada uma na cor do lutador,
       com linhas de velocidade correndo para o centro e um risco de luz na emenda */
    const corte = Math.round((1 - k) * W * 0.6), meio = (y, lado) => W / 2 + (lado < 0 ? -corte : corte) + 26 - y * 52 / H;
    const metade = (cor, lado) => { cx.fillStyle = cor; cx.beginPath();
      if (lado < 0){ cx.moveTo(0, 0); cx.lineTo(meio(0, -1), 0); cx.lineTo(meio(H, -1), H); cx.lineTo(0, H); } else { cx.moveTo(W, 0); cx.lineTo(meio(0, 1), 0); cx.lineTo(meio(H, 1), H); cx.lineTo(W, H); }
      cx.closePath(); cx.fill(); cx.save(); cx.clip(); cx.fillStyle = 'rgba(0,0,0,.28)'; cx.fillRect(0, 0, W, H);
      for (let i = 0; i < 14; i++){ const yy = (i * 37) % H, comp = 30 + (i * 23) % 60, v = ((this.t * (4 + i % 3) + i * 41) % (W + 80)) - 40;
        cx.fillStyle = 'rgba(255,255,255,' + (0.05 + (i % 3) * 0.03) + ')'; cx.fillRect(lado < 0 ? v : W - v - comp, yy, comp, 1 + (i & 1)); }
      cx.restore(); };
    metade('#1d47c8', -1); metade('#cf2a1f', 1);   /* referencia do versus (Magnific, 18/10): jogador no azul, rival no vermelho */
    cx.save(); for (let i = 0; i < 28; i++){ const a = i * Math.PI * 2 / 28 + (this.t || 0) * 0.004; cx.fillStyle = 'rgba(255,255,255,' + (i & 1 ? .06 : .02) + ')'; cx.beginPath(); cx.moveTo(W / 2, H / 2); cx.arc(W / 2, H / 2, W, a, a + Math.PI / 40); cx.closePath(); cx.fill(); } cx.restore();   /* raios saindo do centro */
    cx.save(); cx.globalAlpha = 0.18 * k; cx.strokeStyle = '#ffffff'; cx.lineWidth = 1; cx.beginPath();   /* chao em perspectiva (19/10): as linhas fogem para o centro e dao fundo ao confronto */
    for (let i = 0; i < 7; i++){ const q = (i + ((this.t || 0) * 0.03) % 1) / 7, yy = Math.round(150 + q * q * 74) + 0.5; cx.moveTo(0, yy); cx.lineTo(W, yy); }
    for (let i = -9; i <= 9; i++){ cx.moveTo(W / 2 + i * 10, 150); cx.lineTo(W / 2 + i * 60, H); } cx.stroke(); cx.restore();
    if (k >= 1){ cx.strokeStyle = (FRAME & 4) ? '#fff6b0' : '#ffffff'; cx.lineWidth = 2; cx.beginPath(); cx.moveTo(meio(76, -1), 76); cx.lineTo(meio(198, -1), 198); cx.stroke(); }   /* so entre a escadinha e o nome do cenario (nao risca texto) */
    const ra = retrato(this.a), rb = retrato(this.b), conv = conversa(this.a, this.b);
    /* 26/10 (pedido: "o balao pode ficar acima deles para liberar espaco inferior; nome e subtitulo podem descer"): os baloes vao para
       o topo, na coluna do lado de quem fala (o meio fica para a placa da luta e a escadinha), com a ponta para a cabeca; o busto desce
       para baixo deles e a placa do nome e o apelido descem para o peito, abaixo do queixo. O tamanho do busto sai da altura que sobra:
       o queixo (linha 81 de 96 no retrato mais baixo, o do Tonho) fica acima da placa. */
    const NY = 178, AY = NY + 16, altB = conv ? Math.max(...conv.map(c => medeBalaoTopo(c[1], c[0] === this.a ? -1 : 1).lh)) : 0;
    const PY = Math.max(44, Math.min(60, altB ? 14 + altB : 44)), D = Math.min(156, Math.floor((NY - 6 - PY) * 96 / 81));
    const lx = -D - 8 + Math.round(k * (D + 10)), rx = W + 6 - Math.round(k * (D + 8)), PXA = Math.round(lx + D / 2), PXB = Math.round(rx + D / 2);
    if (k > 0.3){ cx.save(); cx.globalCompositeOperation = 'lighter'; brilho(cx, lx + D / 2, PY + D * 0.55, 80, 70, 0.22 * k, 'rgba(80,150,255,'); brilho(cx, rx + D / 2, PY + D * 0.55, 80, 70, 0.22 * k, 'rgba(255,80,60,'); cx.restore(); }
    if (ra) retratoContorno(ra, lx, PY, D, false, '#6fb4ff');
    if (rb) retratoContorno(rb, rx, PY, D, true, '#ff6a4a');
    { const g = cx.createLinearGradient(0, H - 58, 0, H); g.addColorStop(0, 'rgba(6,8,20,0)'); g.addColorStop(0.45, 'rgba(6,8,20,.7)'); g.addColorStop(1, 'rgba(6,8,20,.95)'); cx.fillStyle = g; cx.fillRect(0, H - 58, W, 58); }   /* o corte do busto some no chao escuro, atras da placa do nome */
    /* placas de nome com a moldura de metal do HUD e o nome em letra de fliperama */
    const placa = (nome, cxp, c1, c2) => { const w = Math.max(84, larguraT(nome) + 20); cx.fillStyle = 'rgba(0,0,0,.45)'; cx.fillRect(Math.round(cxp - w / 2) + 3, NY - 1, w, 18); hudMoldura(Math.round(cxp - w / 2), NY - 4, w, 18, 'prata'); txt2(nome, cxp, NY + 1, c1, c2, '#1a1210', 1, 'C'); };
    placa(A.nome, PXA, '#ffb3a6', '#e0241a'); placa(B.nome, PXB, '#bfefff', '#2a6fd1');
    txtO(A.apelido, PXA, AY + 1, A.cor2, INK); txtO(B.apelido, PXB, AY + 1, B.cor2, INK);   /* 23/10: apelido legivel (era miudo) */
    if (this.t > 18){ const s = this.t < 26 ? 6 - (this.t - 18) * 0.25 : 4; chamasVS(W / 2, H / 2 + 18, this.t, k); letreiro('VS', W/2, H/2 - 4 * s, s, 'fogo'); }
    { const tt = LUTA.p2humano ? 'VERSUS' : LUTA.indice === 2 ? 'LUTA FINAL' : 'LUTA ' + (LUTA.indice + 1) + ' DE 3', tw = larguraT(tt) + 18;   /* placa de metal no topo (layout); a terceira e a LUTA FINAL */
      cx.fillStyle = 'rgba(0,0,0,.45)'; cx.fillRect(Math.round(W / 2 - tw / 2) + 3, 6, tw, 17); hudMoldura(Math.round(W / 2 - tw / 2), 3, tw, 17, 'prata');
      txt2(tt, W / 2, 8, LUTA.indice === 2 ? '#ffe75a' : '#ffb3a6', LUTA.indice === 2 ? '#ff9d1c' : '#e0241a', '#1a1210', 1, 'C'); }
    placaMarca(56, W/2, 25, 3);
    if (this.t > 10) drawEscada(W / 2, 40);
    { const cn = CENARIOS[LUTA.cenario].nome; plaquinha(W / 2, 206, larguraT(cn)); txtO(cn, W / 2, 206, CREME, INK); }
    if (conv){
      const [f1, f2] = conv; const lado = id => id === this.a ? -1 : 1, pos = id => id === this.a ? PXA : PXB;
      if (this.t > this.t1) balaoTopo(f1[1], lado(f1[0]), pos(f1[0]), PY);
      if (this.t > this.t2) balaoTopo(f2[1], lado(f2[0]), pos(f2[0]), PY);
      if (this.t > this.pula){
        if (LAY === 'toque'){ botaoUI([W - 68 - MARGEM, H - 21, 62, 16], 'PULAR', 'rgba(4,20,22,.8)', CREME, { dx: -5 }); setaPx(W - 14 - MARGEM, H - 14, 1, AMARELO); setaPx(W - 10 - MARGEM, H - 14, 1, AMARELO); }   /* botao de pular, como nas cenas dos jogos de celular */
        else if (FRAME & 16) txtMini(LAY !== 'desk' ? 'SOCO AVANCA' : 'Z AVANCA', W - 34, 214, 'rgba(243,241,238,.6)');
      }
    }
  }
};
/* ---------------- CENA: luta ---------------- */
const scFight = {
  enter(){
    L1 = novoLutador(LUTA.jogador, 1, LUTA.demo ? 'ia' : 'p1'); L2 = novoLutador(LUTA.lista[LUTA.indice], -1, LUTA.p2humano ? 'p2' : 'ia');
    if (LUTA.demo) L1.ia.nivel = 2;
    L2.ia.nivel = dif().nivel(LUTA.indice, LUTA.derrotas || 0); STAGE_W = Math.max(392, W);
    if (!LUTA.p2humano && !LUTA.demo){ L1.vidaMax = L1.vida = L1.vidaAtras = Math.round(L1.C.vida * dif().vida); L2.ia.cool = 50; } L1.x = STAGE_W / 2 - 86; L2.x = STAGE_W / 2 + 86; CAM = Math.max(0, (STAGE_W - W) / 2);
    LUTA.cenario = CHARS[L2.id].stage; carregaCenario(LUTA.cenario); LUTA.faixaT = 0; carregaFoto(L1.id, L2.id, LUTA.cenario);
    ITEM = null; LUTA.itemSaiu = false; LUTA.avisoT = 0; LUTA.primeiroGolpe = false; MOMENTO = null; FALAS = []; sorteiaMomentos(); CAMZ.z = 1; CAMZ.alvo = 1; CAMZ.hold = 0; CAMZ.fx = CAMZ.tfx = W/2; CAMZ.fy = CAMZ.tfy = 150;
    LUTA.fase = 'intro'; LUTA.t = 0; LUTA.timer = TEMPO_LUTA; LUTA.ko = null; HIPER = null; FATAL = null; LUTA.finalizado = false; LUTA.fatalNome = null; LUTA.koT = 70; LUTA.finalizador = null; LUTA.tonto = null; ESCURO = 0; ESCURO_ALVO = 0; SHAKE = 0; HITSTOP = 0; FOTO = null;
    LUTA.musica = LUTA.indice === 2 ? 'boss' : 'luta'; this.fim = 0; this.tm = 0; this.pausa = null; this.retoma = 0; PEDE_PAUSA = false;
    for (const j of ['p1','p2']) for (const k in IN[j]) if (j === 'p2' && !LUTA.p2humano) IN[j][k] = 0;
    /* MOMENTO COROA antes do LUTA! (pedido do time: nada de parar a luta no meio). Um por luta; recomecar ou continuar nao repete. */
    const pre = LUTA.momentos && LUTA.momentos[0]; LUTA.momentos = []; LUTA.popsAdiados = null;
    const feito = LUTA.momentoFeito && LUTA.momentoFeito[LUTA.indice];
    LUTA.teveMomentoPre = false;
    if (pre && !LUTA.demo && !LUTA.pulaMomento && !feito){ iniciaMomento(pre); MOMENTO.pre = true; LUTA.teveMomentoPre = true; (LUTA.momentoFeito = LUTA.momentoFeito || {})[LUTA.indice] = true; }
    LUTA.pulaMomento = false;
  },
  toque(x, y){
    if (this.pausa){ toquePausa(this, x, y); return; }
    /* toque no relogio pausa (a pausa no meio de cima, como no Street Fighter IV de celular) */
    if (!LUTA.demo && Math.abs(x - W / 2) < 32 && y < 54 && (LUTA.fase === 'luta' || LUTA.fase === 'intro' || LUTA.fase === 'finaliza')){ abrePausa(this); return; }
    if (LUTA.fase === 'momento' && MOMENTO && MOMENTO.t > momentoPulavel(MOMENTO)){ fimMomento(); return; }
    if (LUTA.fase === 'ko') this.tocou = true;
  },
  voltar(){
    if (this.pausa){ fechaPausa(this); return; }
    if (LUTA.demo){ LUTA.demo = false; musica(null); go(scTitle); return; }
    if (LUTA.fase === 'luta' || LUTA.fase === 'intro' || LUTA.fase === 'finaliza') abrePausa(this);
  },
  update(){
    if (this.pausa){ passoPausa(this); return; }
    if (!LUTA.demo && (PEDE_PAUSA || (HIT.p1.start && (LUTA.fase === 'luta' || LUTA.fase === 'intro' || this.retoma > 0)))){ PEDE_PAUSA = false; if (LUTA.fase === 'luta' || LUTA.fase === 'intro' || LUTA.fase === 'finaliza'){ abrePausa(this); return; } }
    if (this.retoma > 0){ this.retoma--; if (!this.retoma && (LUTA.fase === 'luta' || LUTA.fase === 'finaliza')) musica(LUTA.musica); return; }   /* 3, 2, 1 depois da pausa (a pausa vale tambem durante a contagem) */
    this.t++; FRAME++; LUTA.t++; passoZoom();
    if (LUTA.demo){                                      /* modo atracao: qualquer tecla volta ao titulo; KO tambem */
      const ap = ENTRADA_REAL !== LUTA.demoEntrada;
      if (ap || (LUTA.fase === 'ko' && LUTA.t > 160) || this.t > 4200){ LUTA.demo = false; musica(null); if (ap) SFX.moeda(); go(ap ? scSelect : scTitle); return; }
      if (LUTA.fase === 'luta') for (const k in IN.p1) IN.p1[k] = 0;
    }
    if (SHAKE > 0) SHAKE--;
    ESCURO += (ESCURO_ALVO - ESCURO) * 0.15;
    if (LUTA.fase === 'intro'){
      if (LUTA.t === 1) SFX.blip(); if (LUTA.t === 6 || LUTA.t === 56) SFX.carimbo();
      if (LUTA.t === 84){ LUTA.fase = 'luta'; SFX.fight(); musica(LUTA.musica); if (!LUTA.teveMomentoPre) falar(L2, L2.C.falas.intro, 110);   /* depois do momento, menos texto antes do primeiro soco (revisao de 19/10) */
        if (LUTA.popsAdiados){ for (const [l, tx, cor] of LUTA.popsAdiados) pop(l, tx, cor); LUTA.popsAdiados = null; } }   /* consequencia do momento de abertura, depois do LUTA! */   /* provocacao do rival no 1o segundo, com a faixa livre */
      passoFX(); return;
    }
    if (LUTA.fase === 'luta'){
      if (HITSTOP > 0){ HITSTOP--; passoFX(); return; }
      if (HIPER){ const h = HIPER; passoHiper(); passoLutador(h.l); passoLutador(h.r); passoFX(); atualizaCam(); if (LUTA.ko){ LUTA.fase = 'ko'; LUTA.t = 0; } return; }
      if (L1.ctrl === 'ia') passoIA(L1);
      if (L2.ctrl === 'ia') passoIA(L2);
      controla(L1, IN.p1, HIT.p1); controla(L2, IN.p2, HIT.p2);
      passoLutador(L1); passoLutador(L2);
      checaGolpes(); centraliza(); passoProjeteis(); passoItem(); passoFX(); passoFalas(); atualizaCam(); checaMomento();
      if (!HIPER){ this.tm++; if (this.tm >= 60){ this.tm = 0; LUTA.timer--; if (LUTA.timer <= 10) SFX.timer(); if (LUTA.timer <= 0){ LUTA.timer = 0; tempoEsgotado(); } } }
      if (LUTA.ko){ LUTA.fase = 'ko'; LUTA.t = 0; }
      return;
    }
    if (LUTA.fase === 'momento'){ passoMomento(); for (const l of [L1, L2]){ l.t++; if (l.estado === 'hit' && l.t >= l.stun) l.estado = 'idle'; } passoFX(); passoFalas(); atualizaCam(); return; }
    if (LUTA.fase === 'finaliza'){
      if (LUTA.t > 10 && LUTA.t % 40 === 0) SFX.coracao();       /* batida de coracao enquanto o rival esta tonto */
      if (HITSTOP > 0){ HITSTOP--; passoFX(); return; }
      const l = LUTA.finalizador, r = LUTA.tonto;
      if (l.ctrl === 'ia') passoIA(l);
      const inp = l.ctrl === 'ia' ? IN.p2 : IN[l.ctrl], hit = l.ctrl === 'ia' ? HIT.p2 : HIT[l.ctrl];
      if (hit.h && Math.abs(r.x - l.x) < 120 && podeAgir(l)){ iniciaFatal(l, r); passoFX(); return; }
      controla(l, inp, hit); passoLutador(l); passoLutador(r); checaGolpes(); passoProjeteis(); passoFX(); atualizaCam();
      if (LUTA.ko){ LUTA.fase = 'ko'; LUTA.t = 0; return; }
      if (LUTA.t > 300){ nocaute(r, l); LUTA.fase = 'ko'; LUTA.t = 0; }
      return;
    }
    if (LUTA.fase === 'fatal'){
      passoFatal(); passoFX(); atualizaCam();
      if (LUTA.ko){ LUTA.fase = 'ko'; LUTA.t = 0; }
      return;
    }
    if (LUTA.fase === 'ko'){
      const lento = LUTA.t > 2 && LUTA.t < 40 && !LUTA.ko.tempo && !LUTA.fatalNome && (LUTA.t & 1);   /* camera lenta na queda do K.O. (os letreiros seguem no tempo normal) */
      if (!lento){ passoLutador(L1); passoLutador(L2); passoProjeteis(); } passoFX(); passoFalas(); atualizaCam();
      if (LUTA.t === 1){ LUTA.koT = (LUTA.fatalNome || LUTA.ko.hiper) ? 100 : 70; encerraFalas(6); if (LUTA.faixaT > 12) LUTA.faixaT = 12; for (const p of POPS) p.dur = Math.min(p.dur, p.t + 1); for (const f of FX) if (f.tipo === 'reuniao') f.dur = Math.min(f.dur, f.t + 12); }   /* nocaute: falas, pops e janelas de efeito saem esmaecendo */
      const lw = leitura(LUTA.ko.vencedor.C.falas.win), fimKO = Math.max(250, LUTA.koT + 20 + lw + 24), pula = LUTA.koT + 20 + Math.min(150, Math.round(lw * 0.5));   /* a fala da vitoria e lida inteira; pular so depois de metade dela */
      if (LUTA.t === LUTA.koT){ const v = LUTA.ko.vencedor; v.estado = 'win'; v.t = 0; v.winT = 0; v.golpe = null; if (v === L1) { SFX.win(); musica('vitoria'); } else { SFX.lose(); } }
      if (LUTA.t > LUTA.koT) LUTA.ko.vencedor.winT++;
      if (LUTA.demo) return;
      if (LUTA.p2humano){ if (LUTA.t > fimKO || (LUTA.t > pula && (HIT.p1.start || HIT.p1.p || HIT.p2.start || HIT.p2.p))) go(scSelect); return; }
      /* um jogador: depois da pose de vitoria vem a tela da frase do vencedor (como nos fliperamas de luta), e dela a proxima tela */
      const pose = LUTA.koT + 56;
      if (LUTA.t > pose || (LUTA.t > LUTA.koT + 20 && (HIT.p1.start || HIT.p1.p || this.tocou))){ this.tocou = false;
        const v = LUTA.ko.vencedor, p = LUTA.ko.perdedor || outro(v), ganhou = v === L1;
        if (ganhou){ LUTA.pontos = (LUTA.pontos || 0) + 1000 + LUTA.timer * 10; LUTA.vitorias++; LUTA.indice++; }
        go(scFrase, { v: v.id, p: p.id, cen: LUTA.cenario, texto: v.C.falas.win, resposta: p.C.falas.lose, prox: ganhou ? (LUTA.indice >= 3 ? scFim : scVs) : scContinue });
      }
      return;
    }
  },
  draw(){
    /* 19/10 (skill game-feel): tremor por senoides, nao sorteio a cada quadro (que "chia"); a mesma amplitude maxima de antes,
       e mais leve para quem pediu menos movimento no aparelho */
    const tr = SHAKE > 0 ? SHAKE * (MENOS_MOVIMENTO ? 0.4 : 1) : 0, fs = FRAME * 0.9;
    const sx = tr ? Math.round(Math.sin(fs * 1.7) * tr * 0.5) : 0, sy = tr ? Math.round(Math.sin(fs * 2.3 + 1) * tr * 0.3) : 0;
    OCUPADO_ANT = OCUPADO; OCUPADO = [];
    cx.save(); cx.translate(sx, sy);
    /* K.O. (23/10, aprendizado do 2o ROUND): o cenario perde a cor e escurece enquanto o letreiro esta no ar; os lutadores seguem coloridos */
    const cinza = LUTA.fase === 'ko' && LUTA.ko && LUTA.t < (LUTA.koT || 70) ? Math.min(1, LUTA.t / 6) * (LUTA.t > (LUTA.koT || 70) - 12 ? ((LUTA.koT || 70) - LUTA.t) / 12 : 1) : 0;
    comZoom(0.55, () => { if (cinza > 0.02) cx.filter = 'saturate(' + (1 - 0.75 * cinza).toFixed(2) + ') brightness(' + (1 - 0.18 * cinza).toFixed(2) + ')'; drawStage(LUTA.cenario, 0); cx.filter = 'none'; });
    comZoom(0.8, () => nevoaHorizonte(LUTA.cenario));   /* a nevoa fica entre o fundo (55% do zoom) e os lutadores (100%) */
    if (ESCURO > 0.02){ cx.fillStyle = 'rgba(0,0,0,' + ESCURO.toFixed(2) + ')'; cx.fillRect(-8, -8, W + 16, H + 16); }
    if (HIPER && HIPER.fase === 'efeito'){ cx.fillStyle = 'rgba(4,20,22,.5)'; cx.fillRect(-8, -8, W + 16, H + 16); raiosFundo(HIPER.l.C.cor2, FRAME, 0.1, W / 2, 150); drawGrade3D(FRAME, HIPER.l.C.cor2); }   /* fundo trocado do HIPER: raios na cor de quem soltou + chao em perspectiva */
    else if (FATAL){ cx.fillStyle = 'rgba(4,8,12,.35)'; cx.fillRect(-8, -8, W + 16, H + 16); drawGrade3D(FRAME, FATAL.l.C.cor2); }
    /* luz de palco (a la fatality): o cenario apaga em volta dos dois; lutadores, efeitos e a notificacao ficam acesos por cima */
    if (LUTA.fase === 'finaliza' && LUTA.finalizador){ const t = LUTA.t, bat = (t % 40) < 8 ? 1 - (t % 40) / 8 : 0, m = telaZoom((LUTA.finalizador.x + LUTA.tonto.x) / 2 - CAM, CHAO - 64);
      luzPalco(m[0], m[1], Math.max(110, Math.abs(LUTA.finalizador.x - LUTA.tonto.x) / 2 + 74) + bat * 10, Math.min(0.88, t / 36)); }
    if (LUTA.fase === 'fatal' && FATAL){ const m = telaZoom((FATAL.l.x + FATAL.r.x) / 2 - CAM, CHAO - 64); luzPalco(m[0], m[1], (Math.max(110, Math.abs(FATAL.l.x - FATAL.r.x) / 2 + 74)) * CAMZ.z, Math.min(0.9, FATAL.t / 12)); }
    comZoom(1, () => {
      const ordem = (L1.golpe || L1.estado === 'hit') ? [L2, L1] : [L1, L2];
      if (HIPER && HIPER.fase === 'efeito'){ ordem.sort((a, b) => (a === HIPER.l) - (b === HIPER.l)); }
      drawItemLuz();                                  /* facho de luz atras de todos */
      for (const l of ordem) drawLutador(l);
      drawMomentoExtras();                            /* espelhinho do momento e o sobrinho que zoa */
      drawItem();                                     /* a caixa da MANUAL fica NA FRENTE dos lutadores */
      drawProjeteis(); drawFX(); drawPops();
    });
    /* 23/10 tarde: os frades desfocados em primeiro plano sairam (no pe da tela liam como uma sombra que anda com o cenario, parecia erro) */
    cx.restore();
    if (!HIPER && !FATAL) vinhetaBordas();          /* bordas escuras: o olho vai para o centro e o fundo recua */
    drawImpacto();                                  /* quadro de impacto do golpe que decide (2-3 quadros) */
    if (LUTA.fase === 'finaliza' && LUTA.t % 40 < 8){ cx.fillStyle = 'rgba(120,0,0,' + ((1 - (LUTA.t % 40) / 8) * 0.14).toFixed(3) + ')'; cx.fillRect(0, 0, W, H); }   /* tela pulsa vermelha com o coracao */
    if (FLASH > 0){ FLASH--; cx.fillStyle = 'rgba(255,255,255,' + (FLASH / 10).toFixed(2) + ')'; cx.fillRect(0, 0, W, H); }
    /* indicador de quem subiu alem da tela (super pulo) */
    if (LUTA.fase !== 'ko') for (const l of [L1, L2]){ const topo = l.y - 112 * l.C.ev; if (topo < -4){ const ix = Math.round(l.x - CAM), cor = l === L1 ? MINT : CORAL; if (OCUPADO.some(o => o[4] === 6 && o[0] < ix + 9 && o[2] > ix - 9 && o[1] < 74 && o[3] > 56)) continue;   /* um pop ja ocupa o lugar do indicador */ cx.fillStyle = INK; cx.fillRect(ix - 5, 58, 11, 7); cx.fillStyle = cor; for (let k = 0; k < 4; k++) cx.fillRect(ix - 4 + k, 62 - k, 9 - k * 2, 1); txtMini(l === L1 ? 'P1' : (l.ctrl === 'ia' ? 'CPU' : 'P2'), ix, 67, cor); ocupa([ix - 8, 57, ix + 8, 73], 6); } }
    drawMomentoFundo();
    if (!MOMENTO && LUTA.fase !== 'fatal') naMargem(drawHUD);   /* na pausa do momento e no cinema da finalizacao o HUD sai de cena */
    naMargem(drawFaixas);                           /* faixa com o nome do especial, antes dos baloes (eles fogem dela) */
    drawFaixaMarca();
    drawMomentoFoto();
    drawFalas();                                   /* baloes em coordenada de tela: acham lugar livre sozinhos */
    drawMomento();
    if (LUTA.demo && (FRAME & 32)) { txtO('DEMO . APERTE START', W/2, 62, CREME, INK); }
    drawCutin();
    if (HIPER && HIPER.fase === 'efeito' && LUTA.fase === 'luta' && HIPER.l.C.hiperTxt !== HIPER.l.C.hiperNome && HIPER.t > 6 && HIPER.t < HIPER.l.C.hiper.dur - 4){ txtO(HIPER.l.C.hiperTxt, W/2, 152, CREME, INK); ocupa([W/2 - larguraT(HIPER.l.C.hiperTxt) / 2 - 2, 150, W/2 + larguraT(HIPER.l.C.hiperTxt) / 2 + 2, 162], 8); }
    if (LUTA.fase === 'intro'){
      cx.fillStyle = 'rgba(4,16,18,' + (0.42 * Math.min(1, LUTA.t / 8) * Math.min(1, (84 - LUTA.t) / 10)).toFixed(3) + ')'; cx.fillRect(0, 0, W, H);
      /* 23/10: a mesma gramatica de todos os letreiros (anuncio): LUTA n com o nome do cenario, depois LUTA!; a ultima e a LUTA FINAL */
      if (LUTA.t < 48) anuncio(LUTA.p2humano ? 'VERSUS' : LUTA.indice === 2 ? 'LUTA FINAL' : 'LUTA ' + (LUTA.indice + 1), W/2, 80, 3, 'gelo', LUTA.t, 48, { sub: CENARIOS[LUTA.cenario].nome, cor: '#62c6f2' });
      else if (LUTA.t < 84) anuncio('LUTA!', W/2, 80, 4, 'fogo', LUTA.t - 48, 36);
      if (LUTA.t > 12 && LUTA.t < 80){ txtMini('OFERECIMENTO', W/2, 124, CREME); placaMarca(72, W/2, 131, 4); }
      /* a fala de entrada do rival sai no inicio da luta (falar em LUTA.t === 84) */
    }
    if (LUTA.fase === 'finaliza'){
      const t = LUTA.t, bat = (t % 40) < 6 ? 1 - (t % 40) / 6 : 0;   /* as letras caem uma a uma e pulsam com o coracao */
      anuncio('FINALIZA!', W/2, 70, 3, 'sangue', t - 10, Infinity, { pulso: bat * 0.06, cor: '#e0241a' });
      if (t > 34) anMaquina(LAY === 'desk' ? 'CHEGA PERTO E APERTA V' : 'CHEGA PERTO E APERTA HIPER', W/2, 96, AMARELO, t - 34, { borda: INK, passo: 1 });
    }
    if (LUTA.fase === 'fatal' && FATAL){ const hb = tarjasCinema(FATAL.t / 10); desenhaFatal();   /* cinema: tarjas pretas, nome de quem finaliza em cima, o nome da finalizacao datilografado embaixo como legenda */
      if (hb >= 20){ txt2(FATAL.l.C.nome, 10, 8, '#ffe75a', '#ff9d1c', '#1a1210', 1, 'L'); anMaquina(FATAL.l.C.fatal.nome, 10, H - 15, CREME, FATAL.t - 10, { alinh: 'L', passo: 2 }); } }
    if (LUTA.fase === 'ko' && LUTA.fatalNome && LUTA.t < 12) tarjasCinema(1 - LUTA.t / 12);
    if (this.pausa) drawPausa(this.pausa);
    else if (this.retoma > 0){ cx.fillStyle = 'rgba(3,14,15,.35)'; cx.fillRect(0, 0, W, H); letreiro(String(Math.ceil(this.retoma / 22)), W / 2, 84, 5, 'ouro'); }
    if (LUTA.fase === 'ko'){
      const t = LUTA.t; const tx = LUTA.ko.tempo ? 'TEMPO!' : LUTA.fatalNome ? 'FINALIZACAO!' : 'K.O.';
      const nt = FX.find(f => f.tipo === 'notificacao'), dn = FX.some(f => f.tipo === 'reuniao') ? 74 : nt ? Math.max(56, (nt.baixo || 114) - 56) : 0;   /* textos do nocaute descem para baixo da notificacao */
      /* 19/10: cada desfecho com a sua tipografia: K.O. em aberracao cromatica, TEMPO! em colisao, FINALIZACAO! caindo letra a letra
         com fios de cabelo pingando das letras (a "gota" da fatality, no tema do jogo), placa da finalizacao batendo no meio */
      if (t < LUTA.koT){ const y0 = 60 + dn;
        if (LUTA.ko.hiper && !LUTA.fatalNome) raiosFundo(LUTA.ko.vencedor.C.cor2, t * 2, 0.13 * Math.min(1, t / 6), W / 2, y0 + 16);   /* HIPER COMBO FINISH: raios da cor de quem venceu */
        /* 23/10: K.O., TEMPO! e FINALIZACAO! na mesma gramatica (anuncio); o HIPER e o nome da finalizacao viram a linha de baixo */
        const sc = LUTA.fatalNome ? (dn > 50 ? 2 : 3) : (dn > 50 ? 3 : 4), cyk = y0 + 4 * sc + 4;
        if (LUTA.ko.tempo) anuncio('TEMPO!', W / 2, cyk, sc, 'gelo', t, LUTA.koT, { cor: '#62c6f2' });
        else if (LUTA.fatalNome){ const w = larguraT(tx, sc); anuncio(tx, W / 2, cyk, sc, 'sangue', t, LUTA.koT, { sub: LUTA.fatalNome, cor: '#e0241a' }); fiosCaindo(W / 2 - w / 2, cyk + 4 * sc + 16, w, t - 16); }
        else { const sk = dn > 50 ? 4 : 6, cy7 = dn > 50 ? y0 + 4 * sk + 2 : 98, sai = t > LUTA.koT - 10 ? (LUTA.koT - t) / 10 : 1, kr = easeBack(Math.min(1, t / 8)), rx = larguraT(tx, sk) * 0.44 * kr;   /* 23/10 (layout): K.O. grande, sem faixa, com anel eletrico e rajada */
          if (t >= 2){ rajadaVelocidade(W / 2, cy7, rx + 4, t, Math.min(1, (t - 2) / 3) * Math.max(0, 1 - (t - 2) / 34), 0.78); anelEletrico(W / 2, cy7, rx, t, Math.max(0, sai) * Math.min(1, t / 3), rx * 0.78); }
          anuncio(tx, W / 2, cy7, sk, 'fogo', t, LUTA.koT, { cromatico: true, faixa: false, sub: LUTA.ko.hiper ? 'HIPER COMBO FINISH!' : null, corSub: MINT }); } }
      else { const v = LUTA.ko.vencedor, txv = LUTA.demo ? v.C.nome + ' VENCEU' : LUTA.p2humano ? 'JOGADOR ' + (v === L1 ? 1 : 2) + ' VENCEU!' : v === L1 ? 'VOCE VENCEU!' : 'VOCE PERDEU', yv = 98 + (nt ? Math.max(0, (nt.baixo || 0) + 6 - 98) : 0), tv = t - LUTA.koT;
        const perf = v.vida === v.vidaMax, ok = v === L1 || LUTA.demo || LUTA.p2humano;   /* 23/10: PERFEITO! virou o chapeu do letreiro (antes girava como um cartao) */
        LUTA.perfeitoR = anuncio(txv, W / 2, yv + 10, 2, ok ? 'ouro' : 'sangue', tv, Infinity, { chapeu: perf ? 'PERFEITO!' : null, cor: ok ? AMARELO : '#e0241a' });
        if (!nt) drawSpr('fx_coroa', v.x - CAM, v.y - 118 * v.C.ev + Math.round(Math.sin(t * 0.15) * 3), false, { sc: 1 });   /* a coroa espera a notificacao sair */
        if (t > LUTA.koT + 20 && LUTA.p2humano){ cx.save(); cx.globalAlpha = Math.min(1, (t - LUTA.koT - 20) / 6); citacao(v, v.C.falas.win); cx.restore(); } }   /* um jogador: a frase vai para a tela propria (scFrase) */
    }
  }
};
/* citacao do vencedor: caixa larga embaixo, com o nome (cobre so os medidores de HIPER, a luta ja acabou) */
/* caixa de dialogo do fliperama (18/10): a mesma em todo texto de narracao (frase do vencedor, final, legenda do momento),
   com a moldura de aco do medidor HIPER, fundo azul-noite e uma faixa da cor de quem fala */
function caixaDialogo(x, y, w, h, faixa){ cx.fillStyle = 'rgba(0,0,0,.42)'; cx.fillRect(x + 3, y + 3, w, h); hudMoldura(x, y, w, h, 'aco'); cx.fillStyle = 'rgba(8,18,34,.95)'; cx.fillRect(x + 3, y + 3, w - 6, h - 6); if (faixa){ cx.fillStyle = faixa; cx.fillRect(x + 3, y + 3, 3, h - 6); } }
function citacao(l, texto){
  const linhas = wrap(texto, 43), h = 24 + linhas.length * 10, y0 = H - 3 - h;
  caixaDialogo(5, y0, W - 10, h, l.C.cor2);
  txt2(l.C.nome, 16, y0 + 6, '#ffe75a', '#ff9d1c', '#1a1210', 1, 'L');
  linhas.forEach((ln, i) => txtL(ln, 16, y0 + 18 + i * 10, CREME));
}
function minimoPagina(sc){ return Math.max(40, Math.round(leitura(sc.paginas[sc.pag] || '') * 0.35)); }
/* texto do final: logo abaixo do VOCE VENCEU!, no ceu do cenario, para nao cobrir o campeao (pedido de 18/10). Devolve a base da caixa. */
function caixaFala(texto, esq, rodape, larg){
  const bw = larg || W - 20 - 2 * MARGEM, linhas = wrap(texto, Math.floor((bw - 20) / 8)), h = 14 + linhas.length * 10 + (rodape ? 10 : 0), y0 = 36;   /* rodape: linha do aviso de seguir dentro da caixa */
  caixaDialogo(10 + MARGEM, y0, bw, h, esq ? MINT : CORAL);
  linhas.forEach((ln, i) => txtL(ln, 20 + MARGEM, y0 + 8 + i * 10, CREME));
  return y0 + h;
}
function alargaArena(antes){
  if (typeof scFight === 'undefined' || SCENE !== scFight || !L1 || !L2 || W <= STAGE_W) return;
  const d = W - STAGE_W; STAGE_W = W; L1.x += d / 2; L2.x += d / 2; for (const p of PROJS) p.x += d / 2; CAM = 0;
}
function atualizaCam(){ const alvo = Math.max(0, Math.min(STAGE_W - W, (L1.x + L2.x) / 2 - W / 2)); CAM += (alvo - CAM) * 0.18; }
function tempoEsgotado(){
  const v = L1.vida / L1.vidaMax >= L2.vida / L2.vidaMax ? L1 : L2, p = outro(v);
  LUTA.ko = { vencedor: v, perdedor: p, t: 0, tempo: true }; p.estado = 'ko'; p.ko = true; p.t = 0; p.golpe = null; LUTA.fase = 'ko'; LUTA.t = 0; musica(null); SFX.ko();
}
/* ---------------- DIFICULDADE (pedido do time: o jogo estava quase impossivel no celular) ----------------
   Medido em _qa/teste_dificuldade.js (05/10), jogador simulado de toque: FACIL vence 100% com ~88% de vida, NORMAL 100% com 49-67%, DIFICIL 46-67%.
   FACIL e o padrao da campanha (captacao); NORMAL e a calibragem anterior; DIFICIL sobe um nivel por luta. Fica salva no aparelho. */
const DIFS = {
  facil:   { nome: 'FACIL',   vida: 1.6, dano: 0.62, bloq: 0.4, lento: 7,  nivel: (i, d) => 0 },
  normal:  { nome: 'NORMAL',  vida: 1.2, dano: 1,    bloq: 1,   lento: 0,  nivel: (i, d) => Math.max(0, i - d) },
  dificil: { nome: 'DIFICIL', vida: 0.9, dano: 1.45, bloq: 1.8, lento: -4, nivel: (i, d) => Math.min(3, i + 1) }   /* _qa/teste_dificuldade.js: jogador de toque vence 46-67% */
};
const DIF_ORDEM = ['facil', 'normal', 'dificil'];
LUTA.dif = (() => { try { const v = localStorage.getItem('cvc_dificuldade'); return DIFS[v] ? v : 'facil'; } catch(e){ return 'facil'; } })();
function dif(){ return DIFS[LUTA.dif] || DIFS.facil; }
function trocaDif(d){
  const n = DIF_ORDEM.length; LUTA.dif = DIF_ORDEM[(DIF_ORDEM.indexOf(LUTA.dif) + (d || 1) + n) % n];
  try { localStorage.setItem('cvc_dificuldade', LUTA.dif); } catch(e){}
  if (SCENE === scFight && L2 && L2.ctrl === 'ia' && !LUTA.p2humano) L2.ia.nivel = dif().nivel(LUTA.indice, LUTA.derrotas || 0);   /* vale na hora para a CPU */
  avisaPagina('dificuldade', { dificuldade: LUTA.dif });
}
/* ---------------- PAUSA: continuar, recomecar a luta, trocar de lutador, dificuldade, som, sair ---------------- */
/* opcoes conforme o aparelho: tamanho dos botoes e tela cheia so no toque (como o menu de configuracoes do Free Fire) */
/* diagramacao de 18/10: duas colunas, como a pausa dos jogos de luta de celular. Esquerda: acoes, CONTINUAR grande em cima;
   direita: ajustes com seletor (toque na metade esquerda volta, na direita avanca). */
const ACOES_PAUSA = new Set(['continuar', 'recomecar', 'trocar', 'sair']);
function opcoesPausa(){ const o = ['continuar', 'recomecar', 'trocar', 'sair', 'dificuldade']; if (LAY === 'toque'){ o.push('botoes'); if (HUD_SOBRE) o.push('transparencia'); if (TELA_CHEIA_OK) o.push('telacheia'); } o.push('som'); return o; }
function geoPausa(){
  const op = opcoesPausa(), acoes = op.filter(k => ACOES_PAUSA.has(k)), ajustes = op.filter(k => !ACOES_PAUSA.has(k)), lh = 28;
  const pw = Math.min(W - 32, 352), x0 = Math.round((W - pw) / 2), ph = 30 + Math.max(114, ajustes.length * lh - 6) + 24, y0 = Math.max(2, Math.round((H - ph) / 2)), R = {};
  let y = y0 + 30; acoes.forEach((k, n) => { const h = n === 0 ? 30 : 20; R[k] = [x0 + 10, y, 158, h]; y += h + 8; });
  ajustes.forEach((k, n) => { R[k] = [x0 + pw - 168, y0 + 30 + n * lh, 158, lh - 6]; });
  return { op, R, x0, y0, pw, ph };
}
function valorPausa(k){ return { dificuldade: dif().nome, botoes: { p: 'PEQUENOS', m: 'MEDIOS', g: 'GRANDES' }[TQ.tamK], transparencia: { baixa: 'BAIXA', media: 'MEDIA', alta: 'ALTA' }[TQ.opK],
  telacheia: telaCheiaAtiva() ? 'LIGADA' : 'DESLIGADA', som: SOM ? 'LIGADO' : 'DESLIGADO' }[k]; }
function abrePausa(cena){ cena.pausa = { i: 0, t: 0, foto: fotoDesfocada() }; cena.retoma = 0; musica(null); SFX.back(); for (const k in IN.p1) IN.p1[k] = 0; avisaPagina('pausa'); }
function fechaPausa(cena){ cena.pausa = null; SFX.ok(); cena.retoma = (LUTA.fase === 'luta' || LUTA.fase === 'finaliza') ? 66 : 0; if (!cena.retoma && LUTA.fase !== 'intro') musica(LUTA.musica); for (const k in IN.p1) IN.p1[k] = 0; }
function rotuloPausa(k){ return { continuar: 'CONTINUAR', recomecar: 'RECOMECAR LUTA', trocar: 'TROCAR LUTADOR', dificuldade: 'DIFICULDADE: ' + dif().nome,
  botoes: 'BOTOES: ' + valorPausa('botoes'), transparencia: 'TRANSPARENCIA: ' + valorPausa('transparencia'), telacheia: 'TELA CHEIA: ' + valorPausa('telacheia'),
  som: 'SOM: ' + valorPausa('som'), sair: 'SAIR PARA O INICIO' }[k]; }
function acaoPausa(cena, k, d){
  if (k === 'continuar') fechaPausa(cena);
  else if (k === 'recomecar'){ cena.pausa = null; LUTA.pulaMomento = true; SFX.ok(); avisaPagina('recomecou'); go(scFight); }
  else if (k === 'trocar'){ cena.pausa = null; musica(null); SFX.ok(); avisaPagina('trocou_lutador'); go(scSelect); }
  else if (k === 'dificuldade'){ trocaDif(d || 1); SFX.blip(); }
  else if (k === 'botoes'){ trocaTamanho(d || 1); SFX.blip(); avisaPagina('botoes', { tamanho: TQ.tamK }); }
  else if (k === 'transparencia'){ trocaOpacidade(d || 1); SFX.blip(); avisaPagina('transparencia', { nivel: TQ.opK }); }
  else if (k === 'telacheia'){ telaCheia(!telaCheiaAtiva()); SFX.blip(); }
  else if (k === 'som'){ somPedido = true; }
  else if (k === 'sair'){ cena.pausa = null; musica(null); SFX.back(); go(scTitle); }
}
function passoPausa(cena){
  const pz = cena.pausa, op = opcoesPausa(); pz.t++; if (pz.i >= op.length) pz.i = 0;
  if (HIT.p1.down){ pz.i = (pz.i + 1) % op.length; SFX.blip(); }
  if (HIT.p1.up){ pz.i = (pz.i + op.length - 1) % op.length; SFX.blip(); }
  const k = op[pz.i];
  if (!ACOES_PAUSA.has(k) && (HIT.p1.left || HIT.p1.right)){ acaoPausa(cena, k, HIT.p1.left ? -1 : 1); return; }
  if ((HIT.p1.start || PEDE_PAUSA || HIT.p1.k) && pz.t > 6){ PEDE_PAUSA = false; fechaPausa(cena); return; }
  if (HIT.p1.p && pz.t > 4) acaoPausa(cena, k, 1);
}
function toquePausa(cena, x, y){
  const pz = cena.pausa; if (pz.t < 4) return; const g = geoPausa();
  if (x < g.x0 || x > g.x0 + g.pw || y < g.y0 || y > g.y0 + g.ph){ fechaPausa(cena); return; }   /* toque fora do painel volta ao jogo */
  for (const k of g.op){ const [rx, ry, rw, rh] = g.R[k];
    if (x >= rx - 4 && x < rx + rw + 4 && y >= ry - 3 && y < ry + rh + 4){ pz.i = g.op.indexOf(k); acaoPausa(cena, k, !ACOES_PAUSA.has(k) && x < rx + rw / 2 ? -1 : 1); return; } }
}
/* 23/10 (layout da pausa): a luta fica desfocada atras do painel, nao so escurecida */
function fotoDesfocada(){ try { const c = document.createElement('canvas'); c.width = cv.width; c.height = cv.height; const g = c.getContext('2d'); g.filter = 'blur(2px)'; g.drawImage(cv, 0, 0); return c; } catch(e){ return null; } }
function drawPausa(pz){
  if (pz.foto && pz.foto.width === cv.width){ cx.save(); cx.setTransform(1, 0, 0, 1, 0, 0); cx.drawImage(pz.foto, 0, 0); cx.restore(); cx.fillStyle = 'rgba(3,14,15,.55)'; }
  else cx.fillStyle = 'rgba(3,14,15,.8)';
  cx.fillRect(0, 0, W, H);
  const g = geoPausa(), teclado = LAY !== 'toque';
  hudMoldura(g.x0 - 3, g.y0 - 3, g.pw + 6, g.ph + 6, 'aco'); cx.fillStyle = 'rgba(8,18,34,.97)'; cx.fillRect(g.x0, g.y0, g.pw, g.ph);   /* moldura de aco, a mesma da caixa de dialogo */
  for (const [px, py] of [[g.x0 + 3, g.y0 + 3], [g.x0 + g.pw - 6, g.y0 + 3], [g.x0 + 3, g.y0 + g.ph - 6], [g.x0 + g.pw - 6, g.y0 + g.ph - 6]]){ cx.fillStyle = '#42587e'; cx.fillRect(px, py, 3, 3); cx.fillStyle = '#e3e6ea'; cx.fillRect(px, py, 2, 2); cx.fillStyle = '#5c6b80'; cx.fillRect(px + 1, py + 1, 1, 1); }   /* parafusos nos cantos */
  anuncio('PAUSA', W / 2, g.y0 + 16, 2, 'ouro', pz.t || 0, Infinity, { faixa: false, reto: true });
  cx.fillStyle = 'rgba(243,241,238,.12)'; cx.fillRect(W / 2, g.y0 + 30, 1, g.ph - 58);   /* divisoria entre acoes e ajustes */
  g.op.forEach((k, n) => {
    const r = g.R[k], sel = teclado && n === pz.i;
    if (ACOES_PAUSA.has(k)){ const prin = k === 'continuar';   /* referencia da pausa (Magnific, 18/10): CONTINUAR em vermelho com seta piscando, o resto azul-marinho */
      botaoUI(r, rotuloPausa(k), prin ? '#f0624f' : '#23398a', prin ? '#2a0e08' : CREME, { sel, sombra: prin ? 'rgba(255,214,200,.6)' : null });   /* 23/10 (layout): CONTINUAR coral com letra escura, o resto azul */
      if (prin){ const k2 = (FRAME >> 4) & 1; setaPx(r[0] - 4 + k2, r[1] + r[3] / 2, 1, AMARELO, 5); } }
    else seletorUI(r, { dificuldade: 'DIFICULDADE', botoes: 'BOTOES', transparencia: 'TRANSPARENCIA', telacheia: 'TELA CHEIA', som: 'SOM' }[k], valorPausa(k),
      k === 'dificuldade' ? ({ facil: MINT, normal: AMARELO, dificil: CORAL }[LUTA.dif] || CREME) : CREME, sel);
  });
  dica(LAY === 'toque' ? 'TOQUE FORA VOLTA AO JOGO' : LAY === 'desk' ? 'SETAS + Z . ESC VOLTA AO JOGO' : 'ALAVANCA + SOCO . START VOLTA AO JOGO', W / 2, g.y0 + g.ph - 14, 'rgba(243,241,238,.7)');
}
/* app em segundo plano (ligacao, notificacao, troca de app): a luta pausa sozinha e a musica para; volta a tocar ao voltar */
let MUSICA_ANTES = null;
document.addEventListener('visibilitychange', () => {
  if (document.hidden){ if (SCENE === scFight && !LUTA.demo && !scFight.pausa && (LUTA.fase === 'luta' || LUTA.fase === 'intro' || LUTA.fase === 'finaliza')) abrePausa(scFight);
    MUSICA_ANTES = MUSICA_ATUAL; musica(null); }
  else if (MUSICA_ANTES && !(SCENE === scFight && (scFight.pausa || scFight.retoma))){ musica(MUSICA_ANTES); MUSICA_ANTES = null; }
});
/* ---------------- CENA: frase do vencedor (18/10) ----------------
   Como nos fliperamas de luta: o vencedor em retrato grande, o derrotado abatido (tonto, estrelas girando) e a frase
   da vitoria numa caixa de dialogo; o derrotado responde com a fala de derrota. Toque (depois de metade da leitura) segue. */
/* 23/10: 'sai' = o rosto passa por cima da borda de cima (camadas: a moldura fica atras da cabeca); abatido perde a cor */
function retratoMoldura(id, x, y, sz, flip, abatido, t, sai){
  const C = CHARS[id], rt = retrato(id); hudMoldura(x - 4, y - 4, sz + 8, sz + 8, 'prata'); cx.fillStyle = C.cor; cx.fillRect(x, y, sz, sz);
  if (rt){ const [sx, sy, sw, sh] = mapaSlot(rt), e = sai ? Math.round(sz * 0.14) : 0, d = sz + e; cx.save(); cx.beginPath(); cx.rect(x, y - e, sz, sz + e); cx.clip();
    if (abatido) cx.filter = 'saturate(.3) brightness(.9)';
    if (flip){ cx.translate(x + sz, y - e); cx.scale(-1, 1); cx.drawImage(folhaSlot(rt), sx, sy, sw, sh, -e / 2, 0, d, d); } else cx.drawImage(folhaSlot(rt), sx, sy, sw, sh, x - e / 2, y - e, d, d);
    cx.filter = 'none'; cx.restore(); }
  if (abatido){ cx.fillStyle = 'rgba(90,0,0,.34)'; cx.fillRect(x, y, sz, sz);
    for (let i = 0; i < 3; i++){ const a = t * 0.09 + i * 2.094, ex = Math.round(x + sz / 2 + Math.cos(a) * sz * 0.32), ey = Math.round(y + 14 + Math.sin(a) * 7); cx.fillStyle = AMARELO; cx.fillRect(ex - 1, ey - 3, 2, 7); cx.fillRect(ex - 3, ey - 1, 7, 2); cx.fillStyle = '#ffffff'; cx.fillRect(ex, ey, 1, 1); } }
}
const scFrase = {
  enter(a){ Object.assign(this, a); this.pediu = false; this.lw = leitura(a.texto); this.r0 = Math.round(this.lw * 0.55); this.fim = this.r0 + leitura(a.resposta || '') + 30; this.tocou = false; },
  toque(){ if (this.t > this.lw * 0.5) this.tocou = true; },
  voltar(){ this.segue(); },
  segue(){ this.tocou = false;   /* fim da 1a luta: o cadastro segura a proxima tela (uma vez so; o cartao fica por cima da frase) */
    if (precisaLead()){ if (!this.pediu){ this.pediu = true; pedeLeadLuta1(this.v === LUTA.jogador, () => go(this.prox)); } return; }
    go(this.prox); },
  update(){ this.t++; FRAME++; if (this.t > Math.max(this.lw + 40, this.fim) || (this.t > this.lw * 0.5 && (HIT.p1.start || HIT.p1.p || this.tocou))) this.segue(); },
  draw(){
    drawStage(this.cen || CHARS[this.v].stage, 0.62);
    const k = ease(Math.min(1, this.t / 14)), V = CHARS[this.v], P = CHARS[this.p], ganhou = this.v === LUTA.jogador;
    /* 23/10 (layout do Magnific, 08 VITORIA): o vencedor em busto grande, sem moldura, com luz quente e contorno de luz, entrando pela esquerda;
       a caixa de fala a direita, por cima do ombro; VOCE VENCEU! numa placa dourada no alto a direita; o derrotado pequeno, sem cor, abaixo da placa */
    const D = 160, bx = Math.round(-D + k * (D + 6 + MARGEM)), by = H - D + 4, rt = retrato(this.v);
    cx.save(); cx.globalCompositeOperation = 'lighter'; brilho(cx, bx + D * 0.45, by + D * 0.42, 110, 92, 0.34 * k, 'rgba(255,206,140,'); cx.restore();
    if (rt) retratoContorno(rt, bx, by, D, false, '#ffcf7a');
    const x0 = Math.round(6 + MARGEM + D * 0.84), bw = W - x0 - 6 - MARGEM, cpl = Math.max(20, Math.floor((bw - 24) / 8));   /* 23/10 tarde: a caixa comeca depois do rosto (cobria a boca do Beto); so o ombro fica por baixo */
    const linhas = wrap(this.texto, cpl), resp = this.resposta ? wrap(this.resposta, cpl) : [], extra = LAY === 'toque' ? 12 : 0;
    const h = 24 + linhas.length * 10 + (resp.length ? 14 + resp.length * 10 : 0) + extra, y0 = H - 5 - h;
    { const tx = ganhou ? 'VOCE VENCEU!' : 'VOCE PERDEU', pw = larguraT(tx, 2) + 22,   /* no toque, longe do botao SOM do canto */
        pcx = Math.round(W - (LAY === 'toque' ? 44 : 6) - MARGEM - pw / 2), ky = easeBack(Math.min(1, this.t / 10));   /* placa dourada (ou vermelha) */
      if (this.t > 0){ cx.save(); cx.translate(pcx, 20); cx.scale(ky, ky); const x = -Math.round(pw / 2), y = -15;
        cx.fillStyle = 'rgba(0,0,0,.45)'; cx.fillRect(x + 3, y + 3, pw, 30); cx.fillStyle = '#0d0a10'; cx.fillRect(x - 2, y - 2, pw + 4, 34);
        cx.fillStyle = ganhou ? '#e8b54a' : '#c9503c'; cx.fillRect(x, y, pw, 30); cx.fillStyle = ganhou ? '#5a3a12' : '#4a1410'; cx.fillRect(x + 2, y + 2, pw - 4, 26);
        cx.fillStyle = ganhou ? 'rgba(255,226,150,.35)' : 'rgba(255,170,150,.3)'; cx.fillRect(x + 2, y + 2, pw - 4, 2); cx.restore(); }
      anuncio(tx, pcx, 20, 2, ganhou ? 'ouro' : 'sangue', this.t || 0, Infinity, { faixa: false, reto: true }); }
    { const lz = Math.max(48, Math.min(84, y0 - 46 - 8)), lx = Math.round(W - 10 - MARGEM - lz - (1 - k) * (lz + 20));
      retratoMoldura(this.p, lx, 46, lz, true, true, this.t); }
    /* uma caixa so, como dialogo: a frase do vencedor e, logo depois, a resposta do derrotado (altura reservada desde o inicio) */
    caixaDialogo(x0, y0, bw, h, V.cor2); txt2(V.nome, x0 + 11, y0 + 6, '#ffe75a', '#ff9d1c', '#1a1210', 1, 'L');
    const escreve = (ls, t0, yy) => { const n = Math.floor((this.t - t0) * 1.2); let usado = 0; ls.forEach((ln, i) => { const vis = ln.slice(0, Math.max(0, n - usado)); usado += ln.length + 1; txtL(vis, x0 + 11, yy + i * 10, CREME); }); };   /* a frase vai sendo escrita, como nos dialogos dos jogos */
    escreve(linhas, 0, y0 + 18);
    if (resp.length && this.t > this.r0){ const yr = y0 + 22 + linhas.length * 10; txt2(P.nome, x0 + 11, yr, '#bfefff', '#5fc4f2', '#1a1210', 1, 'L'); escreve(resp, this.r0, yr + 12); }
    if (this.t > this.lw * 0.5){ txtT('\u25bc', x0 + bw - 13, y0 + h - 12 + ((FRAME >> 3) & 1), AMARELO); if (LAY === 'toque') txtR('TOQUE CONTINUA', x0 + bw - 22, y0 + h - 12, 'rgba(243,241,238,.75)'); }   /* dentro da caixa, ao lado da seta */
  }
};
/* ---------------- CENA: continue ----------------
   Duas saidas na hora, sem esperar o relogio: CONTINUAR (a mesma luta, sem repetir o momento) ou TROCAR LUTADOR. */
const CONT_BT = [[140, 110, 114, 32], [262, 110, 114, 32]];   /* a direita do retrato do lutador abatido */
const scContinue = {
  base: true,
  enter(){ this.n = 9; this.tm = 0; this.i = 0; musica(null); SFX.lose(); LUTA.derrotas = (LUTA.derrotas || 0) + 1; avisaPagina('continue'); },
  escolhe(i){ if (i === 0){ if (CREDITOS > 0) CREDITOS--; SFX.moeda(); go(scVs); } else { SFX.ok(); avisaPagina('trocou_lutador'); go(scSelect); } },
  toque(x, y){ for (let n = 0; n < 2; n++) if (dentro(x, y, CONT_BT[n])){ this.escolhe(n); return; } },
  voltar(){ this.escolhe(1); },
  update(){ this.t++; FRAME++; this.tm++; if (this.tm >= 60){ this.tm = 0; this.n--; if (this.n < 0){ go(scTitle); return; } SFX.timer(); }
    if (HIT.p1.left || HIT.p1.right){ this.i = 1 - this.i; SFX.blip(); }
    if (HIT.p1.start || HIT.p1.p) this.escolhe(this.i); else if (HIT.p1.k) this.escolhe(1); },
  /* 23/10 (layout do Magnific, 10 CONTINUAR): o palco da luta perdida, quase apagado, atras de tudo (nao mais preto chapado) */
  palco(x0, x1){ cx.fillStyle = '#05060a'; cx.fillRect(x0, 0, x1 - x0, H); const im = STAGES[LUTA.cenario] || STAGES.rua;
    if (im){ const k = Math.max((x1 - x0) / im.width, H / im.height), w = Math.round(im.width * k), h = Math.round(im.height * k); cx.save(); cx.globalAlpha = 0.5; cx.drawImage(im, Math.round((x0 + x1 - w) / 2), H - h, w, h); cx.restore(); }
    const g = cx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgba(4,6,12,.86)'); g.addColorStop(0.6, 'rgba(4,6,12,.74)'); g.addColorStop(1, 'rgba(4,6,12,.9)'); cx.fillStyle = g; cx.fillRect(x0, 0, x1 - x0, H); },
  fundo(x0, x1){ this.palco(x0, x1); },
  draw(){
    if (!XB) this.palco(0, W);
    /* como nos fliperamas de luta: o seu lutador abatido a esquerda (tonto, estrelas girando) e a contagem a direita */
    const id = LUTA.jogador, rt = id && retrato(id), px = 22, py = 46, sz = 96, C = id && CHARS[id], cxr0 = C ? 258 : W / 2;
    /* 23/10 (layout): um refletor grande de cima sobre o titulo e a contagem, com o circulo de luz no chao; o lutador abatido fica na meia-luz */
    { cx.save(); cx.globalCompositeOperation = 'lighter'; const g = cx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgba(255,240,210,.22)'); g.addColorStop(1, 'rgba(255,240,210,.03)');
      cx.fillStyle = g; cx.beginPath(); cx.moveTo(cxr0 - 26, 0); cx.lineTo(cxr0 + 26, 0); cx.lineTo(cxr0 + 112, H - 14); cx.lineTo(cxr0 - 112, H - 14); cx.closePath(); cx.fill();
      brilho(cx, cxr0, H - 16, 130, 16, 0.26, 'rgba(255,236,200,'); brilho(cx, px + sz / 2, py + sz / 2, 74, 74, 0.1, 'rgba(190,215,255,'); cx.restore(); }
    if (C){ hudMoldura(px - 4, py - 4, sz + 8, sz + 8, 'prata'); cx.fillStyle = C.cor; cx.fillRect(px, py, sz, sz);
      if (rt){ const [sx, sy, sw, sh] = mapaSlot(rt), tre = this.tm < 8 ? ((this.tm >> 1) & 1 ? 2 : -2) : 0; cx.save(); cx.beginPath(); cx.rect(px, py, sz, sz); cx.clip(); cx.drawImage(folhaSlot(rt), sx, sy, sw, sh, px + tre, py, sz, sz); cx.restore(); }
      cx.fillStyle = 'rgba(90,0,0,.32)'; cx.fillRect(px, py, sz, sz);
      for (let i = 0; i < 3; i++){ const a = this.t * 0.09 + i * 2.094, ex = Math.round(px + sz / 2 + Math.cos(a) * 30), ey = Math.round(py + 14 + Math.sin(a) * 7); cx.fillStyle = AMARELO; cx.fillRect(ex - 1, ey - 3, 2, 7); cx.fillRect(ex - 3, ey - 1, 7, 2); cx.fillStyle = '#ffffff'; cx.fillRect(ex, ey, 1, 1); }
      txt2(C.nome, px + sz / 2, py + sz + 10, '#ffe75a', '#ff9d1c', '#1a1210', 1, 'C'); }
    const cxr = C ? 258 : W / 2;
    anuncio('CONTINUAR?', cxr, 38, 2, 'gelo', this.t || 0, Infinity, { faixa: false, reto: true });
    letreiro(String(Math.max(0, this.n)), cxr, 50, 6, this.n <= 3 ? 'sangue' : 'fogo');   /* 23/10 (layout): contagem maior, em fogo */
    /* duas saidas grandes lado a lado (a principal em coral); no toque nao precisa de instrucao */
    const toque = LAY === 'toque';
    ['CONTINUAR', 'TROCAR LUTADOR'].forEach((t, n) => botaoUI(CONT_BT[n], t, n === 0 ? '#f0624f' : '#245049', CREME, { sel: !toque && n === this.i }));   /* 23/10 (layout): CONTINUAR coral e TROCAR teal, letra clara com sombra dura */
    if (!toque) txtT(LAY !== 'desk' ? 'ALAVANCA ESCOLHE . SOCO CONFIRMA' : 'SETAS ESCOLHEM . ENTER CONFIRMA', cxr, 158, (FRAME & 16) ? CREME : 'rgba(243,241,238,.4)');
    txtT('CREDITOS ' + (CREDITOS < 10 ? '0' : '') + CREDITOS, cxr, 174, 'rgba(243,241,238,.6)');
    txtO('CONSTANCIA E TUDO. TENTA DE NOVO.', cxr, 196, 'rgba(243,241,238,.75)', INK);
  }
};
/* ---------------- CENA: final + recompensa ---------------- */
const scFim = {
  enter(){ musica('fim'); this.pag = 0; this.mostrou = false; this.cen = CHARS[LUTA.jogador].stage; carregaCenario(this.cen); /* o campeao comemora em casa */ this.l = novoLutador(LUTA.jogador, 1, 'p1'); this.l.x = 200; this.l.estado = 'win'; this.l.winT = 30; CAM = 0;
    const C = CHARS[LUTA.jogador];
    this.paginas = C.time === 'calvo'
      ? ['O TIME CABELUDO CAIU.', 'O TIME CALVO VENCEU DE CABECA ERGUIDA.', 'NAO EXISTE CURA DA NOITE PRO DIA. MAS O TRATAMENTO CERTO FAZ MARAVILHAS COM O TEMPO.', 'VOCE LIBEROU 30% OFF NA SUA AVALIACAO.']
      : ['O TIME CALVO CAIU. MAS SAIU DE CABECA ERGUIDA.', 'FORA DO JOGO, O MELHOR GOLPE E CUIDAR CEDO DA CALVICIE.', 'NAO EXISTE CURA DA NOITE PRO DIA. MAS O TRATAMENTO CERTO FAZ MARAVILHAS COM O TEMPO.', 'VOCE LIBEROU 30% OFF NA SUA AVALIACAO.'];
    avisaPagina('fim');
  },
  toque(){ this.tocou = true; },
  voltar(){ if (!this.mostrou){ SFX.back(); go(scTitle); } },
  /* 23/10 (layout do Magnific, 11 FINAL): no celular deitado o cartao da recompensa fica a direita e o campeao e o VOCE VENCEU! vao para a esquerda (o campeao segue a vista) */
  premioLado(){ return this.mostrou && LAY === 'toque' && HUD_SOBRE && !GIRADO && LEAD.ok; },
  update(){ this.t++; FRAME++; this.kp = Math.max(0, Math.min(1, (this.kp || 0) + (this.premioLado() ? 0.06 : -0.06))); const kp = ease(this.kp);
    /* 26/10 ("no final o texto cobre o personagem"): enquanto o texto passa, o campeao fica no terco direito e a caixa ocupa a esquerda */
    const lendo = this.pag < this.paginas.length, alvo = lendo ? W * 0.74 : W / 2 + 8 - kp * (W * 0.2);
    this.lx = this.lx === undefined ? alvo : this.lx + (alvo - this.lx) * 0.12; this.l.x = Math.round(this.lx);
    if (this.t > minimoPagina(this) && (HIT.p1.start || HIT.p1.p || HIT.p1.k || this.tocou) && !this.mostrou){ this.tocou = false; this.pag++; SFX.ok(); this.t = 0; if (this.pag >= this.paginas.length){ this.mostrou = true; mostraRecompensa(); } }
    /* 23/10 (layout): chuva de confete mais cheia, em papeis de 2x4 que viram de lado no plano da tela (nada de giro de papel em 3D) */
    if (this.t % 4 === 0 || (this.pag === 0 && this.t < 3)) for (let i = 0; i < (this.pag === 0 && this.t < 3 ? 14 : 1); i++) FX.push({ tipo:'conf', x: Math.random() * W, y: -6 - Math.random() * (this.t < 3 ? 120 : 0), vx:(Math.random()-.5)*.6, vy:.6 + Math.random() * .9, t:0, dur:320, fase: Math.random() * 20 | 0, cor:[CORAL, MINT, AMARELO, CREME, '#6fb4ff', '#c58cff'][(Math.random()*6)|0] });
    for (const f of FX){ if (f.tipo === 'conf'){ f.x += f.vx + Math.sin(f.t * .1) * .4; f.y += f.vy; } }
    passoFX(); },
  draw(){
    L1 = this.l; L2 = this.l;
    drawStage(this.cen || 'barbearia', 0.12);
    nevoaHorizonte(this.cen || 'barbearia');                       /* 23/10: a mesma profundidade da luta */
    { if (!this.sol){ this.sol = cx.createLinearGradient(0, 0, 0, H); this.sol.addColorStop(0, 'rgba(255,226,170,.16)'); this.sol.addColorStop(0.5, 'rgba(255,226,170,.05)'); this.sol.addColorStop(1, 'rgba(255,226,170,0)'); }
      cx.fillStyle = this.sol; cx.fillRect(0, 0, W, H); }   /* 23/10 (layout): dia de sol, mais claro que a luta */
    { cx.save(); cx.globalCompositeOperation = 'lighter'; brilho(cx, this.l.x - CAM, this.l.y - 60, 70, 90, 0.22, 'rgba(255,220,160,'); cx.restore(); }
    drawLutador(this.l);
    vinhetaBordas();
    drawSpr('fx_coroa', this.l.x - CAM, this.l.y - 118 * this.l.C.ev - 4 + Math.round(Math.sin((this.t || 0) * 0.12) * 3), false, { sc: 1 });   /* a coroa do campeao, como na referencia do final */
    for (const f of FX) if (f.tipo === 'conf'){ cx.fillStyle = f.cor; const dep = ((f.t + f.fase) >> 3) & 1; cx.fillRect(Math.round(f.x), Math.round(f.y), dep ? 4 : 2, dep ? 2 : 4); }
    const kp = ease(this.kp || 0); anuncio('VOCE VENCEU!', Math.round(Math.max(larguraT('VOCE VENCEU!', 2) / 2 + 6 + MARGEM, W / 2 - kp * W * 0.26)), 20, 2, 'ouro', this.mostrou ? 60 : (this.t || 0), Infinity, { faixa: false, reto: true });
    if (this.pag < this.paginas.length){ const bw = Math.round(W * 0.74 - 52 - 10 - MARGEM), yb = caixaFala(this.paginas[this.pag], true, true, bw), xr = 10 + MARGEM + bw;
      if (this.t > minimoPagina(this)){                 /* seta de "tem mais" e o aviso de seguir DENTRO da caixa (26/10: solto embaixo dela, cobria a placa do cenario) */
        txtT('\u25bc', xr - 14, yb - 12 + ((FRAME >> 3) & 1), AMARELO);
        const s = LAY === 'toque' ? 'TOQUE CONTINUA' : LAY !== 'desk' ? 'SOCO CONTINUA' : 'Z CONTINUA'; txtR(s, xr - 22, yb - 12, (FRAME & 16) ? 'rgba(243,241,238,.8)' : 'rgba(243,241,238,.45)'); } }
  }
};
function avisaPagina(ev, dados){ try { window.parent.postMessage(Object.assign({ cvc: ev }, dados || {}), '*'); } catch(e){} try { (window.dataLayer = window.dataLayer || []).push(Object.assign({ event: 'cvc_' + ev }, dados || {})); } catch(e){} }
/* captacao (pedido de 19/10): OBRIGATORIA no fim da 1a luta, ganhando ou perdendo (e-mail obrigatorio, WhatsApp opcional, aceite).
   Antes era so no cartao final. O lead vai para /api/lead (servidor do jogo), que grava no D1 e repassa para a planilha do Google
   (Apps Script da conta alexandre@manual.co). Nada de dado pessoal na URL, no dataLayer nem no aparelho: o aparelho guarda so a
   marca "ja cadastrou" (cvc_lead_ok), para nao pedir de novo; com ela, o cartao final so entrega a recompensa. */
const ACEITE_VERSAO = '2026-10-19';
const LEAD = { ok: (() => { try { return localStorage.getItem('cvc_lead_ok') === '1'; } catch(e){ return false; } })() };
function precisaLead(){ return !LEAD.ok && !LUTA.p2humano && !LUTA.demo; }
function mascaraTel(v){ const d = String(v).replace(/\D/g, '').slice(0, 11); if (!d.length) return ''; if (d.length <= 2) return '(' + d; if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2); if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6); return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7); }
/* origem do anuncio (utm da URL do jogo): vai junto do lead para a planilha separar campanha e criativo */
function origemAnuncio(){ const o = {}; for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']){ const v = Q.get(k); if (v) o[k] = v.slice(0, 120); } return o; }
function enviaLead(dados){
  const corpo = Object.assign({ consentimento: true, aceite_versao: ACEITE_VERSAO, lutador: LUTA.jogador, time: CHARS[LUTA.jogador].time, criado: false, dificuldade: LUTA.dif }, origemAnuncio(), dados);
  /* de outro dominio (Webflow) vai como text/plain: pedido simples, sem preflight (keepalive com preflight falha em alguns navegadores) */
  const fora = /^https?:/i.test(API_LEAD) && API_LEAD.indexOf(location.origin + '/') !== 0;
  try { fetch(API_LEAD, { method: 'POST', headers: { 'Content-Type': fora ? 'text/plain;charset=UTF-8' : 'application/json' }, body: JSON.stringify(corpo), keepalive: true })
    .then(r => avisaPagina(r.ok ? 'lead_gravado' : 'lead_erro', { status: r.status, momento: corpo.momento })).catch(() => avisaPagina('lead_erro', { momento: corpo.momento })); } catch(_){}
  avisaPagina('lead_enviado', { whatsapp: !!corpo.whatsapp, momento: corpo.momento });
  LEAD.ok = true; try { localStorage.setItem('cvc_lead_ok', '1'); } catch(_){}
}
const htmlFormLead = botao =>
  '<form id="lead" class="lead" novalidate>' +
    '<label class="campo"><span>SEU E-MAIL</span><input id="lead-email" name="email" type="email" inputmode="email" autocomplete="email" autocapitalize="off" spellcheck="false" maxlength="120" placeholder="voce@email.com" enterkeyhint="next"></label>' +
    '<label class="campo"><span>WHATSAPP COM DDD <i>(OPCIONAL)</i></span><input id="lead-whats" name="whatsapp" type="tel" inputmode="tel" autocomplete="tel-national" maxlength="16" placeholder="(11) 91234-5678" enterkeyhint="go"></label>' +
    '<label class="aceite"><input id="lead-aceite" type="checkbox"><span>Aceito receber contato da&nbsp;MANUAL por&nbsp;e-mail e&nbsp;WhatsApp e&nbsp;li a&nbsp;<a href="https://www.manual.com.br/privacy-policy" target="_blank" rel="noopener">Pol&iacute;tica de&nbsp;Privacidade</a>.</span></label>' +
    '<input type="text" name="site" class="mel" tabindex="-1" autocomplete="off" aria-hidden="true">' +
    '<p class="aviso" id="lead-aviso" role="alert"></p>' +
    '<button class="cta" type="submit" id="cta-link">' + botao + '</button>' +
  '</form>';
/* valida o formulario do cartao aberto; com tudo certo chama ok(email, digitos do WhatsApp, robo) uma vez por toque */
function ligaFormLead(ok){
  const form = document.getElementById('lead'), em = document.getElementById('lead-email'), wh = document.getElementById('lead-whats'), ac = document.getElementById('lead-aceite'), aviso = document.getElementById('lead-aviso');
  const erro = (el, msg) => { aviso.textContent = msg; if (el && el.focus) el.focus(); if (el) el.setAttribute('aria-invalid', 'true'); avisaPagina('lead_invalido'); return false; };
  for (const el of [em, wh]) el.addEventListener('input', () => { el.removeAttribute('aria-invalid'); aviso.textContent = ''; });
  wh.addEventListener('input', () => { wh.value = mascaraTel(wh.value); });
  ac.addEventListener('change', () => { aviso.textContent = ''; });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = em.value.trim().toLowerCase(), dig = wh.value.replace(/\D/g, '');
    if (!/^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(email)) return erro(em, 'CONFIRA SEU E-MAIL.');
    if (dig && (dig.length < 10 || dig.length > 11)) return erro(wh, 'CONFIRA O WHATSAPP COM DDD.');
    if (!ac.checked) return erro(ac, 'MARQUE O ACEITE PARA CONTINUAR.');
    aviso.textContent = ''; ok(email, dig, !!form.elements.site.value);
  });
}
const AVISO_LEGAL = '<small>Tratamento mediante avalia&ccedil;&atilde;o m&eacute;dica. Resultados variam de pessoa para pessoa.</small>';
/* fim da 1a luta: o cartao segura o jogo ate o cadastro; quem venceu segue para a 2a luta, quem perdeu vai para o continue */
function pedeLeadLuta1(venceu, segue){
  const over = document.getElementById('over'), card = document.getElementById('card');
  card.className = 'card com-form';
  card.innerHTML = '<div class="wm" role="img" aria-label="MANUAL"></div><h2><span>' + (venceu ? 'VOC&Ecirc; VENCEU!' : 'VOC&Ecirc; PERDEU') + '</span></h2>' +
    '<div class="selo">LUTA 1 DE 3</div>' +
    '<p>Deixe seu e-mail para ' + (venceu ? 'seguir para a&nbsp;pr&oacute;xima&nbsp;luta' : 'continuar&nbsp;lutando') + '. Ven&ccedil;a as 3 lutas e libere 30% OFF na&nbsp;sua&nbsp;avalia&ccedil;&atilde;o.</p>' +
    htmlFormLead('CONTINUAR') + AVISO_LEGAL + '<button class="voltar" id="lead-sair" type="button">SAIR PARA O IN&Iacute;CIO</button>';
  over.classList.add('on');
  let foi = false;
  ligaFormLead((email, dig, robo) => {
    if (foi) return; foi = true;
    if (!robo) enviaLead({ email, whatsapp: dig, venceu, momento: 'luta1' });
    over.classList.remove('on'); SFX.ok(); segue();
  });
  document.getElementById('lead-sair').addEventListener('click', () => { if (foi) return; foi = true; over.classList.remove('on'); avisaPagina('lead_luta1_saiu'); go(scTitle); });
  avisaPagina('lead_luta1_aberto', { venceu });
}
/* cartao final: com o cadastro feito na 1a luta, so a recompensa e o botao da avaliacao; sem ele (aparelho que limpou tudo), o formulario volta */
function mostraRecompensa(){
  const over = document.getElementById('over'), card = document.getElementById('card'), comForm = !LEAD.ok;
  card.className = 'card premio' + (comForm ? ' com-form' : '');
  card.innerHTML = '<div class="wm" role="img" aria-label="MANUAL"></div><h2><span>VOC&Ecirc; VENCEU O&nbsp;TIME&nbsp;' + (CHARS[LUTA.jogador].time === 'calvo' ? 'CABELUDO' : 'CALVO') + '</span></h2>' +
    '<div class="selo">30% OFF LIBERADO</div>' +
    '<p>N&atilde;o existe cura da&nbsp;noite pro&nbsp;dia, mas&nbsp;o&nbsp;tratamento certo faz maravilhas com&nbsp;o&nbsp;tempo. Comece pela&nbsp;avalia&ccedil;&atilde;o&nbsp;m&eacute;dica.</p>' +
    (comForm ? htmlFormLead('FAZER MINHA AVALIA&Ccedil;&Atilde;O') : '<button class="cta" type="button" id="cta-link">FAZER MINHA AVALIA&Ccedil;&Atilde;O</button>') +
    AVISO_LEGAL +
    '<button class="voltar" id="cta-voltar" type="button">JOGAR DE NOVO</button>';
  over.classList.add('on');
  const bt = document.getElementById('cta-link');
  const abreAvaliacao = () => {
    avisaPagina('cta_click');
    const w = window.open(CTA_URL, '_blank'); if (w){ try { w.opener = null; } catch(_){} } else location.href = CTA_URL;
    bt.textContent = 'AVALIAÇÃO ABERTA!';
  };
  if (comForm){ let enviado = false; ligaFormLead((email, dig, robo) => { if (!enviado && !robo){ enviado = true; enviaLead({ email, whatsapp: dig, venceu: true, momento: 'final' }); } abreAvaliacao(); }); }
  else bt.addEventListener('click', abreAvaliacao);
  document.getElementById('cta-voltar').addEventListener('click', ()=>{ over.classList.remove('on'); go(scTitle); });
  avisaPagina('bonus_liberado');
}

/* ---------------- LOOP ---------------- */
const LOGIC_MS = 1000 / 60; let _last = null, _acc = 0;
/* cena de diagramacao fixa: roda com W = 384 e desenha deslocada por XB no meio da tela larga */
function naBase(fn){ if (!SCENE || !SCENE.base || !XB) return fn(); const Wr = W; W = WB; try { return fn(); } finally { W = Wr; } }
function loop(ts){
  if (ts == null) ts = performance.now();
  if (_last == null) _last = ts;
  let dt = ts - _last; _last = ts; if (dt > 200) dt = LOGIC_MS; _acc += dt;
  let passos = 0;
  while (_acc >= LOGIC_MS && passos < 5){
    amostraEntrada();
    if (VOLTAR_PEDIDO){ VOLTAR_PEDIDO = false; if (SCENE && SCENE.voltar){ try { SCENE.voltar(); } catch(e){ window.__err = String(e && e.stack || e); } } }
    if (TOQUE_TELA){ const tq = TOQUE_TELA, bx = SCENE && SCENE.base ? XB : 0; TOQUE_TELA = null; UI_APERTO = { x: tq.x - bx, y: tq.y, ms: performance.now() }; if (SCENE && SCENE.toque){ try { naBase(() => SCENE.toque(tq.x - bx, tq.y)); } catch(e){ window.__err = String(e && e.stack || e); } } }
    if (somPedido){ somPedido = false; SOM = !SOM; if (!SOM) musica(null); POPS.push({ x: CAM + (SCENE && SCENE.base ? WB : W)/2, y: 120, texto: SOM ? 'SOM LIGADO' : 'SOM DESLIGADO', t:0, dur:50, cor:CREME, vx:0 }); }
    if (SCENE){ try { naBase(() => SCENE.update()); } catch(e){ window.__err = String(e && e.stack || e); } }
    PEDE_PAUSA = false; _acc -= LOGIC_MS; passos++;
  }
  if (SCENE){ cx.fillStyle = '#000'; cx.fillRect(0, 0, W, H);
    try {
      if (SCENE.base && XB){ cx.save(); cx.translate(XB, 0); naBase(() => { if (SCENE.fundo) SCENE.fundo(-XB, WB + XB); SCENE.draw(); }); cx.restore(); }
      else SCENE.draw();
    } catch(e){ cx.restore(); window.__err = String(e && e.stack || e); }
    present(); }
  sincronizaPainel();
  requestAnimationFrame(loop);
}
/* atalhos de desenvolvimento: ?luta=carlos,tonho  ?cena=select */
window.DBG = {
  luta(a, b){ LUTA.jogador = a; LUTA.lista = [b, b, b]; LUTA.indice = 0; LUTA.momentoFeito = {}; go(scFight); },
  cena(n){ go({ boot:scBoot, title:scTitle, select:scSelect, vs:scVs, fim:scFim, continue:scContinue }[n] || scTitle); },
  estado(){ return { cena: SCENE === scFight ? 'fight' : SCENE === scTitle ? 'title' : SCENE === scSelect ? 'select' : SCENE === scVs ? 'vs' : SCENE === scFim ? 'fim' : 'outra', fase: LUTA.fase, l1: L1 && { x:L1.x, vida:L1.vida, estado:L1.estado, pose:poseDe(L1) }, l2: L2 && { x:L2.x, vida:L2.vida, estado:L2.estado, pose:poseDe(L2) }, sheet: SHEET_OK, slots: Object.keys(SHEETMAP).length }; },
  quadro(){ return cv.toDataURL('image/png'); }
};
fitCanvas();
(function(){
  if (Q.get('luta')){ const [a, b] = Q.get('luta').split(','); DBG.luta(a, b || 'tonho'); }
  else if (Q.get('cena')) DBG.cena(Q.get('cena'));
  else go(scBoot);
  requestAnimationFrame(loop);
})();
