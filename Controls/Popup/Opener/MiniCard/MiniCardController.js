define('Controls/Popup/Opener/MiniCard/MiniCardController',
   [
      'Core/Deferred',
      'Controls/Popup/Manager/ManagerController',
      'Controls/Popup/Opener/Sticky/StickyController',

      'css!Controls/Popup/Opener/MiniCard/MiniCardController'
   ],
   function(Deferred, ManagerController, StickyController) {

      'use strict';

      var MiniCardController = StickyController.constructor.extend({
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

            return MiniCardController.superclass.elementCreated.apply(this, arguments);
         },

         elementDestroyed: function(element, container) {
            this._openedPopupId = null;
            this._destroyDeferred = new Deferred();

            container.classList.add('controls-MiniCardController_close');

            return this._destroyDeferred;
         },

         elementAnimated: function(element, container) {
            if (container.classList.contains('controls-MiniCardController_close')) {
               this._destroyDeferred.callback();
            }
         }
      });

      return new MiniCardController();
   }
);
