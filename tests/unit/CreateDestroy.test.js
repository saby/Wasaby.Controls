/**
 * Created by dv.zuev on 18.05.2017.
 */
define([
   'js!WSTest/TestSubControls/TestSubControlParent',
   'js!WSTest/TestSubControls/LogicParentTestControl'
], function (
   ParentControl, LogicParentTestControl
) {
   'use strict';

   describe('CreateDestroy', function () {
      beforeEach(function () {
         if (typeof $ === 'undefined') {
            this.skip();
         }
      });
      describe('SubControls', function(){
         it('SubControls', function(done) {
            var parentControl = new ParentControl({
               element: $('<div></div>')
            });
            setTimeout(function () {
               assert.isTrue(!!parentControl.children.child);
               var a = parentControl.children.child;

               parentControl.destroy();
               assert.isTrue(a.isDestroyed());
               done();
            }, 0)

         });

         it('Parents', function(done) {
            var logicParentTestControl = new LogicParentTestControl({
               element: $('<div></div>')
            });
            setTimeout(function() {
               var ch1 = logicParentTestControl.children.ch1,
                  ch2 = logicParentTestControl.children.ch2;
               assert.isTrue(ch1 !== undefined);
               assert.isTrue(ch2.logicParent === logicParentTestControl);

               assert.isTrue( ch2.isEnabled() );
               assert.isTrue( ch2._options.enabled === undefined );
               ch1._options.enabled = false;
               ch1._setDirty();
               setTimeout(function(){
                  assert.isTrue( !ch2.isEnabled() );
                  assert.isTrue( ch2._options.enabled === undefined );

                  done();

               }, 50);

            }, 50);
         });

      });

   });

});