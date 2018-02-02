define('Controls/Validate/Validators/IsEmail', [], function() {
   'use strict';

   var emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   return function(args) {
      return emailRegExp.test(args.text) || rk('В поле требуется ввести адрес электронной почты');
   };
});