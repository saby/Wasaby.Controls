define('Controls/Validate/Validators/IsEmail', [], function() {
   'use strict';

   var
      regExp = /^(([а-я0-9+_-]+\.)*[а-я0-9+_-]+@[а-я0-9+_-]+(\.[а-я0-9+_-]+)*\.[а-я]{2,9}|([a-z0-9+_-]+\.)*[a-z0-9+_-]+@[a-z0-9+_-]+(\.[a-z0-9+_-]+)*\.[a-z]{2,9}|([a-z0-9+_-]+\.)*[a-z0-9+_-]+@[а-я0-9+_-]+(\.[а-я0-9+_-]+)*\.[а-я]{2,9})$/;
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
