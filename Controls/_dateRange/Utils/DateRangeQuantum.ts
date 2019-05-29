import isEmpty = require('Core/helpers/Object/isEmpty');

var Utils = {

   /**
    * Returns the list of days of the week
    * @returns {Boolean}
    */
   monthSelectionEnabled: function(quantum) {
      return !quantum || isEmpty(quantum) || ('months' in quantum && quantum.months.indexOf(1) !== -1);
   }
};

export default Utils;
