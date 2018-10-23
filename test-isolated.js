#!/usr/bin/env node

/**
 * Запускает тестирование в Node.js.
 * Использование:
 * node node_modules/ws-unit-testing/scripts/mocha -t 10000 test-isolated
 */

let app = require('ws-unit-testing/isolated');
const config = require('./package.json').config;

app.run({
   moduleType: 'amd',
   root: './application',
   ws: 'WS.Core',
   tests: 'tests'
});
