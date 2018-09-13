define('Controls/Container/Scroll/ScrollWidthUtil',
   [
      'Core/detection'
   ],
   function(detection) {

      'use strict';

      var _private = {

         styleHideScrollbar: null,

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
          * @param detection
          * @return {number}
          */
         calcScrollbarWidth: function(detection) {
            var scrollbarWidth;

            if (detection.webkit || detection.chrome) {
               scrollbarWidth = 0;
            } else if (detection.isIE12) {
               scrollbarWidth = detection.IEVersion < 17 ? 12 : 16;
            } else if (detection.isIE10 || detection.isIE11) {
               scrollbarWidth = 17;
            } else if (typeof window !== 'undefined') {
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
         calcStyleHideScrollbar: function(scrollbarWidth) {
            var style;

            if (scrollbarWidth) {
               style = 'margin-right: -' + scrollbarWidth + 'px;';
            } else if (scrollbarWidth === 0) {
               style = '';
            }

            return style;
         }
      };

      return {
         _private: _private,

         calcStyleHideScrollbar: function() {
            var scrollbarWidth, styleHideScrollbar;

            if (typeof _private.styleHideScrollbar === 'string') {
               styleHideScrollbar = _private.styleHideScrollbar;
            } else {
               scrollbarWidth = _private.calcScrollbarWidth(detection);
               styleHideScrollbar = _private.calcStyleHideScrollbar(scrollbarWidth);
            }

            /**
             * Do not cache on the server and firefox.
             */
            if (!(typeof window === 'undefined' || detection.firefox)) {
               _private.styleHideScrollbar = styleHideScrollbar;
            }

            return styleHideScrollbar;
         }
      };
   }
);
