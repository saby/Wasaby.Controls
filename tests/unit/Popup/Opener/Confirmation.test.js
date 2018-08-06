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

            //fixme по-идее это значвение должно было проставиться в _beforeMount BaseOpener-а, но этого не произошло
            popupOpener._popupIds = [];

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