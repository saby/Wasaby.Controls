define(
   [
      'js!Controls/Popup/Manager/Popup',
      'js!Controls/Popup/Controller'
   ],

   function (Popup, Controller) {
      'use strict';
      describe('Controls/Popup/Manager/Popup', function () {
         var
            controller = new Controller(),
            cfg = {
               opener: null,
               controller: controller
            },
            popup = new Popup();
         popup.saveOptions();

         it('popup initialize', function () {
            popup._beforeMount(cfg);
            assert.equal(popup._controller, controller);
            assert.equal(popup._opener, null);
         });

         it('send result', function () {

         });
      });
   }
);