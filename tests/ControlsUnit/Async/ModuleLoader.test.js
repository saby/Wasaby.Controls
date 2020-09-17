define([
   'require',
   'Controls/Container/Async/ModuleLoader',
   'Core/IoC',
   'ControlsUnit/Async/TestModuleSync'
], function(
   require,
   ModuleLoader,
   IoC,
   TestModuleSync
) {
   describe('Controls/Container/Async/ModuleLoader', function() {
      var logErrors = [];
      var originalLogger = IoC.resolve('ILogger');
      beforeEach(function() {
         logErrors = [];
         IoC.bind('ILogger', {
            warn: originalLogger.warn,
            error: function(error, message, originError) {
               logErrors.push({
                  error: error,
                  message: message,
                  originError: originError
               });
            },
            log: originalLogger.log,
            info: originalLogger.info
         });
      });

      afterEach(function() {
         IoC.bind('ILogger', originalLogger);
      });

      /* Хак. Потому что сломан require в юнит тестах
         @link https://online.sbis.ru/opendoc.html?guid=b2f93ecc-5b43-4bf1-a2c0-684cc621c314
      */
      require(['ControlsUnit/Async/Fail/TestModule'], function(){}, function(){});

      it('loadAsync failed', function () {
         var ml = new ModuleLoader();
         return ml.loadAsync('ControlsUnit/Async/Fail/TestModule').then(function () {
            assert.fail('Should not resolved promise successfull');
         }, function (err) {
            assert.equal(err.message, 'У СБИС возникла проблема', 'Error message is wrong');
            assert.equal(logErrors.length, 1);
         });
      });

      it('loadAsync failed with callback', function() {
         let ml = new ModuleLoader();
         let callbackCalled = false;
         let callbackParams = {};
         let errorCallback = (viewConfig, error) => {
            callbackCalled = true;
            callbackParams = { viewConfig: viewConfig, error: error };
         };
         return ml.loadAsync('ControlsUnit/Async/Fail/TestModule', errorCallback).then(function() {
            assert.fail('Should not resolved promise successfull');
         }, function(err) {
            assert.equal(err.message, 'У СБИС возникла проблема', 'Error message is wrong');
            assert.equal(logErrors.length, 1);
            assert.equal(callbackCalled, true, 'errorCallback не был вызван.');
            assert.exists(callbackParams.error, 'Второй параметр errorCallback должен быть определен.');

            // далее проверки только на клиенте, т.к. в тестах на сервере require возвращает "непонятную" ошибку
            if (typeof window !== 'undefined') {
               assert.exists(callbackParams.viewConfig, 'Первый параметр errorCallback должен быть определен.');
               assert.equal(typeof callbackParams.viewConfig, 'object', 'Первый параметр errorCallback должен быть объектом.');
               assert.equal(callbackParams.viewConfig.status, 404, 'Первый параметр errorCallback имеет неправильную структуру.');
            }
         });
      });

      it('loadAsync faild found export control', function () {
         var ml = new ModuleLoader();
         return ml.loadAsync('ControlsUnit/Async/TestModuleAsync:NotFound').then(function(res) {
            assert.notEqual(res, null, 'Старое поведение, когда возвращался модуль, если е найдено свойство из библиотеки');
         }, function (err) {
            assert.equal(err.message, 'У СБИС возникла проблема', 'Error message is wrong');
            assert.equal(logErrors.length, 1);
         });
      });
   });
});
