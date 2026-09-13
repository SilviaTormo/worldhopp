// Rasterize the worldhopp illustration SVG in headless Chrome, then cluster
// non-white pixels to discover each artwork's bounding box.
// Usage: node scripts/slice-destinations.mjs <input.svg> [workdir]
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';
import os from 'node:os';
import path from 'node:path';

const SVG = process.argv[2] || 'C:/Users/Silvia/Downloads/Diseno/worldhopp_ilustraciones_def (2).svg';
const WORK = process.argv[3] || 'evidence/dest-slice';
const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
].find(p => existsSync(p));

mkdirSync(WORK, { recursive: true });
const shot = path.join(WORK, 'sheet.png');

// 1. Rasterize --------------------------------------------------------------
const url = encodeURI('file:///' + SVG.replace(/\\/g, '/'));
const shotAbs = path.resolve(shot).replace(/\\/g, '/');
const profile = path.join(os.tmpdir(), 'wh-slice-profile');
let stderr = '';
try {
  execFileSync(CHROME, [
    '--headless=new', '--disable-gpu', '--no-first-run', '--hide-scrollbars',
    `--screenshot=${shotAbs}`, '--window-size=3000,10800',
    '--default-background-color=FFFFFFFF', '--virtual-time-budget=8000',
    '--force-device-scale-factor=1', `--user-data-dir=${profile}`,
    url,
  ], { stdio: ['ignore', 'ignore', 'pipe'] });
} catch (e) { stderr = String(e.stderr || e); }
if (stderr.trim()) console.error('chrome stderr:', stderr.slice(0, 500));
if (!existsSync(shot)) throw new Error('chrome did not write screenshot (url=' + url + ')');
console.log('screenshot written:', shot);

// 2. Decode PNG (zlib) -------------------------------------------------------
function decodePng(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error('not a png');
  let off = 8, w = 0, h = 0, bitDepth, colorType, idat = [];
  while (off < buf.length) {
    const len = buf.readUInt32BE(off);
    const type = buf.toString('ascii', off + 4, off + 8);
    const data = buf.subarray(off + 8, off + 8 + len);
    if (type === 'IHDR') {
      w = data.readUInt32BE(0); h = data.readUInt32BE(4);
      bitDepth = data[8]; colorType = data[9];
    } else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
    off += 12 + len;
  }
  if ((colorType !== 6 && colorType !== 2) || bitDepth !== 8) throw new Error(`unsupported png: colorType=${colorType} depth=${bitDepth}`);
  const bpp = colorType === 6 ? 4 : 3;
  const raw = inflateSync(Buffer.concat(idat));
  const stride = w * bpp;
  const out = Buffer.alloc(h * stride);
  // unfilter
  let pos = 0;
  for (let y = 0; y < h; y++) {
    const f = raw[pos++]; const row = y * stride;
    for (let x = 0; x < stride; x++) {
      const rb = raw[pos++];
      const a = x >= bpp ? out[row + x - bpp] : 0;
      const b = y > 0 ? out[row - stride + x] : 0;
      const c = (x >= bpp && y > 0) ? out[row - stride + x - bpp] : 0;
      let v;
      switch (f) {
        case 0: v = rb; break;
        case 1: v = rb + a; break;
        case 2: v = rb + b; break;
        case 3: v = rb + ((a + b) >> 1); break;
        case 4: { const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
          v = rb + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c); break; }
        default: throw new Error('filter ' + f);
      }
      out[row + x] = v & 0xff;
    }
  }
  return { w, h, bpp, data: out };
}

const png = decodePng(readFileSync(shot));
console.log('decoded:', png.w + 'x' + png.h);

// 3. Occupancy grid + clustering ---------------------------------------------
const CELL = 30;
const gw = Math.ceil(png.w / CELL), gh = Math.ceil(png.h / CELL);
const occ = new Uint8Array(gw * gh);
for (let cy = 0; cy < gh; cy++) {
  for (let cx = 0; cx < gw; cx++) {
    let ink = false;
    const px0 = cx * CELL, py0 = cy * CELL;
    outer:
    for (let y = py0; y < Math.min(py0 + CELL, png.h); y += 2) {
      for (let x = px0; x < Math.min(px0 + CELL, png.w); x += 2) {
        const i = (y * png.w + x) * png.bpp;
        // non-white (RGB, alpha-less)
        if (png.data[i] < 235 || png.data[i + 1] < 235 || png.data[i + 2] < 235) { ink = true; break outer; }
      }
    }
    occ[cy * gw + cx] = ink ? 1 : 0;
  }
}
// flood fill (4-neighborhood)
const seen = new Uint8Array(gw * gh);
const clusters = [];
for (let start = 0; start < occ.length; start++) {
  if (!occ[start] || seen[start]) continue;
  const q = [start]; seen[start] = 1;
  let x0 = Infinity, y0 = Infinity, x1 = -1, y1 = -1, n = 0;
  while (q.length) {
    const idx = q.pop(); n++;
    const cx = idx % gw, cy = (idx / gw) | 0;
    if (cx < x0) x0 = cx; if (cx > x1) x1 = cx;
    if (cy < y0) y0 = cy; if (cy > y1) y1 = cy;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = cx + dx, ny = cy + dy;
      if (nx < 0 || ny < 0 || nx >= gw || ny >= gh) continue;
      const ni = ny * gw + nx;
      if (occ[ni] && !seen[ni]) { seen[ni] = 1; q.push(ni); }
    }
  }
  const bx0 = x0 * CELL, by0 = y0 * CELL, bx1 = (x1 + 1) * CELL, by1 = (y1 + 1) * CELL;
  clusters.push({ x0: bx0, y0: by0, x1: bx1, y1: by1, w: bx1 - bx0, h: by1 - by0, cells: n });
}
clusters.sort((a, b) => b.cells - a.cells);
console.log('clusters:', clusters.length, '(top 25 by ink)');
for (const c of clusters.slice(0, 25)) {
  console.log(`  box ${c.x0},${c.y0} -> ${c.x1},${c.y1}  (${c.w}x${c.h})  ink=${c.cells}`);
}
writeFileSync(path.join(WORK, 'clusters.json'), JSON.stringify(clusters, null, 2));
console.log('saved', path.join(WORK, 'clusters.json'));
