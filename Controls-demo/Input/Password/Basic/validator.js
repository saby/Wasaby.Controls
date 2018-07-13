define('Controls-demo/Input/Password/Basic/validator', [], function() {

   'use strict';

   return function(args) {
      return /^([0-9A-Za-z])*$/.test(args.value) ? true : 'Valid characters are a-z and 0-9';
   };
});
