define('Controls/Popup/Opener/Previewer/PreviewerController',
   [
      'Core/Deferred',
      'Controls/Popup/Manager/ManagerController',
      'Controls/Popup/Opener/Sticky/StickyController',

      'css!theme?Controls/Popup/Opener/Previewer/PreviewerController'
   ],
   function(Deferred, ManagerController, StickyController) {

      'use strict';

      var PreviewerController = StickyController.constructor.extend({
         _openedPopupId: null,

         _destroyDeferred: {},

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

         elementDestroyed: function(item) {
            if (item.id === this._openedPopupId) {
               this._openedPopupId = null;
            }

            this._destroyDeferred[item.id] = new Deferred();

            item.popupOptions.className = (item.popupOptions.className || '') + ' controls-PreviewerController_close';

            return this._destroyDeferred[item.id];
         },

         elementAnimated: function(item) {
            if (this._destroyDeferred[item.id]) {
               this._destroyDeferred[item.id].callback();
               delete this._destroyDeferred[item.id];
            }
         }
      });

      return new PreviewerController();
   }
);
