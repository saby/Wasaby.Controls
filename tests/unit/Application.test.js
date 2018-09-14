/**
 * Created by dv.zuev on 27.12.2017.
 */
define([
   'Controls/Application'
], function(Application) {
   describe('Controls.Application', function() {

      beforeEach(function () {
         /* Пока не ясно, как мокать контексты */
         this.skip();
      });
      it('_tplConfig init', function(done) {
         var cfg = {
               templateConfig: {prop1: 123},
               content: Application
            },
            ctrl = new Application(cfg);

         ctrl._beforeMount(cfg).addCallback(function(conf) {
            assert.equal(ctrl.templateConfig, cfg.templateConfig, 'Property templateConfig is incorrect before mounting');
            done();
         });
      });

      it('Opening and closing of the infobox.', function() {
         var ctrl = new Application({});
         var event1 = {
            target: 1
         };
         var event2 = {
            target: 2
         };
         var event3 = {
            target: 3
         };
         var result = [];

         ctrl._children = {
            infoBoxOpener: {
               open: function() {
                  result.push('open');
               },
               close: function() {
                  result.push('close');
               }
            }
         };

         ctrl._openInfoBoxHandler(event1);
         ctrl._openInfoBoxHandler(event2);
         ctrl._openInfoBoxHandler(event3);

         assert.deepEqual(result, ['open', 'open', 'open']);

         result = [];

         assert.deepEqual(result, ['open', 'open', 'open']);

         result = [];

         ctrl._openInfoBoxHandler(event1);
         ctrl._closeInfoBoxHandler(event1);
         ctrl._openInfoBoxHandler(event2);
         ctrl._closeInfoBoxHandler(event2);
         ctrl._openInfoBoxHandler(event3);
         ctrl._closeInfoBoxHandler(event3);

         assert.deepEqual(result, ['open', 'close', 'open', 'close', 'open', 'close']);

         result = [];

         ctrl._openInfoBoxHandler(event1);
         ctrl._closeInfoBoxHandler(event2);
         ctrl._closeInfoBoxHandler(event3);
         ctrl._closeInfoBoxHandler(event1);

         assert.deepEqual(result, ['open', 'close']);
      });
   });
});
