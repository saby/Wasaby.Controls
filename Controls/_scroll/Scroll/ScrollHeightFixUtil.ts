import Env = require('Env/Env');

      

      var _private = {

         /**
          * Расчитать функцию расчета значения для css свойства overflow.
          * @param detection
          * @return {function}
          */
         calcHeightFixFn: function(detection) {
            var calcHeightFixFn;

            if (detection.firefox) {
               calcHeightFixFn = function(container) {
                  if (window && container) {
                     /**
                      * В firefox при высоте дочерних элементав < высоты скролла(34px) и резиновой высоте контейнера
                      * через max-height, нативный скролл не пропадает.
                      * В такой ситуации content имеет высоту скролла, а должен быть равен высоте дочерних элементов.
                      */
                     return container.scrollHeight === container.offsetHeight && container.scrollHeight < 35;
                  }
               };
            } else if (detection.isIE) {
               calcHeightFixFn = function(container) {
                  if (window && container) {
                     /**
                      * В ie при overflow: scroll, если контент не нуждается в скроллировании, то браузер добавляет
                      * 1px для скроллирования.
                      */
                     return container.scrollHeight - container.offsetHeight === 1;
                  }
               };
            } else {
               calcHeightFixFn = function() {
                  return false;
               };
            }

            return calcHeightFixFn;
         }
      };

      export = {
         _private: _private,

         calcHeightFix: _private.calcHeightFixFn(Env.detection)
      };
   
