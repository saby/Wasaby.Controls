define('Controls/Utils/DateRangeUtil', [
   'Core/helpers/Date/getPeriodLength',
   'Core/helpers/Date/getPeriodType',
   'Core/helpers/Date/periodTypes'
], function(getPeriodLength, getPeriodType, periodTypes) {
   'use strict';

   var utils = {

      /**
       * Shifts the period to the adjacent one. If the period is a multiple of the months,
       * the shift occurs for the corresponding number of months. If the period is not a multiple of months,
       * then the shift occurs for the corresponding number of days.
       * @param start {Date}
       * @param end {Date}
       * @param direction Shift direction.
       */
      shiftPeriod: function(start, end, direction) {
         var delta = utils.getPeriodLengthInMonths(start, end);
         if (delta) {
            return utils.shiftPeriodByMonth(start, end, direction * delta);
         } else {
            return utils.shiftPeriodByDays(start, end, direction * getPeriodLength(start, end));
         }
      },

      /**
       * Shifts the period by several whole months.
       * @param start {Date} Start date of the period.
       * @param end {Date} End date of the period.
       * @param monthDelta The number of whole months on which the period shifts.
       */
      shiftPeriodByMonth: function(start, end, monthDelta) {
         return [
            new Date(start.getFullYear(), start.getMonth() + monthDelta, 1),
            new Date(end.getFullYear(), end.getMonth() + monthDelta + 1, 0)
         ];
      },

      /**
       * Shifts the period by several whole months.
       * @param start {Date} Start date of the period.
       * @param end {Date} End date of the period.
       * @param dayDelta The number of whole days on which the period shifts.
       */
      shiftPeriodByDays: function(start, end, dayDelta) {
         return [
            new Date(start.getFullYear(), start.getMonth(), start.getDate() + dayDelta),
            new Date(end.getFullYear(), end.getMonth(), end.getDate() + dayDelta)
         ];
      },

      /**
       * Specifies the type of period: month, quarter, six months or a year.
       * Returns the length of this period in months. If the period does not represent a whole month, quarter or year,
       * it returns undefined.
       * @param start {Date}
       * @param end {Date}
       */
      getPeriodLengthInMonths: function(start, end) {
         var periodType = getPeriodType(start, end);
         if (periodType === 'month') {
            return 1;
         }
         if (periodType === periodTypes.quarter) {
            return 3;
         }
         if (periodType === periodTypes.halfyear) {
            return 6;
         }
         if (periodType === periodTypes.year) {
            return 12;
         }
      },

      SHIFT_DIRECTION: {
         BACK: -1,
         FORWARD: 1
      }
   };

   return utils;
});
