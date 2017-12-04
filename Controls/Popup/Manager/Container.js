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

      var _private = {
         /**
          * @param id идентификатор попапа.
          */
         closePopup: function (id) {
            this._notify('closePopup', id);
         },

         /**
          * @param id идентификатор попапа.
          */
         focusInPopup: function(id){
            this._notify('focusInPopup', id);
         },

         /**
          * @param id идентификатор попапа.
          * @param {Object} focusedControl контрол, на который кшел фокус.
          */
         focusOutPopup: function(id, focusedControl){
            this._notify('focusOutPopup', id, focusedControl);
         },

         /**
          * @param {Object} popup Инстанс попапа.
          */
         recalcPosition: function (popup) {
            this._notify('recalcPosition', popup);
         }
      };
      /**
       * Контенер для отображения окон
       * @class Controls/Popup/Manager/Container
       * @control
       * @extends Controls/Control
       * @public
       * @category Popup
       * @singleton
       */
      var Container = Control.extend({
         _controlName: 'Controls/Popup/Manager/Container',
         _template: template,
         iWantVDOM: true,

         constructor: function (cfg) {
            Container.superclass.constructor.call(this, cfg);
            this._publish('closePopup', 'focusInPopup', 'focusOutPopup', 'recalcPosition');
            CommandDispatcher.declareCommand(this, 'closePopup', _private.closePopup);
            CommandDispatcher.declareCommand(this, 'focusInPopup', _private.focusInPopup);
            CommandDispatcher.declareCommand(this, 'focusOutPopup', _private.focusOutPopup);
            CommandDispatcher.declareCommand(this, 'recalcPosition', _private.recalcPosition);
         },

         _beforeMount: function (options) {
            if (!options._popupItems) {
               options._popupItems = new List();
            }
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

      // TODO довольно спорный способ встроить контйнер на страницу
      var newDiv = document.createElement('div');
      newDiv.setAttribute('id', 'popup');
      document.body.appendChild(newDiv);
      return Control.createControl(Container, {}, '#popup');
   }
);