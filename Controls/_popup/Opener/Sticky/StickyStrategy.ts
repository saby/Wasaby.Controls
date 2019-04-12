/**
 * Created by as.krasilnikov on 21.03.2018.
 */
import TouchKeyboardHelper = require('Controls/Utils/TouchKeyboardHelper');
import cMerge = require('Core/core-merge');
   var INVERTING_CONST = {
      top: 'bottom',
      bottom: 'top',
      left: 'right',
      right: 'left',
      center: 'center'
   };

   var COORDINATE_MULTIPLIERS = {
      left: -1,
      right: 0,
      top: -1,
      bottom: 0,
      center: -1 / 2
   };

   var _private = {

      /**
       * Returns the target point relative to which the popup should be positioned
       * @param popupCfg Popup configuration
       * @param targetInfo Target data
       */
      getTargetPoint: function(popupCfg, targetInfo) {
         var offsetMultipliers = {
            top: 0,
            left: 0,
            center: 0.5,
            bottom: 1,
            right: 1
         };

         return {
            top: targetInfo.top + targetInfo.height * offsetMultipliers[popupCfg.corner.vertical],
            left: targetInfo.left + targetInfo.width * offsetMultipliers[popupCfg.corner.horizontal]
         };
      },

      /**
       * Invert the position of the popup. If the popup does not fit into the available area, you may need to invert it
       * @param popupCfg Popup configuration
       * @param direction Positioning direction: vertical or horizontal
       */
      invert: function(popupCfg, direction) {
         popupCfg.corner[direction] = INVERTING_CONST[popupCfg.corner[direction]];
         popupCfg.align[direction].side = INVERTING_CONST[popupCfg.align[direction].side];
         popupCfg.align[direction].offset *= -1;
         popupCfg.sizes.margins[direction === 'horizontal' ? 'left' : 'top'] *= -1;
      },

      /**
       * Returns the horizontal or the vertical coordinate for positioning the popup
       * @param targetPoint Target point relative to which the popup should be positioned
       * @param cfg Popup configuration
       * @param direction Positioning direction: vertical or horizontal
       */
      getCoordinate: function(targetPoint, cfg, direction) {
         var isHorizontalDirection = direction === 'horizontal';
         return targetPoint[isHorizontalDirection ? 'left' : 'top'] + cfg.align[direction].offset +
            cfg.sizes[isHorizontalDirection ? 'width' : 'height'] * COORDINATE_MULTIPLIERS[cfg.align[direction].side] +
            cfg.sizes.margins[isHorizontalDirection ? 'left' : 'top'];
      },

      /**
       * Check how much the popup does not fit on both sides of the transmitted coordinates and return the maximum value
       * @param coordinate Popup position coordinate
       * @param popupCfg Popup configuration
       * @param direction Positioning direction: vertical or horizontal
       * @param targetCoords Target position
       */
      getMaxOverflowValue: function(coordinate, popupCfg, direction, targetCoords) {
         return Math.max(
            popupCfg.sizes[direction === 'horizontal' ? 'width' : 'height'] -
            (this.getWindowSizes()[direction === 'horizontal' ? 'width' : 'height'] -
            (coordinate - targetCoords[direction === 'horizontal' ? 'leftScroll' : 'topScroll'])),
            targetCoords[direction === 'horizontal' ? 'leftScroll' : 'topScroll'] - coordinate
         );
      },

      getPositionCoordinates: function(popupCfg, targetCoords, targetPoint, direction) {
         var self = this,
            coordinate,
            maxOverflowValue,
            minOverflow,
            scroll,
            size;

         var checkOverflow = function(callback) {
            coordinate = self.getCoordinate(targetPoint, popupCfg, direction);
            maxOverflowValue = self.getMaxOverflowValue(coordinate, popupCfg, direction, targetCoords);

            // Check if the popup is outside the screen
            if (maxOverflowValue > 0) {
               if (popupCfg.fittingMode === 'fixed') {
                  // Reduce the size to fit the popup into the screen
                  size = popupCfg.sizes[direction === 'horizontal' ? 'width' : 'height'] - maxOverflowValue;
               } else if (popupCfg.fittingMode === 'overflow') {
                  // todo: переделать на новой схеме
                  coordinate -= maxOverflowValue;
                  if (coordinate < 0) {
                     size = popupCfg.sizes[direction === 'horizontal' ? 'width' : 'height'] + coordinate;
                     coordinate = 0;
                  }
               } else {
                  callback(maxOverflowValue);
               }
            }
         };

         // Check if the popup has enough space
         checkOverflow(function(firstOverflowValue) {
            // Let's try to invert the popup and check again
            self.invert(popupCfg, direction);
            targetPoint = self.getTargetPoint(popupCfg, targetCoords);

            checkOverflow(function(secondOverflowValue) {
               // display the popup in the direction where there was more space
               if (firstOverflowValue < secondOverflowValue) {
                  self.invert(popupCfg, direction);
                  targetPoint = self.getTargetPoint(popupCfg, targetCoords);
                  coordinate = self.getCoordinate(targetPoint, popupCfg, direction);
               }

               minOverflow = Math.min(firstOverflowValue, secondOverflowValue);

               scroll = targetCoords[direction === 'horizontal' ? 'leftScroll' : 'topScroll'];
               if (coordinate < scroll) {
                  coordinate = scroll;
               }

               size = popupCfg.sizes[direction === 'horizontal' ? 'width' : 'height'] - minOverflow;
            });
         });

         return {
            coordinate: coordinate,
            size: size
         };
      },

      getWindowSizes: function() {
         return {
            width: window.innerWidth,
            height: window.innerHeight - TouchKeyboardHelper.getKeyboardHeight()
         };
      },

      getMargins: function(popupCfg, direction) {
         return popupCfg.sizes.margins[direction === 'horizontal' ? 'left' : 'top'] + popupCfg.align[direction].offset;
      },

      getPosition: function(popupCfg, targetCoords, direction) {
         var position = {};
         var isHorizontal = direction === 'horizontal';
         if (popupCfg.align[direction].side === (isHorizontal ? 'left' : 'top')) {
            position[isHorizontal ? 'right' : 'bottom'] = _private.getWindowSizes()[isHorizontal ? 'width' : 'height'] -
               targetCoords[popupCfg.corner[direction]] - _private.getMargins(popupCfg, direction) + targetCoords[isHorizontal ? 'leftScroll' : 'topScroll'];
         } else {
            position[isHorizontal ? 'left' : 'top'] = targetCoords[popupCfg.corner[direction]] + _private.getMargins(popupCfg, direction);
         }
         return position;
      },

      checkOverflow: function(popupCfg, targetCoords, position, direction) {
         var isHorizontal = direction === 'horizontal';
         if (position.hasOwnProperty(isHorizontal ? 'right' : 'bottom')) {
            return popupCfg.sizes[isHorizontal ? 'width' : 'height'] - (targetCoords[popupCfg.corner[direction]] - targetCoords[isHorizontal ? 'leftScroll' : 'topScroll']);
         }
         return popupCfg.sizes[isHorizontal ? 'width' : 'height'] + _private.getMargins(popupCfg, direction) + targetCoords[popupCfg.corner[direction]] - _private.getWindowSizes()[isHorizontal ? 'width' : 'height'] - targetCoords[isHorizontal ? 'leftScroll' : 'topScroll'];
      },

      invertPosition: function(popupCfg, direction) {
         popupCfg.corner[direction] = INVERTING_CONST[popupCfg.corner[direction]];
         popupCfg.align[direction].side = INVERTING_CONST[popupCfg.align[direction].side];
         popupCfg.align[direction].offset *= -1;
         popupCfg.sizes.margins[direction === 'horizontal' ? 'left' : 'top'] *= -1;
      },

      moveContainer: function(popupCfg, position, sizeProperty, positionOverflow) {
         var positionProperty = Object.keys(position)[0];
         position[positionProperty] -= positionOverflow;
         if (position[positionProperty] < 0) {
            _private.restrictContainer(position, sizeProperty, popupCfg, -position[positionProperty]);
            position[positionProperty] = 0;
         }
      },

      calculateFixedModePosition: function(popupCfg, property, targetCoords, position, positionOverflow) {
         _private.restrictContainer(position, property, popupCfg, positionOverflow);
         _private.fixPosition(position, targetCoords);
         return position;
      },

      calculateOverflowModePosition: function(popupCfg, property, targetCoords, position, positionOverflow) {
         _private.moveContainer(popupCfg, position, property, positionOverflow);
         _private.fixPosition(position, targetCoords);
         return position;
      },

      calculatePosition: function(popupCfg, targetCoords, direction) {
         var property = direction === 'horizontal' ? 'width' : 'height';
         var position = _private.getPosition(popupCfg, targetCoords, direction);
         var positionOverflow = _private.checkOverflow(popupCfg, targetCoords, position, direction);
         if (positionOverflow > 0) {
            if (popupCfg.fittingMode === 'fixed') {
               return _private.calculateFixedModePosition(popupCfg, property, targetCoords, position, positionOverflow);
            }
            if (popupCfg.fittingMode === 'overflow') {
               return _private.calculateOverflowModePosition(popupCfg, property, targetCoords, position, positionOverflow);
            }
            _private.invertPosition(popupCfg, direction);

            var revertPosition = _private.getPosition(popupCfg, targetCoords, direction);
            var revertPositionOverflow = _private.checkOverflow(popupCfg, targetCoords, revertPosition, direction);
            if (revertPositionOverflow > 0) {
               if (positionOverflow < revertPositionOverflow) {
                  _private.invertPosition(popupCfg, direction);
                  _private.fixPosition(position, targetCoords);
                  _private.restrictContainer(position, property, popupCfg, positionOverflow);
                  return position;
               }
               _private.fixPosition(revertPosition, targetCoords);
               _private.restrictContainer(revertPosition, property, popupCfg, revertPositionOverflow);
               return revertPosition;
            }
            _private.fixPosition(revertPosition, targetCoords);
            return revertPosition;
         }
         _private.fixPosition(position, targetCoords);
         return position;
      },

      restrictContainer: function(position, property, popupCfg, overflow) {
         position[property] = popupCfg.sizes[property] - overflow;
      },

      fixPosition: function(position, targetCoords) {
         if (position.bottom) {
            position.bottom += TouchKeyboardHelper.getKeyboardHeight();

            // on newer versions of ios(12.1.3/12.1.4), in horizontal orientation sometimes(!) keyboard with the display
            // reduces screen height(as it should be). in this case, getKeyboardHeight returns height 0, and
            // additional offsets do not need to be considered. In other cases, it is necessary to take into account the height of the keyboard.
            position.bottom += _private.getTopScroll(targetCoords);
         }
      },

      getTopScroll: function(targetCoords) {
         // in portrait landscape sometimes(!) screen.availHeight < innerHeight =>
         // screen.availHeight / innerHeight < 2 incorrect. We expectation what availHeight > innerHeight always.
         if (window && (window.screen.availHeight / window.innerHeight < 2) && (window.screen.availHeight > window.innerHeight)) {
            return targetCoords.topScroll;
         }
         return 0;
      },

      setMaxSizes: function(popupCfg, position) {
         var windowSizes = _private.getWindowSizes();

         if (popupCfg.config.maxWidth) {
            position.maxWidth = Math.min(popupCfg.config.maxWidth, windowSizes.width);
         } else {
            position.maxWidth = windowSizes.width;
         }

         if (popupCfg.config.minWidth) {
            position.minWidth = popupCfg.config.minWidth;
         }

         if (popupCfg.config.maxHeight) {
            position.maxHeight = Math.min(popupCfg.config.maxHeight, windowSizes.height);
         } else {
            position.maxHeight = windowSizes.height;
         }

         if (popupCfg.config.minHeight) {
            position.minHeight = popupCfg.config.minHeight;
         }
      },

      getPositionCoordinatesFixed: function(popupCfg, targetCoords) {
         var position = {

            // position: 'fixed'
         };

         cMerge(position, _private.calculatePosition(popupCfg, targetCoords, 'horizontal'));
         cMerge(position, _private.calculatePosition(popupCfg, targetCoords, 'vertical'));
         _private.setMaxSizes(popupCfg, position);
         return position;
      }
   };

   export = {
      getPosition: function(popupCfg, targetCoords) {
         if (popupCfg.corner.vertical === 'center' || popupCfg.corner.horizontal === 'center') {
            var targetPoint = _private.getTargetPoint(popupCfg, targetCoords);
            var horizontalPosition = _private.getPositionCoordinates(popupCfg, targetCoords, targetPoint, 'horizontal');
            var verticalPosition = _private.getPositionCoordinates(popupCfg, targetCoords, targetPoint, 'vertical');
            var position = {
               left: horizontalPosition.coordinate,
               width: horizontalPosition.size || popupCfg.config.maxWidth,
               height: verticalPosition.size || popupCfg.config.maxHeight
            };
            position.top = verticalPosition.coordinate;

            return position;
         }
         return _private.getPositionCoordinatesFixed(popupCfg, targetCoords);
      },
      _private: _private
   };

