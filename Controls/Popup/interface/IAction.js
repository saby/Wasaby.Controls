define('js!Controls/Popup/interface/IAction',
   [],
   function() {
      /**
       * Интерфейс дейсвтия открытия окна
       * @mixes Controls/Popup/interface/IAction
       * @control
       * @category Popup
       */
      return {
         /**
          * Выполнить
          * @function Controls/Popup/interface/IAction#execute
          * @param options компонент, который будет показан в окне
          * @param opener компонент, который инициировал открытие окна
          */
         execute: function(options, opener) {
            throw new Error('Method execute must be implemented');
         }
      };
   }
);