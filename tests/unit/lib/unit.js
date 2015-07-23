/**
 * Юнит тестирование
 */

var path = require('path'),
   fs = require('fs'),
   fsExt = require('./util').fs,
   fromEnv = require('./util').config.fromEnv,
   config = require('../unit.json');

fromEnv(config, 'UNIT');

/**
 * Юнит тесты
 */
var test = {};

/**
 * Возвращает список файлов юнит-тестов
 * @param {String} [pathPrefix=''] Префикс пути до каталога с компонентами
 * @returns {Array}
 */
test.getList = function (pathPrefix) {
   pathPrefix = pathPrefix || '';

   /**
    * Рекурсивно обходит каталоги и собирает в них файлы на основе результатов 2-х ф-ий обратного вызова.
    * @param {String} parentDir Путь до папки, в которой делаем обход
    * @param {Function} dirCallback Callback, определяющий, будем ли заходить в эту папку
    * @param {Function} fileCallback Callback, определяющий, будем собирать этот файл
    * @param {Array} [items] Собранные файлы
    * @param {Integer} [level=0] Текущий уровень вложенности
    * @returns {Array} Собранные файлы, готовые для подключения через require/requirejs
    */
   function lookingForFiles(parentDir, dirCallback, fileCallback, items, level) {
      items = items || [];
      level = level || 0;

      fs.readdirSync(parentDir).forEach(function (itemName) {
         var itemPath = path.join(parentDir, itemName);
         var stat = fs.statSync(itemPath);
         if (stat.isDirectory()) {
            if (dirCallback(itemName, itemPath, level)) {
               lookingForFiles(itemPath, dirCallback, fileCallback, items, 1 + level);
            }
         } else if (stat.isFile()) {
            var saveName = fileCallback(itemName, itemPath, level);
            if (saveName) {
               items.push(saveName);
            }
         }
      });

      return items;
   }

   //Ищем тесты для комонентов
   var basePath = pathPrefix + 'components',
      tests = lookingForFiles(
         basePath,
         function () {
            return true;
         },
         function (fileName, filePath) {
            if (fileName.substr(-8) != '.test.js') {
               return false;
            }
            return filePath
               .split('\\')
               .join('/')
               .replace('.test.js', '.test');
         }
      );

   return tests;
};

/**
 * Сохраняет список тестов в файл
 * @param {String} fileName Путь к файлу, в который запишется список
 * @param {String} [prefix=''] Префикс, который допишется к пути к каждому тесту
 */
test.buildList = function (fileName, prefix) {
   prefix = prefix || '';

   fs.writeFileSync(
      fileName,
      'define([\n' +
      this.getList()
         .map(function (test) {
            return '\'' + prefix + test + '\'';
         })
         .join(',\n') +
      '\n]);'
   );
};

/**
 * Работа с файлом отчета о тестировании в формате XUnit
 */
var report = {};

/**
 * Возвращает путь до файла с отчетом
 * @returns {String}
 */
report.getFilename = function () {
   return path.resolve(process.cwd(), config.report);
};

/**
 * Удаляет старый файл отчета
 */
report.clear = function () {
   try {
      fs.unlinkSync(this.getFilename());
   } catch (e) {
      //Not found
   }
};

/**
 * Сохраняет содержимое отчета в файл
 * @param {String} contents Содержимое отчета
 */
report.save = function (contents) {
   var fileName = this.getFilename();
   fsExt.mkdir(path.dirname(fileName));
   fs.writeFileSync(
      fileName,
      new Buffer(contents, 'utf8')
   );
};


exports.test = test;
exports.report = report;
