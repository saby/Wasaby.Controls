define('Controls/Validate/Validators/IsEmail', [], function() {
   'use strict';

   var
      emailEnRegExp = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/,
      emailRuRegExp = /^([а-я0-9_-]+\.)*[а-я0-9_-]+@[а-я0-9_-]+(\.[а-я0-9_-]+)*\.[а-я]{2,6}$/;
   return function(args) {
      return emailEnRegExp.test(args.text) || emailRuRegExp.test(args.text) || rk('В поле требуется ввести адрес электронной почты');
   };
});