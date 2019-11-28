define([
   'Controls/Container/Async/ModuleLoader',
   'Env/Env'
], function(
   ModuleLoader,
   envLib
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

   describe('Dynamic loading Controls/Container/Async/ModuleLoader', function() {
      var ml;
      var logErrors = [];
      var originalLogger = envLib.IoC.resolve('ILogger');
      beforeEach(function() {
         logErrors = [];
         envLib.IoC.bind('ILogger', {
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
         ml = new ModuleLoader();
         ml.loadedSync = {};
         ml.requireSync = function(name) {
            var res = {};
            this.loadedSync[name] = res;
            return res;
         };
         ml.loadedAsync = [];
         ml.requireAsync = function(name) {
            var self = this;
            var promiseResult = new Promise(function(resolve) {
               var res = {};
               self.loadedAsync[name] = res;
               resolve(res);
            });
            return promiseResult;
         };
      });
      afterEach(function() {
         envLib.IoC.bind('ILogger', originalLogger);
         ml.clearCache();
      });
      it('Load sync no cache', function() {
         var res = ml.loadSync('Controls/list');
         assert.equal(ml.loadedSync['Controls/list'], res);
      });
      it('Load sync with cache', function() {
         ml.loadedSync = [];
         ml.requireSync = function(name) {
            this.loadedSync.push(name);
            return {};
         };
         var res = ml.loadSync('Controls/list');
         var res2 = ml.loadSync('Controls/list');
         assert.equal(res, res2);
         assert.equal(ml.loadedSync.length, 1);
      });
      it('Load sync error', function() {
         ml.loadedSync = [];
         ml.requireSync = function(name) {
            throw new Error('test error');
         };
         var res = ml.loadSync('Controls/list');
         assert.equal(ml.loadedSync.length, 0);
         checkError(logErrors, 'Couldn\'t load module Controls/list', 'test error');
      });

      it('Load async no cache', function(done) {
         var promiseResult = ml.loadAsync('Controls/list');
         promiseResult.then(function(res) {
            assert.equal(ml.loadedAsync['Controls/list'], res);
            done();
         });
      });
      it('Load async with cached promise', function(done) {
         ml.loadedAsync = [];
         ml.requireAsync = function(name) {
            return new Promise(function(resolve) {
               ml.loadedAsync.push(name);
               resolve({});
            });
         };
         var res = ml.loadAsync('Controls/list');
         var res2 = ml.loadAsync('Controls/list');
         res.then(function() {
            res2.then(function() {
               done();
            });
         });
         assert.equal(ml.loadedAsync.length, 1);
      });
      it('Load async with cached promise lib', function(done) {
         var lib = { MyList: {}, MyList2: {} };
         ml.loadedAsync = [];
         ml.requireAsync = function(name) {
            return new Promise(function(resolve) {
               ml.loadedAsync.push(name);
               resolve(lib);
            });
         };
         var promiseRes = ml.loadAsync('Controls/List:MyList');
         var promiseRes2 = ml.loadAsync('Controls/List:MyList2');
         promiseRes.then(function(res) {
            assert.equal(res, lib.MyList);
            promiseRes2.then(function(res2) {
               assert.equal(res2, lib.MyList2);
               done();
            });
         });
         assert.equal(ml.loadedAsync.length, 1);
      });
      it('Load async with cached module', function(done) {
         ml.loadedAsync = [];
         ml.requireAsync = function(name) {
            return new Promise(function(resolve) {
               ml.loadedAsync.push(name);
               resolve({});
            });
         };
         var res = ml.loadAsync('Controls/list');
         res.then(function(loaded) {
            var res2 = ml.loadAsync('Controls/list');
            res2.then(function(loaded2) {
               assert.equal(loaded, loaded2);
               assert.equal(ml.loadedAsync.length, 1);
               done();
            });
         });
      });
      it('Load async with cached lib', function(done) {
         var lib = { MyList: {}, MyList2: {} };
         ml.loadedAsync = [];
         ml.requireAsync = function(name) {
            return new Promise(function(resolve) {
               ml.loadedAsync.push(name);
               resolve(lib);
            });
         };
         var res = ml.loadAsync('Controls/list:MyList');
         res.then(function(loaded) {
            var res2 = ml.loadAsync('Controls/list:MyList2');
            res2.then(function(loaded2) {
               assert.equal(loaded, lib.MyList);
               assert.equal(loaded2, lib.MyList2);
               assert.equal(ml.loadedAsync.length, 1);
               done();
            });
         });
      });
      it('Load async error', function(done) {
         ml.loadedAsync = [];
         ml.requireAsync = function(name) {
            return new Promise(function(resolve, reject) {
               reject('test error');
            });
         };
         var res = ml.loadAsync('Controls/list');
         res.catch(function(res) {
            assert.equal(ml.loadedAsync.length, 0);
            checkError(logErrors, 'Couldn\'t load module Controls/list', 'test error');
            done();
         });
      });
      it('IsLoaded simple', function() {
         let module = {};
         ml.cacheModule('Test/TestModule', module)
         assert.isTrue(ml.isLoaded('Test/TestModule'));
      });
      it('IsLoaded lib', function() {
         let module = {};
         ml.cacheModule('Test/TestLib', module)
         assert.isTrue(ml.isLoaded('Test/TestLib:TestModule'));
      });
   });
});
;