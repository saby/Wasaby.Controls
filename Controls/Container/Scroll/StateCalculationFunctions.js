define('Controls/Container/Scroll/StateCalculationFunctions',
   [
      'Core/detection',
      'Core/compatibility'
   ],
   function(detection, compatibility) {

      'use strict';

      var _private = {
         /**
          * Расчитать сумму высот дочерних нод.
          * @param container
          * @return {number}
          */
         calcChildHeight: function(container) {
            return Array.prototype.reduce.call(container.children, function(height, item) {
               height += item.offsetHeight;

               return height;
            }, 0);
         },

         /**
          * Расчитать функцию расчета значения для css свойства overflow.
          * @param detection
          * @return {function}
          */
         calcOverflowFn: function(detection) {
            var overflowFn;

            if (detection.firefox) {
               overflowFn = function(container) {
                  /**
                   * В firefox при высоте дочерних элементав < высоты скролла(34px) и резиновой высоте контейнера
                   * через max-height, нативный скролл не пропадает.
                   * В такой ситуации content имеет высоту скролла, а должен быть равен высоте дочерних элементов.
                   */
                  return _private.calcChildHeight(container) < 35 ? 'hidden' : 'scroll';
               }
            } else if (detection.isIE) {
               overflowFn = function(container) {
                  /**
                   * В ie при overflow: scroll, если контент не нуждается в скроллировании, то браузер добавляет
                   * 1px для скроллирования.
                   */
                  return container.scrollHeight - container.offsetHeight === 1 ? 'hidden' : 'scroll';
               }
            } else {
               overflowFn = function() {
                  return 'scroll';
               }
            }

            return overflowFn;
         },

         /**
          * Расчет ширины нативного скролла с помощью вспомогательного контейнера.
          * @return {number}
          */
         calcScrollbarWidthByMeasuredBlock: function() {
            var scrollbarWidth, measuredBlock;

            measuredBlock = document.createElement('div');
            measuredBlock.className = 'controls-Scroll__measuredBlock';
            document.body.appendChild(measuredBlock);
            scrollbarWidth = measuredBlock.offsetWidth - measuredBlock.clientWidth;
            document.body.removeChild(measuredBlock);

            return scrollbarWidth;
         },

         /**
          * Расчет ширины нативного скролла.
          * @param userAgent
          * @param detection
          * @return {number}
          */
         calcScrollbarWidth: function(userAgent, detection) {
            var scrollbarWidth;
            /**
             * В браузерах с поддержкой ::-webkit-scrollbar установлена ширина 0.
             * Определяем не с помощью Core/detection, потому что в нем считается, что chrome не на WebKit.
             */
            if (~userAgent.indexOf('AppleWebKit')) {
               scrollbarWidth = 0;
            } else if (detection.isMac) {
               scrollbarWidth = 15;
            } else if (detection.isIE12) {
               scrollbarWidth = 16;
            } else if (detection.isIE10 || detection.isIE11) {
               scrollbarWidth = 17;
            } else {
               scrollbarWidth = _private.calcScrollbarWidthByMeasuredBlock();
            }

            return scrollbarWidth;
         },

         /**
          * Расчет css стиля для скрытия нативного скролла.
          * @param scrollbarWidth
          * @param detection
          * @param compatibility
          * @return {string}
          */
         calcStyleHideScrollbar: function(scrollbarWidth, detection, compatibility) {
            var style;

            if (scrollbarWidth) {
               style = 'margin-right: -' + scrollbarWidth + 'px;';

               // На планшете c OS Windown 10 для скрытия нативного скролла, кроме margin требуется padding.
               if (compatibility.touch && detection.isIE) {
                  style += 'padding-right: ' + scrollbarWidth + 'px;';
               }
            } else {
               style = '';
            }

            return style;
         },

         calcStyleHideScrollbarFn: function(detection, compatibility) {
            var styleHideScrollbarFn;

            if (detection.firefox) {
               styleHideScrollbarFn = function() {
                  var scrollbarWidth = _private.calcScrollbarWidthByMeasuredBlock();

                  return _private.calcStyleHideScrollbar(scrollbarWidth, detection, compatibility);
               };
            } else {
               styleHideScrollbarFn = function() {
                  var scrollbarWidth;

                  if (!_private.styleHideScrollbar) {
                     scrollbarWidth = _private.calcScrollbarWidth(navigator.userAgent, detection);

                     _private.styleHideScrollbar = _private.calcStyleHideScrollbar(scrollbarWidth, detection, compatibility);
                  }

                  return _private.styleHideScrollbar;
               };
            }

            return styleHideScrollbarFn;
         }
      };

      return {
         _private: _private,

         calcOverflow: _private.calcOverflowFn(detection),

         calcStyleHideScrollbar: _private.calcStyleHideScrollbarFn(detection, compatibility)
      }
   }
);