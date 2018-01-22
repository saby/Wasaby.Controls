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
         elementCreated: function (cfg, width, height) {
            cfg.position = this.getPosition(window.innerWidth, window.innerHeight, width, height);
         },

         elementUpdated: function (cfg, width, height) {
            this.elementCreated(cfg, width, height);
         },

         /**
          * Возвращает позицию диалогового окна
          * @function Controls/Popup/Opener/Dialog/Strategy#getPosition
          * @param wWidth ширина окна браузера
          * @param wHeight высота окна браузера
          * @param cWidth ширина диалогового окна
          * @param cHeight высота диалогового окна
          */
         getPosition: function (wWidth, wHeight, cWidth, cHeight) {
            return {
               left: Math.round((wWidth - cWidth) / 2),
               top: Math.round((wHeight - cHeight) / 2)
            };
         }
      });
      return new Strategy();
   }
);