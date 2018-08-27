define('Controls/Popup/Manager/Container',
   [
      'Core/Control',
      'tmpl!Controls/Popup/Manager/Container',
      'Controls/Popup/Manager/ManagerController',
      'css!Controls/Popup/Manager/Container'
   ],
   function(Control, template, ManagerController) {
      'use strict';

      var Container = Control.extend({

         /**
          * Контейнер для отображения окон
          * @class Controls/Popup/Manager/Container
          * @extends Core/Control
          * @control
          * @private
          * @category Popup
          * @author Красильников Андрей
          */

         _template: template,
         _overlayId: null,
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

         _popupDeactivated: function(event, popupId) {
            var isPopupExists = this._children[popupId];
            if (isPopupExists) {
               if (!this[popupId + '_activeElement']) {
                  this[popupId + '_activeElement'] = document.activeElement;
               }
               var popup = this._children[popupId],
                  registrator = this._children[popupId + '_registrator'];
               popup._container.focus();
               var finishDef = registrator.finishPendingOperations();
               finishDef.addCallback(function() {
                  this._notify('popupDeactivated', [popupId], { bubbling: true });
               }.bind(this));
            }
         },
         _popupDestroyed: function(event, popupId) {
            if (this[popupId + '_activeElement']) {
               // its need to focus element on _afterUnmount, thereby _popupDeactivated not be when focus is occured.
               // but _afterUnmount is not exist, thereby its called setTimeout on _beforeUnmount of popup for wait needed state.
               setTimeout(function() {
                  this[popupId + '_activeElement'].focus();
                  delete this[popupId + '_activeElement'];
               }.bind(this), 0);
            }
         },

         _overlayClickHandler: function(event) {
            event.preventDefault();
         }
      });

      return Container;
   });
