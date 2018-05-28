define('Controls/Validate/Validators/IsEmail', [], function() {
   'use strict';

   var
      regExp = /^([а-яa-z0-9+_-]+\.)*[а-яa-z0-9+_-]+@[а-яa-z0-9+_-]+(\.[а-яa-z0-9+_-]+)*\.[а-яa-z]{2,7}$/;
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
