define('Controls/Date/PeriodDialog/Utils', [
   'Core/helpers/Object/isEmpty'
], function(isEmpty) {
   'use strict';

   var Utils = {

      /**
       * Returns whether the mode of the year can be displayed
       * @returns {Boolean}
       */
      isYearStateEnabled: function(options) {
         var quantum = options.quantum;
         return options.selectionType !== 'single' && (!quantum ||
            (isEmpty(quantum) || 'months' in quantum || 'quarters' in quantum || 'halfyears' in quantum || 'years' in quantum));
      },

      /**
       * Returns whether the month view can be displayed
       * @returns {Boolean}
       */
      isMonthStateEnabled: function(options) {
         var quantum = options.quantum;
         return !quantum || ((isEmpty(quantum) && options.minQuantum === 'day') || 'days' in quantum || 'weeks' in quantum);
      },

      /**
       * Returns whether the month and year mode switch button can be displayed
       * @returns {Boolean}
       */
      isStateButtonDisplayed: function(options) {
         return this.isYearStateEnabled(options) && this.isMonthStateEnabled(options);
      }
   };

   return Utils;
});
