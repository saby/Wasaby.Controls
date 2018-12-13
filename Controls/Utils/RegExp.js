define('Controls/Utils/RegExp', [], function() {
   'use strict';

   return {

      /**
       * @type {RegExp}
       * $1 - Minus.
       * $2 - Integer part.
       * $3 - The separator of the integer and fractional parts.
       * $4 - Fractional part.
       */
      partOfNumber: /(-?)([0-9]*)([.,]?)([0-9]*)/,

      /**
       * Escaping special characters of a regular expression.
       * @param {String} value Escaping value.
       * @return {String} Escaped value.
       */
      escapeSpecialChars: function(value) {
         return value.replace(/[\(\)\{\}\[\]\?\+\*\.\\]/g, '\\$&');
      }
   };
});
