define('js!Controls/Popup/Opener/Notification/Strategy',
   [
      'js!Controls/Popup/Opener/BaseStrategy',
      'Controls/Popup/Opener/PositioningHelpers'
   ],
   function (BaseStrategy, PositioningHelpers) {

      /**
       * Стратегия позиционирования нотификационного окна.
       * @class Controls/Popup/Opener/Notification/Strategy
       * @control
       * @public
       * @category Popup
       * @extends Controls/Control
       */
      var Strategy = BaseStrategy.extend({
         addElement: function (cfg) {
            cfg.position = PositioningHelpers.notification();
         }
      });

      return new Strategy();
   }
);