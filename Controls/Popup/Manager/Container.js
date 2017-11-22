define('js!Controls/Popup/Manager/Container',
   [
      'Core/Control',
      'Core/CommandDispatcher',
      'tmpl!Controls/Popup/Manager/Container'
   ],
   function (Control, CommandDispatcher, template) {
      'use strict';
      /**
       * Контенер для отображения окон
       * @class Controls/Popup/Manager/Container
       * @control
       * @extends Core/Control
       * @public
       * @category Popup
       * @singleton
       */
      var Container = Control.extend({
         _controlName: 'Controls/Popup/Manager/Container',
         _template: template,
         iWantVDOM: true,

         constructor: function (cfg){
            Container.superclass.constructor.call(this, cfg);
            this._publish('onClosePopup');
            CommandDispatcher.declareCommand(this, 'closePopup', this.closePopup);
         },

         _beforeMount: function(options){
            if( !options.popupItems ){
               options.popupItems = [];
            }
         },

         /**
          * @event Controls/Popup/Manager/Container#closePopup Происходит при закрытии попапа.
          * @param {Object} popup Инстанс попапа.
          */
         closePopup: function(popup){
            this._notify('onClosePopup', popup.getId());
         },

         /**
          * Изменить набор окон
          * @function Controls/Popup/Manager/Container#setPopupItems
          * @param popupItems новый набор окон
          */
         setPopupItems: function (popupItems) {
            this._options.popupItems = popupItems;
            this._forceUpdate();
         }
      });

      var newDiv = document.createElement('div');
      newDiv.setAttribute('id', 'popup');
      document.body.appendChild(newDiv);
      return Control.createControl(Container, {}, '#popup');
   }
);