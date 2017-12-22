define(
   [
      'js!Controls/Utils/PopupOpener'
   ],

   function (PopupOpener) {
      'use strict';

      var popupOpener;

      describe('Controls/Utils/PopupOpener', function () {

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
            assert.equal(popupOpener._positiveHandler, null);
         });

         it('confirmDialog', function() {
            var handler = function(){};
            popupOpener.confirmDialog({},  handler);
            assert.equal(popupOpener._positiveHandler, handler);
         });

         it('successDialog', function() {
            var handler = function(){};
            popupOpener.successDialog({},  handler);
            assert.equal(popupOpener._cancelHandler, handler);
         });

         it('errorDialog', function() {
            var handler = function(){};
            popupOpener.errorDialog({},  handler);
            assert.equal(popupOpener._cancelHandler, handler);
         });

         it('infoDialog', function() {
            var handler = function(){};
            popupOpener.infoDialog({},  handler);
            assert.equal(popupOpener._cancelHandler, handler);
         });
      });
   }
);