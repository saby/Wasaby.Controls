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
         getDefaultPosition: function () {
            return {
               top: -10000,
               left: - 10000
            }
         },

         removeElement: function(){

         }
      });
      return BaseStrategy;
   }
);