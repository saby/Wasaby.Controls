define('Controls/Validate/Validators/IsRequired', [], function() {
   'use strict';

   return function(args) {
      return (args.text || args.doNotValidate) ? true : rk('Поле обязательно для заполнения');
   };
});