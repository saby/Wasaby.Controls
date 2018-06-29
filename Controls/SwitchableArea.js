define('Controls/SwitchableArea',
   [
      'Core/Control',
      'Controls/SwitchableArea/ViewModel',
      'tmpl!Controls/SwitchableArea/SwitchableArea'
   ],
   function(Control, ViewModel, template) {

      'use strict';

      var SwitchableArea = Control.extend({
         _template: template,

         _beforeMount: function(options) {
            this._viewModel = new ViewModel(options.items, options.selectedKey);
            this._items = options.items;
         },

         _beforeUpdate: function(newOptions) {
            this._viewModel.updateViewModel(newOptions.items, newOptions.selectedKey);
         },
         getIdPropertyItem: function(item) {
            return item.get(this._options.items.getIdProperty());
         }
      });
      return SwitchableArea;
   }
);

