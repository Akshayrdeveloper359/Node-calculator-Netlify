'use strict';
// Copies the static site into dist/ so Netlify can publish it.
const fs = require('node:fs');

fs.rmSync('dist', { recursive: true, force: true });
fs.mkdirSync('dist');
for (const f of ['index.html', 'calculator.js']) fs.copyFileSync(f, `dist/${f}`);
console.log('Build complete: dist/ is ready to deploy');
