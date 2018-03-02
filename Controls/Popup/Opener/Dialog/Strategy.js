define('Controls/Popup/Opener/Dialog/Strategy',
   [
      'Controls/Popup/Opener/BaseStrategy'
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
         elementCreated: function (cfg, sizes) {
            cfg.position = this.getPosition(window.innerWidth, window.innerHeight, sizes);
         },

         elementUpdated: function (cfg, sizes) {
            this.elementCreated(cfg, sizes);
         },

         /**
          * Возвращает позицию диалогового окна
          * @function Controls/Popup/Opener/Dialog/Strategy#getPosition
          * @param wWidth ширина окна браузера
          * @param wHeight высота окна браузера
          * @param sizes размеры диалогового окна
          */
         getPosition: function (wWidth, wHeight, sizes) {
            return {
               left: Math.round((wWidth - sizes.width) / 2),
               top: Math.round((wHeight - sizes.height) / 2)
            };
         }
      });
      return new Strategy();
   }
);