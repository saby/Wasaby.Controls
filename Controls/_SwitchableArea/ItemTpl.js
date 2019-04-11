define('Controls/SwitchableArea/ItemTpl', [
   'Core/Control',
   'wml!Controls/SwitchableArea/ItemTpl'
],
function(
   Control,
   template
) {
   'use strict';
   var SwitchableAreaItem = Control.extend({
      _template: template,

      _afterMount: function() {
         // if we select current item, then activate it, for focusing child controls
         this.activate();
      },

      _afterUpdate: function(oldOptions) {
         // if we select current item, then activate it, for focusing child controls
         if (this._options.selectedKey !== oldOptions.selectedKey && this._options.selectedKey === this._options.key) {
            this.activate();
         }
      }
   });

   return SwitchableAreaItem;
});
