// Enumerate depth-2 groups under Capa_1 (and depth-3 under BCN) with bboxes,
// so whole subtrees can be sliced into standalone destination SVGs.
import { readFileSync, writeFileSync } from 'node:fs';

const SVG = process.argv[2] || 'C:/Users/Silvia/Downloads/Diseno/worldhopp_ilustraciones_def (2).svg';
const s = readFileSync(SVG, 'utf8');
const body = s.slice(s.indexOf('</defs>'));

function parseT(t) {
  let M = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
  const re = /(matrix|translate|scale|rotate)\(([^)]*)\)/g; let m;
  while ((m = re.exec(t))) {
    const p = m[2].trim().split(/[ ,]+/).map(Number);
    if (m[1] === 'matrix') M = { a: p[0], b: p[1], c: p[2], d: p[3], e: p[4], f: p[5] };
    else if (m[1] === 'translate') M = { a: 1, b: 0, c: 0, d: 1, e: p[0] || 0, f: p[1] || 0 };
    else if (m[1] === 'scale') { const sx = p[0], sy = p.length > 1 ? p[1] : p[0]; M = { a: sx, b: 0, c: 0, d: sy, e: 0, f: 0 }; }
    else if (m[1] === 'rotate') {
      const r = (p[0] || 0) * Math.PI / 180, co = Math.cos(r), si = Math.sin(r);
      M = { a: co, b: si, c: -si, d: co, e: 0, f: 0 };
    }
  }
  return M;
}
function mulM(X, Y) { return { a: X.a * Y.a + X.c * Y.b, b: X.b * Y.a + X.d * Y.b, c: X.a * Y.c + X.c * Y.d, d: X.b * Y.c + X.d * Y.d, e: X.a * Y.e + X.c * Y.f + X.e, f: X.b * Y.e + X.d * Y.f + X.f }; }

const num = /[-+]?[0-9]*\.?[0-9]+(?:[eE][-+]?[0-9]+)?/g;
let F = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
const stack = [];
let depth = 0;
const groups = []; // {depth, openIdx, openTag, closeIdx, bbox}
const openStack = [];
const all = [...body.matchAll(/<(\/?)g\b([^>]*)>|<path\b([^>]*)\/?>/g)];
for (const t of all) {
  if (t[0].startsWith('</')) {
    F = stack.pop() || F; depth--;
    const g = openStack.pop();
    if (g) { g.closeIdx = t.index + t[0].length; groups.push(g); }
    continue;
  }
  if (t[0].startsWith('<g')) {
    stack.push(F);
    const tr = t[2].match(/transform="([^"]+)"/);
    if (tr) F = mulM(F, parseT(tr[1]));
    depth++;
    openStack.push({ depth, openIdx: t.index, openTag: t[0], bbox: null });
    continue;
  }
  const d = (t[3] || '').match(/ d="([^"]*)"/);
  if (!d) continue;
  const nums = d[1].match(num) || [];
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (let i = 0; i + 1 < nums.length; i += 2) {
    const X = F.a * nums[i] + F.c * nums[i + 1] + F.e;
    const Y = F.b * nums[i] + F.d * nums[i + 1] + F.f;
    if (X < x0) x0 = X; if (X > x1) x1 = X; if (Y < y0) y0 = Y; if (Y > y1) y1 = Y;
  }
  if (x0 < Infinity) {
    for (const g of openStack) {
      if (!g.bbox) g.bbox = { x0, y0, x1, y1 };
      else {
        g.bbox.x0 = Math.min(g.bbox.x0, x0); g.bbox.y0 = Math.min(g.bbox.y0, y0);
        g.bbox.x1 = Math.max(g.bbox.x1, x1); g.bbox.y1 = Math.max(g.bbox.y1, y1);
      }
    }
  }
}
const fmt = b => b ? `${Math.round(b.x0)},${Math.round(b.y0)} -> ${Math.round(b.x1)},${Math.round(b.y1)} (${Math.round(b.x1 - b.x0)}x${Math.round(b.y1 - b.y0)})` : 'no-paths';
console.log('=== depth-2 groups ===');
for (const g of groups.filter(g => g.depth === 2)) {
  console.log(`[${g.openIdx}..${g.closeIdx}] len=${g.closeIdx - g.openIdx}  ${fmt(g.bbox)}\n    ${g.openTag.slice(0, 150)}`);
}
const bcn = groups.filter(g => g.depth === 3 && g.bbox && g.bbox.x0 > 1800 && g.bbox.y1 < 5500 && g.bbox.y0 > 4300);
console.log('=== depth-3 groups inside BCN region ===');
for (const g of bcn) console.log(`[${g.openIdx}..${g.closeIdx}] len=${g.closeIdx - g.openIdx}  ${fmt(g.bbox)}\n    ${g.openTag.slice(0, 130)}`);
