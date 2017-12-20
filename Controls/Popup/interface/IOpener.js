define('js!Controls/Popup/interface/IOpener',
   [],
   function() {
      /**
       * Интерфейс дейсвтия открытия окна
       * @control
       * @category Popup
       */
      return {
         /**
          * Выполнить
          * @function Controls/Popup/interface/IOpener#execute
          * @param config компонент, который будет показан в окне
          */
         open: function(config) {
            throw new Error('Method execute must be implemented');
         }
      };
   }
);