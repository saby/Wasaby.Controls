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
            if( !strategy || !CoreInstance.instanceOfMixin(strategy, 'Controls/Popup/interface/IStrategy') ){
               throw new Error('Strategy is not defined');
            }
            var element = {};
            element.id = Random.randomId();
            popupOptions.strategy = strategy;
            element.popupOptions = popupOptions;
            Manager._popupItems.add(element);
            Container.setPopupItems(Manager._popupItems);
         },
         /**
          * Вытолкнуть окно наверх
          * @function Controls/Popup/Manager#pushUp
          * @param popup инстанс попапа
          */
         pushUp: function(popup){
            if( popup.isStack() ){
               var
                  index = Manager._popupItems.getIndexByValue('id', popup.getId());
               if( index > -1 ){
                  Manager._popupItems.move(index, Manager._popupItems.getCount() - 1);
                  Container.setPopupItems(Manager._popupItems);
               }
            }
         },
         /**
          * Удалить окно
          * @function Controls/Popup/Manager#remove
          * @param popup инстанс попапа
          */
         remove: function(popup){
            var
               id = popup.getId(),
               index = Manager._popupItems.getIndexByValue('id', id);
            if( index > -1 ){
               Manager._popupItems.removeAt(index);
               Container.setPopupItems(Manager._popupItems);
            }
         }
      };

      Manager._popupItems = new List();
      Container.subscribe('onClosePopup', function(event, popup){
         Manager.remove(popup);
      });
      Container.subscribe('onFocusPopup', function(event, popup, focusIn){
         if( focusIn ){
            Manager.pushUp(popup);
         }
         else{
            if( popup._autoHide ){
               Manager.remove(popup);
            }
         }
      });

      return Manager;
   }
);