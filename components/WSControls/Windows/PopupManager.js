define('js!WSControls/Windows/PopupManager',
   [
      'Core/Control',
      'js!WSControls/Windows/PopupContainer/PopupContainer',
      'WS.Data/Collection/List',
      'Core/core-merge',
      'Core/helpers/random-helpers'
   ],
   function (Control, PopupContainer, List, coreMerge, random) {
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
            coreMerge(options, strategy.getPosition());
            options.id = random.randomId();
            options.zIndex = PopupManager._calculateZIndex();
            PopupManager.popupItems.push(options);
            PopupManager.apply();
         },

         remove: function(id){
            PopupManager.popupItems = PopupManager.popupItems.filter(function(element) {
               return element.id !== id;
            });
            PopupManager.apply();
         },

         apply: function(){
            PopupManager.popupContainer.setPopupItems(PopupManager.popupItems);
         },

         _calculateZIndex: function(){
            PopupManager._currentZIndex += 10;
            return PopupManager.getCurrentZIndex();
         },

         getCurrentZIndex: function(){
            return PopupManager._currentZIndex;
         }
      };

      PopupManager.popupItems = [];
      PopupManager.popupContainer = Control.createControl(PopupContainer, {}, '#popup');
      PopupManager._popupStack = new List();
      PopupManager._currentZIndex = 1000;

      return PopupManager;
   }
);