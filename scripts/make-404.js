/**
 * GitHub Pages SPA fallback: copies index.html to 404.html so deep links
 * like /destino/barcelona are served by Pages' 404 handler.
 * https://github.com/rafgraph/spa-github-pages
 */
import { copyFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const dir = resolve('dist/worldhopp-modern/browser');
const index = resolve(dir, 'index.html');
const out = resolve(dir, '404.html');

if (!existsSync(index)) {
  console.error('make-404: index.html not found at', index);
  process.exit(1);
}
copyFileSync(index, out);
console.log('make-404: wrote', out);
