define('js!Controls/Popup/Opener/Sticky/Strategy',
   [
      'js!Controls/Popup/Opener/BaseStrategy',
      'js!Controls/Popup/TargetCoords'
   ],
   function (BaseStrategy, TargetCoords) {

      /**
       * Стратегия позиционирования прилипающего диалога.
       * @class Controls/Popup/Opener/Sticky/Strategy
       * @control
       * @public
       * @category Popup
       */
      var Strategy = BaseStrategy.extend({
         elementCreated: function (cfg, width, height) {
            var
               target = cfg.popupOptions.target ? cfg.popupOptions.target : document.body,
               tCoords = TargetCoords.get(target, cfg.popupOptions.corner),
               hAlign = cfg.popupOptions.horizontalAlign,
               vAlign = cfg.popupOptions.verticalAlign;
            cfg.position = this.getPosition(tCoords, hAlign, vAlign, width, height, window.outerWidth, window.outerHeight);
         },

         /**
          * Возвращает позицию плавающей панели
          * @function Controls/Popup/Opener/Sticky/Strategy#getPosition
          * @param targetCoords координаты таргета
          * @param hAlign горизонтальное выравнивание
          * @param vAlign вертикальное выравнивание
          * @param contWidth ширина плавающей панели
          * @param contHeight высота плавающей панели
          * @param wWidth ширина окна
          * @param wHeight высота окна
          */
         getPosition: function (targetCoords, hAlign, vAlign, contWidth, contHeight, wWidth, wHeight) {
            var
               hSide = hAlign ? (hAlign.side || 'left') : 'left',
               hOffset = hAlign ? (hAlign.offset || 0) : 0,
               left = targetCoords.left - (hSide === 'right' ? contWidth || 0 : 0 ) + hOffset;
            if (( left + contWidth ) > wWidth) {
               left -= contWidth;
            }
            if (left < 0) {
               left += contWidth;
            }

            var
               vSide = vAlign ? (vAlign.side || 'bottom') : 'bottom',
               vOffset = vAlign ? (vAlign.offset || 0) : 0,
               top = targetCoords.top - (vSide === 'top' ? contHeight || 0 : 0) + vOffset;
            if (( top + contHeight ) > wHeight) {
               top -= contHeight;
            }
            if (top < 0) {
               top += contHeight;
            }

            return {
               left: left,
               top: top
            };
         }
      });

      return new Strategy();
   }
);