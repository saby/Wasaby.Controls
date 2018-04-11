define('Controls/Validate/Validators/IsEmail', [], function() {
   'use strict';

   var
      emailEnRegExp = /^([a-z0-9+_-]+\.)*[a-z0-9+_-]+@[a-z0-9+_-]+(\.[a-z0-9+_-]+)*\.[a-z]{2,7}$/,
      emailRuRegExp = /^([а-я0-9+_-]+\.)*[а-я0-9+_-]+@[а-я0-9+_-]+(\.[а-я0-9+_-]+)*\.[а-я]{2,7}$/;
   return function(args) {
      //Пустое значение должно быть валидным
      if (!args.value) {
         return true;
      }

      var
         lowerCaseValue = args.value.toLowerCase();

      return emailEnRegExp.test(lowerCaseValue) || emailRuRegExp.test(lowerCaseValue) || rk('В поле требуется ввести адрес электронной почты');
   };
});
