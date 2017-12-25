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
            this._popupItems = new List()
         },

         /**
          * @param id идентификатор попапа.
          */
         _closePopup: function (event, id) {
            if( this.eventHandlers && this.eventHandlers.onClosePopup){
               this.eventHandlers.onClosePopup(event, id);
            }
         },

         /**
          * @param id идентификатор попапа.
          */
         _focusInPopup: function(event, id){
            if( this.eventHandlers && this.eventHandlers.onFocusIn){
               this.eventHandlers.onFocusIn(event, id);
            }
         },

         /**
          * @param id идентификатор попапа.
          * @param {Object} focusedControl контрол, на который кшел фокус.
          */
         _focusOutPopup: function(event, id, focusedControl){
            if( this.eventHandlers && this.eventHandlers.onFocusOut){
               this.eventHandlers.onFocusOut(event, id, focusedControl);
            }
         },

         /**
          * @param {Object} popup Инстанс попапа.
          */
         _recalcPosition: function (event, popup) {
            if( this.eventHandlers && this.eventHandlers.onRecalcPosition){
               this.eventHandlers.onRecalcPosition(event, popup);
            }
         },

         /**
          * Изменить набор окон
          * @function Controls/Popup/Manager/Container#setPopupItems
          * @param {List} popupItems новый набор окон
          */
         setPopupItems: function (popupItems) {
            this._popupItems = popupItems;
            this._forceUpdate();
         }
      });

      return Container;
   }
);