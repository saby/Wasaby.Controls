define('Controls-demo/Input/Validate/Validator', ['wml!Controls-demo/Input/Validate/ErrorMssg'], function() {
   'use strict';

   return function(args) {
      if (!args.value) {
         return true;
      }
      var value = args.value.toString();
      if (value.length < 3) {
         return 'wml!Controls-demo/Input/Validate/ErrorMssg';
      } return true;
   };
});
