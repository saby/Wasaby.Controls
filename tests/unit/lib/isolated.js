/**
 * Прогоняет unit тесты в изолированной среде (Node.js).
 */

var global = (0, eval)('this'),
    path = require('path'),
    fs = require('fs'),
    requirejs = require('requirejs'),
    unit = require('./unit'),
    report = unit.report;
global.isMochaRunned = true;
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

   //Конфигурируем requirejs
   var requireCfg = require(path.join(rootPath, wsConfig.wsRoot, 'ext/requirejs/config'))(
       rootPath,
       wsConfig.wsRoot,
       wsConfig.resourceRoot
   );
   requirejs.config(requireCfg);

   //Подключаем ядро
   requirejs(path.join(wsConfig.wsRoot, 'lib/core.js'));

   //Подменяем штатный логгер
   $ws.proto.TestConsoleLogger = function () {
      this.log = function(tag, message) {
         console.log(tag + ': ' + message);
      };

      this.error = function(tag, message, exception) {
         console.error(tag + ': ' + message + (exception ? exception.toString() : ''));
      };

      this.info = function(tag, message) {
         console.info(tag + ': ' + message);
      };
   };

   $ws.core.classicExtend($ws.proto.TestConsoleLogger, $ws.proto.ILogger);
   $ws.single.ioc.bindSingle('ILogger', new $ws.proto.TestConsoleLogger());

   //Загружаем оглавление
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

      var fileName = report.getFilename();
      console.log('Writing report file "' + fileName + '"');

      //Перехватываем вывод для формирования отчета
      var writeOriginal = process.stdout.write,
          contents = [];
      process.stdout.write = function (chunk) {
         var str = '' + chunk;
         if (str && str[0] !== '<') {
            str = '<!--' + str + '-->';
         }
         contents.push(str);
      };
      process.on('exit', function () {
         process.stdout.write = writeOriginal;
         report.save(contents.join(''));
      });
   }
};
