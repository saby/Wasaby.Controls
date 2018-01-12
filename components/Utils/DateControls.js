define('SBIS3.CONTROLS/Utils/DateControls',[
   "Core/constants"
], function(constants) {
   'use strict';
   /**
    * @class SBIS3.CONTROLS/Utils/DateControls
    * @public
    */
   var DateControls = /** @lends SBIS3.CONTROLS/Utils/DateControls.prototype */{
       /**
        * Возвращает список названий дней недели
        * @returns {Array}
        */
      getWeekdaysCaptions: function () {
         var days = constants.Date.daysSmall.slice(1);
         days.push(constants.Date.daysSmall[0]);

         return days.map(function (value, index) {
            return {caption: value, weekend: index === 5 || index === 6}
         });
      }
   };

   return DateControls;
});