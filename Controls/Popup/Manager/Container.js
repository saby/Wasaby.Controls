define('js!Controls/Popup/Manager/Container',
   [
      'Core/Control',
      'tmpl!Controls/Popup/Manager/Container',
      'WS.Data/Collection/List',
      'css!Controls/Popup/Manager/Container'
   ],
   function (Control, template, List) {
      'use strict';

      var Container = Control.extend({
         /**
          * Контейнер для отображения окон
          * @class Controls/Popup/Manager/Container
          * @extends Core/Control
          * @control
          * @private
          * @category Popup
          * @author Лощинин Дмитрий
          */

         _controlName: 'Controls/Popup/Manager/Container',
         _template: template,

         constructor: function (cfg) {
            Container.superclass.constructor.call(this, cfg);
            this._popupItems = new List();
         },

         /**
          * Изменить набор окон
          * @function Controls/Popup/Manager/Container#setPopupItems
          * @param {List} popupItems новый набор окон
          */
         setPopupItems: function (popupItems) {
            this._popupItems = popupItems;
            this._forceUpdate();
         },

         /**
          * Закрыть попап
          * @function Controls/Popup/Manager/Container#_closePopup
          * @param event
          * @param id идентификатор попапа.
          */
         _closePopup: function (event, id) {
            if (this.eventHandlers && this.eventHandlers.onClosePopup) {
               this.eventHandlers.onClosePopup(event, id);
            }
         },

         /**
          * Обработчик на создание нового попапа
          * @function Controls/Popup/Manager/Container#_popupCreated
          * @param event
          * @param id идентификатор попапа.
          * @param width ширина попапа.
          * @param height высота попапа.
          * @param cfg конфиг попапа.
          */
         _popupCreated: function(event, id, width, height, cfg){
            if (this.eventHandlers && this.eventHandlers.onPopupCreated) {
               this.eventHandlers.onPopupCreated(event, id, width, height, cfg);
            }
         },

         /**
          * Обработчик на создание нового попапа
          * @function Controls/Popup/Manager/Container#_popupCreated
          * @param event
          * @param id идентификатор попапа.
          * @param args аргументы.
          */
         _result: function(event, id, args){
            if (this.eventHandlers && this.eventHandlers.onResult) {
               this.eventHandlers.onResult(event, id, args);
            }
         }
      });

      return Container;
   }
);