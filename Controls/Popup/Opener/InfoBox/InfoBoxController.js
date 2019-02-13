define('Controls/Popup/Opener/InfoBox/InfoBoxController',
   [
      'Core/Deferred',
      'Controls/Popup/Opener/Sticky/StickyController',
      'Controls/Popup/Opener/InfoBox/resources/themeConstantsGetter',
      'Core/core-merge',
      'Controls/Popup/Manager/ManagerController',

      'css!theme?Controls/Popup/Opener/InfoBox/InfoBox',
      'css!theme?Controls/Popup/Opener/Previewer/PreviewerController'
   ],
   function(Deferred, StickyController, themeConstantsGetter, cMerge, ManagerController) {
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

         // Checks if the target width is enough for the correct positioning of the arrow.
         // Returns offset to which you want to move the popup.
         getOffset: function(targetSize, alignSide, arrowOffset, arrowWidth) {
            var align = INVERTED_SIDES[alignSide];

            // Check if we have enough width of the target for the correct positioning of the arrow, if not, just
            // move the popup arrow to the center of the target
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

         // Return the configuration prepared for StickyStrategy
         prepareConfig: function(position, target) {
            var side = position[0];
            var alignSide = position[1];
            var topOrBottomSide = side === 't' || side === 'b';

            return {
               verticalAlign: {
                  side: topOrBottomSide ? SIDES[side] : INVERTED_SIDES[alignSide],
                  offset: _private.getVerticalOffset(target, topOrBottomSide, side, alignSide)
               },

               horizontalAlign: {
                  side: topOrBottomSide ? INVERTED_SIDES[alignSide] : SIDES[side],
                  offset: _private.getHorizontalOffset(target, topOrBottomSide, side, alignSide)
               },

               corner: {
                  vertical: topOrBottomSide ? SIDES[side] : SIDES[alignSide],
                  horizontal: topOrBottomSide ? SIDES[alignSide] : SIDES[side]
               }
            };
         },

         getVerticalOffset: function(target, topOrBottomSide, side, alignSide) {
            if (topOrBottomSide) {
               return side === 't' ? -constants.TARGET_OFFSET : constants.TARGET_OFFSET;
            }

            // svg hasn't offsetHeight property
            var targetHeight = target.offsetHeight || target.clientHeight;
            return _private.getOffset(targetHeight, alignSide, constants.ARROW_V_OFFSET, constants.ARROW_WIDTH);
         },

         getHorizontalOffset: function(target, topOrBottomSide, side, alignSide) {
            if (topOrBottomSide) {
               // svg hasn't offsetWidth property
               var targetWidth = target.offsetWidth || target.clientWidth;
               return _private.getOffset(targetWidth, alignSide, constants.ARROW_H_OFFSET, constants.ARROW_WIDTH);
            }
            return side === 'l' ? -constants.TARGET_OFFSET : constants.TARGET_OFFSET;
         }
      };

      /**
       * InfoBox Popup Controller
       * @class Controls/Popup/Opener/InfoBox/InfoBoxController
       * @control
       * @private
       * @category Popup
       */
      var InfoBoxController = StickyController.constructor.extend({
         _openedPopupId: null,

         _destroyDeferred: {},

         elementCreated: function(cfg, container, id) {
            // Only one popup can be opened
            if (this._openedPopupId) {
               ManagerController.remove(this._openedPopupId);
            }
            this._openedPopupId = id;

            return InfoBoxController.superclass.elementCreated.apply(this, arguments);
         },

         elementUpdated: function() {
            // Hide popup then page scroll or resize
            ManagerController.remove(this._openedPopupId);
         },

         popupResize: function(element, container) {
            InfoBoxController.superclass.elementUpdated.call(this, element, container);
         },

         elementDestroyed: function(item) {
            if (item.id === this._openedPopupId) {
               this._openedPopupId = null;
            }

            this._destroyDeferred[item.id] = new Deferred();

            item.popupOptions.className += ' controls-PreviewerController_close';

            return this._destroyDeferred[item.id];
         },

         elementAnimated: function(item) {
            if (this._destroyDeferred[item.id]) {
               this._destroyDeferred[item.id].callback();
               delete this._destroyDeferred[item.id];
            }
         },

         prepareConfig: function(cfg, sizes) {
            cMerge(cfg.popupOptions, _private.prepareConfig(cfg.popupOptions.position, cfg.popupOptions.target));
            return InfoBoxController.superclass.prepareConfig.apply(this, arguments);
         }
      });
      InfoBoxController.prototype._private = _private;
      return new InfoBoxController();
   });
