define([
   'Controls/Container/LoadingIndicator',
   'WS.Data/Entity/Record',
   'Core/helpers/Function/runDelayed',
   'Core/Deferred',
   'WS.Data/Source/Memory',
   'require'
], function(LoadingIndicator, Record, runDelayed, Deferred, MemorySource, require) {
   'use strict';

   describe('LoadingIndicator-tests', function() {
      var testControl, testElement;

      function mountControl(moduleName) {
         var def = new Deferred();
         require(['Core/Control', moduleName], function(CoreControl, Component) {
            var element =  document.body.querySelectorAll('#loadingIndicatorComponent')[0];
            var config = {
               element: element,
               dataSource: new MemorySource({
                  idProperty: 'id',
                  data: [{ id: 0 }]
               })
            };
            testControl = CoreControl.createControl(Component, config, element);
            var baseAfterMount = testControl._afterMount;

            testControl._afterMount = function() {
               baseAfterMount.apply(this, arguments);
               runDelayed(function() {
                  // waiting(function() {
                     def.callback(testControl);
                  // });
               });
            };
         });
         return def;
      }

      beforeEach(function () {
         if (!document || !document.body) {//Проверка того, что тесты выполняются в браузере
            this.skip();
         }
         else {
            var el = document.body.querySelectorAll('#mocha')[0];
            var testElement = document.createElement("div");
            testElement.setAttribute('id', 'loadingIndicatorComponent');
            el.appendChild(testElement);
         }
      });

      it('LoadingIndicator - SimpleCase', function(done) {
         var mountedDef = mountControl('Controls-demo/LoadingIndicator/LoadingIndicator');
         mountedDef.addCallback(function(control) {
            control._children.loadingIndicator.toggleIndicator(true);
            setTimeout(function () {
               assert.equal(control._children.loadingIndicator.isLoading, false);
               setTimeout(function () {
                  assert.equal(control._children.loadingIndicator.isLoading, true);

                  control._children.loadingIndicator.toggleIndicator(false);
                  setTimeout(function () {
                     assert.equal(control._children.loadingIndicator.isLoading, false);
                     done();
                  }, 500);
               }, 1000);
            }, 500);
         });
         mountedDef.addErrback(function(e) {
            done(e);
         });

      }).timeout(6000);

      it('LoadingIndicator - SimpleCase 2', function(done) {
         var mountedDef = mountControl('Controls-demo/LoadingIndicator/LoadingIndicator');
         mountedDef.addCallback(function(control) {
            control._children.loadingIndicator.toggleIndicator(true);
            setTimeout(function () {
               setTimeout(function() {
                  control._children.loadingIndicator.toggleIndicator(false);
               }, 300);
               setTimeout(function () {
                  assert.equal(control._children.loadingIndicator.isLoading, false);
                  done();
               }, 1000);
            }, 500);
         });
         mountedDef.addErrback(function(e) {
            done(e);
         });

      }).timeout(6000);

      afterEach(function() {
         testControl && testControl.destroy();
         testElement && testElement.remove();
      });
   });
});
