define('Controls/Popup/Opener/Sticky/Strategy',
   [
      'Controls/Popup/Opener/BaseStrategy',
      'Core/core-merge',
      'Controls/Popup/TargetCoords'
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

      var COORDINATE_MULTIPLIERS = {
         left: -1,
         right: 0,
         top: -1,
         bottom: 0,
         center: -1/2
      };


      var _private = {
         /*
         * Возвращает точку таргета, относительно которой нужно спозиционироваться окну
         * */
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

         /*
         * Инвертировать положение окна
         * В случае если окно не влезает в доступную область, может потребоваться его инвертировать
         * */
         invert: function(cfg, direction){
            cfg.corner[direction] = INVERTING_CONST[cfg.corner[direction]];
            cfg.align[direction].side = INVERTING_CONST[cfg.align[direction].side];
            cfg.align[direction].offset = cfg.align[direction].offset * (-1);
         },

         /*
         * Получить горизонтальную или вертикальную координату позиционирования окна
         * */
         getCoordinate: function(targetPoint, cfg, direction){
            return targetPoint[direction === 'horizontal' ? 'left' : 'top'] + cfg.align[direction].offset + 
               cfg.sizes[direction === 'horizontal' ? 'width' : 'height'] * COORDINATE_MULTIPLIERS[cfg.align[direction].side];
         },

         /*
         * Получить новую ширину окна, используется в случае, когда окно не влезает в доступную область
         * */
         getNewWidth: function(popupCfg, targetPoint, direction){
            return Math.max(targetPoint[[direction === 'horizontal' ? 'left' : 'top']] - popupCfg.align[direction].offset,
               _private.getWindowSizes()[direction === 'horizontal' ? 'width' : 'height'] - targetPoint[[direction === 'horizontal' ? 'left' : 'top']] - popupCfg.align[direction].offset);
         },

         /*
         * Проверить насколько не влезает окно с обеих сторон относительно переданной координаты и вернуть максимальное значение
         * */
         getMaxOverflowValue: function(coordinate, popupCfg, direction){
            return Math.max(-coordinate, -(_private.getWindowSizes()[direction === 'horizontal' ? 'width' : 'height'] - coordinate - popupCfg.sizes[direction === 'horizontal' ? 'width' : 'height']));
         },

         getPosition: function(popupCfg, targetCoords, targetPoint, direction){

            var
               coordinate,
               newWidth;

            var checkOverflow = function(callback){
               coordinate = _private.getCoordinate(targetPoint, popupCfg, direction);
               var maxOverflowValue = _private.getMaxOverflowValue(coordinate, popupCfg, direction);
               //Если окно не влезает, то передаем управление дальше
               if(maxOverflowValue > 0){
                  callback(maxOverflowValue);
               }
            };

            //Проверим, возможно окну достаточно места
            checkOverflow(function(firstOverflowValue){
               //Попробуем инвертировать окно и проверим снова
               _private.invert(popupCfg, direction);
               targetPoint = _private.getTargetPoint(popupCfg, targetCoords);

               checkOverflow(function(secondOverflowValue){
                  //Если и на этот раз окно не поместилось, отобразим окно в ту сторону, где места было больше
                  if(firstOverflowValue < secondOverflowValue){
                     _private.invert(popupCfg, direction);
                     targetPoint = _private.getTargetPoint(popupCfg, targetCoords);
                  }

                  if(coordinate < 0){
                     coordinate = 0;
                  }

                  newWidth = _private.getNewWidth(popupCfg, targetPoint, direction);
               });
            });

            return {
               coordinate: coordinate,
               newWidth: newWidth
            }
         },

         getOrientationClasses: function(cfg){
            var className = '';

            className = 'controls-Popup-corner-vertical-' + cfg.corner.vertical;
            className += ' controls-Popup-corner-horizontal-' + cfg.corner.horizontal;
            className += ' controls-Popup-align-horizontal-' + cfg.align.horizontal.side;
            className += ' controls-Popup-align-vertical-' + cfg.align.vertical.side;

            return className;
         },

         getWindowSizes: function(){
            return {
               width: window.innerWidth,
               height: window.innerHeight
            }
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
                  horizontal: cMerge(DEFAULT_OPTIONS['horizontalAlign'], cfg.popupOptions.horizontalAlign || {}),
                  vertical: cMerge(DEFAULT_OPTIONS['verticalAlign'], cfg.popupOptions.verticalAlign || {})
               },
               sizes: {
                  width: width,
                  height: height
               }
            };

            cfg.position = this.getPosition(popupCfg, TargetCoords.get(cfg.popupOptions.target ? cfg.popupOptions.target : document.body));

            //Удаляем предыдущие классы характеризующие направление
            cfg.popupOptions.className = cfg.popupOptions.className.replace(/controls-Popup-corner\S*|controls-Popup-align\S*/g, '').trim();
            //Добавляем новые
            cfg.popupOptions.className += ' ' + _private.getOrientationClasses(popupCfg);
         },

         elementUpdated: function (cfg, width, height) {
            this.elementCreated(cfg, width, height);
         },

         /**
          * Возвращает позицию плавающей панели
          * @function Controls/Popup/Opener/Sticky/Strategy#getPosition
          * @param popupCfg конфигурация попапа
          * @param targetCoords координаты таргета
          */
         getPosition: function (popupCfg, targetCoords) {

            var targetPoint = _private.getTargetPoint(popupCfg, targetCoords);
            var horizontalPosition = _private.getPosition(popupCfg, targetCoords, targetPoint, 'horizontal');
            var verticalPosition = _private.getPosition(popupCfg, targetCoords, targetPoint, 'vertical');

            return {
               left: horizontalPosition.coordinate,
               top: verticalPosition.coordinate,
               width: horizontalPosition.newWidth,
               height: verticalPosition.newWidth
            };
         }

      });

      Strategy._private = _private;

      return new Strategy();
   }
);