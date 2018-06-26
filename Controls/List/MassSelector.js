define('Controls/List/MassSelector', [
   'Core/Control',
   'tmpl!Controls/List/MassSelector/MassSelector',
   'Controls/Container/MassSelector/SelectionContextField'
], function(Control, template, SelectionContextField) {
   'use strict';

   var MassSelector = Control.extend({
      _template: template,

      _onCheckBoxClickHandler: function(event, key, status) {
         this._notify('listCheckBoxClick', [key, status], {
            bubbling: true
         });
      },

      _onAfterItemsRemoveHandler: function(event, keys) {
         this._notify('listAfterItemsRemove', [keys], {
            bubbling: true
         });
      }
   });

   MassSelector.contextTypes = function contextTypes() {
      return {
         selection: SelectionContextField
      };
   };

   return MassSelector;
});
