define('js!Controls/Popup/Manager',
   [
      'Core/helpers/random-helpers',
      'WS.Data/Collection/List'
   ],

   function (Random, List) {
      'use strict';

      var _popupContainer;

      var _private = {
         addElement: function (element) {
            this._popupItems.add(element);
            if (element.isModal) {
               _private.getPopupContainer().setOverlay(this._popupItems.getCount() - 1);
            }
         },

         removeElement: function (element) {
            element.strategy.elementDestroyed(element);
            this._popupItems.remove(element);
            if (element.isModal) {
               var indices = this._popupItems.getIndicesByValue('isModal', true);
               _private.getPopupContainer().setOverlay(indices.length ? indices[indices.length - 1] : -1);
            }
         },

         /**
          * Получить Popup/Container
          * TODO временное решение, пока непонятно, как Manager должен узнать о контейнере
          */
         getPopupContainer: function () {
            if (document && !_popupContainer) {
               var element = document.getElementById('popup');
               if (element && element.controlNodes && element.controlNodes.length) {
                  _popupContainer = element.controlNodes[0].control;
                  _popupContainer.eventHandlers = {
                     onClosePopup: function (event, id) {
                        Manager.remove(id);
                     },
                     onPopupCreated: function (event, id, width, height) {
                        _private.popupCreated(id, width, height);
                     },
                     onPopupUpdated: function (event, id, width, height) {
                        _private.popupUpdated(id, width, height);
                     },
                     onPopupFocusIn: function (event, id, focusedControl) {
                        _private.popupFocusIn(id, focusedControl);
                     },
                     onPopupFocusOut: function (event, id, focusedControl) {
                        _private.popupFocusOut(id, focusedControl);
                     },
                     onResult: function (event, id, result) {
                        _private.sendResult(id, result);
                     }
                  };
               }
            }
            return _popupContainer;
         },

         popupCreated: function (id, width, height) {
            var element = Manager.find(id);
            if (element) {
               var strategy = element.strategy;
               if (strategy) {
                  // при создании попапа, зарегистрируем его
                  strategy.elementCreated(element, width, height);
                  Manager._redrawItems();
               }
            }
         },

         popupUpdated: function (id, width, height) {
            var element = Manager.find(id);
            if (element) {
               var strategy = element.strategy;
               if (strategy) {
                  // при создании попапа, зарегистрируем его
                  strategy.elementUpdated(element, width, height);
                  Manager._redrawItems();
               }
            }
         },

         popupFocusIn: function(id, focusedControl){
            var element = Manager.find(id);
            if (element && element.popupOptions.eventHandlers && element.popupOptions.eventHandlers.onFocusIn) {
               element.popupOptions.eventHandlers.onFocusIn(focusedControl);
            }
         },

         popupFocusOut: function (id, focusedControl) {
            var element = Manager.find(id);
            if (element && element.popupOptions.eventHandlers && element.popupOptions.eventHandlers.onFocusOut) {
               element.popupOptions.eventHandlers.onFocusOut(focusedControl);
            }
         },

         sendResult: function (id, result) {
            var element = Manager.find(id);
            if (element && element.popupOptions.eventHandlers && element.popupOptions.eventHandlers.onResult) {
               element.popupOptions.eventHandlers.onResult(result);
            }
         }
      };

      var Manager = {
         /**
          * Менеджер окон
          * @class Controls/Popup/Manager
          * @private
          * @singleton
          * @category Popup
          * @author Лощинин Дмитрий
          */

         /**
          * Показать всплывающее окно
          * @function Controls/Popup/Manager#show
          * @param options конфигурация попапа
          * @param strategy стратегия позиционирования попапа
          */
         show: function (options, strategy) {
            var element = {
               id: Random.randomId('popup-'),
               isModal: options.isModal,
               strategy: strategy,
               position: strategy.getDefaultPosition(),

               popupOptions: options
            };
            _private.addElement.call(this, element);
            this._redrawItems();
            return element.id;
         },

         /**
          * Обновить опции существующего попапа
          * @function Controls/Popup/Manager#update
          * @param id идентификатор попапа, для которого нужно обновить опции
          * @param options новые опции
          */
         update: function (id, options) {
            var
               element = this.find(id);
            if (element) {
               element.popupOptions = options;
               this._redrawItems();
               return id;
            }
            return null;
         },

         /**
          * Удалить окно
          * @function Controls/Popup/Manager#remove
          * @param id идентификатор попапа
          */
         remove: function (id) {
            var
               element = this.find(id);
            if (element) {
               _private.removeElement.call(this, element);
               this._redrawItems();
            }
         },

         /**
          * Найти конфиг попапа
          * @function Controls/Popup/Manager#find
          * @param id идентификатор попапа
          */
         find: function (id) {
            var
               element,
               index = this._popupItems.getIndexByValue('id', id);
            if (index > -1) {
               element = this._popupItems.at(index);
            }
            return element;
         },

         /**
          * Установить набор попапов
          * @function Controls/Popup/Manager#_redrawItems
          */
         _redrawItems: function () {
            var container = _private.getPopupContainer();
            if (container) {
               container.setPopupItems(this._popupItems);
            }
         }
      };

      Manager._popupItems = new List();
      return Manager;
   }
);