/**
 * Created by am.gerasimov on 01.02.2016.
 */
define('js!SBIS3.CONTROLS.ControlsValidators', ['i18n!SBIS3.CONTROLS.ControlsValidators'],function() {

   'use strict';

   return  {
      required: function(option) {
         var isEmpty;

         switch (typeof option) {
            case 'string' :
               isEmpty = !Boolean(option);
               break;
            case 'number' :
               isEmpty = isNaN(option);
               break;
            case 'object' :
               if(option instanceof $ws.proto.Enum) {
                  isEmpty = option.getCurrentValue() === null;
               } else if($ws.helpers.instanceOfModule(option, 'SBIS3.CONTROLS.Data.Collection.List')) {
                  isEmpty = !Boolean(option.getCount());
               } else if(option instanceof Array) {
                  isEmpty = !Boolean(option.length);
               } else if(option instanceof Object) {
                  isEmpty = Object.isEmpty(option)
               } else if(option === null) {
                  isEmpty = true;
               }
               break;
            case 'boolean' :
               isEmpty = option;
               break;
            case 'undefined' :
               isEmpty = true;
               break;
         }

         return isEmpty ?
             rk('Поле обязательно для заполнения') :
             true;
      }
   };
});