define('Controls/Popup/Opener/Sticky/Strategy',
   [
      'Controls/Popup/Opener/BaseStrategy',
      'Controls/Popup/TargetCoords'
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
               corner = cfg.popupOptions.corner || {
                     'vertical': 'top',
                     'horizontal': 'left'
                  },
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
               width,
               hSide = hAlign ? (hAlign.side || 'right') : 'right',
               hOffset = hAlign ? (hAlign.offset || 0) : 0,
               indentLeft = targetCoords.left,
               indentRight = wWidth - indentLeft,
               left = targetCoords.left + hOffset;
            // если попап не умещается в видимую область экрана, направление выпадания нужно изменить
            // на противоположное, а угол от которого открывать попап заменить на противоположный
            if (hSide === 'left') {
               if (left - contWidth >= 0) {
                  left -= contWidth;
               }
               else{
                  if (( left + (corner.horizontal === 'right' ? -1 : 1) * targetCoords.width + contWidth ) <= wWidth) {
                     left += (corner.horizontal === 'right' ? -1 : 1) * targetCoords.width;
                  }
                  else {
                     left = indentLeft > indentRight ? 0 : left;
                     width = Math.max(indentLeft, indentRight);
                  }
               }
            }
            else{
               if (( left + contWidth ) > wWidth) {
                  if (left - ((corner.horizontal === 'right' ? 1 : -1) * targetCoords.width + contWidth) >= 0) {
                     left -= ((corner.horizontal === 'right' ? 1 : -1) * targetCoords.width + contWidth);
                  }
                  else {
                     left = indentLeft > indentRight ? 0 : left;
                     width = Math.max(indentLeft, indentRight);
                  }
               }
            }

            // расчет вертикальной координаты
            var
               height,
               vSide = vAlign ? (vAlign.side || 'bottom') : 'bottom',
               vOffset = vAlign ? (vAlign.offset || 0) : 0,
               indentTop = targetCoords.top,
               indentBottom = wHeight - targetCoords.top,
               top = targetCoords.top + vOffset;
            // если попап не умещается в видимую область экрана, направление выпадания нужно изменить
            // на противоположное, а угол от которого открывать попап заменить на противоположный
            if (vSide === 'top') {
               if (top - contHeight >= 0) {
                  top -= contHeight;
               }
               else{
                  if (( top + (corner.vertical === 'bottom' ? -1 : 1) * targetCoords.height + contHeight ) <= wHeight) {
                     top += (corner.vertical === 'bottom' ? -1 : 1) * targetCoords.height;
                  }
                  else {
                     top = indentTop > indentBottom ? 0 : top;
                     height = Math.max(indentTop, indentBottom);
                  }
               }
            }
            else{
               if (( top + contHeight ) > wHeight) {
                  if (top - ((corner.vertical === 'bottom' ? 1 : -1) * targetCoords.height + contHeight) >= 0) {
                     top -= (corner.vertical === 'bottom' ? 1 : -1) * targetCoords.height + contHeight;
                  }
                  else {
                     top = indentTop > indentBottom ? 0 : top;
                     height = Math.max(indentTop, indentBottom);
                  }
               }
            }

            return {
               left: left,
               top: top,
               width: width,
               height: height
            };
         }
      });

      return new Strategy();
   }
);