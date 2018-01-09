define('js!Controls/Popup/Opener/Dialog/Strategy',
   [
      'js!Controls/Popup/Opener/BaseStrategy',
      'Controls/Popup/Opener/PositioningHelpers'
   ],
   function (BaseStrategy, PositioningHelpers) {

      /**
       * Стратегия позиционирования окна.
       * @class Controls/Popup/Opener/Dialog/Strategy
       * @control
       * @public
       * @category Popup
       * @extends Controls/Control
       */
      var Strategy = BaseStrategy.extend({
         addElement: function (cfg, width, height) {
            cfg.position = PositioningHelpers.dialog(window.outerWidth, window.innerHeight, width, height);
         }
      });
      return new Strategy();
   }
);