define('js!Controls/Popup/Opener/Sticky/Strategy',
   [
      'js!Controls/Popup/Opener/BaseStrategy',
      'Core/core-merge',
      'js!Controls/Popup/TargetCoords'
   ],
   function (BaseStrategy, cMerge, TargetCoords) {

      var DEFAULT_OPTIONS = {
         horizontalAlign: {
            side: 'right',
            offset: 0
         },
         verticalAlign: {
            side: 'bottom',
            offset: 0
         },
         corner: {
            vertical: 'top',
            horizontal: 'left'
         }
      };

      var INVERTING_CONST = {
         top: 'bottom',
         bottom: 'top',
         left: 'right',
         right: 'left',
         center: 'center'
      };


      var _private = {
         getTargetPoint: function(popupCfg, targetInfo){
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
            }
         },

         invertHorizontal: function(cfg){
            cfg.corner.horizontal = INVERTING_CONST[cfg.corner.horizontal];
            cfg.align.horizontal.side = INVERTING_CONST[cfg.align.horizontal.side];
            cfg.align.horizontal.offset = cfg.align.horizontal.offset * (-1);
         },

         invertVertical: function(cfg){
            cfg.corner.vertical = INVERTING_CONST[cfg.corner.vertical];
            cfg.align.vertical.side = INVERTING_CONST[cfg.align.vertical.side];
            cfg.align.vertical.offset = cfg.align.vertical.offset * (-1);
         },

         getLeft: function(targetPoint, cfg){
            return targetPoint.left + cfg.align.horizontal.offset + cfg.sizes.width * {
                  left: -1,
                  center: -1/2,
                  right: 0
               }[cfg.align.horizontal.side];
         },

         getTop: function(targetPoint, cfg){
            return targetPoint.top + cfg.align.vertical.offset + cfg.sizes.height * {
                  top: -1,
                  center: -1/2,
                  bottom: 0
               }[cfg.align.vertical.side];
         },

         getHorizontalPosition: function(popupCfg, targetCoords, targetPoint){
            return _private.getPosition(popupCfg, targetCoords, targetPoint, _private.invertHorizontal, _private.getLeft,
               popupCfg.sizes.width, window.innerWidth, 'left');
         },

         getVerticalPosition: function(popupCfg, targetCoords, targetPoint){
            return _private.getPosition(popupCfg, targetCoords, targetPoint, _private.invertVertical, _private.getTop,
               popupCfg.sizes.height, window.innerHeight, 'top');
         },

         getPosition: function(popupCfg, targetCoords, targetPoint, invert, getCoordinate, orientedPopupWidth, orientedWindowWidth, positionType, coordName){

            var
               coordinate,
               newOrientedWidth;

            var checkOverflow = function(callback){
               coordinate = getCoordinate(targetPoint, popupCfg);
               var maxOverflowValue = Math.max(-coordinate, -(orientedWindowWidth - coordinate - orientedPopupWidth));
               if(maxOverflowValue > 0){
                  callback(maxOverflowValue);
               }
            };

            checkOverflow(function(firstOverflowValue){

               invert(popupCfg);
               targetPoint = _private.getTargetPoint(popupCfg, targetCoords);

               checkOverflow(function(secondOverflowValue){

                  if(firstOverflowValue < secondOverflowValue){
                     invert(popupCfg);
                     targetPoint = _private.getTargetPoint(popupCfg, targetCoords);
                  }

                  if(coordinate < 0){
                     coordinate = 0;
                  }

                  newOrientedWidth = Math.max(targetPoint[coordName], orientedWindowWidth - targetPoint[coordName]);
               });
            });

            return {
               coordinate: coordinate,
               newOrientedWidth: newOrientedWidth
            }
         },

         getOrientationClasses: function(cfg){
            var className = '';

            className = 'controls-Popup-corner-vertical-' + cfg.corner.vertical;
            className += ' controls-Popup-corner-horizontal-' + cfg.corner.horizontal;
            className += ' controls-Popup-align-horizontal-' + cfg.align.horizontal.side;
            className += ' controls-Popup-align-vertical-' + cfg.align.vertical.side;

            return className;
         }
      };

      /**
       * Стратегия позиционирования прилипающего диалога.
       * @class Controls/Popup/Opener/Sticky/Strategy
       * @control
       * @public
       * @category Popup
       */
      var Strategy = BaseStrategy.extend({
         elementCreated: function (cfg, width, height) {
            var popupCfg = {
               corner: cMerge(DEFAULT_OPTIONS['corner'], cfg.popupOptions.corner),
               align: {
                  horizontal: cMerge(DEFAULT_OPTIONS['horizontalAlign'], cfg.popupOptions.horizontalAlign),
                  vertical: cMerge(DEFAULT_OPTIONS['verticalAlign'], cfg.popupOptions.verticalAlign)
               },
               sizes: {
                  width: width,
                  height: height
               }
            };

            cfg.position = this.getPosition(popupCfg, TargetCoords.get(cfg.popupOptions.target ? cfg.popupOptions.target : document.body));
            cfg.popupOptions.className += ' ' + _private.getOrientationClasses(popupCfg);
         },

         /**
          * Возвращает позицию плавающей панели
          * @function Controls/Popup/Opener/Sticky/Strategy#getPosition
          * @param popupCfg конфигурация попапа
          * @param targetCoords координаты таргета
          */
         getPosition: function (popupCfg, targetCoords) {

            var targetPoint = _private.getTargetPoint(popupCfg, targetCoords);
            var horizontalPosition = _private.getHorizontalPosition(popupCfg, targetCoords, targetPoint);
            var verticalPosition = _private.getVerticalPosition(popupCfg, targetCoords, targetPoint);

            return {
               left: horizontalPosition.coordinate,
               top: verticalPosition.coordinate,
               width: horizontalPosition.newOrientedWidth,
               height: verticalPosition.newOrientedWidth
            };
         }

      });

      return new Strategy();
   }
);