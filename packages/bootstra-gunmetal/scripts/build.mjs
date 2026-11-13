// Builds the theme and the demo site.
//
//   node scripts/build.mjs   gunmetal.css + gunmetal.js → dist/, then the demo pages → _site/
//
// The theme is hand-written plain CSS and JavaScript. The build copies both files to dist/
// and adds a minified copy of the CSS; nothing else changes.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { transform } from 'lightningcss';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');
const siteDir = path.join(root, '_site');

fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir);
const css = fs.readFileSync(path.join(root, 'gunmetal.css'));
const { code } = transform({ filename: 'gunmetal.css', code: css, minify: true });
fs.copyFileSync(path.join(root, 'gunmetal.css'), path.join(distDir, 'gunmetal.css'));
fs.writeFileSync(path.join(distDir, 'gunmetal.min.css'), code);
fs.copyFileSync(path.join(root, 'gunmetal.js'), path.join(distDir, 'gunmetal.js'));
console.log(`dist/gunmetal.css (${css.length} B), .min.css (${code.length} B), .js`);

// The demo pages load gunmetal.css and gunmetal.js from their own folder.
fs.rmSync(siteDir, { recursive: true, force: true });
fs.mkdirSync(siteDir);
for (const file of ['index.html', 'docs.html', 'gunmetal.css', 'gunmetal.js']) {
  fs.copyFileSync(path.join(root, file), path.join(siteDir, file));
}
console.log('_site/ ready');
