define('Controls/Utils/DateRangeUtil', [
   'Core/helpers/Date/getPeriodType',
   'Core/helpers/Date/periodTypes'
], function(getPeriodType, periodTypes) {
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
         var periodType = getPeriodType(start, end);
         var result;
         if (periodType === periodTypes.day || periodType === periodTypes.days) {
            result = utils.shiftPeriodByDays(start, end, direction * utils.gePeriodLengthInDays(start, end));
         } else if (periodType) {
            result = utils.shiftPeriodByMonth(start, end, direction * utils.getPeriodLengthInMonths(start, end));
         }
         return result;
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
       * Returns the length of this period in months. If the period does not represent a whole month
       * it returns undefined.
       * @param start {Date}
       * @param end {Date}
       */
      getPeriodLengthInMonths: function(start, end) {
         return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth() + 1);
      },

      /**
       * Returns the length of this period in days.
       * it returns undefined.
       * @param start {Date}
       * @param end {Date}
       */
      gePeriodLengthInDays: function(start, end) {
         var oneDay = 24 * 60 * 60 * 1000;
         return Math.ceil(Math.abs((start.getTime() - end.getTime()) / (oneDay))) + 1;
      },

      SHIFT_DIRECTION: {
         BACK: -1,
         FORWARD: 1
      }
   };

   return utils;
});
