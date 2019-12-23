/* eslint-disable */
define('Controls/Utils/Date', [
], function() {
   'use strict';

   var DateUtil = {

      /**
       * Checks if the date is correct.
       * @param {Date} date
       * @returns {Boolean}
       */
      isValidDate: function(date) {
         // If date is Invalid Date, "instanceof Date" will return true, so check getTime
         return date instanceof Date && !isNaN(date.getTime());
      },

      /**
       * Checks if the dates are the same.
       * @param {Date} date1 first date.
       * @param {Date} date2 second date.
       * @returns {boolean} If the dates are the equal, then returns true, otherwise false.
       */
      isDatesEqual: function(date1, date2) {
         return date1 === date2 ||
            (date1 instanceof Date && date2 instanceof Date &&
               (date1.getTime() === date2.getTime() || (isNaN(date1.getTime()) && isNaN(date2.getTime()))));
      },

      /**
       * Checks whether the same year in years.
       * @param {Date} date1 first date.
       * @param {Date} date2 second date.
       * @returns {boolean} If the dates are the equal, then returns true, otherwise false.
       */
      isYearsEqual: function(date1, date2) {
         return date1 === date2 ||
            (DateUtil.isValidDate(date1) && DateUtil.isValidDate(date2) && date1.getYear() === date2.getYear());
      },

      /**
       * Checks whether the same years and months in dates.
       * @param {Date} date1 first date.
       * @param {Date} date2 second date.
       * @returns {boolean} If the dates are the equal, then returns true, otherwise false.
       */
      isMonthsEqual: function(date1, date2) {
         return date1 === date2 ||
            (DateUtil.isValidDate(date1) && DateUtil.isValidDate(date2) &&
               date1.getYear() === date2.getYear() && date1.getMonth() === date2.getMonth());
      },

      /**
       * Returns the date corresponding to the beginning of the week by the specified date.
       * @param {Date} date
       * @return {Date}
       */
      getStartOfWeek: function(date) {
         var rDate = new date.constructor(date),
            day = date.getDay(),
            diff = date.getDate() - day + (day === 0 ? -6 : 1);
         rDate.setDate(diff);
         return rDate;
      },

      /**
       * Returns the date corresponding to the end of the week by the specified date
       * @param {Date} date
       * @return {Date}
       */
      getEndOfWeek: function(date) {
         var rDate = new date.constructor(date),
            day = date.getDay(),
            diff = date.getDate() - day + (day === 0 ? 0 : 7);
         rDate.setDate(diff);
         return rDate;
      },

      /**
       * Returns true if the transmitted date is the beginning of the month.
       * @param {Date} date
       * @return {Boolean}
       */
      isStartOfMonth: function(date) {
         return this.isValidDate(date) && date.getDate() === 1;
      },

      /**
       * Returns true if the transmitted date is the end of the month
       * @param {Date} date
       * @return {Boolean}
       */
      isEndOfMonth: function(date) {
         if (!this.isValidDate(date)) {
            return false;
         }
         var d = new Date(date);
         d.setDate(d.getDate() + 1);
         return this.isStartOfMonth(d);
      },

      /**
       * Returns the date corresponding to the beginning of the month by the date sent.
       * @param {Date} date
       * @return {Date}
       */
      getStartOfMonth: function(date) {
         date = date || new Date();
         return new date.constructor(date.getFullYear(), date.getMonth(), 1);
      },

      /**
       * Returns the date corresponding to the end of the month by the specified date.
       * @param {Date} date
       * @return {Date}
       */
      getEndOfMonth: function(date) {
         return new date.constructor(date.getFullYear(), date.getMonth() + 1, 0);
      },

      /**
       * Returns the number of days in a month.
       * @param {Date} date
       * @return {Number}
       */
      getDaysInMonth: function(date) {
         return this.getEndOfMonth(date).getDate();
      },

      /**
       * Returns true if the transmitted number is the beginning of the quarter.
       * @param {Date} date
       * @return {Boolean}
       */
      isStartOfQuarter: function(date) {
         return this.isValidDate(date) && this.isStartOfMonth(date) && date.getMonth() % 3 === 0;
      },

      /**
       * Returns true if the transmitted number is the end of the quarter
       * @param {Date} date
       * @return {Boolean}
       */
      isEndOfQuarter: function(date) {
         if (!this.isValidDate(date)) {
            return false;
         }
         var d = new Date(date);
         d.setDate(d.getDate() + 1);
         return this.isStartOfQuarter(d);
      },

      /**
       * Returns the date corresponding to the beginning of the quarter by the specified date.
       * @param {Date} date
       * @return {Date}
       */
      getStartOfQuarter: function(date) {
         return new date.constructor(date.getFullYear(), (Math.floor(date.getMonth() / 3)) * 3, 1);
      },

      /**
       * Returns the date corresponding to the end of the quarter by the specified date.
       * @param {Date} date
       * @return {Date}
       */
      getEndOfQuarter: function(date) {
         return new date.constructor(date.getFullYear(), (Math.floor(date.getMonth() / 3) + 1) * 3, 0);
      },

      /**
       * Returns true if the transmitted number is the beginning of the half-year.
       * @param {Date} date
       * @return {Boolean}
       */
      isStartOfHalfyear: function(date) {
         return this.isValidDate(date) && this.getStartOfMonth(date) && date.getMonth() % 6 === 0;
      },

      /**
       * Returns true if the number sent is the end of half-year.
       * @param {Date} date
       * @return {Boolean}
       */
      isEndOfHalfyear: function(date) {
         if (!this.isValidDate(date)) {
            return false;
         }
         var d = new Date(date);
         d.setDate(d.getDate() + 1);
         return this.isStartOfHalfyear(d);
      },

      /**
       * Returns the date corresponding to the beginning of the half-year by the specified date.
       * @param {Date} date
       * @return {Date}
       */
      getStartOfHalfyear: function(date) {
         return new date.constructor(date.getFullYear(), (Math.floor(date.getMonth() / 6)) * 6, 1);
      },

      /**
       * Returns the date corresponding to the end of the half-year by the specified date.
       * @param {Date} date
       * @return {Date}
       */
      getEndOfHalfyear: function(date) {
         return new date.constructor(date.getFullYear(), (Math.floor(date.getMonth() / 6) + 1) * 6, 0);
      },

      /**
       * Returns true if the transmitted number is the beginning of the year.
       * @param {Date} date
       * @return {Boolean}
       */
      isStartOfYear: function(date) {
         return this.isValidDate(date) && date.getDate() === 1 && date.getMonth() === 0;
      },

      /**
       * Returns true if the transmitted number is the end of the year.
       * @param {Date} date
       * @return {Boolean}
       */
      isEndOfYear: function(date) {
         if (!this.isValidDate(date)) {
            return false;
         }
         var d = new Date(date);
         d.setDate(d.getDate() + 1);
         return this.isStartOfYear(d);
      },

      /**
       * Returns the date corresponding to the beginning of the year by the specified date.
       * @param {Date} date
       * @return {Date}
       */
      getStartOfYear: function(date) {
         return new date.constructor(date.getFullYear(), 0, 1);
      },

      /**
       * Returns the date corresponding to the beginning of the year by the specified date.
       * @param {Date} date
       * @return {Date}
       */
      getEndOfYear: function(date) {
         return new date.constructor(date.getFullYear(), 12, 0);
      },

      /**
       * Returns the month in normal form (with date 1 and zero time).
       * @param month {Date} Date on the basis of which a new Date will be created with updated day and time.
       * @returns {Date} Date with zeroed day and time
       */
      normalizeMonth: function(month) {
         if (!(month instanceof Date)) {
            return null;
         }
         return new month.constructor(month.getFullYear(), month.getMonth(), 1);
      },

      /**
       * Returns the date in normal form (with zero time).
       * @param date {Date} Date on the basis of which a new Date will be created with updated time.
       * @returns {Date} Date with zeroed time
       */
      normalizeDate: function(date) {
         if (!(date instanceof Date)) {
            return null;
         }
         return new date.constructor(date.getFullYear(), date.getMonth(), date.getDate());
      },

      getDaysByRange: function(date1, date2) {
         var oneDay = 24 * 60 * 60 * 1000;
         return Math.round(Math.abs((date1.getTime() - date2.getTime()) / (oneDay)));
      },

      isRangesOverlaps: function(startDate1, endDate1, startDate2, endDate2) {
         if (!startDate1 || !endDate1 || !startDate2 || !endDate2) {
            return false;
         }

         startDate1 = startDate1 instanceof Date ? startDate1.getTime() : startDate1;
         endDate1 = endDate1 instanceof Date ? endDate1.getTime() : endDate1;
         startDate2 = startDate2 instanceof Date ? startDate2.getTime() : startDate2;
         endDate2 = endDate2 instanceof Date ? endDate2.getTime() : endDate2;

         return Math.max(startDate1, startDate2) <= Math.min(endDate1, endDate2);
      }
   };

   return DateUtil;
});
/* eslint-enable */
