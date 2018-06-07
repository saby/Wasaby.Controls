define('Controls/Input/Dropdown/Util', [], function() {

   'use strict';
   var DropdownUtil = {

      prepareEmpty: function(emptyText) {
         if (emptyText) {
            return emptyText === true ? 'Не выбрано' : emptyText;
         }
      }
   };

   return DropdownUtil;
}
);
