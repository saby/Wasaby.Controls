define('Controls/Popup/Opener/InfoBox/InfoBoxController',
   [
      'Controls/Popup/Opener/Sticky/StickyController',
      'Controls/Popup/Opener/InfoBox/resources/themeConstantsGetter',
      'Core/core-merge',
      'Controls/Popup/Manager/ManagerController',
      'css!Controls/Popup/Opener/InfoBox/InfoBox'
   ],
   function(StickyController, themeConstantsGetter, cMerge, ManagerController) {
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

         // Проверяет хватает ли ширины таргета для корректного позиционирования стрелки.
         // Возвращает offset на который нужно сдвинуть инфобокс.
         getOffset: function(targetSize, alignSide, arrowOffset, arrowWidth) {
            var align = INVERTED_SIDES[alignSide];

            /*
             * Проверяем, хватает ли нам ширины таргета для правильного позиционирования стрелки, если нет, то просто
             * сдвигаем стрелку инфобокса на центр таргета
             * */
            if (align !== 'center' && targetSize < arrowWidth + arrowOffset) {
               switch (align) {
                  case 'top':
                  case 'left':
                     return arrowWidth / 2 + arrowOffset - targetSize / 2;
                  case 'bottom':
                  case 'right':
                     return -arrowWidth / 2 + -arrowOffset + targetSize / 2;
               }
            }
            return 0;
         },

         // Возвращаем конфигурацию подготовленную для StickyStrategy
         prepareConfig: function(position, target) {
            var side = position[0];
            var alignSide = position[1];
            var topOrBottomSide = side === 't' || side === 'b';

            return {
               verticalAlign: {
                  side: topOrBottomSide ? SIDES[side] : INVERTED_SIDES[alignSide],
                  offset: topOrBottomSide
                     ? (side === 't' ? -constants.TARGET_OFFSET : constants.TARGET_OFFSET)
                     : this.getOffset(target.offsetHeight, alignSide, constants.ARROW_V_OFFSET, constants.ARROW_WIDTH)
               },

               horizontalAlign: {
                  side: topOrBottomSide ? INVERTED_SIDES[alignSide] : SIDES[side],
                  offset: topOrBottomSide
                     ? this.getOffset(target.offsetWidth, alignSide, constants.ARROW_H_OFFSET, constants.ARROW_WIDTH)
                     : (side === 'l' ? -constants.TARGET_OFFSET : constants.TARGET_OFFSET)
               },

               corner: {
                  vertical: topOrBottomSide ? SIDES[side] : SIDES[alignSide],
                  horizontal: topOrBottomSide ? SIDES[alignSide] : SIDES[side]
               }
            };
         }
      };

      /**
       * Стратегия позиционирования инфобокса
       * @class Controls/Popup/Opener/InfoBox/InfoBoxController
       * @control
       * @public
       * @category Popup
       */
      var InfoBoxController = StickyController.constructor.extend({
         _openedPopupId: null,

         elementCreated: function(cfg, container, id) {
            // Открыто может быть только одно окно
            if (this._openedPopupId) {
               ManagerController.remove(this._openedPopupId);
            }
            this._openedPopupId = id;

            return InfoBoxController.superclass.elementCreated.apply(this, arguments);
         },

         elementDestroyed: function(element, container, id) {
            if (id === this._openedPopupId) {
               this._openedPopupId = null;
            }

            return InfoBoxController.superclass.elementDestroyed.apply(this, arguments);
         },

         prepareConfig: function(cfg, sizes) {
            cMerge(cfg.popupOptions, _private.prepareConfig(cfg.popupOptions.position, cfg.popupOptions.target));
            return InfoBoxController.superclass.prepareConfig.apply(this, arguments);
         }
      });
      InfoBoxController.prototype._private = _private; //todo для тестов. нужно их подправить и выпилить это
      return new InfoBoxController();
   }
);
