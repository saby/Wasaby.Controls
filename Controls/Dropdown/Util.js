define('Controls/Dropdown/Util',
   [],
   function() {

      'use strict';

      function prepareEmpty(emptyText) {
         if (emptyText) {
            return emptyText === true ? 'Не выбрано' : emptyText;
         }
      }

      return {prepareEmpty: prepareEmpty};
   }
);
