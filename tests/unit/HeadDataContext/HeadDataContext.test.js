define(
   [
      'Controls/Application/HeadData',
      'Core/Deferred',
      'WS.Data/Collection/RecordSet'
   ],

   function(HeadData, Deferred, RecordSet) {
      'use strict';
      describe('DepsCollector', function() {
         it('ReceivedState dependencies', function(done) {
            var hdc = new HeadData();
            var def = new Deferred();
            hdc.pushWaiterDeferred(def);
            hdc.addReceivedState('123', new RecordSet({
               rawData: []
            }));
            var resDef = hdc.waitAppContent();
            resDef.addCallback(function(res) {
               assert.isTrue(!!~res.additionalDeps.indexOf('WS.Data/Collection/RecordSet'));
               if (typeof window !== 'undefined') {
                  delete window._$ThemesController;
               } else if (typeof process !== 'undefined') {
                  if (process && process.domain && process.domain.req) {
                     delete process.domain.req._$ThemesController;
                  }
               } else if (typeof global !== 'undefined') {
                  delete global._$ThemesController;
               }
               done();
            });
            def.callback();
         });
      });
   }
);
