define('Controls/Container/Scroll/ScrollOverflowUtil',
   [
      'Core/detection'
   ],
   function(detection) {

      'use strict';

      var _private = {
         /**
          * Расчитать сумму высот дочерних нод.
          * @param container
          * @return {number}
          */
         calcChildrenHeight: function(container) {
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
                  return _private.calcChildrenHeight(container) < 35 ? 'hidden' : 'scroll';
               };
            } else if (detection.isIE) {
               overflowFn = function(container) {
                  /**
                   * В ie при overflow: scroll, если контент не нуждается в скроллировании, то браузер добавляет
                   * 1px для скроллирования.
                   */
                  return container.scrollHeight - container.offsetHeight === 1 ? 'hidden' : 'scroll';
               };
            } else {
               overflowFn = function() {
                  return 'scroll';
               };
            }

            return overflowFn;
         }
      };

      return {
         _private: _private,

         calcOverflow: _private.calcOverflowFn(detection)
      }
   }
);