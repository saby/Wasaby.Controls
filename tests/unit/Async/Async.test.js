define([
   'Controls/Container/Async'
], function(
   Async
) {
   describe('Controls.Container.Async', function() {
      var async;
      beforeEach(function() {
         async = new Async();
         async._options = {
            templateName: 'myTemplate'
         };
         async.pushedToHeadData = [];
         async.loadedSync = [];
         async.loadedAsync = [];
         async._pushDepToHeadData = function(name) {
            this.pushedToHeadData.push(name);
         };
         async._loadFileAsync = function(name) {
            return new Promise(function(resolve, reject) {
               async.loadedAsync.push(name);
               resolve(name);
            });
         };
         async._forceUpdate = function() {
            if (!async.fuCnt) {
               async.fuCnt = 1;
            } else {
               async.fuCnt++;
            }
         };
      });
      afterEach(function() {
         async.destroy();
      });
      it('Set error state', function() {
         async._setErrorState(true, 'load error');
         assert.equal(async.error, "Couldn't load module myTemplate load error");
         async._setErrorState(false);
         assert.isNull(async.error);
      });
      it('Server side loading', function(done) {
         var promise = async._loadServerSide(async._options.templateName, {opt: '123'});
         promise.then(function() {
            assert.deepEqual(async.loadedAsync, ["myTemplate"]);
            assert.deepEqual(async.pushedToHeadData, ["myTemplate"]);
            assert.equal(async.optionsForComponent.opt, '123');
            assert.equal(async.optionsForComponent.resolvedTemplate, 'myTemplate');
            done();
         });
      });
      it('Server side loading failed', function() {
         async._loadFileAsync = function(done) {
            return new Promise(function(resolve, reject) {
               reject('loading error');
            });
         };
         var promise = async._loadServerSide(async._options.templateName);
         promise.then(function() {
            assert.equal(async.error, "Couldn't load module myTemplate Error: loading error");
            assert.isUndefined(async.optionsForComponent.opt);
            assert.isUndefined(async.optionsForComponent.resolvedTemplate);
            done();
         });
      });
      it('Client side loading', function(done) {
         async._loadContentAsync(async._options.templateName, {opt: '123'}).then(function() {
            assert.deepEqual(async.loadedAsync, ["myTemplate"]);
            assert.equal(async.optionsForComponent.opt, '123');
            assert.equal(async.optionsForComponent.resolvedTemplate, 'myTemplate');
            done();
         });
         assert.isUndefined(async.optionsForComponent.opt);
         assert.isUndefined(async.optionsForComponent.resolvedTemplate);
      });
      it('Client side loading failed', function(done) {
         async._loadFileAsync = function() {
            return new Promise(function(resolve, reject) {
               reject('loading error');
            });
         };
         async._loadContentAsync(async._options.templateName).catch(function() {
            assert.equal(async.error, "Couldn't load module myTemplate loading error");
            assert.isUndefined(async.optionsForComponent.opt);
            assert.isUndefined(async.optionsForComponent.resolvedTemplate);
            done();
         });
      });
      it('Update content first', function() {
         async._updateOptionsForComponent('myTemplate', {opt: '123'});
         assert.equal(async.optionsForComponent.opt, '123');
         assert.equal(async.optionsForComponent.resolvedTemplate, 'myTemplate');
      });
      it('_beforeUpdate new template', function(done) {
         async._updateOptionsForComponent('myTemplate', {opt: '123'});
         async._beforeUpdate({templateName: 'myTemplateNew', templateOptions: {opt: '234'}});
         setTimeout(function() {
            assert.deepEqual(async.loadedAsync, ['myTemplateNew']);
            assert.equal(async.optionsForComponent.opt, '234');
            done();
         }, 10);
      });
      it('_beforeUpdate template not changed', function() {
         async._updateOptionsForComponent('myTemplate', {opt: '123'});
         async._beforeUpdate({templateName: 'myTemplate', templateOptions: {opt: '234'}});
         assert.deepEqual(async.loadedAsync, []);
         assert.equal(async.optionsForComponent.opt, '234');
      });
      it('Before mount', function(done) {
         var bmRes = async._beforeMount({templateName: "myTemplate", templateOptions: {opt: '123'}});
         if (typeof window !== 'undefined') {
            bmRes.then(function(tpl) {
               assert.equal(tpl, 'myTemplate');
               done();
            });
         } else {
            bmRes.then(function(tpl) {
               assert.isNull(tpl);
               done();
            });
         }
      });
      it('Load lib server-side', function(done) {
         async._options.templateName = "Test/Lib:Control";
         var promise = async._loadServerSide(async._options.templateName, {opt: '123'});
         promise.then(function() {
            assert.deepEqual(async.loadedAsync, ["Test/Lib:Control"]);
            assert.deepEqual(async.pushedToHeadData, ["Test/Lib"]);
            assert.equal(async.optionsForComponent.opt, '123');
            assert.equal(async.optionsForComponent.resolvedTemplate, 'Test/Lib:Control');
            done();
         });
      });
      it('Load content async no force update', function(done) {
         async._loadContentAsync(async._options.templateName, {opt: '123'}, true).then(function() {
            assert.isUndefined(async.fuCnt);
            done();
         });
      });
      it('No update while loading', function(done) {
         async._updateOptionsForComponent('myTemplate', {opt: '123'});

         async._loadContentAsyncOrigin = async._loadContentAsync;
         async._loadContentAsync = function() {
            var promise = async._loadContentAsyncOrigin.apply(async, arguments);
            async.__loadPromise = promise;
            if(!async._loadContentAsyncCalled) {
               async._loadContentAsyncCalled = 1;
            } else {
               async._loadContentAsyncCalled++;
            }
         }

         async._beforeUpdate({templateName: 'myTemplateNew', templateOptions: {opt: '234'}});
         async._beforeUpdate({templateName: 'myTemplateNew2', templateOptions: {opt: '345'}});
         async.__loadPromise.then(function() {
            assert.deepEqual(async.loadedAsync, ['myTemplateNew']);
            assert.equal(async.optionsForComponent.opt, '234');
            assert.equal(async._loadContentAsyncCalled, 1);
            done();
         });
      });
   });
});
