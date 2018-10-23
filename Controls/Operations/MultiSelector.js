define('Controls/Operations/MultiSelector', [
   'Core/Control',
   'wml!Controls/Operations/MultiSelector/MultiSelector',
   'Controls/Container/MultiSelector/SelectionContextField',
   'css!theme?Controls/Operations/MultiSelector/MultiSelector'
], function(
   Control,
   template,
   SelectionContextField
) {
   'use strict';
   
   var MultiSelector = Control.extend({
      _template: template,
      _multiSelectStatus: undefined,

      _beforeMount: function(newOptions, context) {
         this._updateSelection(context.selection);
      },

      _beforeUpdate: function(newOptions, context) {
         this._updateSelection(context.selection);
      },

      _updateSelection: function(selection) {
         if (selection.selectedKeys[0] === null && !selection.excludedKeys.length) {
            this._multiSelectStatus = true;
         } else if (selection.count > 0) {
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

   MultiSelector.contextTypes = function contextTypes() {
      return {
         selection: SelectionContextField
      };
   };

   return MultiSelector;
});
