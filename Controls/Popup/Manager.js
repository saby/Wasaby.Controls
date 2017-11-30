define('js!Controls/Popup/Manager',
   [
      'Core/Control',
      'Core/core-merge',
      'Core/core-instance',
      'Core/helpers/random-helpers',
      'js!Controls/Popup/Manager/Container',
      'WS.Data/Collection/List'
   ],

   function (Control, CoreMerge, CoreInstance, Random, Container, List) {
      'use strict';
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
          * Вернуть следующий z-index
          * @function Controls/Popup/Manager#calculateZIndex
          */
         calculateZIndex: function () {
            if (!Manager._zIndex) {
               Manager._zIndex = 10;
            }
            return Manager._zIndex += 10;
         },

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
            element.position = {
               left: -10000,
               top: -10000
            };
            element.zIndex = Manager.calculateZIndex();
            Manager._popupItems.add(element);
            Container.setPopupItems(Manager._popupItems);
            return element.id;
         },

         update: function (id, options) {
            var
               index = Manager._popupItems.getIndexByValue('id', id);
            if (index > -1) {
               var element = Manager._popupItems.at(index);
               CoreMerge(element.popupOptions, options);
               Container.setPopupItems(Manager._popupItems);
               return id;
            }
            return null;
         },

         /**
          * Удалить окно
          * @function Controls/Popup/Manager#remove
          * @param popup инстанс попапа
          */
         remove: function (popup) {
            var
               id = popup.getId(),
               index = Manager._popupItems.getIndexByValue('id', id);
            if (index > -1) {
               Manager._popupItems.removeAt(index);
               Container.setPopupItems(Manager._popupItems);
            }
         },

         /**
          * Вытолкнуть окно наверх
          * @function Controls/Popup/Manager#_pushUp
          * @param popup инстанс попапа
          */
         _pushUp: function (popup) {
            var
               index = Manager._popupItems.getIndexByValue('id', popup.getId());
            if (index > -1) {
               var element = Manager._popupItems.at(index);
               element.zIndex = Manager.calculateZIndex();
               Container.setPopupItems(Manager._popupItems);
            }
         },

         /**
          * Пересчитать положение попапа
          * @function Controls/Popup/Manager#_recalcPosition
          * @param popup инстанс попапа
          */
         _recalcPosition: function (popup) {
            var
               index = Manager._popupItems.getIndexByValue('id', popup.getId());
            if (index > -1) {
               var element = Manager._popupItems.at(index);
               Manager._popupItems.at(index).position = element.strategy.getPosition(popup);
               Container.setPopupItems(Manager._popupItems);
            }
         }
      };

      Manager._popupItems = new List();

      Container.subscribe('closePopup', function (event, popup) {
         Manager.remove(popup);
      });

      Container.subscribe('recalcPosition', function (event, popup) {
         Manager._recalcPosition(popup);
      });

      return Manager;
   }
);