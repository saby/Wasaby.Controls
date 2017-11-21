define('js!Controls/Input/resources/ValidateHelper', [],
   function() {

      'use strict';

      return {

         constraint: function(value, constraint){
            return (value.match(new RegExp(constraint, 'g')) || ['']).join('');
         },

         maxLength: function(value, splitValue, maxLength){
            return value.substring(0, maxLength - splitValue.beforeInputValue.length - splitValue.afterInputValue.length);
         }

      };

   }
);