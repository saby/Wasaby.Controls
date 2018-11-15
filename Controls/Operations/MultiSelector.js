define('Controls/Operations/MultiSelector', [
   'Core/Control',
   'wml!Controls/Operations/MultiSelector/MultiSelector',
   'css!theme?Controls/Operations/MultiSelector/MultiSelector'
], function(
   Control,
   template
) {
   'use strict';

   var MultiSelector = Control.extend({
      _template: template,
      _multiSelectStatus: undefined,

      _beforeMount: function(newOptions) {
         this._updateSelection(newOptions.selectedKeys, newOptions.excludedKeys, newOptions.selectedKeysCount);
      },

      _beforeUpdate: function(newOptions) {
         this._updateSelection(newOptions.selectedKeys, newOptions.excludedKeys, newOptions.selectedKeysCount);
      },

      _updateSelection: function(selectedKeys, excludedKeys, count) {
         if (selectedKeys[0] === null && !excludedKeys.length) {
            this._multiSelectStatus = true;
         } else if (count > 0) {
            this._multiSelectStatus = null;
         } else {
            this._multiSelectStatus = false;
         }
      },

      _onCheckBoxClick: function() {
         this._notify('selectedTypeChanged', [this._multiSelectStatus === false ? 'selectAll' : 'unselectAll'], {
            bubbling: true
         });
      }
   });

   return MultiSelector;
});
