define(
   [
      'Controls/Popup/Opener/Confirmation',
      'Controls/Popup/Opener/Confirmation/Dialog',
      'Core/Deferred'
      'Core/polyfill/PromiseAPIDeferred'
   ],

   (PopupOpener, Dialog, Deferred) => {
      'use strict';

      var popupOpener;
      var dialog;

      describe('Controls/Popup/Opener/Confirmation', () => {
         beforeEach(() => {
            popupOpener = new PopupOpener();
            dialog = new Dialog();
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
         it('getSize', () => {
            var a = dialog._getSize();
            assert.equal(a, 'm');
            dialog._messageMaxLength = 5;
            dialog._options.message = 'abcabcabcacb';
            a = dialog._getSize();
            assert.equal(a, 'l');
            dialog._options.size = 'm';
            a = dialog._getSize();
            assert.equal(a, 'm');
         });

         it('open', () => {
            let def = popupOpener.open({});
            assert.equal(def instanceof Deferred, true);
         });
      });
   }
);
