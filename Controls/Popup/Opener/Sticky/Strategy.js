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
               corner = cfg.popupOptions.corner || {'vertical': 'top', 'horizontal': 'left'},
               tCoords = TargetCoords.get(target, corner),
               hAlign = cfg.popupOptions.horizontalAlign,
               vAlign = cfg.popupOptions.verticalAlign;
            cfg.position = this.getPosition(tCoords, corner, hAlign, vAlign, width, height, window.innerWidth, window.innerHeight);
         },

         /**
          * Возвращает позицию плавающей панели
          * @function Controls/Popup/Opener/Sticky/Strategy#getPosition
          * @param targetCoords координаты таргета
          * @param corner угол таргета, от которого открывается popup
          * @param hAlign горизонтальное выравнивание
          * @param vAlign вертикальное выравнивание
          * @param contWidth ширина плавающей панели
          * @param contHeight высота плавающей панели
          * @param wWidth ширина окна
          * @param wHeight высота окна
          */
         getPosition: function (targetCoords, corner, hAlign, vAlign, contWidth, contHeight, wWidth, wHeight) {
            // расчет горизонтальной координаты
            var
               hSide = hAlign ? (hAlign.side || 'left') : 'left',
               hOffset = hAlign ? (hAlign.offset || 0) : 0,
               left = targetCoords.left - (hSide === 'right' ? contWidth || 0 : 0 ) + hOffset;
            // если попап не умещается в видимую область экрана, направление выпадания нужно изменить
            // на противоположное, а угол от которого открывать попап заменить на противоположный
            if (( left + contWidth ) > wWidth) {
               left -= (corner.horizontal === 'right' ? 1 : -1) * targetCoords.width + contWidth;
            }
            if (left < 0) {
               left += (corner.horizontal === 'right' ? -1 : 1) * targetCoords.width + contWidth;
            }

            // расчет вертикальной координаты
            var
               vSide = vAlign ? (vAlign.side || 'bottom') : 'bottom',
               vOffset = vAlign ? (vAlign.offset || 0) : 0,
               top = targetCoords.top - (vSide === 'top' ? contHeight || 0 : 0) + vOffset;
            // если попап не умещается в видимую область экрана, направление выпадания нужно изменить
            // на противоположное, а угол от которого открывать попап заменить на противоположный
            if (( top + contHeight ) > wHeight) {
               top -= (corner.vertical === 'bottom' ? 1 : -1) * targetCoords.height + contHeight;
            }
            if (top < 0) {
               top += (corner.vertical === 'bottom' ? -1 : 1) * targetCoords.height + contHeight;
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