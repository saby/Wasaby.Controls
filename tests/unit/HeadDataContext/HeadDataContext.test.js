define(
   [
      'Controls/Application/HeadDataContext',
      'Core/Deferred',
      'WS.Data/Collection/RecordSet'
   ],

   function(HeadDataContext, Deferred, RecordSet) {
      'use strict';
      describe('DepsCollector', function() {
         it('ReceivedState dependencies', function(done) {
            var hdc = new HeadDataContext();
            var def = new Deferred();
            hdc.pushWaiterDeferred(def);
            hdc.addReceivedState('123', new RecordSet({
               rawData: []
            }));
            var resDef = hdc.waitAppContent();
            resDef.addCallback(function(res) {
               assert.isTrue(!!~res.additionalDeps.indexOf('WS.Data/Collection/RecordSet'));
               if (typeof window !== 'undefined') {
                  window._$ThemesController = null;
               } else if (typeof process !== 'undefined') {
                  if (process && process.domain && process.domain.req) {
                     process.domain.req._$ThemesController = null;
                  }
               }
               done();
            });
            def.callback();
         });
      });
   }
);
