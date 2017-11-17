define('js!WSControls/Windows/PopupContainer/PopupContainer',
   [
      'Core/Control',
      'Core/CommandDispatcher',
      'tmpl!WSControls/Windows/PopupContainer/PopupContainer'
   ],
   function (Control, CommandDispatcher, template) {
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

         constructor: function (cfg){
            PopupContainer.superclass.constructor.call(this, cfg);
            this._publish('onClosePopup');
            CommandDispatcher.declareCommand(this, 'closePopup', this.closePopup);
         },

         _beforeMount: function(options){
            if( !options.popupItems ){
               options.popupItems = [];
            }
         },

         /**
          *
          * @function WSControls/Windows/PopupContainer/PopupContainer#closePopup
          * @param popupId
          */
         closePopup: function(popupId){
            this._notify('onClosePopup', popupId);
         },

         /**
          *
          * @function WSControls/Windows/PopupContainer/PopupContainer#setPopupItems
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