define('Controls/Popup/Manager/Container',
   [
      'Core/Control',
      'tmpl!Controls/Popup/Manager/Container',
      'Controls/Popup/Manager/ManagerController',
      'css!Controls/Popup/Manager/Container'
   ],
   function(Control, template, ManagerController) {
      'use strict';

      //step zindex between popups. It should be enough to place all the additional popups (menu, infobox, suggest) on the main popups (stack, window)
      var POPUP_ZINDEX_STEP = 10;

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

         _popupDeactivated: function(event, popupId) {
            var popup = this._children[popupId];
            if (popup) {
               if (!this[popupId + '_activeElement']) {
                  this[popupId + '_activeElement'] = document.activeElement;
               }
               var registrator = this._children[popupId + '_registrator'];
               if (registrator) {
                  if (registrator._hasRegisteredPendings()) {
                     // if pendings is exist, take focus back while pendings are finishing
                     popup._container.focus();
                  }
                  var finishDef = registrator.finishPendingOperations();
                  finishDef.addCallback(function() {
                     //Старые панели прерывали свое закрытие без механизма пендингов, на onBeforeClose.
                     //Поддерживаю старую логику, закрываю compoundArea через close, чтобы прошел весь цикл закрытия
                     if (popup && popup._options.isCompoundTemplate) {
                        if (popup._options.closeByExternalClick) {
                           this._getCompoundArea(popup._container).close();
                        }
                     } else {
                        this._notify('popupDeactivated', [popupId], { bubbling: true });
                     }
                  }.bind(this));
               }
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
         },

         //TODO Compatible
         //Старые панели прерывали свое закрытие без механизма пендингов, на событие onBeforeClose
         //Зовем метод close с шаблона. Если закрывать по механизму деактивации, то он уничтожит попап =>
         //у compoundArea вызовется сразу destroy. такую логику прервать нельзя
         _getCompoundArea: function(popupContainer) {
            return $('.controls-CompoundArea', popupContainer)[0].controlNodes[0].control;
         }
      });

      //To calculate the zIndex in a compatible notification Manager
      Container.POPUP_ZINDEX_STEP = POPUP_ZINDEX_STEP;
      return Container;
   });
