#!/usr/bin/env node

/**
 * Запускает тестирование в Node.js.
 * Использование:
 * node node_modules/saby-units/scripts/mocha -t 10000 test-isolated
 */

let app = require('saby-units/isolated');
const config = require('./package.json').config;

app.run({
   moduleType: 'amd',
   root: './application',
   ws: 'WS.Core',
   tests: 'tests'
});
