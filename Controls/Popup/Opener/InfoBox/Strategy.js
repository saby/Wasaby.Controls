define('Controls/Popup/Opener/InfoBox/Strategy',
   [
      'Controls/Popup/Opener/Sticky/Strategy',
      'Core/core-merge',
      'Controls/Popup/Opener/InfoBox/resources/themeConstantsGetter',
      'Controls/Popup/Manager'
   ],
   function (StickyStrategy, cMerge, themeConstantsGetter, Manager) {

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

         // Возвращаем конфигурацию подготовленную для stickyStrategy
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

         // Проверяет хватает ли ширины таргета для корректного позиционирования стрелки.
         // Возвращает offset на который нужно сдвинуть инфобокс.
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

         // Возвращает вертикальный offset с учетом ширины таргета
         getVerticalOffset: function(target, alignSide){
            return _private.getOffset(target.offsetHeight, alignSide, constants.ARROW_V_OFFSET, constants.ARROW_WIDTH);
         },

         // Возвращает горизонтальный offset с учетом ширины таргета
         getHorizontalOffset: function(target, alignSide){
            return _private.getOffset(target.offsetWidth, alignSide, constants.ARROW_H_OFFSET, constants.ARROW_WIDTH);
         }

      };

      /**
       * Стратегия позиционирования инфобокса
       * TODO На половину стратегия, на половину контроллер
       * @class Controls/Popup/Opener/InfoBox/Strategy
       * @control
       * @public
       * @category Popup
       */
      var Strategy = StickyStrategy.constructor.extend({

         _openedPopupId: null,

         elementCreated: function (cfg, width, height, id) {

            // Открыто может быть только одно окно. Логика контроллера!
            if (this._openedPopupId) {
               Manager.remove(this._openedPopupId);
            }
            this._openedPopupId = id;

            return Strategy.superclass.elementCreated.apply(this, arguments);
         },

         elementDestroyed: function(element, container, id){
            if (id === this._openedPopupId){
               this._openedPopupId = null;
            }

            return Strategy.superclass.elementDestroyed.apply(this, arguments);
         },

         modifyCfg: function(cfg, width, height){
            cMerge(cfg.popupOptions, _private.getStickyParams(cfg.popupOptions.position, cfg.popupOptions.target));

            return Strategy.superclass.modifyCfg.apply(this, arguments);
         }

      });

      Strategy._private = _private;

      return new Strategy();
   }
);