define('Controls/Dropdown/Util',
   [],
   function() {

      'use strict';

      function prepareEmpty(emptyText) {
         if (emptyText) {
            return emptyText === true ? rk('Не выбрано') : emptyText;
         }
      }

      return {prepareEmpty: prepareEmpty};
   }
);
