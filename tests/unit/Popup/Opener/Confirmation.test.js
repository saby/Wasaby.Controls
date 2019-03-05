define(
   [
      'Controls/Popup/Opener/Confirmation',
      'Core/Deferred',
      'Core/polyfill/PromiseAPIDeferred'
   ],

   (PopupOpener, Deferred) => {
      'use strict';

      var popupOpener;

      describe('Controls/Popup/Opener/Confirmation', () => {
         beforeEach(() => {
            popupOpener = new PopupOpener();
            popupOpener._beforeMount({});
            popupOpener._children.LoadingIndicator = {
               toggleIndicator: () => {}
            };
            popupOpener._children.opener = {
               open: () => {}
            };
         });

         it('initialize', () => {
            assert.equal(popupOpener._resultDef, null);
         });

         it('open', () => {
            let def = popupOpener.open({});
            assert.equal(def instanceof Deferred, true);
         });
      });
   }
);
