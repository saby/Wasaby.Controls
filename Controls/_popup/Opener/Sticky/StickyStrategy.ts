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

   var _private = {
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
         if (popupCfg.align[direction].side === 'center') {
            position[isHorizontal ? 'left' : 'top'] = targetCoords[isHorizontal ? 'left' : 'top'] + targetCoords[isHorizontal ? 'width' : 'height'] / 2 - popupCfg.sizes[isHorizontal ? 'width' : 'height'] / 2 + _private.getMargins(popupCfg, direction) ;
         } else {
            if (popupCfg.align[direction].side === (isHorizontal ? 'left' : 'top')) {
               position[isHorizontal ? 'right' : 'bottom'] = _private.getWindowSizes()[isHorizontal ? 'width' : 'height'] -
                   targetCoords[popupCfg.corner[direction]] - _private.getMargins(popupCfg, direction) + targetCoords[isHorizontal ? 'leftScroll' : 'topScroll'];
            } else {
               position[isHorizontal ? 'left' : 'top'] = targetCoords[popupCfg.corner[direction]] + _private.getMargins(popupCfg, direction);
            }
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
      }
   };

   export = {
      getPosition: function(popupCfg, targetCoords) {
         var position = {

            // position: 'fixed'
         };

         cMerge(position, _private.calculatePosition(popupCfg, targetCoords, 'horizontal'));
         cMerge(position, _private.calculatePosition(popupCfg, targetCoords, 'vertical'));
         _private.setMaxSizes(popupCfg, position);
         return position;
      },
      _private: _private
   };

