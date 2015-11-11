/**
 * Выполняет проверку покрытия кода тестами через jscoverage в среде Selenium webdriver.
 * Отчет попадает в папку test/jscoverage-report/
 */

var path = require('path'),
   fs = require('fs'),
   spawn = require('child_process').spawn,
   exec = require('child_process').exec,
   util = require('./util'),
   fromEnv = util.config.fromEnv,
   config = require('../jscoverage.json'),
   DriverProvider = require('./webdriver').Provider,
   DriverChecker = require('./webdriver').Checker;

fromEnv(config, 'JSCOVERAGE');

/**
 * Jscoverage сервер
 */
var Server = function () {
   this.proc = undefined;
   //TODO: linux OS detection by process.platform
   this.executable = config.execWin;
   this.docRoot = path.resolve(process.cwd(), config.docRoot);
   this.params = this._buildParams(config.params);
};

/**
 * Запускает Jscoverage сервер
 * @param {Function} callback При успешном запуске
 */
Server.prototype.start = function (callback) {
   var self = this;

   this.clear(function () {
      var hasData = false,
         hasExit = false;

      self.proc = spawn(self.executable, self.params, {
         cwd: self.docRoot
      });

      self.proc.on('error', function (err) {
         throw err;
      });

      self.proc.on('close', function (code) {
         hasExit = true;
         console.log('jscoverage-server: exited with code ' + code);
      });

      self.proc.stdout.on('data', function (data) {
         hasData = true;
         console.log('jscoverage-server: ' + data);
      });

      setTimeout(function () {
         if (!hasData || hasExit) {
            throw new Error('Cannot start the jscoverage server');
         }
         callback();
      }, 200);
   });
};

/**
 * Останавливает Jscoverage сервер
 */
Server.prototype.stop = function () {
   if (this.proc) {
      this.proc.kill();
   }
};

/**
 * Ищет уже запущенный экземпляр и завершает его
 * @param {Function} callback При успешном запуске
 */
Server.prototype.clear = function (callback) {
   var params = this._buildParams({
      port: config.params.port,
      shutdown: true
   });
   exec(this.executable + ' ' + params.join(' '), {
      cwd: this.docRoot
   }, callback);
};

/**
 * Формирует набор параметров для запуска процесса
 * @param {Function} raw При успешном запуске
 */
Server.prototype._buildParams = function (raw) {
   var params = [],
      paramPrefix = '--';

   for (var paramName in raw) {
      if (raw.hasOwnProperty(paramName)) {
         var paramValue = raw[paramName];
         if (typeof paramValue === 'boolean') {
            params.push(paramPrefix + paramName);
         } else {
            if (!(paramValue instanceof Array)) {
               paramValue = [paramValue];
            }
            for (var paramNum = 0; paramNum < paramValue.length; paramNum++) {
               params.push(paramPrefix + paramName + '=' + paramValue[paramNum]);
            }
         }
      }
   }

   return params;
};


/**
 * Загрузчик отчета о покрытии кода тестами
 */
var Loader = function () {
   this._provider = new DriverProvider();
};

/**
 * Запускает загрузчик отчета
 * @param {Function} done При успешном завершении операции
 */
Loader.prototype.start = function (done) {
   this._removeReport();

   var self = this;
   this._provider.startUp(function (err) {
      if (err) {
         throw err;
      }

      self._load(
         ['http://', config.webdriver.host, ':', config.params.port, config.webdriver.path].join(''),
         done
      );
   });
};

/**
 * Останавливает загрузчик отчета
 * @param {Function} done При успешном запуске
 */
Loader.prototype.stop = function (done) {
   this._provider.tearDown(done);
};

/**
 * Загружает URL через webdriver, сохраняет отчет о покрытии
 * @param {String} url URL
 * @param {Function} done При успешном завершении операции
 */
Loader.prototype._load = function (url, done) {
   this._driver = this._provider.getDriver();

   var self = this;
   this._driver.url(url).then(function () {
      //Ждем сохранения отчета
      self._saveReport(function () {
         self.stop(false);
         done();
      });
   }).catch(function (err) {
      throw err;
   });
};

/**
 * Удаляет старый отчет о покрытии
 */
Loader.prototype._removeReport = function () {
   var reportPath = path.resolve(
      config.docRoot,
      config.params['report-dir']
   );
   util.fs.rmdir(reportPath);
};

/**
 * Сохраняет отчет о покрытии
 * @param {Function} done При успешном завершении операции
 */
Loader.prototype._saveReport = function (done) {
   var reportPath = path.resolve(
      config.docRoot,
      config.params['report-dir']
   );
   util.fs.mkdir(reportPath);

   var driver = this._driver;
   driver.frame('browserIframe', function () {
      var checker = new DriverChecker(driver, {
         timeout: config.checkerTimeout
      });
      checker.start(function (checksDone) {
         driver.isExisting('body.tests-finished', function (err, isExisting) {
            if (err) {
               throw err;
            }
            if (!isExisting) {
               return;
            }

            checksDone();

            //Подождем, пока выполнится сохранение отчета через jscoverage_report() на клиентской стороне
            setTimeout(function () {
               done();
            }, config.reportTimeout);
         });
      });
   });
};

exports.Server = Server;
exports.Loader = Loader;

/**
 * Запускает сервер, прогоняет тесты и сохраняет отчет о покрытии
 */
exports.run = function () {
   var server = new Server(),
      loader = new Loader(),
      stopInProgress = false;

   process.on('uncaughtException', function (err) {
      if (stopInProgress) {
         throw err;
      }

      stopInProgress = true;
      server.stop();
      loader.stop(function () {
         throw err;
      });
   });

   server.start(function () {
      loader.start(function () {
         server.stop();
      });
   });
};
