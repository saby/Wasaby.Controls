define('Controls/SwitchableArea/ViewModel', [
   'Core/core-simpleExtend',
   'Core/core-clone'
],
function(
   SimpleExtend,
   cClone
) {
   'use strict';

   var _private = {
      updateLoadStatus: function(selectedKey, self) {
         self._items.find(function(item) {
            return selectedKey === item.id || selectedKey === item.key;
         }).loaded = true;
      },

      updateItems: function(items, self) {
         self._items = cClone(items);
      }
   };

   var ViewModel = SimpleExtend.extend({
      constructor: function(items, selectedKey) {
         ViewModel.superclass.constructor.apply(this, arguments);
         _private.updateItems(items, this);
         _private.updateLoadStatus(selectedKey, this);
      },
      updateSelectedKey: function(selectedKey) {
         _private.updateLoadStatus(selectedKey, this);
      },
      updateItems: function(items) {
         _private.updateItems(items, this);
      }
   });

   return ViewModel;
});
