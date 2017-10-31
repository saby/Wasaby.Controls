define('js!WSControls/Windows/PopupContainer/PopupContainer',
   [
      'Core/Control',
      'tmpl!WSControls/Windows/PopupContainer/PopupContainer',
      'css!WSControls/Windows/PopupContainer/PopupContainer'
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

         _beforeMount: function(options){
            if( !options.popupItems ){
               options.popupItems = [];
            }
         },

         /**
          *
          * @function WSControls/Windows/PopupContainer/PopupContainer#show
          * @param popupItems
          */
         setPopupItems: function (popupItems) {
            this._options.popupItems = popupItems;
            this._forceUpdate();
         }
      });

      return Control.createControl(PopupContainer, {}, '#popup');
   }
);