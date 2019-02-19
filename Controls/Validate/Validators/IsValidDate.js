define('Controls/Validate/Validators/IsValidDate', [
   'Controls/Utils/Date'
], function(
   dateUtils
) {
   'use strict';

   return function(args) {
      if (args.doNotValidate || !args.value || dateUtils.isValidDate(args.value)) {
         return true;
      }

      return rk('Дата или время заполнены некорректно.');
   };
});
