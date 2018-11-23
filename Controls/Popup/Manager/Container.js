define('Controls/Popup/Manager/Container',
   [
      'Core/Control',
      'wml!Controls/Popup/Manager/Container',
      'Controls/Popup/Manager/ManagerController',
      'css!theme?Controls/Popup/Manager/Container'
   ],
   function(Control, template, ManagerController) {
      'use strict';

      // step zindex between popups. It should be enough to place all the additional popups (menu, infobox, suggest) on the main popups (stack, window)
      var POPUP_ZINDEX_STEP = 10;

      var Container = Control.extend({

         /**
          * Контейнер для отображения окон
          * @class Controls/Popup/Manager/Container
          * @extends Core/Control
          * @control
          * @private
          * @category Popup
          * @author Красильников А.С.
          */

         _template: template,
         _overlayId: null,
         _zIndexStep: POPUP_ZINDEX_STEP,
         _afterMount: function() {
            ManagerController.setContainer(this);
         },

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

         getPopupById: function(id) {
            return this._children[id];
         },

         getPendingById: function(id) {
            return this._children[id + '_registrator'];
         },

         _popupDeactivated: function(event, popupId, data) {
            this._notify('popupDeactivated', [popupId, data], { bubbling: true });
         },

         _popupActivated: function(event, popupId, data) {
            this._notify('popupActivated', [popupId, data], { bubbling: true });
         },

         _overlayClickHandler: function(event) {
            event.preventDefault();
         }
      });

      // To calculate the zIndex in a compatible notification Manager
      Container.POPUP_ZINDEX_STEP = POPUP_ZINDEX_STEP;
      return Container;
   });
