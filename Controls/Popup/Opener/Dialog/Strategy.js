define('js!Controls/Popup/Opener/Dialog/Strategy',
   [
      'js!Controls/Popup/Opener/BaseStrategy'
   ],
   function (BaseStrategy) {

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
            var
               top = (window.innerHeight - height) / 2,
               left = (window.outerWidth - width) / 2;
            cfg.position.left = Math.round(left);
            cfg.position.top = Math.round(top);
         }
      });
      return new Strategy();
   }
);