define('js!Controls/Input/resources/ValidateHelper',
   [
      'Core/core-extend'
   ],
   function(coreExtend) {

      'use strict';

      var ValidateHelper = coreExtend({

         trim: function(value){
            return value.trim();
         },

         constraint: function(value, splitValue, constraint){
            var newValue = '';
            value.replace(new RegExp(constraint, 'g'), function(res) {
               newValue += res;
            });
            return newValue;
         },

         maxLength: function(value, splitValue, maxLength){
            return value.substring(0, maxLength - splitValue.beforeInputValue.length - splitValue.afterInputValue.length);
         }

      });

      return ValidateHelper;
   }
);