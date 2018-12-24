#!/usr/bin/env node

/**
 * Запускает HTTP сервер для тестирования в браузере.
 * Использование:
 * node test-server
 */

let app = require('saby-units/server');
const pckg = require('./package.json');

app.run(process.env.test_server_port || pckg.config.test_server_port, {
   moduleType: 'amd',
   root: './application',
   ws: 'WS.Core',
   tests: 'tests',
   initializer: 'testing-init.js',
   coverageCommand: pckg.scripts.coverage,
   coverageReport: pckg.config.htmlCoverageReport
});
