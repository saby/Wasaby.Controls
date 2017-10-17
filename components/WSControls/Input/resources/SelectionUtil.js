define('js!WSControls/Input/resources/SelectionUtil', [],
   function() {

      'use strict';

      var SelectionUtil = {
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
      };

      return function() {
         return SelectionUtil;
      }
   }
);