define(
   [
      'js!Controls/InformationWindow'
   ],

   function (PopupOpener) {
      'use strict';

      var popupOpener;

      describe('Controls/InformationWindow', function () {

         beforeEach(function(){
            popupOpener = new PopupOpener();
            popupOpener._children.opener = {
               open: function(){

               }
            };
         });

         afterEach(function(){
            popupOpener.destroy();
         });

         it('initialize', function() {
            assert.equal(popupOpener._handlers.yes, null);
         });

         it('confirmDialog', function() {
            var handler = function(){};
            popupOpener.openConfirmDialog({}, handler);
            assert.equal(popupOpener._handlers.yes, handler);
         });

         it('infoDialog', function() {
            var handler = function(){};
            popupOpener.openInfoDialog({}, handler);
            assert.equal(popupOpener._handlers.cancel, handler);
         });
      });
   }
);