define('js!Controls/Popup/Opener/BaseStrategy',
   [
      'Core/core-extend'
   ],
   function (CoreExtend) {
      /**
       * Базовая стратегия
       * @category Popup
       * @class Controls/Popup/Opener/BaseStrategy
       * @author Лощинин Дмитрий
       */
      var BaseStrategy = CoreExtend.extend({
         /**
          * Добавление нового элемента
          * @function Controls/Popup/Opener/BaseStrategy#addElement
          * @param element
          * @param width
          * @param height
          */
         addElement: function (element, width, height) {

         },

         /**
          * Удаление элемента
          * @function Controls/Popup/Opener/BaseStrategy#removeElement
          * @param element
          */
         removeElement: function (element) {

         },

         /**
          * Возвращает позицию элемента по умолчанию
          * @function Controls/Popup/Opener/BaseStrategy#getDefaultPosition
          */
         getDefaultPosition: function () {
            return {
               top: -10000,
               left: -10000
            };
         }
      });
      return BaseStrategy;
   }
);