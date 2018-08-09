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
            var container = this._container.hasOwnProperty('length') ? this._container[0] : this._container;
            container.controlNodes[0].control._forceUpdate(); // ??
            // this._forceUpdate();
         },

         _popupDeactivated: function(event, popupId) {
            var activeElement = document.activeElement;
            var isPopupExists = this._children[popupId];
            if (isPopupExists) {
               // this._children[popupId].activate();
               var finishDef = this._children.registrator.finishPendingOperations(false);
               finishDef.addCallback(function() {
                  // activeElement.focus();
                  this._notify('popupDeactivated', [popupId], { bubbling: true });
               }.bind(this));
               finishDef.addErrback(function(e) {
                  IoC.resolve('ILogger').error('FormController example', '', e);
                  return e;
               });
            } else {
               this._notify('popupDeactivated', [popupId], { bubbling: true });
            }
         },

         _overlayClickHandler: function(event) {
            event.preventDefault();
         }
      });

      return Container;
   });
