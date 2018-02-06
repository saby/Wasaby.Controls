define('Controls/Validate/Validators/IsEmail', [], function() {
   'use strict';

   var
      emailEnRegExp = /^([a-z0-9+_-]+\.)*[a-z0-9+_-]+@[a-z0-9+_-]+(\.[a-z0-9+_-]+)*\.[a-z]{2,6}$/,
      emailRuRegExp = /^([а-я0-9+_-]+\.)*[а-я0-9+_-]+@[а-я0-9+_-]+(\.[а-я0-9+_-]+)*\.[а-я]{2,6}$/;
   return function(args) {
      return emailEnRegExp.test(args.value) || emailRuRegExp.test(args.value) || rk('В поле требуется ввести адрес электронной почты');
   };
});