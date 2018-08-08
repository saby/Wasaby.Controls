#!/usr/bin/env node

/**
 * Запускает HTTP сервер для тестирования в браузере.
 * Использование:
 * node test-server
 */

var app = require('ws-unit-testing/server'),
   config = require('./package.json').config;

require('./test-fix-view.js').fix(config);
require('./sbis3-ws/compileEsAndTs.js');


app.run(process.env.test_server_port || config.test_server_port, {
   root: process.cwd(),
   ws: config.ws,
   resources: config.resources,
   shared: ['tests'],
   tests: config.tests
});
