/**
 * Created by as.krasilnikov on 21.03.2018.
 */
define('Controls/Popup/Opener/Sticky/StickyStrategy', ['Controls/Utils/TouchKeyboardHelper'], function(TouchKeyboardHelper) {
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
               if (popupCfg.locationStrategy === 'fixed') {
                  // Reduce the size to fit the popup into the screen
                  size = popupCfg.sizes[direction === 'horizontal' ? 'width' : 'height'] - maxOverflowValue;
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

         // https://online.sbis.ru/opendoc.html?guid=9a71628a-26ae-4527-a52b-2ebf146b4ecd
         if (popupCfg.revertPositionStyle) {
            // When positioning from the top of the target we consider' bottom ' coordinates
            if (direction === 'vertical' && popupCfg.align.vertical.side === 'top') {
               coordinate = this.getWindowSizes().height - Math.max(0, coordinate) - (size || popupCfg.sizes.height);
            }
         }

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
      }
   };

   return {
      getPosition: function(popupCfg, targetCoords) {
         var targetPoint = _private.getTargetPoint(popupCfg, targetCoords);
         var horizontalPosition = _private.getPositionCoordinates(popupCfg, targetCoords, targetPoint, 'horizontal');
         var verticalPosition = _private.getPositionCoordinates(popupCfg, targetCoords, targetPoint, 'vertical');
         var position = {
            left: horizontalPosition.coordinate,
            width: horizontalPosition.size || popupCfg.config.maxWidth,
            height: verticalPosition.size || popupCfg.config.maxHeight
         };

         // When positioning from the top of the target we consider' bottom ' coordinates
         if (popupCfg.revertPositionStyle && popupCfg.align.vertical.side === 'top') {
            position.bottom = verticalPosition.coordinate;
         } else {
            position.top = verticalPosition.coordinate;
         }

         return position;
      },
      _private: _private
   };
});
