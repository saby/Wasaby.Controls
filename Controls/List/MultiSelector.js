define('Controls/List/MultiSelector', [
   'Core/Control',
   'tmpl!Controls/List/MultiSelector/MultiSelector',
   'Controls/Container/MultiSelector/SelectionContextField'
], function(
   Control,
   template,
   SelectionContextField
) {
   'use strict';

   var MultiSelector = Control.extend({
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

   MultiSelector.contextTypes = function contextTypes() {
      return {
         selection: SelectionContextField
      };
   };

   return MultiSelector;
});
