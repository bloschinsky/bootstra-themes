// Builds the theme and the demo site.
//
//   node scripts/build.mjs   src/ → dist/, then index.html + demo/ + examples/ + dist/ → _site/
//
// The theme is hand-written plain CSS and JavaScript. The build copies both files to dist/
// and adds a minified copy of the CSS; nothing else changes.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { transform } from 'lightningcss';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = path.join(root, 'src');
const distDir = path.join(root, 'dist');
const siteDir = path.join(root, '_site');

fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir);
const css = fs.readFileSync(path.join(srcDir, 'rustomancy.css'));
const { code } = transform({ filename: 'rustomancy.css', code: css, minify: true });
fs.copyFileSync(path.join(srcDir, 'rustomancy.css'), path.join(distDir, 'rustomancy.css'));
fs.writeFileSync(path.join(distDir, 'rustomancy.min.css'), code);
fs.copyFileSync(path.join(srcDir, 'rustomancy.js'), path.join(distDir, 'rustomancy.js'));
console.log(`dist/rustomancy.css (${css.length} B), .min.css (${code.length} B), .js`);

// The demo pages load dist/ (index.html) and ../dist/ (examples/starter.html); keep that layout.
fs.rmSync(siteDir, { recursive: true, force: true });
fs.mkdirSync(siteDir);
fs.copyFileSync(path.join(root, 'index.html'), path.join(siteDir, 'index.html'));
for (const dir of ['demo', 'examples', 'dist']) {
  fs.cpSync(path.join(root, dir), path.join(siteDir, dir), { recursive: true });
}
console.log('_site/ ready');
