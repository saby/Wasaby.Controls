define('Controls-demo/Input/Validate/EqualEmailValidator', ['wml!Controls-demo/Input/Validate/ErrorMssg'], function() {
   'use strict';

   return function(args) {
      if ((!args.email1 && args.email2) || args.email1 !== args.email2) {
         return 'Адреса email не совпадают';
      }
      return true;
   };
});