define('Controls/Popup/Manager/Container',
   [
      'Core/Control',
      'tmpl!Controls/Popup/Manager/Container',
      'css!Controls/Popup/Manager/Container'
   ],
   function(Control, template) {
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

         _template: template,
         _overlayId: null,

         /**
          * Установить индекс попапа, под которым будет отрисован оверлей
          * @function Controls/Popup/Manager/Container#setPopupItems
          * @param {Integer} index индекс попапа
          */
         setOverlay: function(index) {
            this._overlayId = index;
         },

         /**
          * Изменить набор окон
          * @function Controls/Popup/Manager/Container#setPopupItems
          * @param {List} popupItems новый набор окон
          */
         setPopupItems: function(popupItems) {
            this._popupItems = popupItems;
            this._forceUpdate();
         },

         /**
          * Закрыть попап
          * @function Controls/Popup/Manager/Container#_closePopup
          * @param event
          * @param id идентификатор попапа.
          * @param container контейнер
          */
         _closePopup: function(event, id, container) {
            if (this.eventHandlers && this.eventHandlers.onClosePopup) {
               this.eventHandlers.onClosePopup(event, id, container);
            }
         },

         /**
          * Обработчик на создание нового попапа
          * @function Controls/Popup/Manager/Container#_popupCreated
          * @param event
          * @param id идентификатор попапа.
          * @param container
          */
         _popupCreated: function(event, id, container) {
            if (this.eventHandlers && this.eventHandlers.onPopupCreated) {
               this.eventHandlers.onPopupCreated(event, id, container);
            }
         },

         /**
          * Обработчик на обновление попапа
          * @function Controls/Popup/Manager/Container#_popupUpdated
          * @param event
          * @param id идентификатор попапа.
          * @param container
          */
         _popupUpdated: function(event, id, container) {
            if (this.eventHandlers && this.eventHandlers.onPopupUpdated) {
               this.eventHandlers.onPopupUpdated(event, id, container);
            }
         },

         /**
          * Обработчик установки фокуса.
          * @function Controls/Popup/Manager/Container#_popupFocusIn
          * @param event
          * @param id идентификатор попапа.
          * @param focusedControl
          */
         _popupFocusIn: function(event, id, focusedControl) {
            if (this.eventHandlers && this.eventHandlers.onPopupFocusIn) {
               this.eventHandlers.onPopupFocusIn(event, id, focusedControl);
            }
         },

         /**
          * Обработчик потери фокуса.
          * @function Controls/Popup/Manager/Container#_popupFocusOut
          * @param event
          * @param id идентификатор попапа.
          * @param focusedControl
          */
         _popupFocusOut: function(event, id, focusedControl) {
            if (this.eventHandlers && this.eventHandlers.onPopupFocusOut) {
               this.eventHandlers.onPopupFocusOut(event, id, focusedControl);
            }
         },

         /**
          * Обработчик на отправку результат с попапа
          * @function Controls/Popup/Manager/Container#_popupCreated
          * @param event
          * @param id идентификатор попапа.
          * @param result
          */
         _result: function(event, id, result) {
            if (this.eventHandlers && this.eventHandlers.onResult) {
               this.eventHandlers.onResult(event, id, result);
            }
         }
      });

      return Container;
   }
);
