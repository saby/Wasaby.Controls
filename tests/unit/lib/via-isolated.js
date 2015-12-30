/**
 * Прогоняет unit тесты в изолированной среде (Nodejs).
 */

var global = (0, eval)('this'),
   path = require('path'),
   fs = require('fs'),
   requirejs = require('requirejs'),
   unit = require('./unit'),
   report = unit.report;

/**
 * Запускает тестирование
 * @param {Object} config Конфигурация тестирования
 * @param {Object} wsConfig Конфигурация WS
 * @param {String} [rootPath=''] Корневой каталог (по умолчанию совпадает с каталогом основного процесса)
 */
exports.run = function (config, wsConfig, rootPath) {
   rootPath = rootPath || process.cwd();

   //Подготавливаем окружение для ядра
   global.requirejs = requirejs;
   global.define = requirejs.define;
   global.assert = require('chai').assert;
   global.wsConfig = wsConfig;

   //Настраиваем requirejs
   requirejs.config({
      nodeRequire: require,
      baseUrl: rootPath,
      paths: {
         Squire: 'node_modules/squirejs/src/Squire'
      }
   });

   //Подключаем конфиг requirejs из ядра
   requirejs(path.join(wsConfig.wsRoot, 'ext/requirejs/config.js'));
   //FIXME: config.js сбрасывает baseUrl на '/'
   requirejs.config({
      baseUrl: rootPath
   });

   //Подключаем ядро
   requirejs(path.join(wsConfig.wsRoot, 'lib/core.js'));
   requirejs(path.join(wsConfig.wsRoot, 'lib/Source.js'));

   //Подменяем штатный логгер
   $ws.proto.TestConsoleLogger = $ws.proto.ILogger.extend({
      log: function(tag, message) {
         console.log(tag + ': ' + message);
      },
      error: function(tag, message, exception) {
         console.error(tag + ': ' + message + (exception ? exception.toString() : ''));
      },
      info: function(){
         console.info(tag + ': ' + message);
      }
   });
   $ws.single.ioc.bindSingle('ILogger', 'TestConsoleLogger');

   //Подключаем контролы к requirejs
   var contents = require(path.join(rootPath, wsConfig.resourceRoot, 'contents.json'));
   $ws.core.loadContents(contents, false, {
      service: rootPath,
      resources: wsConfig.resourceRoot
   });

   //Запускаем тесты
   unit.test.getList().forEach(function (test) {
      try {
         requirejs(test);
      } catch (e) {
         console.log(e.toString());
      }
   });

   if (config.saveToFile) {
      //Удаляем старый отчет
      report.clear();

      //Перехватываем вывод для формирования отчета
      var ws = fs.createWriteStream(report.getFilename(), {
         flags: 'a',
         encoding: 'utf8',
         mode: 0666
      });
      //var writeOriginal = process.stdout.write;
      process.stdout.write = function (chunk) {
         /*var str = '' + chunk;
         if (str && str[0] !== '<') {
            str = '<!--' + str + '-->';
         }*/
         ws.write(str);
         //writeOriginal.apply(process.stdout, arguments);
      };
      process.stdout.on('finish', function() {
         ws.end();
      });

   }
};
