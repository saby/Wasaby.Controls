define('js!Controls/Popup/Manager/Container',
   [
      'Core/Control',
      'tmpl!Controls/Popup/Manager/Container',
      'WS.Data/Collection/List',
      'css!Controls/Popup/Manager/Container'
   ],
   function (Control, template, List) {
      'use strict';

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

         constructor: function (cfg) {
            Container.superclass.constructor.call(this, cfg);
         },

         _beforeMount: function (options) {
            if (!options._popupItems) {
               options._popupItems = new List();
            }
         },

         /**
          * @param id идентификатор попапа.
          */
         _closePopup: function (event, id) {
            this._notify('closePopup', id);
         },

         /**
          * @param id идентификатор попапа.
          */
         _focusInPopup: function(event, id){
            this._notify('focusInPopup', id);
         },

         /**
          * @param id идентификатор попапа.
          * @param {Object} focusedControl контрол, на который кшел фокус.
          */
         _focusOutPopup: function(event, id, focusedControl){
            this._notify('focusOutPopup', id, focusedControl);
         },

         /**
          * @param {Object} popup Инстанс попапа.
          */
         _recalcPosition: function (event, popup) {
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

      // TODO довольно спорный способ встроить контйнер на страницу
      var newDiv = document.createElement('div');
      newDiv.setAttribute('id', 'popup');
      document.body.appendChild(newDiv);
      return Control.createControl(Container, {}, '#popup');
   }
);