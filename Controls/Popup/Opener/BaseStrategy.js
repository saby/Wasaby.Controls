define('Controls/Popup/Opener/BaseStrategy',
   [
      'Core/core-extend',
      'Core/Deferred'
   ],
   function (CoreExtend, cDeferred) {
      /**
       * Базовая стратегия
       * @category Popup
       * @class Controls/Popup/Opener/BaseStrategy
       * @author Лощинин Дмитрий
       */
      var BaseStrategy = CoreExtend.extend({
         /**
          * Добавление нового элемента
          * @function Controls/Popup/Opener/BaseStrategy#elementCreated
          * @param element
          * @param width
          * @param height
          */
         elementCreated: function (element, width, height) {

         },

         /**
          * Обновление размеров элемента
          * @function Controls/Popup/Opener/BaseStrategy#elementUpdated
          * @param element
          * @param width
          * @param height
          */
         elementUpdated: function (element, width, height) {

         },

         /**
          * Удаление элемента
          * @function Controls/Popup/Opener/BaseStrategy#elementDestroyed
          * @param element
          */
         elementDestroyed: function (element) {
            return new cDeferred().callback();
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