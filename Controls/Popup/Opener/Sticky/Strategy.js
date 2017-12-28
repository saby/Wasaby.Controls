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
         addElement: function (cfg, width, height) {
            var
               target = cfg.popupOptions.target ? cfg.popupOptions.target : $('body'),
               targetCoords = TargetCoords.get(target, cfg.popupOptions.corner);
            cfg.position = {
               top: this._vertical(targetCoords, cfg.popupOptions.verticalAlign, height),
               left: this._horizontal(targetCoords, cfg.popupOptions.horizontalAlign, width)
            };
         },

         _horizontal: function (targetCoords, horizontalAlign, contWidth) {
            var
               side = horizontalAlign ? (horizontalAlign.side || 'left') : 'left',
               offset = horizontalAlign ? (horizontalAlign.offset || 0) : 0,
               left = targetCoords.left - (side === 'right' ? contWidth || 0 : 0 ) + offset;
            if (( left + contWidth ) > window.outerWidth) {
               left -= contWidth;
               left += ( side === 'right' ? 1 : -1 ) * targetCoords.width;
            }
            if (left < 0) {
               left += contWidth;
               left += ( side === 'right' ? 1 : -1 ) * targetCoords.width;
            }
            return left;
         },

         _vertical: function (targetCoords, verticalAlign, contHeight) {
            var
               side = verticalAlign ? (verticalAlign.side || 'bottom') : 'bottom',
               offset = verticalAlign ? (verticalAlign.offset || 0) : 0,
               top = targetCoords.top - (side === 'top' ? contHeight || 0 : 0) + offset;
            if (( top + contHeight ) > window.outerHeight) {
               top -= contHeight;
               top += ( side === 'bottom' ? 1 : -1 ) * targetCoords.height;
            }
            if (top < 0) {
               top += contHeight;
               top += ( side === 'bottom' ? 1 : -1 ) * targetCoords.height;
            }
            return top;
         },

         _oppositeCorners: function () {

         }
      });

      return new Strategy();
   }
);