define('Controls/Validate/Validators/IsINN', [], function() {
   'use strict';

   return function(args) {

      //Пустое значение должно быть валидным
      if (!args.value) {
         return true;
      }

      var value = args.value.toString();

      if (value.length !== 10 && value.length !== 12) {
         return rk('ИНН должен состоять из 10 или 12 цифр');
      }

      if (/^0+$/.test(value)) {
         return rk('ИНН не может состоять из одних нулей');
      }

      var
         koef = [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8],
         sum = 0, i, j;

      if (value.length === 12) {
         for (i = 0, j = 1; i < 10; i++, j++) {
            sum += value.charAt(i) * koef[j];
         }
         if ((sum % 11) % 10 == value.charAt(10)) {
            sum = 0;
            for (i = 0, j = 0; i < 11; i++, j++) {
               sum += value.charAt(i) * koef[j];
            }
            if ((sum % 11) % 10 == value.charAt(11)) {
               return true;
            }
         }
      } else {
         if (value.length === 10) {// 10 digits
            for (i = 0, j = 2; i < 9; i++, j++) {
               sum += value.charAt(i) * koef[j];
            }
            if ((sum % 11) % 10 == value.charAt(9)) {
               return true;
            }
         } else {
            return true;
         }
      }

      return rk('Неверная контрольная сумма ИНН');
   };
});
