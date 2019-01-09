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

      /*
       * Возвращает точку таргета, относительно которой нужно спозиционироваться окну
       * */
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

      /*
       * Инвертировать положение окна
       * В случае если окно не влезает в доступную область, может потребоваться его инвертировать
       * */
      invert: function(cfg, direction) {
         cfg.corner[direction] = INVERTING_CONST[cfg.corner[direction]];
         cfg.align[direction].side = INVERTING_CONST[cfg.align[direction].side];
         cfg.align[direction].offset *= -1;
         cfg.sizes.margins[direction === 'horizontal' ? 'left' : 'top'] *= -1;
      },

      /*
       * Получить горизонтальную или вертикальную координату позиционирования окна
       * */
      getCoordinate: function(targetPoint, cfg, direction) {
         var isHorizontalDirection = direction === 'horizontal';
         return targetPoint[isHorizontalDirection ? 'left' : 'top'] + cfg.align[direction].offset +
            cfg.sizes[isHorizontalDirection ? 'width' : 'height'] * COORDINATE_MULTIPLIERS[cfg.align[direction].side] +
            cfg.sizes.margins[isHorizontalDirection ? 'left' : 'top'];
      },

      /*
       * Проверить насколько не влезает окно с обеих сторон относительно переданной координаты и вернуть максимальное значение
       * */
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

         // Проверим, возможно окну достаточно места
         checkOverflow(function(firstOverflowValue) {
            // Попробуем инвертировать окно и проверим снова
            self.invert(popupCfg, direction);
            targetPoint = self.getTargetPoint(popupCfg, targetCoords);

            checkOverflow(function(secondOverflowValue) {
               // Если и на этот раз окно не поместилось, отобразим окно в ту сторону, где места было больше
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
      _private: _private // для тестов
   };
});
