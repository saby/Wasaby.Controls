define('Controls/SwitchableArea', [
   'Core/Control',
   'Controls/SwitchableArea/ViewModel',
   'wml!Controls/SwitchableArea/SwitchableArea',
   'Controls/SwitchableArea/ItemTpl'
],
function(
   Control,
   ViewModel,
   template,
   defaultItemTemplate
) {
   'use strict';

   /**
    * SwitchableArea
    *
    * @class Controls/SwitchableArea
    * @extends Core/Control
    * @control
    * @public
    * @author Михайловский Д.С.
    */

   /**
    * @typedef {Object} SwitchableAreaItem
    * @property {String|Number} id
    * @property {Function} itemTemplate
    */

   /**
    * @name Controls/SwitchableArea#items
    * @cfg {Array.<SwitchableAreaItem>}
    */

   /**
    * @name Controls/SwitchableArea#selectedKey
    * @cfg {String} Key of selected item.
    */

   /**
    * @name Controls/SwitchableArea#itemTemplate
    * @cfg {Function} Template for item render.
    */

   var SwitchableArea = Control.extend({
      _template: template,

      _beforeMount: function(options) {
         this._viewModel = new ViewModel(options.items, options.selectedKey);
      },

      _beforeUpdate: function(newOptions) {
         if (this._options.items !== newOptions.items) {
            this._viewModel.updateItems(newOptions.items);
         }
         if (this._options.selectedKey !== newOptions.selectedKey) {
            this._viewModel.updateSelectedKey(newOptions.selectedKey);
         }
      },

      _beforeUnmount: function() {
         this._viewModel = null;
      }
   });

   SwitchableArea.getDefaultOptions = function() {
      return {
         itemTemplate: defaultItemTemplate
      };
   };

   return SwitchableArea;
});
