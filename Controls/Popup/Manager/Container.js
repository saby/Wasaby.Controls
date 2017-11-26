define('js!Controls/Popup/Manager/Container',
   [
      'Core/Control',
      'Core/CommandDispatcher',
      'tmpl!Controls/Popup/Manager/Container',
      'WS.Data/Collection/List',
      'css!Controls/Popup/Manager/Container'
   ],
   function (Control, CommandDispatcher, template, List) {
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
            this._publish('closePopup', 'focusInPopup', 'focusOutPopup', 'recalcPosition');
            CommandDispatcher.declareCommand(this, 'closePopup', this.closePopup);
            CommandDispatcher.declareCommand(this, 'focusInPopup', this.focusInPopup);
            CommandDispatcher.declareCommand(this, 'focusOutPopup', this.focusOutPopup);
            CommandDispatcher.declareCommand(this, 'recalcPosition', this.recalcPosition);
         },

         _beforeMount: function(options){
            if( !options._popupItems ){
               options._popupItems = new List();
            }
         },

         /**
          * @event Controls/Popup/Manager/Container#closePopup Происходит при закрытии попапа.
          * @param {Object} popup Инстанс попапа.
          */
         closePopup: function(popup){
            this._notify('closePopup', popup);
         },

         /**
          * @event Controls/Popup/Manager/Container#focusPopup Происходит при установке/уходе фокуса.
          * @param {Object} popup Инстанс попапа.
          */
         focusInPopup: function(popup){
            this._notify('focusInPopup', popup);
         },

         /**
          * @event Controls/Popup/Manager/Container#focusPopup Происходит при уходе фокуса.
          * @param {Object} popup Инстанс попапа.
          * @param {Object} focusedControl Контрол, на который перешёл фокус. Если контрол неизвестен, то undefined.
          */
         focusOutPopup: function(popup, focusedControl){
            this._notify('focusOutPopup', popup, focusedControl);
         },

         /**
          * @event Controls/Popup/Manager/Container#recalcPosition Происходит при закрытии попапа.
          * @param {Object} popup Инстанс попапа.
          */
         recalcPosition: function(popup){
            this._notify('recalcPosition', popup);
         },

         /**
          * Изменить набор окон
          * @function Controls/Popup/Manager/Container#setPopupItems
          * @param {List} popupItems новый набор окон
          */
         setPopupItems: function (popupItems) {
            this._options._popupItems = popupItems;
            this._forceUpdate();
         }
      });

      var newDiv = document.createElement('div');
      newDiv.setAttribute('id', 'popup');
      document.body.appendChild(newDiv);
      return Control.createControl(Container, {}, '#popup');
   }
);