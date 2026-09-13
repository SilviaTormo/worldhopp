// ASCII density map of the rasterized illustration sheet.
import { readFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';

const PNG = process.argv[2] || 'evidence/dest-slice/sheet.png';

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
const CELL = Number(process.argv[3] || 60);
const cols = Math.floor(png.w / CELL), rows = Math.floor(png.h / CELL);
const CH = ' .:-=+*#%@';
let header = '     ';
for (let cx = 0; cx < cols; cx++) header += cx % 10 === 0 ? String((cx / 10) % 10) : ' ';
console.log(header);
for (let cy = 0; cy < rows; cy++) {
  let line = '';
  for (let cx = 0; cx < cols; cx++) {
    let ink = 0, tot = 0;
    for (let y = cy * CELL; y < (cy + 1) * CELL; y += 3) {
      for (let x = cx * CELL; x < (cx + 1) * CELL; x += 3) {
        const i = (y * png.w + x) * png.bpp;
        tot++;
        if (png.data[i] < 235 || png.data[i + 1] < 235 || png.data[i + 2] < 235) ink++;
      }
    }
    line += CH[Math.min(9, Math.round((ink / tot) * 12))];
  }
  console.log(String(cy * CELL).padStart(4) + ' ' + line);
}
