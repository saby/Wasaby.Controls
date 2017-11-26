define('js!Controls/Popup/Opener/Dialog/Strategy',
   [
      'Core/Abstract',
      'js!Controls/Popup/interface/IStrategy'
   ],
   function (Abstract, IStrategy) {

      /**
       * Стратегия позиционирования окна.
       * @class Controls/Popup/Opener/Dialog/Strategy
       * @mixes Controls/Popup/interface/IStrategy
       * @control
       * @public
       * @category Popup
       */
      var Strategy = Abstract.extend([IStrategy], {

         getPosition: function (){
            return {
               top: 0,
               left: 0
            };
         }
      });

      return new Strategy();
   }
);