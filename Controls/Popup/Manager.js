define('js!Controls/Popup/Manager',
   [
      'Core/Control',
      'Core/core-instance',
      'Core/helpers/random-helpers',
      'js!Controls/Popup/Manager/Container',
      'WS.Data/Collection/List',
      'Core/core-merge'
   ],

   function (Control, CoreInstance, Random, Container, List, CoreMerge) {
      'use strict';

      var _private = {
         /**
          * Вернуть следующий z-index
          */
         calculateZIndex: function () {
            if (!Manager._zIndex) {
               Manager._zIndex = 10;
            }
            return Manager._zIndex += 10;
         },

         focusOut: function (id, focusedControl) {
            var
               index = Manager._popupItems.getIndexByValue('id', id);
            if (index > -1) {
               var element = Manager._popupItems.at(index);
               if (!!element.popupOptions.autoHide) {
                  var
                     opener = element.popupOptions.opener,
                     parent = focusedControl.to;
                  while (!!parent) {
                     if (parent.getId() === opener.getId() || parent.getId() === id) {
                        return;
                     }
                     parent = parent.getParent();
                  }
                  Manager.remove(id);
               }
            }
         },

         /**
          * Вытолкнуть окно наверх
          * @param popup инстанс попапа
          */
         pushUp: function (popup) {
            var
               index = Manager._popupItems.getIndexByValue('id', popup.getId());
            if (index > -1) {
               var element = Manager._popupItems.at(index);
               element.zIndex = _private.calculateZIndex();
               Container.setPopupItems(Manager._popupItems);
            }
         },

         /**
          * Пересчитать положение попапа
          * @param popup инстанс попапа
          */
         recalcPosition: function (popup) {
            var
               index = Manager._popupItems.getIndexByValue('id', popup.getId());
            if (index > -1) {
               var element = Manager._popupItems.at(index);
               Manager._popupItems.at(index).position = element.strategy.getPosition(popup);
               Container.setPopupItems(Manager._popupItems);
            }
         }
      };

      /**
       * Менеджер окон
       * @class Controls/Popup/Manager
       * @control
       * @public
       * @category Popup
       * @singleton
       * @extends Controls/Control
       */
      var Manager = {
         /**
          * Показать всплывающее окно
          * @function Controls/Popup/Manager#show
          * @param options компонент, который будет показан в окне
          * @param opener компонент, который инициировал открытие окна
          * @param strategy стратегия позиционирования всплывающего окна
          * @param controller контроллер
          */
         show: function (options, opener, strategy, controller) {
            if (!strategy || !CoreInstance.instanceOfMixin(strategy, 'Controls/Popup/interface/IStrategy')) {
               throw new Error('Strategy is not defined');
            }
            var element = {};
            element.id = Random.randomId('popup-');
            options.opener = opener;
            options.controller = controller;
            element.popupOptions = options;
            element.strategy = strategy;
            // TODO вероятно позиция по умолчанию должна задаваться не здесь
            element.position = {
               left: -10000,
               top: -10000
            };
            element.zIndex = _private.calculateZIndex();
            Manager._popupItems.add(element);
            Container.setPopupItems(Manager._popupItems);
            return element.id;
         },

         /**
          * Обновить опции существующего попапа
          * @function Controls/Popup/Manager#update
          * @param id идентификатор попапа, для которого нужно обновить опции
          * @param options новые опиции
          */
         update: function (id, options) {
            var
               index = Manager._popupItems.getIndexByValue('id', id);
            if (index > -1) {
               var element = Manager._popupItems.at(index);
               options.opener = element.popupOptions.opener;
               options.controller = element.popupOptions.controller;
               element.popupOptions = options;
               Container.setPopupItems(Manager._popupItems);
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
               index = Manager._popupItems.getIndexByValue('id', id);
            if (index > -1) {
               Manager._popupItems.removeAt(index);
               Container.setPopupItems(Manager._popupItems);
            }
         }
      };

      Manager._popupItems = new List();

      Container.subscribe('closePopup', function (event, id) {
         Manager.remove(id);
      });

      Container.subscribe('focusInPopup', function (event, id) {

      });

      Container.subscribe('focusOutPopup', function (event, id, focusedControl) {
         _private.focusOut(id, focusedControl);
      });

      Container.subscribe('recalcPosition', function (event, popup) {
         _private.recalcPosition(popup);
      });

      return Manager;
   }
);