define('Controls/Validate/Validators/IsRequired', [], function() {
   'use strict';

   return function(args) {
      return (args.text || args.doNotValidate) ? true : 'Поле обязательно для заполнения!'
   };
});