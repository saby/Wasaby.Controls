define('Controls/SwitchableArea',
   [
      'Core/Control',
      'Controls/SwitchableArea/ViewModel',
      'tmpl!Controls/SwitchableArea/SwitchableArea'
   ],
   function(Control, ViewModel, template) {

      'use strict';

      /**
       * SwitchableArea
       *
       * @class Controls/SwitchableArea
       * @extends Core/Control
       * @control
       * @public
       * @category SwitchableArea
       * @demo Controls-demo/SwitchableArea/DemoSwitchableArea
       */

      /**
       * @name Controls/SwitchableArea#items
       * @cfg {RecordSet} RecordSet of item, which itemTemplate are displayed.
       */

      /**
       * @name Controls/SwitchableArea#selectedKey
       * @cfg {Function} Key of selected item.
       */

      /**
       * @name Controls/SwitchableArea#itemTemplateProperty
       * @cfg {RecordSet} Name of field with template, which display.
       */

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

