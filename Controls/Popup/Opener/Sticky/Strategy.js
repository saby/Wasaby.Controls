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
               targetCoords = TargetCoords.get(popup._options.target, popup._options.corner),
               position = {};
            // вертикальное выравнивание
            position.top = targetCoords.top;
            if( popup._options.verticalAlign ){
               // сможем посчитать только на _afterMount, когда будут известны размеры контейнера
               if( container && popup._options.verticalAlign.side === 'bottom'){
                  var offsetTop = position.top - container.height() + (popup._options.verticalAlign.offset || 0);
                  if( offsetTop > 0 ){
                     position.top = offsetTop;
                  }
               }
            }
            // горизонтальное выравнивание
            position.left = targetCoords.left;
            if( popup._options.horizontalAlign ){
               // сможем посчитать только на _afterMount, когда будут известны размеры контейнера
               if( container && popup._options.horizontalAlign.side === 'right'){
                  var offsetLeft = position.left - container.width() + (popup._options.horizontalAlign.offset || 0);
                  if( offsetLeft > 0 ){
                     position.left = offsetLeft;
                  }
               }
            }
            return position;
         }
      });

      return new Strategy();
   }
);