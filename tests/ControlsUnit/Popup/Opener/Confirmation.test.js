define([
   'Controls/popup',
   'Controls/popupTemplate',
   'Core/Deferred',
   'Core/polyfill/PromiseAPIDeferred'
], (
   popup,
   popupTemplate,
   Deferred ) =>
   {
      'use strict';

      var popupOpener;
      var dialog;

      describe('Controls/_popup/Opener/Confirmation', () => {
         beforeEach(() => {
            popupOpener = new popup.Confirmation();
            dialog = new popupTemplate.ConfirmationDialog();
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
            popupOpener._openPopup = () => Promise.resolve();
            let def = popupOpener.open({});

            assert.equal(def instanceof Deferred, true);
         });
         it('getConfirmationConfig', () => {
            let templateOptions = {};
            let popupOptions = popup.Confirmation._getConfig(templateOptions, {});
            let config = {
               template: 'Controls/popupTemplate:ConfirmationDialog',
               modal: true,
               autofocus: true,
               isCentered: true,
               className: 'controls-Confirmation_popup',
               templateOptions: {
                  closeHandler: {}
               },
               zIndex: 5000
            };

            assert.deepEqual(popupOptions, config);
         });
      });
   }
);
