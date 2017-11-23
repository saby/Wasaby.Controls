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
         constructor: function (cfg, target) {
            Strategy.superclass.constructor.apply(this, arguments);
            this._options = cfg;
            this._target = target;
         },

         getPosition: function (popup) {
            if( !this._target ){
               this._target = $('body');
            }
            var
               container = popup.getContainer(),
               targetCoords = TargetCoords.get(this._target, this._options.corner),
               position = {};
            // вертикальное выравнивание
            if( this._options.verticalAlign ){
               position.top = targetCoords.top;
               if(this._options.verticalAlign.side === 'bottom'){
                  var offsetTop = position.top - container.height();
                  if( offsetTop > 0 ){
                     position.top = offsetTop;
                  }
               }
               position.top += this._options.verticalAlign.offset || 0;
            }
            else{
               position.top = targetCoords.top;
            }
            // горизонтальное выравнивание
            if( this._options.horizontalAlign ){
               position.left = targetCoords.left;
               if(this._options.horizontalAlign.side === 'right'){
                  var offsetLeft = position.left - container.width();
                  if( offsetLeft > 0 ){
                     position.left = offsetLeft;
                  }
               }
               position.left += this._options.horizontalAlign.offset || 0;
            }
            else{
               position.left = targetCoords.left;
            }
            return position;
         }
      });

      return Strategy;
   }
);