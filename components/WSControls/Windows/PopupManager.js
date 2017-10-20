define('js!WSControls/Windows/PopupManager',
   [
      'Core/Control',
      'js!WSControls/Windows/PopupContainer/PopupContainer',
      'WS.Data/Collection/List',
      'Core/core-merge',
      'Core/CommandDispatcher'
   ],
   function (Control, PopupContainer, List, coreMerge, CommandDispatcher) {
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
            options.zIndex = PopupManager.calculateZIndex();
            PopupManager.popupItems.add(options);
            PopupManager.popupContainer.setPopupItems(PopupManager.popupItems);
         },

         removePopup: function(index){
            index = index || (PopupManager.popupItems.getCount() - 1);
            if( PopupManager.popupItems.getCount() ) {
               PopupManager._currentZIndex -= 10;
               PopupManager.popupItems.removeAt(index);
               PopupManager.popupContainer.setPopupItems(PopupManager.popupItems);
            }
         },

         calculateZIndex: function(){
            PopupManager._currentZIndex += 10;
            return PopupManager._currentZIndex;
         },

         getCurrentZIndex: function(){
            return PopupManager._currentZIndex;
         },

         close: function(){
            PopupManager.removePopup();
         }
      };

      PopupManager._currentZIndex = 1000;
      PopupManager.popupItems = new List();
      PopupManager._popupStack = new List();
      PopupManager.popupContainer = Control.createControl(PopupContainer, {}, '#popup');
      CommandDispatcher.declareCommand(PopupManager.popupContainer, 'close', PopupManager.close);

      return PopupManager;
   }
);