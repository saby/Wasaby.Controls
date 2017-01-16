'use strict';

const themePreview = require('child_process').spawn('node', ['./theme-preview/app.js']);

themePreview.stdout.pipe(process.stdout);
themePreview.stderr.pipe(process.stderr);

themePreview.on('close', (code) => {
  console.log(`theme-preview завершилась с ошибкой: ${code}`);
});