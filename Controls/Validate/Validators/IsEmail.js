define('Controls/Validate/Validators/IsEmail', [], function() {
   'use strict';

   var regExp = /^.+@.+\..+$/;

   return function(args) {
      //Пустое значение должно быть валидным
      if (!args.value) {
         return true;
      }

      var
         lowerCaseValue = args.value.toLowerCase();

      return regExp.test(lowerCaseValue) || rk('В поле требуется ввести адрес электронной почты');
   };
});
