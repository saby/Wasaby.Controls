define('js!Controls/Popup/Manager',
   [
      'Core/helpers/random-helpers',
      'WS.Data/Collection/List'
   ],

   function (Random, List) {
      'use strict';

      var _popupContainer;

      var _private = {
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
                        _private.recalcPosition(id, width, height);
                     },
                     onResult: function(event, id, args){
                        _private.sendResult(id, args);
                     }
                  };
               }
            }
            return _popupContainer;
         },

         recalcPosition: function (id, width, height) {
            var element = Manager._find(id);
            if (element) {
               var strategy = element.strategy;
               if (strategy) {
                  strategy.getPosition(element, width, height);
                  Manager._setItems();
               }
            }
         },

         sendResult: function(id, args){
            var element = Manager._find(id);
            if (element) {
               element.controller.notifyOnResult(args);
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
          * @param controller контроллер
          */
         show: function (options, strategy, controller) {
            var element = {};
            element.id = Random.randomId('popup-');
            element.strategy = strategy;
            element.position = strategy.getDefaultPosition();
            element.controller = controller;
            element.popupOptions = options;
            this._popupItems.add(element);
            this._setItems();
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
               element = this._find(id);
            if (element) {
               element.popupOptions = options;
               this._setItems();
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
               element = this._find(id);
            if (element) {
               element.strategy.removeElement(element);
               this._popupItems.remove(element);
               this._setItems();
            }
         },

         /**
          * Найти конфиг попапа
          * @function Controls/Popup/Manager#_find
          * @param id идентификатор попапа
          */
         _find: function (id) {
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
          * @function Controls/Popup/Manager#_setItems
          */
         _setItems: function () {
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