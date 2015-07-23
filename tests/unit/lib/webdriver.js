/**
 * Работа с Selenium webdriver
 */

var path = require('path'),
   fromEnv = require('./util').config.fromEnv,
   config = require('../webdriver.json');

fromEnv(config, 'WEBDRIVER');

/**
 * Точка доступа к Selenium webdriver
 */
var Provider = function () {
   this._serverProc = undefined;
   this._driver = undefined;
   this._exitOnStop = false;
};

/**
 * Проверяет, запускается ли Selenium в ручном режиме
 * @returns {Boolean}
 */
Provider.isManualMode = function () {
   return config.manual ? true : false;
};

/**
 * Устанавливает Selenium сервер
 * @param {Function} done При успешном завершении операции
 */
Provider.installServer = function (done) {
   if (!config.manual) {
      return done && done();
   }

   var selenium = require('selenium-standalone');
   config.install = config.install || {};
   config.install.logger = function (message) {
      console.log(message);
   };
   selenium.install(config.install, function (err) {
      if (err) {
         throw err;
      }
      done && done();
   });
};

/**
 * Запускает Selenium сервер
 * @param {Function} done При успешном завершении операции
 */
Provider.prototype.startServer = function (done) {
   if (!config.manual) {
      return done && done();
   }

   var self = this,
       selenium = require('selenium-standalone');

   selenium.start({
      /*seleniumArgs: [
       '-port ' + config.remote.port
       ]*/
   }, function (err, child) {
      if (err) {
         throw new Error(err.toString());
      }

      child.stdout.on('data', function (data) {
         console.log('provider: ' + data.toString());
      });

      child.stderr.on('data', function (data) {
         console.log('provider: ' + data.toString());
      });

      self._serverProc = child;
      done && done(err, child);
   });
};

/**
 * Останавливает Selenium сервер
 * @param {Function} done При успешном завершении операции
 */
Provider.prototype.stopServer = function (done) {
   if (!config.manual || !this._serverProc) {
      return done && done();
   }

   var self = this;
   this._serverProc.on('close', function (code) {
      done && done(code);

      if (self._exitOnStop) {
         process.exit(255);
      }
   });
   this._serverProc.kill();
};

/**
 * Создает экземпляр webdriver
 * @param {Function} done При успешном завершении операции
 */
Provider.prototype.buildDriver = function (done) {
   var webdriverio = require('webdriverio');

   this._driver = webdriverio
      .remote(config.remote)
      .init(function () {
         done && done();
      });
};

/**
 * Уничтожает экземпляр webdriver
 * @param {Function} done При успешном завершении операции
 */
Provider.prototype.destroyDriver = function (done) {
   if (this._driver) {
      this._driver
         .endAll(function () {
            done && done();
         });
   }
};

/**
 * Возвращает экземпляр webdriver
 * @returns {Object}
 */
Provider.prototype.getDriver = function () {
   return this._driver;
};

/**
 * Запускает точку доступа
 * @param {Function} done При успешном завершении операции
 */
Provider.prototype.startUp = function (done) {
   var self = this;
   this.startServer(function () {
      self.buildDriver(function () {
         done && done.apply(self, arguments);
      });
   });
};

/**
 * Останавливает точку доступа
 * @param {Function} done При успешном завершении операции
 */
Provider.prototype.tearDown = function (done) {
   var self = this;
   this.destroyDriver(function () {
      self.stopServer(function () {
         done && done();
      });
   });
};

/**
 * Устанвливает признак, завершать процесс при остановке
 * @param {Boolean} doExit Завершать процесс при остановке
 */
Provider.prototype.setExitOnStop = function (doExit) {
   this._exitOnStop = doExit;
};

/**
 * Проверяет состояние в webdriver через равные промежутки времени.
 * Используется для ожидания завершения каких-либо процессов, которые могут об этом как-то сообщить.
 * О том, как именно процесс сообщает о своем состоянии, знает тот, кто запустил процесс.
 * @param {Object} driver Экземпляр webdriver
 * @param {Object} config Конфигурация
 */
var Checker = function (driver, config) {
   config = config || {};
   var defaults = {
         delay: 200, //Задержка перед пуском
         interval: 1000,//Интервал проверки
         timeout: 60000,//Таймаут, по истечении которого не имеет смысла больше ждать
         onError: function (err) {
            throw err;
         }
      },
      self = this,
      timer;

   for (var key in defaults) {
      if (defaults.hasOwnProperty(key)) {
         if (config[key] === undefined) {
            config[key] = defaults[key];
         }
      }
   }

   /**
    * Запускает цикл ожидания
    * @param {Function} callback Callback, вызываемый в каждый интервал проверки
    */
   this.start = function (callback) {
      driver.timeoutsImplicitWait(config.delay, function () {
         timer = setInterval(function () {
            config.timeout -= config.interval;
            if (config.timeout > 0) {
               self.check(callback);
            } else {
               self.stop();
               config.onError(new Error('Cannot wait anymore. Exiting by timeout.'));
            }

         }, config.interval);
      });
   };

   /**
    * Останавливает цикл ожидания окончания прохождения тестов
    */
   this.stop = function () {
      clearInterval(timer);
   };

   /**
    * Проверяет состояние отслеживаемого процесса
    * @param {Function} callback Callback, вызываемый в каждый интервал проверки
    */
   this.check = function (callback) {
      callback(function () {
         self.stop();
      });
   };
};

exports.Provider = Provider;
exports.Checker = Checker;