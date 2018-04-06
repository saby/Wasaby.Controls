define('Controls/Input/Dropdown/Util', ['Controls/Controllers/SourceController'], function(SourceController) {

   'use strict';
   var DropdownUtil = {
   /**
     * Открывает всплывашку
     * @param {Object} self
     * @param {Object} target
     */
      open: function(self, target) {
         var config = {
            componentOptions: {
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
