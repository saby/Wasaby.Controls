define('Controls/Utils/RegExp', [], function() {

   'use strict';

   return {

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
