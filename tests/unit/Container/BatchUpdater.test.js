/**
 * Created by Belotelov on 08.08.2018.
 */
define(
   [
      'Controls/Container/BatchUpdater',
      'Core/Deferred'
   ],
   function(BatchUpdater, Deferred) {

      'use strict';

      var enumInstance, containerInstance;

      describe('Controls.Container.BatchUpdater', function() {
         it('BatchUpdater update and reset', function(done) {
            var bu = new BatchUpdater();
            var def1 = new Deferred();
            var def2 = new Deferred();

            setTimeout(function() {
               def1.callback();
            }, 10);
            setTimeout(function() {
               def2.callback();
            }, 20);

            var call1 = false;
            var call2 = false;

            function callback1() {
               call1 = true;
            }
            function callback2() {
               call2 = true;
            }

            bu.requestHandler({}, def1, callback1);
            bu.requestHandler({}, def2, callback2);

            setTimeout(function() {
               assert.isTrue(call1);
               assert.isTrue(call2);
               assert.equal(bu.pDef, null);
               done();
            }, 50);
         });
      });
   }
);