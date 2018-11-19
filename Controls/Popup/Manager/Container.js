define('Controls/Popup/Manager/Container',
   [
      'Core/Control',
      'wml!Controls/Popup/Manager/Container',
      'Controls/Popup/Manager/ManagerController',
      'Core/IoC',
      'css!theme?Controls/Popup/Manager/Container'
   ],
   function(Control, template, ManagerController, IoC) {
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
         _finishPendings: function(popupId, popupCallback, pendingCallback, pendingsFinishedCallback) {
            var popup = this._children[popupId];
            if (popup) {
               popupCallback && popupCallback(popup);

               var registrator = this._children[popupId + '_registrator'];
               if (registrator) {
                  if (registrator._hasRegisteredPendings()) {
                     pendingCallback && pendingCallback(popup);
                  }
                  var finishDef = registrator.finishPendingOperations();
                  finishDef.addCallbacks(function() {
                     pendingsFinishedCallback && pendingsFinishedCallback(popup);
                  }, function(e) {
                     IoC.resolve('ILogger').error('Controls/Popup/Manager/Container', 'Не получилось завершить пендинги: (name: ' + e.name + ', message: ' + e.message + ', details: ' + e.details + ')', e);
                     pendingsFinishedCallback && pendingsFinishedCallback(popup);
                  });
               }
            }
         },

         _popupClosed: function(event, popupId) {
            var self = this;
            this._finishPendings(popupId, null, function() {
               event.stopPropagation();
            }, function() {
               self._notify('popupClose', [popupId], { bubbling: true });
            });
         },
         _popupDeactivated: function(event, popupId) {
            var self = this;
            this._finishPendings(popupId, function() {
               if (!self[popupId + '_activeElement']) {
                  self[popupId + '_activeElement'] = document.activeElement;
               }
            }, function(popup) {
               // if pendings is exist, take focus back while pendings are finishing
               popup._container.focus();
            }, function(popup) {
               // Старые панели прерывали свое закрытие без механизма пендингов, на onBeforeClose.
               // Поддерживаю старую логику, закрываю compoundArea через close, чтобы прошел весь цикл закрытия
               if (popup && popup._options.isCompoundTemplate) {
                  if (popup._options.closeByExternalClick) {
                     self._getCompoundArea(popup._container).close();
                  }
               } else {
                  self._notify('popupDeactivated', [popupId], { bubbling: true });
               }
            });
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

         // TODO Compatible
         // Старые панели прерывали свое закрытие без механизма пендингов, на событие onBeforeClose
         // Зовем метод close с шаблона. Если закрывать по механизму деактивации, то он уничтожит попап =>
         // у compoundArea вызовется сразу destroy. такую логику прервать нельзя
         _getCompoundArea: function(popupContainer) {
            return $('.controls-CompoundArea', popupContainer)[0].controlNodes[0].control;
         }
      });

      // To calculate the zIndex in a compatible notification Manager
      Container.POPUP_ZINDEX_STEP = POPUP_ZINDEX_STEP;
      return Container;
   });
