define('Controls/Popup/Opener/Previewer/PreviewerController',
   [
      'Core/Deferred',
      'Controls/Popup/Manager/ManagerController',
      'Controls/Popup/Opener/Sticky/StickyController',

      'css!Controls/Popup/Opener/Previewer/PreviewerController'
   ],
   function(Deferred, ManagerController, StickyController) {

      'use strict';

      var PreviewerController = StickyController.constructor.extend({
         _openedPopupId: null,

         _destroyDeferred: null,

         elementCreated: function(element, container, id) {
            /**
             * Only one window can be opened.
             */
            if (this._openedPopupId) {
               ManagerController.remove(this._openedPopupId);
            }
            this._openedPopupId = id;

            return PreviewerController.superclass.elementCreated.apply(this, arguments);
         },

         elementDestroyed: function(element) {
            this._openedPopupId = null;
            this._destroyDeferred = new Deferred();

            //https://online.sbis.ru/opendoc.html?guid=0970b6a0-e38d-4b46-bd83-4e994444671a
            element.popupState = 'destroying';
            element.popupOptions.className = (element.popupOptions.className || '') + ' controls-PreviewerController_close';

            return this._destroyDeferred;
         },

         elementAnimated: function(element) {
            if (element.popupState === 'destroying') {
               element.popupState = 'destroyed';
               this._destroyDeferred.callback();
            }
         }
      });

      return new PreviewerController();
   }
);
