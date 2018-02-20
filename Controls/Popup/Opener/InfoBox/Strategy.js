define('Controls/Popup/Opener/InfoBox/Strategy',
   [
      'Controls/Popup/Opener/BaseStrategy',
      'Core/core-merge',
      'Controls/Popup/Opener/Sticky/Strategy',
      'Controls/Popup/Opener/InfoBox/resources/themeConstantsGetter',
      'Controls/Popup/Manager'
   ],
   function (BaseStrategy, cMerge, StickyStrategy, themeConstantsGetter, Manager) {

      // Получание констант из темы. Эксперементальный способ
      var constants = themeConstantsGetter('controls-InfoBox__themeConstants', {
         ARROW_WIDTH: 'marginLeft',
         ARROW_H_OFFSET: 'marginRight',
         ARROW_V_OFFSET: 'marginBottom',
         TARGET_OFFSET: 'marginTop'
      });

      var SIDES = {
         't': 'top',
         'r': 'right',
         'b': 'bottom',
         'l': 'left',
         'c': 'center'
      };

      var INVERTED_SIDES = {
         't': 'bottom',
         'r': 'left',
         'b': 'top',
         'l': 'right',
         'c': 'center'
      };

      var _private = {

         getStickyParams: function(position, target){
            var side = position[0];
            var alignSide = position[1];
            var topOrBottomSide = side === 't' || side === 'b';

            return {
               verticalAlign: {
                  side: topOrBottomSide ? SIDES[side] : INVERTED_SIDES[alignSide],
                  offset: topOrBottomSide ?
                     (side === 't' ? -constants.TARGET_OFFSET : constants.TARGET_OFFSET) :
                     _private.getVerticalOffset(target, alignSide)
               },

               horizontalAlign: {
                  side: topOrBottomSide ? INVERTED_SIDES[alignSide] : SIDES[side],
                  offset: topOrBottomSide ?
                     _private.getHorizontalOffset(target, alignSide) :
                     (side === 'l' ? -constants.TARGET_OFFSET : constants.TARGET_OFFSET)
               },

               corner: {
                  vertical: topOrBottomSide ? SIDES[side] : SIDES[alignSide],
                  horizontal: topOrBottomSide ? SIDES[alignSide] : SIDES[side]
               }
            }
         },

         getOffset: function(targetSize, alignSide, arrowOffset, arrowWidth){
            var align = INVERTED_SIDES[alignSide];

            /*
             * Проверяем, хватает ли нам ширины таргета для правильного позиционирования стрелки, если нет, то просто
             * сдвигаем стрелку инфобокса на центр таргета
             * */
            if(align !== 'center' && targetSize < arrowWidth + arrowOffset){
               switch(align){
                  case 'top':
                  case 'left':
                     return arrowWidth/2 + arrowOffset - targetSize/2;
                  case 'bottom':
                  case 'right':
                     return -arrowWidth/2 + -arrowOffset + targetSize/2;
               }
            }

            return 0;
         },

         getVerticalOffset: function(target, alignSide){
            return _private.getOffset(target.offsetHeight, alignSide,
               constants.ARROW_V_OFFSET, constants.ARROW_WIDTH)
         },

         getHorizontalOffset: function(target, alignSide){
            return _private.getOffset(target.offsetWidth, alignSide,
               constants.ARROW_H_OFFSET, constants.ARROW_WIDTH)
         }

      };

      /**
       * Стратегия позиционирования инфобокса
       * //TODO На половину стратегия, на половину контроллер
       * @class Controls/Popup/Opener/InfoBox/Strategy
       * @control
       * @public
       * @category Popup
       */
      var Strategy = BaseStrategy.extend({

         _openedInfoBoxId: null,

         elementCreated: function (cfg, width, height, id) {

            // Открыто может быть только одно окно. Логика контроллера!
            if (this._openedInfoBoxId) {
               Manager.remove(this._openedInfoBoxId);
            }
            this._openedInfoBoxId = id;

            this.modifyCfg(cfg, width, height);
         },

         elementUpdated: function (cfg, width, height) {
            this.modifyCfg(cfg, width, height);
         },

         elementDestroyed: function(element, container, id){
            if (id === this._openedInfoBoxId){
               this._openedInfoBoxId = null;
            }
            return Strategy.superclass.elementDestroyed.apply(this, arguments);
         },

         modifyCfg: function(cfg, width, height){
            cMerge(cfg.popupOptions, _private.getStickyParams(cfg.popupOptions.position, cfg.popupOptions.target));
            StickyStrategy.elementCreated(cfg, width, height);
         }

      });

      Strategy._private = _private;

      return new Strategy();
   }
);