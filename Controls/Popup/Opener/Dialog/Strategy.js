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
         constructor: function (cfg) {
            Strategy.superclass.constructor.apply(this, arguments);
            this._options = cfg;
         },

         getPosition: function (popup) {
            var
               container = popup.getContainer(),
               popupWidth = container.width(),
               popupHeight = container.height(),
               windowWidth = window.outerWidth,
               windowHeight = window.innerHeight,
               position = {
                  top: (windowHeight - popupHeight) / 2,
                  left: (windowWidth - popupWidth) / 2
               };

            position.left = Math.round(position.left);
            position.top = Math.round(position.top);
            return position;
         }
      });

      return Strategy;
   }
);