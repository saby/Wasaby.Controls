define('Controls/Input/Dropdown/Util',
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
