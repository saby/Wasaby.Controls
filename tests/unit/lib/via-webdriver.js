/**
 * Прогоняет unit тесты в среде Selenium webdriver.
 */

var DriverProvider = require('./webdriver').Provider,
   DriverChecker = require('./webdriver').Checker,
   assert = assert || require('assert'),
   config = require('../via-webdriver.json'),
   fromEnv = require('./util').config.fromEnv,
   fs = require('fs'),
   path = require('path'),
   report = require('./unit').report;

fromEnv(config, 'VIA_WEBDRIVER');

/**
 * Запускает тестирование через webdriver, возвращает отчет.
 */
var Loader = function () {
   this._provider = new DriverProvider();
};

Loader.prototype = {
   _provider: undefined,
   _driver: undefined,

   /**
    * Запускает loader
    * @param {Function} done При успешном завершении операции
    */
   start: function (done) {
      var self = this;
      this._provider.startUp(function (err) {
         if (err) {
            throw err;
         }

         self._load(
            ['http://', config.url.host, ':', config.url.port, config.url.path].join(''),
            done
         );
      });
   },

   /**
    * Останавливает loader
    * @param {Function} done При успешном завершении операции
    */
   stop: function (done) {
      this._provider.tearDown(done);
   },

   /**
    * Загружает URL через webdriver, получает отчет
    * @param {String} url URL
    * @param {Function} done При успешном завершении операции
    */
   _load: function (url, done) {
      this._driver = this._provider.getDriver();

      var self = this;
      this._driver.url(url).then(function () {
         done();
      }).catch(function (err) {
         throw err;
      });
   },

   /**
    * Возвращает отчет о прохождении тестов
    * @param {Function} done При успешном завершении операции
    */
   getReport: function (done) {
      var driver = this._driver,
         checker = new DriverChecker(driver);
      checker.start(function (checksDone) {
         //Ждем завершения тестов
         driver.isExisting('body.tests-finished', function (err, isExisting) {
            if (err) {
               throw err;
            }
            if (!isExisting) {
               return;
            }
            checksDone();

            driver.getHTML('#report', false, function (err, html) {
               if (err) {
                  throw err;
               }
               done(html);
            });
         });
      });
   }
};

exports.Loader = Loader;

/**
 * Запускает тестирование
 * @param {Object} config Конфигурация тестирования
 */
exports.run = function (config) {
   if (config.saveToFile) {
      //Удаляем старый отчет
      report.clear();
   }

   //Загружаем новый
   var loader = new Loader(),
      stopInProgress = false;

   process.on('uncaughtException', function (err) {
      if (stopInProgress) {
         throw err;
      }

      stopInProgress = true;
      loader.stop(function () {
         throw err;
      });
   });

   loader.start(function () {
      loader.getReport(function (reportContent) {
         loader.stop();

         //Выводим отчет
         console.log(reportContent);

         if (config.saveToFile) {
            //Сохраняем отчет
            report.save(reportContent);
         }
      });
   });
};