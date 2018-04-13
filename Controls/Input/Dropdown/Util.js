define('Controls/Input/Dropdown/Util', [], function() {

   'use strict';
   var DropdownUtil = {

   /**
     * Открывает всплывашку
     * @param {Object} self
     * @param {Object} target
     */
      open: function(self, target) {
         var config = {
            templateOptions: {
               items: self._items,
               defaultItemTemplate: self._defaultItemTemplate
            },
            target: target
         };
         self._children.DropdownOpener.open(config, self);
      }
   };

   return DropdownUtil;
}
);
