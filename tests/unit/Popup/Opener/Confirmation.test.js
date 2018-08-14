define(
   [
      'Controls/Popup/Opener/Confirmation',
      'Core/Deferred'
   ],

   function (PopupOpener, Deferred) {
      'use strict';

      var popupOpener;

      describe('Controls/Popup/Opener/Confirmation', function () {

         beforeEach(function(){
            popupOpener = new PopupOpener();
            popupOpener._beforeMount();
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