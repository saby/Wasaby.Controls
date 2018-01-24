define(
   [
      'Controls/ConfirmationWindow',
      'Core/Deferred'
   ],

   function (PopupOpener, Deferred) {
      'use strict';

      var popupOpener;

      describe('Controls/ConfirmationWindow', function () {

         beforeEach(function(){
            popupOpener = new PopupOpener();
            popupOpener._children.opener = {
               open: function(){

               }
            };
         });

         it('initialize', function() {
            assert.equal(popupOpener._resultDef, null);
         });

         it('open', function() {
            var def = popupOpener.open({});
            assert.equal(def instanceof Deferred, true);
         });

      });
   }
);