define('Controls/Validate/Validators/IsRequired', [], function() {
   'use strict';

   return function(args) {
      var isEmpty = false;

      switch (typeof args.value) {
         case 'string':
            isEmpty = !Boolean(args.value);
            break;
         case 'number':
            isEmpty = isNaN(args.value);
            break;
         case 'object':
            if(args.value instanceof Array) {
               isEmpty = !Boolean(args.value.length);
            } else if(args.value instanceof Object) {
               isEmpty = Object.isEmpty(args.value)
            } else if(args.value === null) {
               isEmpty = true;
            }
            break;
         case 'undefined':
            isEmpty = true;
            break;
      }

      return isEmpty ?
         rk('Поле обязательно для заполнения') :
         true;
   };
});