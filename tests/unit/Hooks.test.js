/**
 * Created by dv.zuev on 18.05.2017.
 */
define([
   'js!SBIS3.CONTROLS.Button',
   'js!WSTest/Hooks/HookTest'
], function (
   Button,
   Control
) {
   'use strict';

   describe('Hooks', function () {
      beforeEach(function () {
         if (typeof $ === 'undefined') {
            this.skip();
         }
         $('#mocha').append('<div id="component"></div>');
      });
      describe('SubControls', function(){


         it('Hooks', function(done) {
            var control = new Control({
               childText: 'text',
               element:$('#component')
            });

            setTimeout(function () {
               assert.isTrue(control.checkHooks[0] === 'beforeMount');
               assert.isTrue(control.checkHooks[1] === 'afterMount');

               control._onMouseClick();

               setTimeout(function() {
                  assert.isTrue(control.checkHooks[2] === 'beforeUpdate');
                  assert.isTrue(control.checkHooks[3] === 'shouldUpdate');
                  assert.isTrue(control.checkHooks[4] === 'afterUpdate');

                  control.destroy();
                  setTimeout(function() {
                     assert.isTrue(control.checkHooks[5] === 'beforeUnmount');
                     done();
                  }, 150);
               }, 150);

            }, 150);

         });

      });

   });

});
