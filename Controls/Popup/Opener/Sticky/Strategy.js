define('js!Controls/Popup/Opener/Sticky/Strategy',
   [
      'Core/Abstract',
      'js!Controls/Popup/interface/IStrategy',
      'js!Controls/Popup/TargetCoords'
   ],
   function (Abstract, IStrategy, TargetCoords) {

      /**
       * Стратегия позиционирования прилипающего диалога.
       * @class Controls/Popup/Opener/Sticky/Strategy
       * @mixes Controls/Popup/interface/IStrategy
       * @control
       * @public
       * @category Popup
       */
      var Strategy = Abstract.extend([IStrategy], {
         getPosition: function (popup){
            if( !popup._options.target ){
               popup._options.target = $('body');
            }
            var
               container = popup._container,
               position = {},
               targetCoords = TargetCoords.get(popup._options.target, popup._options.corner);
            // вертикальное выравнивание
            position.top = this._vertical(targetCoords, popup._options.verticalAlign, container && container.height());
            // горизонтальное выравнивание
            position.left = this._horizontal(targetCoords, popup._options.horizontalAlign, container && container.width());
            return position;
         },
         
         _horizontal: function(targetCoords, horizontalAlign, contWidth){
            var left = targetCoords.left;
            if ( horizontalAlign ){
               // сможем посчитать только на _afterMount, когда будут известны размеры контейнера
               var offsetLeft = targetCoords.left - (horizontalAlign.side === 'right' ? contWidth || 0 : 0 ) + (horizontalAlign.offset || 0);
               if( offsetLeft > 0 ){
                  left = offsetLeft;
               }
            }
            return left;
         },

         _vertical: function(targetCoords, verticalAlign, contHeight){
            var top = targetCoords.top;
            if ( verticalAlign ){
               // сможем посчитать только на _afterMount, когда будут известны размеры контейнера
               var offsetTop = targetCoords.top - (verticalAlign.side === 'bottom' ? contHeight || 0 : 0) + (verticalAlign.offset || 0);
               if( offsetTop > 0 ){
                  top = offsetTop;
               }
            }
            return top;
         }
      });

      return new Strategy();
   }
);