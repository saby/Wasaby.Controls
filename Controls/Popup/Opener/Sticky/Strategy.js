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
         getPosition: function (cfg, width, height) {
            var
               target = cfg.popupOptions.target ? cfg.popupOptions.target : $('body'),
               targetCoords = TargetCoords.get(target, cfg.popupOptions.corner);
            cfg.position = {
               top: this._vertical(targetCoords, cfg.popupOptions.verticalAlign, height),
               left: this._horizontal(targetCoords, cfg.popupOptions.horizontalAlign, width)
            };
         },

         _horizontal: function (targetCoords, horizontalAlign, contWidth) {
            var left = targetCoords.left;
            if (horizontalAlign) {
               // сможем посчитать только на _afterMount, когда будут известны размеры контейнера
               var offsetLeft = targetCoords.left - (horizontalAlign.side === 'right' ? contWidth || 0 : 0 ) + (horizontalAlign.offset || 0);
               if (offsetLeft > 0) {
                  left = offsetLeft;
               }
            }
            return left;
         },

         _vertical: function (targetCoords, verticalAlign, contHeight) {
            var top = targetCoords.top;
            if (verticalAlign) {
               // сможем посчитать только на _afterMount, когда будут известны размеры контейнера
               var offsetTop = targetCoords.top - (verticalAlign.side === 'bottom' ? contHeight || 0 : 0) + (verticalAlign.offset || 0);
               if (offsetTop > 0) {
                  top = offsetTop;
               }
            }
            return top;
         }
      });

      return new Strategy();
   }
);