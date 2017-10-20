define('js!WSControls/Windows/PopupContainer/PopupContainer',
   [
      'Core/Control',
      'tmpl!WSControls/Windows/PopupContainer/PopupContainer',
      'css!WSControls/Windows/PopupContainer/PopupContainer',
      'js!WSControls/Windows/Popup/Popup'
   ],
   function (Control, template) {
      'use strict';

      /**
       * Контейнер окон
       * @class WSControls/Windows/PopupContainer/PopupContainer
       * @control
       * @public
       */

      var PopupContainer = Control.extend({
         _template: template,
         _controlName: 'WSControls/Windows/PopupContainer/PopupContainer',
         iWantVDOM: true,

         constructor: function(cfg){
            this.popupItems = [];
            PopupContainer.superclass.constructor.call(this, cfg);
         },

         /**
          * Добавить окно
          * @function WSControls/Windows/PopupContainer/PopupContainer#show
          * @param popupItems
          */
         setPopupItems: function (popupItems) {
            this.popupItems = popupItems;
            this._forceUpdate();
         }
      });

      return PopupContainer;
   }
);