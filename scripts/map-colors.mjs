// Color-coded ASCII map: dominant palette color per cell (worldhopp palette).
// R=red #e8674f, Y=yellow, N=navy/dark #1d1c3c, G=green-ish, B=blue, .=white/none
import { readFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';

const PNG = process.argv[2] || 'evidence/dest-slice/sheet.png';
const CELL = Number(process.argv[3] || 30);
const X0 = Number(process.argv[4] || 0), Y0 = Number(process.argv[5] || 0);
const W = Number(process.argv[6] || 0), H = Number(process.argv[7] || 0);

function decodePng(buf) {
  let off = 8, w = 0, h = 0, colorType = 0, idat = [];
  while (off < buf.length) {
    const len = buf.readUInt32BE(off);
    const type = buf.toString('ascii', off + 4, off + 8);
    const data = buf.subarray(off + 8, off + 8 + len);
    if (type === 'IHDR') { w = data.readUInt32BE(0); h = data.readUInt32BE(4); colorType = data[9]; }
    else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
    off += 12 + len;
  }
  const bpp = colorType === 6 ? 4 : 3;
  const raw = inflateSync(Buffer.concat(idat));
  const stride = w * bpp;
  const out = Buffer.alloc(h * stride);
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

const png = decodePng(readFileSync(PNG));
const x0 = X0, y0 = Y0, x1 = W ? Math.min(X0 + W, png.w) : png.w, y1 = H ? Math.min(Y0 + H, png.h) : png.h;
const cols = Math.floor((x1 - x0) / CELL), rows = Math.floor((y1 - y0) / CELL);

function classify(r, g, b) {
  if (r > 235 && g > 235 && b > 235) return ' ';
  // distance to palette
  const pal = [
    ['R', 232, 103, 79], ['Y', 247, 209, 61], ['N', 29, 28, 60],
    ['B', 46, 49, 146], ['W', 255, 255, 255],
  ];
  let best = ' ', bd = 1e9;
  for (const [ch, pr, pg, pb] of pal) {
    const d = (r - pr) ** 2 + (g - pg) ** 2 + (b - pb) ** 2;
    if (d < bd) { bd = d; best = ch; }
  }
  if (bd > 24000) return '?'; // off-palette (green trees, skin, etc.)
  return best;
}

let header = '     ';
for (let cx = 0; cx < cols; cx++) header += cx % 10 === 0 ? String(((x0 / CELL + cx) / 10) % 10) : ' ';
console.log(header + '   (x cells of ' + CELL + 'px)');
for (let cy = 0; cy < rows; cy++) {
  let line = '';
  const counts = {};
  for (let cx = 0; cx < cols; cx++) {
    // dominant palette color in cell
    const tally = {};
    for (let y = y0 + cy * CELL; y < y0 + (cy + 1) * CELL; y += 3) {
      for (let x = x0 + cx * CELL; x < x0 + (cx + 1) * CELL; x += 3) {
        const i = (y * png.w + x) * png.bpp;
        const ch = classify(png.data[i], png.data[i + 1], png.data[i + 2]);
        if (ch !== ' ') tally[ch] = (tally[ch] || 0) + 1;
      }
    }
    let dom = ' ', max = 0;
    for (const k in tally) if (tally[k] > max) { max = tally[k]; dom = k; }
    counts[dom] = (counts[dom] || 0) + 1;
    line += dom;
  }
  console.log(String(y0 + cy * CELL).padStart(4) + ' ' + line);
}
