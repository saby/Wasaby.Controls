define('Controls/Input/Dropdown/Util', [], function() {

   'use strict';
   var DropdownUtil = {

   /**
     * Открывает всплывашку
     * @param {Object} self
     * @param {Object} target
     */

      prepareEmpty: function(emptyText) {
         if (emptyText) {
            return emptyText === true ? 'Не выбрано' : emptyText;
         }
      }
   };

   return DropdownUtil;
}
);
