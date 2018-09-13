#!/usr/bin/env node

/**
 * Запускает HTTP сервер для тестирования в браузере.
 * Использование:
 * node test-server
 */

var app = require('ws-unit-testing/server'),
   pckg = require('./package.json');

require('./test-fix-view.js').fix(pckg.config);
require('./sbis3-ws/compileEsAndTs.js');


app.run(process.env.test_server_port || pckg.config.test_server_port, {
   moduleType: 'amd',
   root: process.cwd(),
   ws: pckg.config.ws,
   resources: pckg.config.resources,
   shared: ['tests'],
   tests: pckg.config.tests,
   coverageCommand: pckg.scripts.coverage,
   coverageReport: pckg.config.htmlCoverageReport
});
