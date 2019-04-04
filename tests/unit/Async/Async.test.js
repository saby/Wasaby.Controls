define([
   'Controls/Container/Async',
   'Env/Env'
], function(
   Async,
   Env
) {
   describe('Dynamic loading Controls.Container.Async', function() {
      var async;
      var warns = [];
      var originalLogger = Env.IoC.resolve('ILogger');
      function checkWarn(warns, message) {
         assert.isTrue(warns.length !== 0);
         if (warns && warns.length) {
            var logged = warns.shift();
            logged.indexOf && assert.isTrue(!!~logged.indexOf(message));
         }
      }
      beforeEach(function() {
         Env.IoC.bind('ILogger', {
            warn: function(message) {
               warns.push(message);
            },
            error: originalLogger.error,
            log: originalLogger.log,
            info: originalLogger.info
         });
         async = new Async();
         async._options = {
            templateName: 'myTemplate'
         };
         async.loadedSync = [];
         async.loadedAsync = [];
         async._loadFileAsync = function(name) {
            return new Promise(function(resolve, reject) {
               async.loadedAsync.push(name);
               resolve(name);
            });
         };
         async._loadFileSync = function(name) {
            async.loadedSync.push(name);
            return name;
         }
         async._forceUpdate = function() {
            if (!async.fuCnt) {
               async.fuCnt = 1;
            } else {
               async.fuCnt++;
            }
         };
      });
      afterEach(function() {
         Env.IoC.bind('ILogger', originalLogger);
         async.destroy();
      });
      it('Set error state', function() {
         async._setErrorState(true, 'load error');
         assert.equal(async.error, "Couldn't load module myTemplate load error");
         async._setErrorState(false);
         assert.isNull(async.error);
      });
      it('Loading synchronous', function() {
         var pushedArray = [];
         async._pushDepToHeadData = function(dep) {
            pushedArray.push(dep);
         };
         async._loadContentSync(async._options.templateName, {opt: '123'});
         assert.deepEqual(async.loadedSync, ["myTemplate"]);
         assert.deepEqual(pushedArray, []);
         assert.equal(async.optionsForComponent.opt, '123');
         assert.equal(async.currentTemplateName, 'myTemplate');
         assert.equal(async.optionsForComponent.resolvedTemplate, 'myTemplate');
      });
      it('Loading synchronous server-side', function() {
         var pushedArray = [];
         async._pushDepToHeadData = function(dep) {
            pushedArray.push(dep);
         };
         async._loadContentSync(async._options.templateName, {opt: '123'}, true);
         assert.deepEqual(pushedArray, ["myTemplate"]);
      });

      it('Loading synchronous error', function() {
         async._loadFileSync = function() {
            return null;
         };
         var res = async._loadContentSync(async._options.templateName, {opt: '123'});
         assert.equal(res, null);
      });
      it('Loading asynchronous', function(done) {
         var promiseResult = async._loadContentAsync(async._options.templateName, {opt: '123'});
         assert.isUndefined(async.currentTemplateName);
         assert.equal(async.canUpdate, false);
         promiseResult.then(function(res) {
            assert.isTrue(async.canUpdate);
            assert.deepEqual(async.loadedAsync, ["myTemplate"]);
            assert.equal(async.optionsForComponent.opt, '123');
            assert.equal(async.currentTemplateName, 'myTemplate');
            assert.equal(async.optionsForComponent.resolvedTemplate, 'myTemplate');
            assert.isTrue(res);
            assert.equal(async.fuCnt, 1);
            done();
         });
      });
      it('Loading asynchronous no update', function(done) {
         var promiseResult = async._loadContentAsync(async._options.templateName, {opt: '123'}, true);
         promiseResult.then(function(res) {
            assert.isUndefined(async.fuCnt);
            done();
         });
      });
      it('Loading asynchronous failed', function(done) {
         async._loadFileAsync = function() {
            return new Promise(function(_, reject) {
               reject('Loading error');
            });
         };
         var promiseResult = async._loadContentAsync(async._options.templateName, {opt: '123'});
         assert.equal(async.canUpdate, false);
         promiseResult.then(function(res) {
            assert.isTrue(async.canUpdate);
            assert.isUndefined(async.optionsForComponent.opt);
            assert.isUndefined(async.currentTemplateName);
            assert.isUndefined(async.optionsForComponent.resolvedTemplate);
            assert.isFalse(res);
            assert.equal(async.error, 'Couldn\'t load module myTemplate Loading error');
            done();
         });
      });
      it('Update content', function() {
         var options = {opt: '123'};
         Object.freeze(options);
         async._updateOptionsForComponent('myTemplate', options, 'myTemplate');
         assert.equal(async.optionsForComponent.opt, '123');
         assert.equal(async.currentTemplateName, 'myTemplate');
         assert.equal(async.optionsForComponent.resolvedTemplate, 'myTemplate');
      });
      it('Update content no options', function() {
         async._updateOptionsForComponent('myTemplate', undefined);
         assert.isTrue(async.optionsForComponent !== undefined);
         assert.equal(async.optionsForComponent.resolvedTemplate, 'myTemplate');
      });
      it('Push to head data no head data store', function() {
         async._getHeadData = function() {
            return null;
         };
         async._pushDepToHeadData('myTemplate');
         checkWarn(warns, 'HeadData store wasn\'t initialized. Link to myTemplate won\'t be added to server-side generated markup.');
      });
      it('_checkLoadedError error', function() {
         async._checkLoadedError(null);
         assert.equal(async.error, "Couldn't load module myTemplate ");
      });
      it('_checkLoadedError no error', function() {
         async._checkLoadedError('asdasdasd');
         assert.isNull(async.error);
      });
      it('_beforeMount client no rc, not loaded', function(done) {
         var loadContentAsyncCalled;
         var args;
         var promiseResult;
         async._isCompat = function() { return false; };
         async._isServer = function() { return false; };
         async._isLoaded = function() { return false; };
         async._loadContentAsync = function() {
            loadContentAsyncCalled = true;
            args = arguments;
            promiseResult = new Promise(function(res) {
               res();
            });
            return promiseResult;
         };
         var bmRes = async._beforeMount({templateName: "myTemplate", templateOptions: {opt: '123'}});
         assert.isTrue(loadContentAsyncCalled);
         assert.equal(promiseResult, bmRes);
         assert.equal(args[0], 'myTemplate');
         assert.equal(args[1].opt, '123');
         assert.equal(args[2], true);
         bmRes.then(function() {
            done();
         });
      });
      it('_beforeMount client no rc, already loaded', function() {
         var loadContentSyncCalled;
         var args;
         var promiseResult;
         async._isCompat = function() { return false; };
         async._isServer = function() { return false; };
         async._isLoaded = function() { return true; };
         async._loadContentSync = function() {
            args = arguments;
            loadContentSyncCalled = true;
         };
         async._beforeMount({templateName: "myTemplate", templateOptions: {opt: '123'}});
         assert.isTrue(loadContentSyncCalled);
         assert.equal(args[0], 'myTemplate');
         assert.equal(args[1].opt, '123');
         assert.equal(args[2], false);
      });
      it('_beforeMount client rc', function() {
         var loadContentSyncCalled;
         var args;
         async._isCompat = function() { return false; };
         async._isServer = function() { return false; };
         async._isLoaded = function() { return false; };
         async._loadContentSync = function() {
            args = arguments;
            loadContentSyncCalled = true;
         };
         async._beforeMount({templateName: "myTemplate", templateOptions: {opt: '123'}}, {}, true);
         assert.isTrue(loadContentSyncCalled);
         assert.equal(args[0], 'myTemplate');
         assert.equal(args[1].opt, '123');
         assert.equal(args[2], false);
      });
      it('_beforeMount client rc true, compat true, loaded false', function() {
         var loadContentAsyncCalled;
         var args;
         async._isCompat = function() { return true; };
         async._isServer = function() { return false; };
         async._isLoaded = function() { return false; };
         async._loadContentAsync = function() {
            args = arguments;
            loadContentAsyncCalled = true;
         };
         async._beforeMount({templateName: "myTemplate", templateOptions: {opt: '123'}}, {}, true);
         assert.isTrue(loadContentAsyncCalled);
         assert.equal(args[0], 'myTemplate');
         assert.equal(args[1].opt, '123');
         assert.equal(args[2], true);
      });
      it('_beforeMount client rc false, compat true, loaded true', function() {
         var loadContentSyncCalled;
         var args;
         async._isCompat = function() { return true; };
         async._isServer = function() { return false; };
         async._isLoaded = function() { return true; };
         async._loadContentSync = function() {
            args = arguments;
            loadContentSyncCalled = true;
         };
         async._beforeMount({templateName: "myTemplate", templateOptions: {opt: '123'}}, {}, false);
         assert.isTrue(loadContentSyncCalled);
         assert.equal(args[0], 'myTemplate');
         assert.equal(args[1].opt, '123');
         assert.equal(args[2], false);
      });
      it('_beforeMount server', function(done) {
         var loadContentSyncCalled;
         var args;
         async._isServer = function() { return true; };
         async._isLoaded = function() { return false; };
         async._loadContentSync = function() {
            args = arguments;
            loadContentSyncCalled = true;
         };
         var bmRes = async._beforeMount({templateName: "myTemplate", templateOptions: {opt: '123'}}, {});
         assert.isTrue(loadContentSyncCalled);
         assert.equal(args[0], 'myTemplate');
         assert.equal(args[1].opt, '123');
         assert.equal(args[2], true);
         bmRes.then(function(res) {
            assert.isTrue(res);
            done();
         });
      });
      it('_beforeMount server failed', function(done) {
         var loadContentSyncCalled;
         var args;
         async._isServer = function() { return true; };
         async._isLoaded = function() { return false; };
         async._loadContentSync = function() {
            async._setErrorState(true);
         };
         var bmRes = async._beforeMount({templateName: "myTemplate", templateOptions: {opt: '123'}}, {});
         bmRes.catch(function(res) {
            assert.isUndefined(res);
            done();
         });
      });
      it('_beforeUpdate canUpdate true, same templateName', function() {
         async._updateOptionsForComponent('myTemplate', {opt: '123'});
         async._beforeUpdate({templateName: 'myTemplate', templateOptions: { opt: '456'}});
         async.currentTemplateName = 'myTemplate';
         assert.equal(async.optionsForComponent.opt, '456');
      });
      it('_beforeUpdate canUpdate false', function() {
         async.canUpdate = false;
         async.methodCalled = 0;
         async._loadContentSync = function() { async.methodCalled++; };
         async._updateOptionsForComponent = function() { async.methodCalled++; };
         async._beforeUpdate();
         assert.equal(async.methodCalled, 0);
      });
      it('_beforeUpdate canUpdate true, template changed, already loaded', function() {
         var args;
         var promiseResult;
         async._isLoaded = function() { return true; };
         async._loadContentSync = function() {
            args = arguments;
         };
         async.canUpdate = true;
         async._options = { templateName: 'myTemplate', templateOptions: {opt: '123'} };
         async._beforeUpdate({ templateName: 'myTemplate2', templateOptions: { opt: '456'} });
         assert.equal(args[0], 'myTemplate2');
         assert.equal(args[1].opt, '456');
         assert.equal(args.length, 2);
      });
      it('_afterUpdate canUpdate false', function() {
         async.canUpdate = false;
         async.methodCalled = 0;
         async._loadContentAsync = function() { async.methodCalled++; };
         async._loadContentSync = function() { async.methodCalled++; };
         async._updateOptionsForComponent = function() { async.methodCalled++; };
         async._afterUpdate();
         assert.equal(async.methodCalled, 0);
      });
      it('_afterUpdate canUpdate true, template changed, not loaded', function(done) {
         var args;
         var promiseResult;
         async._isLoaded = function() { return false; };
         async._loadContentAsync = function(name) {
            args = arguments;
            promiseResult = new Promise(function(res) {
               res(name);
            });
         };
         async.canUpdate = true;
         async._options = { templateName: 'myTemplate2', templateOptions: {opt: '456'} };
         async._updateOptionsForComponent('myTemplate', {opt: '123'}, 'myTemplate');
         async._afterUpdate({ templateName: 'myTemplate', templateOptions: { opt: '123'} });
         assert.equal(args[0], 'myTemplate2');
         assert.equal(args[1].opt, '456');
         assert.equal(args.length, 2);
         promiseResult.then(function() {
            done();
         });
      });
      it('_afterUpdate currentTemplateName already updated', function() {
         async._isLoaded = function() { return false; };
         async._methodCalled = 0;
         async._loadContentAsync = function() {
            this._methodCalled++;
         };
         async.canUpdate = true;
         async._options = { templateName: 'myTemplate2', templateOptions: {opt: '456'} };
         async._updateOptionsForComponent('myTemplate2', {opt: '456'}, 'myTemplate2');
         async._afterUpdate({ templateName: 'myTemplate', templateOptions: { opt: '123'} });
         assert.equal(async._methodCalled, 0);
      });
   });
});
