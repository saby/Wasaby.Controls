define('js!Controls/Popup/Manager',
   [
      'Core/Control',
      'Core/core-merge',
      'Core/helpers/random-helpers',
      'js!Controls/Popup/Manager/Container'
   ],

   function (Control, coreMerge, random, Container) {
      'use strict';
      /**
       * Менеджер окон
       * @class Controls/Popup/Manager
       * @control
       * @public
       * @category Popup
       * @singleton
       */
      var Manager = {
         /**
          * Показать всплывающее окно
          * @function Controls/Popup/Manager#show
          * @param popupOptions компонент, который будет показан в окне
          * @param opener компонент, который инициировал открытие окна
          * @param strategy стратегия позиционирования всплывающего окна
          */
         show: function (popupOptions, opener, strategy) {
            var cfg = {};
            cfg.id = random.randomId();
            popupOptions.strategy = strategy;
            cfg.popupOptions = popupOptions;
            Manager.popupItems.push(cfg);
            Manager.popupContainer.setPopupItems(Manager.popupItems);
         },

         remove: function(id){
            Manager.popupItems = Manager.popupItems.filter(function(element) {
               return element.id !== id;
            });
            Manager.popupContainer.setPopupItems(Manager.popupItems);
         },

         _addToStack: function(){

         },

         _removeFromStack: function(){

         },

         getCurrentZIndex: function(){
            return Manager._currentZIndex;
         }
      };

      Manager.popupItems = [];
      Manager._popupStack = [];
      Manager._currentZIndex = 1000;

      Manager.popupContainer = Container;
      Manager.popupContainer.subscribe('onClosePopup', function(event, popupId){
         Manager.remove(popupId);
      });

      return Manager;
   }
);