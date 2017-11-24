define('js!Controls/Popup/Opener/Stack/Strategy',
   [
      'Core/Abstract',
      'js!Controls/Popup/interface/IStrategy'
   ],
   function (Abstract, IStrategy) {

      /**
       * Стратегия позиционирования окна.
       * @class Controls/Popup/Opener/Stack/Strategy
       * @mixes Controls/Popup/interface/IStrategy
       * @control
       * @public
       * @category Popup
       */
      var Strategy = Abstract.extend([IStrategy], {
         getPosition: function (popup) {
            return {
               top: 0,
               bottom: 0,
               right: 0
            };
         }
      });

      return new Strategy();
   }
);