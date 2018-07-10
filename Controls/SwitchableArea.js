define('Controls/SwitchableArea',
   [
      'Core/Control',
      'Controls/SwitchableArea/ViewModel',
      'tmpl!Controls/SwitchableArea/SwitchableArea',
      'tmpl!Controls/SwitchableArea/resource/itemTemplate'
   ],
   function(Control, ViewModel, template, defaultItemTemplate) {

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
       * @cfg {String} Key of selected item.
       */

      /**
       * @name Controls/SwitchableArea#itemTemplateProperty
       * @cfg {String} Name of field with template, which display.
       */

      /**
       * @name Controls/SwitchableArea#itemTemplate
       * @cfg {Function} Template for item render.
       */

      var SwitchableArea = Control.extend({
         _template: template,
         _defaultItemTemplate: defaultItemTemplate,

         _beforeMount: function(options) {
            this._viewModel = new ViewModel(options.items, options.selectedKey);
            this._items = options.items;
         },

         _beforeUpdate: function(newOptions) {
            this._viewModel.updateViewModel(newOptions.items, newOptions.selectedKey);
         },
         getItemId: function(item) {
            return item.get(this._options.items.getIdProperty());
         }
      });
      return SwitchableArea;
   }
);

