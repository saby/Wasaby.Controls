define('js!Controls/Popup/interface/IStrategy',
   [],
   function () {
      /**
       * Интерфейс позиционирования окна.
       * @mixin Controls/Popup/interface/IStrategy
       * @public
       * @category Popup
       */
      return {
         /**
          * Вернуть информацию о позиционировании окна.
          * @function Controls/Popup/interface/IStrategy#getPosition
          */
         getPosition: function () {
            throw new Error('Method getPosition must be implemented');
         }
      };
   }
);