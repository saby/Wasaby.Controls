define([
   'Controls/Container/Async',
   'Env/Env',
   'ControlsUnit/Async/TestControlSync'
], function(
   Async,
   Env,
   TestControlSync
) {
   describe('Controls/Container/Async', function () {
      var warns = [];
      var originalLogger = Env.IoC.resolve('ILogger');
      beforeEach(function() {
         Env.IoC.bind('ILogger', {
            warn: function(message) {
               warns.push(message);
            },
            error: originalLogger.error,
            log: originalLogger.log,
            info: originalLogger.info
         });
      });
      afterEach(function() {
         Env.IoC.bind('ILogger', originalLogger);
      });

      typeof window === 'undefined' && it('Loading synchronous server-side', function () {
         let options = {
            templateName: 'ControlsUnit/Async/TestControlSync',
            templateOptions: {}
         };
         Env.constants.compat = false;

         let async = new Async(options);
         async._beforeMount(options);

         assert.isNotOk(async.error, 'error state should be empty');
         assert.equal(async.currentTemplateName, 'ControlsUnit/Async/TestControlSync');
         assert.equal(async.optionsForComponent.resolvedTemplate, TestControlSync);
      });

      it('Loading synchronous client-side', function () {
         let options = {
            templateName: 'ControlsUnit/Async/TestControlSync',
            templateOptions: {}
         };
         let oldCompat = Env.constants.compat;
         Env.constants.compat = false;

         let async = new Async(options);
         let BUILDED_ON_SERVER = true;
         async._beforeMount(options, undefined, BUILDED_ON_SERVER);
         async._beforeUpdate(options);

         assert.isNotOk(async.error, 'error state should be empty');
         assert.equal(async.currentTemplateName, 'ControlsUnit/Async/TestControlSync');
         assert.strictEqual(async.optionsForComponent.resolvedTemplate, TestControlSync);
         Env.constants.compat = oldCompat;
      });

      it('Loading asynchronous client-side', function () {
         let options = {
            templateName: 'ControlsUnit/Async/TestControlAsync',
            templateOptions: {}
         };

         let async = new Async(options);
         async._beforeMount(options);
         async._beforeUpdate(options);
         async._afterUpdate();

         return new Promise(function (resolve, reject) {
            setTimeout(resolve, 1500);
         }).then(function () {
            assert.isNotOk(async.error, "Error message should be empty");
            assert.strictEqual(async.optionsForComponent.resolvedTemplate, require('ControlsUnit/Async/TestControlAsync'));
         });
      }).timeout(3000);

      it('Loading asynchronous client-side faild', function () {
         let options = {
            templateName: 'ControlsUnit/Async/Fail/TestControlAsync',
            templateOptions: {}
         };

         let async = new Async(options);
         async._beforeMount(options);
         async._beforeUpdate(options);
         async._afterUpdate();

         return new Promise(function(resolve, reject) {
            setTimeout(resolve, 2000);
         }).then(function() {
            assert.equal(async.error, "Couldn\'t load module ControlsUnit/Async/Fail/TestControlAsync ");
            assert.strictEqual(async.optionsForComponent.resolvedTemplate, undefined);
         });
      }).timeout(4000);
   });
});
