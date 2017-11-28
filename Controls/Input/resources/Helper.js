define('Controls/Input/resources/Helper',
   [],
   function() {

      'use strict';

      var Helper = {

         constraint: function(value, constraint){
            var
               constraintValue = '',
               reg = new RegExp(constraint);

            for(var i = 0; i < value.length; i++){
               if(reg.test(value[i])){
                  constraintValue += value[i];
               }
            }

            return constraintValue;
         },

         maxLength: function(value, splitValue, maxLength){
            return value.substring(0, maxLength - splitValue.before.length - splitValue.after.length);
         }

      };

      return Helper;
   }
);