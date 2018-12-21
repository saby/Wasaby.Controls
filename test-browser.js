#!/usr/bin/env node

/**
 * Запускает тестирование через Webdriver.
 * Использование (предварительно должен быть запущен локальный HTTP серевер - test-server.js):
 * node test-browser
 */

let app = require('saby-units/browser');
const config = require('./package.json').config;

function buildUrl (scheme, host, port, path, query) {
   return scheme + '://' + host + ':' + port + '/' + path + '?' + query;
}

app.run(
   buildUrl(
      process.env.test_url_scheme || config.test_url.scheme,
      process.env.test_url_host || config.test_url.host,
      process.env.test_url_port || config.test_url.port,
      process.env.test_url_path || config.test_url.path,
      process.env.test_url_query || config.test_url.query
   ),
   process.env.test_report || config.test_report
);
