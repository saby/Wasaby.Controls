define('SBIS3.CONTROLS/Utils/DateControls',[
   'Controls/Calendar/Utils'
], function(calendarUtils) {
   'use strict';

   /**
    * @class SBIS3.CONTROLS/Utils/DateControls
    * @author Крайнов Д.О.
    * @public
    */
   var DateControls = /** @lends SBIS3.CONTROLS/Utils/DateControls.prototype */{
      /**
       * Возвращает список названий дней недели
       * @returns {Array}
       */
      getWeekdaysCaptions: calendarUtils.getWeekdaysCaptions
   };

   return DateControls;
});
