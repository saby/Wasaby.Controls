define([
   'Controls/Container/Async/ModuleLoader',
   'Core/IoC',
   'ControlsUnit/Async/TestModuleSync'
], function(
   ModuleLoader,
   IoC,
   TestModuleSync
) {

   function checkError(logErrors, errorMessage, message, originErrorMessage) {
      assert.isTrue(logErrors.length !== 0);
      if (logErrors && logErrors.length) {
         var logged = logErrors.shift();

         logged.error && logged.error.message && assert.isTrue(!!~logged.error.message.indexOf(errorMessage));
         logged.message && logged.message.indexOf && assert.isTrue(!!~logged.message.indexOf(message));
         logged.originError && logged.originError.message && assert.isTrue(!!~logged.originError.message.indexOf(originErrorMessage));
      }
   }

   describe('Controls/Container/Async/ModuleLoader', function() {
      var ml;
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

      it('loadSync success', function () {
         var ml = new ModuleLoader();
         var syncModule = ml.loadSync('ControlsUnit/Async/TestModuleSync');
         assert.strictEqual(syncModule, TestModuleSync, 'Loaded module is wrong');
      });

      it('loadSync faild', function () {
         var ml = new ModuleLoader();
         var error = ml.loadSync('ControlsUnit/Async/TestModuleSyncFail');
         assert.strictEqual(error, undefined, 'Failed loaded module must be undefined');
      });

      it('loadAsync success', function (done) {
         var ml = new ModuleLoader();
         ml.loadAsync('ControlsUnit/Async/TestModule').then(function (res) {
            assert.notEqual(res, undefined, 'Module not loaded async');
            done();
         });
      });

      it('loadAsync faild', function (done) {
         var ml = new ModuleLoader();
         ml.loadAsync('ControlsUnit/Async/TestModuleFail').catch(function (err) {
            assert.equal(err.message, 'Couldn\'t load module ControlsUnit/Async/TestModuleFail', 'Error message is wrong');
            done();
         });
      });

   });
});
