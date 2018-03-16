define('Controls/Popup/Opener/Sticky/Strategy',
   [
      'Controls/Popup/Opener/BaseStrategy',
      'Core/core-merge',
      'Core/core-clone',
      'Controls/Popup/TargetCoords'
   ],
   function (BaseStrategy, cMerge, cClone, TargetCoords) {

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
            cfg.align[direction].offset *= -1;
            cfg.sizes.margins[direction === 'horizontal' ? 'left' : 'top'] *= -1;
         },

         /*
         * Получить горизонтальную или вертикальную координату позиционирования окна
         * */
         getCoordinate: function(targetPoint, cfg, direction){
            var isHorizontalDirection = direction === 'horizontal';
            return targetPoint[isHorizontalDirection ? 'left' : 'top'] + cfg.align[direction].offset +
               cfg.sizes[isHorizontalDirection ? 'width' : 'height'] * COORDINATE_MULTIPLIERS[cfg.align[direction].side] +
               cfg.sizes.margins[isHorizontalDirection ? 'left' : 'top'];
         },

         /*
         * Проверить насколько не влезает окно с обеих сторон относительно переданной координаты и вернуть максимальное значение
         * */
         getMaxOverflowValue: function(coordinate, popupCfg, direction, targetCoords){
            return Math.max(
               popupCfg.sizes[direction === 'horizontal' ? 'width' : 'height']
                  - (_private.getWindowSizes()[direction === 'horizontal' ? 'width' : 'height']
                  - (coordinate - targetCoords[direction === 'horizontal' ? 'leftScroll' : 'topScroll'])),
               targetCoords[direction === 'horizontal' ? 'leftScroll' : 'topScroll'] - coordinate);
         },

         getPosition: function(popupCfg, targetCoords, targetPoint, direction){

            var
               coordinate,
               newWidth;

            var checkOverflow = function(callback){
               coordinate = _private.getCoordinate(targetPoint, popupCfg, direction);
               var maxOverflowValue = _private.getMaxOverflowValue(coordinate, popupCfg, direction, targetCoords);
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
                     coordinate = _private.getCoordinate(targetPoint, popupCfg, direction);
                  }

                  var minOverflow = Math.min(firstOverflowValue, secondOverflowValue);

                  var scroll = targetCoords[direction === 'horizontal' ? 'leftScroll' : 'topScroll'];
                  if(coordinate < scroll){
                     coordinate = scroll;
                  }

                  newWidth = popupCfg.sizes[direction === 'horizontal' ? 'width' : 'height'] - minOverflow;
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
         elementCreated: function (cfg, sizes) {
            this.modifyCfg(cfg, sizes);
         },

         elementUpdated: function (cfg, sizes) {
            this.modifyCfg(cfg, sizes);
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
         },

         modifyCfg: function(cfg, sizes){
            var popupCfg = {
               corner: cMerge(cClone(DEFAULT_OPTIONS['corner']), cfg.popupOptions.corner || {}),
               align: {
                  horizontal: cMerge(cClone(DEFAULT_OPTIONS['horizontalAlign']), cfg.popupOptions.horizontalAlign || {}),
                  vertical: cMerge(cClone(DEFAULT_OPTIONS['verticalAlign']), cfg.popupOptions.verticalAlign || {})
               },
               sizes: sizes
            };

            cfg.position = this.getPosition(popupCfg, TargetCoords.get(cfg.popupOptions.target ? cfg.popupOptions.target : document.body));

            // Удаляем предыдущие классы характеризующие направление и добавляем новые
            if( cfg.popupOptions.className ){
               cfg.popupOptions.className = cfg.popupOptions.className.replace(/controls-Popup-corner\S*|controls-Popup-align\S*/g, '').trim();
               cfg.popupOptions.className += ' ' + _private.getOrientationClasses(popupCfg);
            }
            else{
               cfg.popupOptions.className = _private.getOrientationClasses(popupCfg);
            }
         }

      });

      Strategy._private = _private;

      return new Strategy();
   }
);