define('js!WSControls/Windows/PopupManager',
   [
      'Core/Control',
      'Core/core-merge',
      'Core/helpers/random-helpers'
   ],
   function (Control, coreMerge, random) {
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
            options.zIndex = PopupManager._calculateZIndex();
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

         removeFromStack: function(){

         },

         _calculateZIndex: function(){
            // TODO правильно считать z-index
            PopupManager._currentZIndex += 10;
            return PopupManager.getCurrentZIndex();
         },

         getCurrentZIndex: function(){
            return PopupManager._currentZIndex;
         }
      };

      PopupManager.popupItems = [];
      PopupManager._popupStack = [];
      PopupManager._currentZIndex = 1000;

      require(['js!WSControls/Windows/PopupContainer/PopupContainer'], function(PopupContainer){
         PopupManager.popupContainer = Control.createControl(PopupContainer, {}, '#popup');
      });

      return PopupManager;
   }
);