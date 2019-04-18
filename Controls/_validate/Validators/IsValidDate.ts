import dateUtils = require('Controls/Utils/Date');

export = function (args) {
   if (args.doNotValidate || !args.value || dateUtils.isValidDate(args.value)) {
      return true;
   }

   return rk('Дата или время заполнены некорректно.');
};