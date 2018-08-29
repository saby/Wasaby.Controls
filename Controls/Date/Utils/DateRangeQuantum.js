define('Controls/Date/Utils/DateRangeQuantum', [
   'Core/helpers/Object/isEmpty'
], function(
   isEmpty
) {
   'use strict';


   var Utils = {

      /**
        * Returns the list of days of the week
        * @returns {Boolean}
        */
      monthSelectionEnabled: function(quantum) {
         return !quantum || isEmpty(quantum) || ('months' in quantum && quantum.months.indexOf(1) !== -1);
      }
   };

   return Utils;
});
