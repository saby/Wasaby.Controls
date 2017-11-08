define('js!Controls/Input/resources/SelectionUtil',
   [
      'Core/core-extend'
   ],
   function(coreExtend) {

      'use strict';

      var SelectionUtil = coreExtend({
         /**
          * Обновление позиций выделения.
          * @param target
          * @private
          */
         updateSelectionPosition: function(target) {
            this.selectionStart = target.selectionStart;
            this.selectionEnd = target.selectionEnd;
         },

         /**
          * Обновление позиций выделения у target.
          * @param target
          * @private
          */
         updateSelectionPositionTarget: function(target, positionStart, positionEnd) {
            target.selectionStart = positionStart;
            target.selectionEnd = positionEnd;
         }
      });

      return SelectionUtil;
   }
);