define('Controls/SwitchableArea', [
   'Core/Control',
   'Controls/SwitchableArea/ViewModel'
   ],
   function(Control, ViewModel) {
   'use strict';

   var SwitchableArea = Control.extend({
      _template: template,

      _beforeMount: function(options) {
         this._viewModel = new ViewModel({
            items: options.items
         });
      },

      _beforeUpdate: function(newOptions) {
         if (this._options.items !== newOptions.items) {
            this._viewModel.updateOptions({
               value: newOptions.items
            });
         }
      }
   });
   return SwitchableArea;
});