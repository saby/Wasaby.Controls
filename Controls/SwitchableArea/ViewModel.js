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
            return selectedKey === item.id;
         }).loaded = true;
      }
   };

   var ViewModel = SimpleExtend.extend({
      constructor: function(items, selectedKey) {
         ViewModel.superclass.constructor.apply(this, arguments);
         this._items = cClone(items);
         _private.updateLoadStatus(selectedKey, this);
      },
      updateViewModel: function(selectedKey) {
         _private.updateLoadStatus(selectedKey, this);
      }
   });

   return ViewModel;
});
