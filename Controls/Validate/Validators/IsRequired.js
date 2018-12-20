define('Controls/Validate/Validators/IsRequired', ['Core/core-instance'], function(cInstance) {
   'use strict';

   return function(args) {
      //Если передали в аргументах doNotValidate, значит возвращаем true (параметр нужен для опционального включения/отключения валидатора)
      if (args.doNotValidate) {
         return true;
      }

      var isEmpty = false;

      switch (typeof args.value) {
         case 'string':
            isEmpty = !Boolean(args.value);
            break;
         case 'number':
            isEmpty = isNaN(args.value);
            break;
         case 'object':
            if (cInstance.instanceOfModule(args.value, 'WS.Data/Collection/List')) {
               isEmpty = !Boolean(args.value.getCount());
            } else if (args.value instanceof Array) {
               isEmpty = !Boolean(args.value.length);
            } else if (args.value instanceof Date) {
               isEmpty = false;
            } else if (args.value instanceof Object) {
               isEmpty = !(Object.keys(args.value).length);
            } else if (args.value === null) {
               isEmpty = true;
            }
            break;
         case 'undefined':
            isEmpty = true;
            break;
      }

      return isEmpty
         ? rk('Поле обязательно для заполнения')
         : true;
   };
});
