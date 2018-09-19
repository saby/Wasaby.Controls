#!/usr/bin/env node

/**
 * Запускает HTTP сервер для тестирования в браузере.
 * Использование:
 * node test-server
 */

let app = require('ws-unit-testing/server');
const pckg = require('./package.json');

require('./test-fix-view.js').fix(pckg.config);
require('./sbis3-ws/compileEsAndTs.js');

app.run(process.env.test_server_port || pckg.config.test_server_port, {
   moduleType: 'amd',
   root: '.',
   ws: pckg.config.ws,
   tests: pckg.config.tests,
   initializer: 'testing-init.js',
   coverageCommand: pckg.scripts.coverage,
   coverageReport: pckg.config.htmlCoverageReport
});
