define('js!WSControls/Windows/PopupManager',
   [
      'Core/Control',
      'Core/core-merge',
      'Core/helpers/random-helpers',
      'js!WSControls/Windows/PopupContainer/PopupContainer'
   ],
   function (Control, coreMerge, random, PopupContainer) {
      'use strict';

      /**
       * Менеджер окон
       * @class WSControls/Windows/PopupManager
       * @control
       * @public
       * @singleton
       */

      var PopupManager = {
         /**
          * Показать всплывающее окно
          * @function WSControls/Windows/PopupManager#show
          * @param options компонент, который будет показан в окне
          * @param opener компонент, который инициировал открытие окна
          * @param strategy стратегия позиционирования всплывающего окна
          */
         show: function (options, opener, strategy) {
            options = options || {};
            options.id = random.randomId();
            options.dialogOptions.strategy = strategy;
            PopupManager.popupItems.push(options);
            PopupManager.popupContainer.setPopupItems(PopupManager.popupItems);
         },

         remove: function(id){
            PopupManager.popupItems = PopupManager.popupItems.filter(function(element) {
               return element.id !== id;
            });
            PopupManager.popupContainer.setPopupItems(PopupManager.popupItems);
         },

         _addToStack: function(){

         },

         _removeFromStack: function(){

         },

         getCurrentZIndex: function(){
            return PopupManager._currentZIndex;
         }
      };

      PopupManager.popupItems = [];
      PopupManager._popupStack = [];
      PopupManager._currentZIndex = 1000;

      PopupManager.popupContainer = PopupContainer;
      PopupManager.popupContainer.subscribe('onClosePopup', function(event, popupId){
         PopupManager.remove(popupId);
      });

      return PopupManager;
   }
);