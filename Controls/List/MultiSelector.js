define('Controls/List/MultiSelector', [
   'Core/Control',
   'tmpl!Controls/List/MultiSelector/MultiSelector',
   'Controls/Container/Data/ContextOptions'
], function(
   Control,
   template,
   DataContext
) {
   'use strict';

   var MultiSelector = Control.extend({
      _template: template,

      _onSelectionChange: function(event, keys) {
         this._notify('listSelectionChange', [keys], {
            bubbling: true
         });
      }
   });

   MultiSelector.contextTypes = function contextTypes() {
      return {
         dataOptions: DataContext
      };
   };

   return MultiSelector;
});
