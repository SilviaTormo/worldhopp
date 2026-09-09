#!/usr/bin/env node
/**
 * Worldhopp — generador de documentación (PDF) estilo Carbon minimalista.
 * Sin dependencias externas: PDFs construidos a mano (PDF 1.4).
 *
 * Uso:  node scripts/generate-docs.js
 * Salida: docs/plan-modernizacion.pdf
 *         docs/arquitectura-inicial.pdf
 *         docs/arquitectura-final.pdf
 */
'use strict';

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

/* ------------------------------------------------------------------ */
/* Paleta y tipografía (Carbon Design System)                         */
/* ------------------------------------------------------------------ */
const C = {
  bg: [0.957, 0.957, 0.957],      // #f4f4f4 Carbon gray-10
  text: [0.086, 0.086, 0.086],    // #161616 Carbon gray-100
  accent: [0.059, 0.384, 0.996],  // #0f62fe Carbon blue-60
  midGray: [0.392, 0.392, 0.392], // #636363 gray-60
  lineGray: [0.573, 0.573, 0.573],// #929292 gray-40-ish
  lightBox: [1, 1, 1],
  green: [0.106, 0.737, 0.608],   // #1bbc9b (verde de la marca Worldhopp)
};
const FONT = 'IBM Plex Sans';     // se usa si está instalada; fallback Helvetica

/* ------------------------------------------------------------------ */
/* Writer PDF mínimo (solo lo necesario)                              */
/* ------------------------------------------------------------------ */
class Pdf {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.pages = [];
    this.page = null;
    this.newPage();
  }
  newPage() {
    this.page = { ops: [], fonts: new Set() };
    this.pages.push(this.page);
  }
  useFont(name) { this.page.fonts.add(name); }
  rect(x, y, w, h, fill) {
    const [r, g, b] = fill;
    this.page.ops.push(`${r} ${g} ${b} rg ${x} ${this.height - y - h} ${w} ${h} re f`);
  }
  line(x1, y1, x2, y2, gray = C.lineGray, w = 0.75) {
    const [r, g, b] = gray;
    this.page.ops.push(
      `${r} ${g} ${b} RG ${w} w ${x1} ${this.height - y1} m ${x2} ${this.height - y2} l S`
    );
  }
  text(x, y, str, size = 10, color = C.text, font = FONT, bold = false) {
    const clean = String(str)
      .replace(/\\/g, '\\\\')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)');
    const f = bold ? `${font}-Bold` : font;
    this.useFont(f);
    const [r, g, b] = color;
    this.page.ops.push(
      `BT /${f} ${size} Tf ${r} ${g} ${b} rg ${x} ${this.height - y} Td (${clean}) Tj ET`
    );
  }
  build() {
    const objects = [];
    const add = (content) => { objects.push(content); return objects.length; };

    const fontRegular = add(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>`);
    const fontBold = add(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>`);
    // Los nombres con espacios (IBM Plex Sans) se mapean a Helvetica igualmente.
    const fontRegularAlt = add(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>`);
    const fontBoldAlt = add(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>`);

    const pageIds = [];
    const contentIds = [];
    for (const pg of this.pages) {
      const stream = pg.ops.join('\n');
      const compressed = zlib.deflateSync(Buffer.from(stream, 'latin1'));
      contentIds.push(add(`<< /Length ${compressed.length} /Filter /FlateDecode >>\nstream\n${''}`));
      objects[objects.length - 1] =
        `<< /Length ${compressed.length} /Filter /FlateDecode >>\nstream\n${compressed.toString('latin1')}\nendstream`;
    }
    const pagesId = add('');
    for (let i = 0; i < this.pages.length; i++) {
      const fontsUsed = this.pages[i].fonts;
      const res = [];
      if (fontsUsed.has(`${FONT}`)) res.push(`/F1 ${fontRegular} 0 R`);
      if (fontsUsed.has(`${FONT}-Bold`)) res.push(`/F2 ${fontBold} 0 R`);
      if (fontsUsed.has(FONT)) res.push(`/F1 ${fontRegularAlt} 0 R`);
      if (fontsUsed.has(`${FONT}-Bold`)) res.push(`/F2 ${fontBoldAlt} 0 R`);
      pageIds.push(add(
        `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${this.width} ${this.height}] ` +
        `/Resources << /Font << ${res.join(' ')} >> >> /Contents ${contentIds[i]} 0 R >>`
      ));
    }
    objects[pagesId - 1] =
      `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${this.pages.length} >>`;
    const catalogId = add(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`);

    let out = '%PDF-1.4\n';
    const offsets = [0];
    for (let i = 0; i < objects.length; i++) {
      offsets.push(out.length);
      out += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
    }
    const xrefPos = out.length;
    out += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    for (let i = 1; i <= objects.length; i++) {
      out += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
    }
    out += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;
    return Buffer.from(out, 'latin1');
  }
}

/* ------------------------------------------------------------------ */
/* Helpers de layout                                                  */
/* ------------------------------------------------------------------ */
const A4 = { w: 595.28, h: 841.89 };
const M = 48; // margen

function wrap(text, size, maxWidth) {
  // ~0.5 * size de ancho medio por carácter en Helvetica
  const charW = size * 0.5;
  const maxChars = Math.max(10, Math.floor(maxWidth / charW));
  const words = String(text).split(/\s+/);
  const lines = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > maxChars) {
      if (cur) lines.push(cur.trim());
      cur = w;
    } else {
      cur = (cur + ' ' + w).trim();
    }
  }
  if (cur) lines.push(cur.trim());
  return lines;
}

function drawWrapped(pdf, x, y, text, size, color, maxWidth, bold = false, lh = 1.45) {
  const lines = wrap(text, size, maxWidth);
  for (const line of lines) {
    pdf.text(x, y, line, size, color, FONT, bold);
    y += size * lh;
  }
  return y;
}

function bullet(pdf, x, y, text, size, color, maxWidth, indent = 12) {
  pdf.rect(x, y - size * 0.32, 3, 3, C.accent);
  return drawWrapped(pdf, x + indent, y, text, size, color, maxWidth - indent);
}

function sectionTitle(pdf, y, text) {
  pdf.rect(M, y, 24, 3, C.accent);
  return drawWrapped(pdf, M, y + 20, text, 15, C.text, A4.w - 2 * M, true) + 6;
}

function box(pdf, x, y, w, h, title, lines, opts = {}) {
  pdf.rect(x, y, w, h, opts.fill || C.lightBox);
  pdf.rect(x, y, w, 1, C.lineGray);          // top
  pdf.rect(x, y + h - 1, w, 1, C.lineGray);  // bottom
  pdf.rect(x, y, 1, h, C.lineGray);          // left
  pdf.rect(x + w - 1, y, 1, h, C.lineGray);  // right
  if (opts.accentLeft) pdf.rect(x, y, 3, h, opts.accentLeft);
  let ty = y + 16;
  if (title) {
    pdf.text(x + 12, ty, title, 9.5, C.text, FONT, true);
    ty += 15;
  }
  for (const l of lines || []) {
    ty = drawWrapped(pdf, x + 12, ty, l, 8, C.midGray, w - 24) + 2;
  }
  return y + h;
}

function arrowV(pdf, x, y1, y2) {
  pdf.line(x, y1, x, y2, C.accent, 1.2);
  pdf.rect(x - 3, y2 - 4, 6, 4, C.accent); // punta
}

function arrowH(pdf, x1, x2, y) {
  pdf.line(x1, y, x2, y, C.accent, 1.2);
  pdf.rect(x2 - 4, y - 3, 4, 6, C.accent);
}

function header(pdf, docTitle, subtitle) {
  pdf.rect(0, 0, A4.w, 6, C.accent);
  pdf.text(M, 34, 'WORLDHOPP · REFACTOR 2026', 8, C.accent, FONT, true);
  let y = drawWrapped(pdf, M, 54, docTitle, 22, C.text, A4.w - 2 * M, true) + 4;
  if (subtitle) y = drawWrapped(pdf, M, y, subtitle, 10.5, C.midGray, A4.w - 2 * M) + 8;
  return y + 4;
}

function footer(pdf, n) {
  pdf.line(M, A4.h - 40, A4.w - M, A4.h - 40);
  pdf.text(M, A4.h - 28, 'Worldhopp — documentación generada automáticamente', 7.5, C.midGray);
  pdf.text(A4.w - M - 40, A4.h - 28, String(n), 7.5, C.midGray, FONT, true);
}

/* ------------------------------------------------------------------ */
/* Documento 1: plan de modernización                                 */
/* ------------------------------------------------------------------ */
function buildPlanPdf() {
  const pdf = new Pdf(A4.w, A4.h);
  let pageNo = 1;

  // --- Página 1: portada + resumen
  let y = header(pdf, 'Plan de modernización y refactor de rendimiento',
    'Worldhopp · Angular 6 (2018) → Angular 20 · Sin cambios visuales');

  y = sectionTitle(pdf, y, 'Objetivo');
  y = drawWrapped(pdf, M, y,
    'Modernizar el stack sin tocar el aspecto visual (mismo layout, mismos CSS/HTML), ' +
    'corregir los problemas de rendimiento del código y dejar la base lista para añadir funcionalidad nueva.',
    10, C.text, A4.w - 2 * M) + 10;

  y = sectionTitle(pdf, y, 'Situación detectada');
  y = bullet(pdf, M, y, 'Angular 6 / TypeScript 2.9 / tslint / Karma+Protractor: no compila con Node 24.', 9.5, C.text, A4.w - 2 * M);
  y = bullet(pdf, M, y, 'Ojo que sigue al cursor: bucle setTimeout(16ms) infinito, getComputedStyle en cada mousemove y en cada frame, 6 console.log por movimiento.', 9.5, C.text, A4.w - 2 * M);
  y = bullet(pdf, M, y, 'Estrellas del formulario: creación y borrado de nodos DOM con timers recursivos sin límite ni pausa.', 9.5, C.text, A4.w - 2 * M);
  y = bullet(pdf, M, y, 'Navbar: ScrollMagic + GSAP (~100KB+ como scripts globales) solo para marcar el link activo.', 9.5, C.text, A4.w - 2 * M);
  y = bullet(pdf, M, y, '3 sliders con código casi duplicado (Hammer.js + reintentos con setTimeout).', 9.5, C.text, A4.w - 2 * M);
  y = bullet(pdf, M, y, 'Dependencias muertas: nodemailer, @angular/http, mo-js, smoothscroll, typeface-indie-flower.', 9.5, C.text, A4.w - 2 * M);
  y = bullet(pdf, M, y, 'Hero: <video autoplay> sin muted (los navegadores actuales lo bloquean); assets pesados (PNG 1920px, @2x/@3x).', 9.5, C.text, A4.w - 2 * M) + 10;

  y = sectionTitle(pdf, y, 'Fases');
  const fases = [
    ['Fase 0 — Preparación + entregables', 'Rama modernize/performance, fix de git y docs/ con este plan y los diagramas de arquitectura (inicial y final), en estilo Carbon.'],
    ['Fase 1 — Modernización Angular 6 → 20', 'ng update major a major o port directo a un workspace v20. Limpieza de dependencias muertas, ESLint en lugar de tslint, builder application moderno. Cero cambios visuales. Checkpoint visual al terminar.'],
    ['Fase 2 — Refactor de rendimiento', 'Ojo con requestAnimationFrame y caché, estrellas con pool, IntersectionObserver en la navbar, sliders unificados, vídeo muted, imágenes lazy, fuentes con font-display: swap, OnPush + trackBy, limpieza de console.log.'],
    ['Fase 3 — Verificación', 'Build de producción con presupuestos, comparativa de bundles, Lighthouse antes/después, tests en verde y PDFs actualizados al estado final.'],
  ];
  for (const [t, d] of fases) {
    pdf.rect(M, y - 4, A4.w - 2 * M, 1, C.lineGray);
    y = drawWrapped(pdf, M, y + 8, t, 10.5, C.text, A4.w - 2 * M, true);
    y = drawWrapped(pdf, M, y, d, 9, C.midGray, A4.w - 2 * M) + 12;
  }

  y = sectionTitle(pdf, y, 'Fuera de alcance (para después)');
  y = drawWrapped(pdf, M, y,
    'Zoneless, SSR/prerender y las features nuevas: se harán sobre esta base ya saneada.',
    9.5, C.midGray, A4.w - 2 * M);

  footer(pdf, pageNo++);

  // --- Página 2: detalle de Fase 2
  pdf.newPage();
  y = header(pdf, 'Fase 2 — Refactor de rendimiento (detalle)',
    'Misma apariencia, implementación simplificada');

  const items = [
    ['Ojo que sigue al cursor', 'Un único bucle requestAnimationFrame (no setTimeout). Se pausa con la pestaña oculta y cuando el componente está fuera de pantalla. Posición del ojo cacheada (se lee 1 vez, no en cada evento/frame). mousemove procesado una vez por frame. Sin console.log. Dirty-check para no escribir estilos si no cambian.'],
    ['Estrellas del formulario', 'Pool con máximo de estrellas concurrentes, un solo temporizador en lugar de timers recursivos, pausa cuando la sección está fuera de pantalla o la pestaña oculta.'],
    ['Navbar', 'ScrollMagic + GSAP sustituidos por IntersectionObserver: se eliminan las 4 entradas de scripts globales y sus dependencias. Scroll con listener pasivo + rAF.'],
    ['Sliders', 'Los 3 sliders (galería, cards, experiencias) unifican su lógica duplicada en un componente/directiva compartida: Hammer una sola vez, transform solo en frames de pan.'],
    ['Hero y assets', 'Vídeo con muted playsinline preload="metadata". Comprobación del peso de video.mp4 (recompresión con ffmpeg si hace falta). PNG pesados → WebP/JPG con la misma apariencia. loading="lazy" + width/height en imágenes bajo el fold (evita CLS).'],
    ['Angular', 'OnPush + trackBy en listas. Typed.js con destroy() en ngOnDestroy (fuga actual). Pipes puras en lugar de llamadas a métodos en templates.'],
    ['Carga', '@font-face con font-display: swap + preload de la fuente local. FontAwesome del CDN sustituido por SVG inline de los iconos realmente usados (cero bloqueo de render).'],
    ['Limpieza', 'Eliminación global de console.log en código de producción.'],
  ];
  for (const [t, d] of items) {
    y = drawWrapped(pdf, M, y, t, 10.5, C.accent, A4.w - 2 * M, true);
    y = drawWrapped(pdf, M, y, d, 9, C.text, A4.w - 2 * M) + 10;
  }
  footer(pdf, pageNo++);

  // --- Página 3: verificación + entregables
  pdf.newPage();
  y = header(pdf, 'Verificación y entregables', 'Cómo comprobamos que todo sigue igual y va más rápido');

  y = sectionTitle(pdf, y, 'Verificación');
  y = bullet(pdf, M, y, 'Build de producción correcta con presupuestos de tamaño (budgets).', 9.5, C.text, A4.w - 2 * M);
  y = bullet(pdf, M, y, 'Comparativa de tamaño de bundles: baseline = primera build de la Fase 1.', 9.5, C.text, A4.w - 2 * M);
  y = bullet(pdf, M, y, 'ng serve + capturas de toda la página para validar que el aspecto es idéntico.', 9.5, C.text, A4.w - 2 * M);
  y = bullet(pdf, M, y, 'Lighthouse (CLI) antes y después del refactor de rendimiento.', 9.5, C.text, A4.w - 2 * M);
  y = bullet(pdf, M, y, 'npm test en verde.', 9.5, C.text, A4.w - 2 * M) + 10;

  y = sectionTitle(pdf, y, 'Entregables permanentes (docs/)');
  y = bullet(pdf, M, y, 'docs/plan-modernizacion.pdf — este documento.', 9.5, C.text, A4.w - 2 * M);
  y = bullet(pdf, M, y, 'docs/arquitectura-inicial.pdf — diagrama de la arquitectura de partida.', 9.5, C.text, A4.w - 2 * M);
  y = bullet(pdf, M, y, 'docs/arquitectura-final.pdf — diagrama de la arquitectura resultante.', 9.5, C.text, A4.w - 2 * M);
  y = bullet(pdf, M, y, 'Generación reproducible: scripts/generate-docs.js (Node puro, sin dependencias), estilo Carbon: fondo #f4f4f4, texto #161616, acento #0f62fe.', 9.5, C.text, A4.w - 2 * M) + 10;

  y = sectionTitle(pdf, y, 'Estado del proyecto');
  const rows = [
    ['Stack inicial', 'Angular 6.1 · TypeScript 2.9 · tslint · Karma · Protractor'],
    ['Stack final', 'Angular 20 · TypeScript moderno · ESLint · builder application'],
    ['Restricción clave', 'El aspecto visual (layout, CSS, HTML) no cambia'],
    ['Fecha', new Date().toISOString().slice(0, 10)],
  ];
  for (const [k, v] of rows) {
    pdf.rect(M, y, 150, 20, C.lightBox);
    pdf.text(M + 8, y + 13, k, 8.5, C.text, FONT, true);
    pdf.text(M + 160, y + 13, v, 8.5, C.midGray);
    y += 22;
  }
  footer(pdf, pageNo++);

  return pdf.build();
}

/* ------------------------------------------------------------------ */
/* Documento 2: arquitectura inicial                                  */
/* ------------------------------------------------------------------ */
function buildArchInitialPdf() {
  const pdf = new Pdf(A4.w, A4.h);
  let pageNo = 1;

  let y = header(pdf, 'Arquitectura inicial',
    'Estado de partida · Angular 6 · septiembre 2026 (documento de referencia)');

  y = sectionTitle(pdf, y, 'Diagrama — app monolita, todo eager, scripts globales');
  const bw = 240, bh = 56, gapX = 40;
  const col1 = M, col2 = M + bw + gapX;

  const yTop = y + 6;
  box(pdf, col1, yTop, bw, bh, 'index.html', [
    'FontAwesome CDN (CSS bloqueante)',
    'smoothscroll-polyfill (script global)',
  ], { accentLeft: C.accent });
  box(pdf, col2, yTop, bw, bh, 'main.ts → AppModule', [
    'NgModule con 23 componentes declarados',
    'Una sola ruta: / → HomeComponent (eager)',
  ], { accentLeft: C.accent });

  const yMid = yTop + bh + 28;
  arrowV(pdf, col1 + bw / 2, yTop + bh, yMid);
  arrowV(pdf, col2 + bw / 2, yTop + bh, yMid);

  box(pdf, col1, yMid, bw, bh + 14, 'Scripts globales (angular.json)', [
    'TweenMax (GSAP 2) + ScrollMagic + plugins',
    'Cargados siempre, ~100KB+, solo para links activos',
  ], { accentLeft: C.accent });
  box(pdf, col2, yMid, bw, bh + 14, 'HomeComponent (todo en una página)', [
    '10 secciones hp-sc-* montadas a la vez',
    'Sin lazy loading, sin OnPush, sin trackBy',
  ], { accentLeft: C.accent });

  const yLow = yMid + bh + 26 + 14;
  box(pdf, col1, yLow, bw, 74, 'Efectos con problemas de rendimiento', [
    'Ojo: setTimeout(16ms) + getComputedStyle por mousemove + 6 console.log por evento',
    'Estrellas: DOM nodes creados/borrados con timers recursivos sin pausa',
    'Typed.js sin destroy() (fuga)',
  ], { accentLeft: C.green });
  box(pdf, col2, yLow, bw, 74, 'Sliders duplicados x3', [
    'gallery-paralax / cards-paralax / slider-experiences',
    'Hammer.js + makeid() + reintentos setTimeout(100ms)',
    'Lógica copiada y pegada en cada componente',
  ], { accentLeft: C.green });

  y = yLow + 84 + 14;
  y = sectionTitle(pdf, y, 'Problemas clave');
  y = bullet(pdf, M, y, 'Todo el JS de efectos se carga y ejecuta siempre, aunque no se use.', 9.5, C.text, A4.w - 2 * M);
  y = bullet(pdf, M, y, 'Bucles infinitos con setTimeout que no se pausan al ocultar la pestaña.', 9.5, C.text, A4.w - 2 * M);
  y = bullet(pdf, M, y, 'Lecturas/escrituras de estilo intercaladas (layout thrashing) en cada frame.', 9.5, C.text, A4.w - 2 * M);
  y = bullet(pdf, M, y, 'Dependencias muertas en package.json (nodemailer, @angular/http, mo-js…).', 9.5, C.text, A4.w - 2 * M);
  footer(pdf, pageNo++);

  return pdf.build();
}

/* ------------------------------------------------------------------ */
/* Documento 3: arquitectura final                                    */
/* ------------------------------------------------------------------ */
function buildArchFinalPdf() {
  const pdf = new Pdf(A4.w, A4.h);
  let pageNo = 1;

  let y = header(pdf, 'Arquitectura final',
    'Estado objetivo tras la modernización · Angular 20');

  y = sectionTitle(pdf, y, 'Diagrama — standalone, lazy, sin scripts globales');
  const bw = 240, bh = 56, gapX = 40;
  const col1 = M, col2 = M + bw + gapX;

  const yTop = y + 6;
  box(pdf, col1, yTop, bw, bh, 'index.html', [
    'Sin CDN bloqueante: iconos SVG inline',
    'Fuentes locales con preload + font-display: swap',
  ], { accentLeft: C.accent });
  box(pdf, col2, yTop, bw, bh, 'main.ts → bootstrapApplication', [
    'Componentes standalone, sin NgModule',
    'Rutas lazy: HomeComponent solo cuando toca',
  ], { accentLeft: C.accent });

  const yMid = yTop + bh + 28;
  arrowV(pdf, col1 + bw / 2, yTop + bh, yMid);
  arrowV(pdf, col2 + bw / 2, yTop + bh, yMid);

  box(pdf, col1, yMid, bw, bh + 14, 'Efectos eficientes', [
    'Ojo: requestAnimationFrame + caché + pausa en visibilitychange',
    'Estrellas: pool con máximo concurrente y timer único',
    'Navbar: IntersectionObserver (sin ScrollMagic ni GSAP)',
  ], { accentLeft: C.green });
  box(pdf, col2, yMid, bw, bh + 14, 'Slider compartido', [
    'Un solo componente/directiva para los 3 sliders',
    'Hammer una vez, transform solo en frames de pan',
  ], { accentLeft: C.green });

  const yLow = yMid + bh + 26 + 14;
  box(pdf, col1, yLow, bw, 74, 'Assets optimizados', [
    'Vídeo muted playsinline preload="metadata"',
    'Imágenes lazy + width/height (sin CLS)',
    'PNG pesados → WebP/JPG con la misma apariencia',
  ], { accentLeft: C.green });
  box(pdf, col2, yLow, bw, 74, 'Calidad y verificación', [
    'OnPush + trackBy en las listas',
    'ESLint (angular-eslint) en lugar de tslint',
    'Budgets de build + Lighthouse antes/después',
  ], { accentLeft: C.green });

  y = yLow + 84 + 14;
  y = sectionTitle(pdf, y, 'Resultado esperado');
  y = bullet(pdf, M, y, 'Mismo aspecto visual, menos JavaScript, menos trabajo por frame.', 9.5, C.text, A4.w - 2 * M);
  y = bullet(pdf, M, y, 'Cero trabajo en segundo plano cuando la pestaña está oculta.', 9.5, C.text, A4.w - 2 * M);
  y = bullet(pdf, M, y, 'Base sana para añadir features nuevas sin arrastrar deuda de 2018.', 9.5, C.text, A4.w - 2 * M);
  footer(pdf, pageNo++);

  return pdf.build();
}

/* ------------------------------------------------------------------ */
/* Main                                                               */
/* ------------------------------------------------------------------ */
const docsDir = path.join(__dirname, '..', 'docs');
fs.mkdirSync(docsDir, { recursive: true });

const targets = [
  ['plan-modernizacion.pdf', buildPlanPdf],
  ['arquitectura-inicial.pdf', buildArchInitialPdf],
  ['arquitectura-final.pdf', buildArchFinalPdf],
];

for (const [name, builder] of targets) {
  const buf = builder();
  fs.writeFileSync(path.join(docsDir, name), buf);
  console.log(`OK docs/${name} (${(buf.length / 1024).toFixed(1)} KB)`);
}
