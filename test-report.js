#!/usr/bin/env node

/**
 * Запускает тестирование в Node.js и записывает результат в файл отчета.
 * Использование:
 * node node_modules/ws-unit-testing/scripts/mocha -t 10000 test-report
 */

let app = require('ws-unit-testing/isolated');
const config = require('./package.json').config;

app.run({
   moduleType: 'amd',
   root: './application',
   ws: 'WS.Core',
   tests: 'tests',
   reportFile: process.env.test_report || config.test_report
});
