define('Controls/Utils/hasHorizontalScroll',
   [
      'Env/Env',
      'Controls/Utils/getTextWidth'
   ],
   function(Env, getTextWidth) {
      'use strict';

      return function hasHorizontalScroll(target) {
         /* eslint-disable */
         var targetStyles = getComputedStyle(target);

         /**
          * In ie, the input tag always has the value of the scrollWidth property equal to the value
          * of the clientWidth property. Therefore, to determine the presence of a horizontal scroll through
          * a standard algorithm will not work. The width of the text in the input tag is equal to
          * the value of the scrollWidth property in a standard algorithm.
          * If the width of the text is greater than the width of the input, then there is a scroll.
          */
         if (target.tagName === 'INPUT' && Env.detection.isIE) {
            return getTextWidth(target.value) > target.clientWidth;
         }

         /**
          * If the element has text-align: right, then chrome rounds scrollWidth very strangely.
          * For example, if the real width in 277.859 he can round up scrollWidth 279. At the same time
          * for clientWidth it rounds by some other algorithm, and as a result there is a situation when the text fits,
          * but clientWidth and scrollWidth are very different. If you hang direction: rtl, the text still remains
          * on the right, but scrollWidth is almost the same as the real width (diff within 1). Therefore,
          * we consider this error and if it is greater than 1, then scroll there, if it is less, then no.
          */
         if (targetStyles.textAlign === 'right' && Env.detection.chrome) {
            target.style.direction = 'rtl';
            target.style.textAlign = 'left';

            var result = Math.abs(parseFloat(targetStyles.width) - target.scrollWidth) >= 1;

            target.style.direction = '';
            target.style.textAlign = '';

            return result;
         }

         var width = parseFloat(targetStyles.width);

         /**
          * The value of the scrollWidth property is an integer. The width can be fractional.
          * In this case,
          * the element that does not have a horizontal scroll will have a scrollWidth equal to the width rounded up.
          * Therefore, when comparing scrollWidth and width, you need to round up the width.
          */
         return target.scrollWidth > Math.ceil(width);
         /* eslint-enable */
      };
   });
