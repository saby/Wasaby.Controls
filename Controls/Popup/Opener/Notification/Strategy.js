define('js!Controls/Popup/Opener/Notification/Strategy',
   [
      'js!Controls/Popup/Opener/BaseStrategy'
   ],
   function (BaseStrategy) {

      /**
       * Стратегия позиционирования нотификационного окна.
       * @class Controls/Popup/Opener/Notification/Strategy
       * @control
       * @public
       * @category Popup
       * @extends Controls/Control
       */
      var Strategy = BaseStrategy.extend({
         getPosition: function () {
            return {
               right: 16,
               bottom: 16
            };
         }
      });

      return new Strategy();
   }
);