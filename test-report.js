#!/usr/bin/env node

/**
 * Запускает тестирование в Node.js и записывает результат в файл отчета.
 * Использование:
 * node node_modules/ws-unit-testing/scripts/mocha -t 10000 test-report
 */

var app = require('ws-unit-testing/isolated'),
   config = require('./package.json').config;
require('./test-fix-view.js').fix(config);
app.run({
   moduleType: 'amd',
   root: './',
   ws: config.ws,
   resources: config.resources,
   tests: config.tests,
   reportFile: process.env.test_report || config.test_report
});
