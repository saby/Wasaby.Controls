define('Controls/SwitchableArea', [
   'Core/Control',
   'Controls/SwitchableArea/ViewModel',
   'wml!Controls/SwitchableArea/SwitchableArea',
   'wml!Controls/SwitchableArea/resource/itemTemplate'
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
    * @author Зайцев А.С.
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
         if (this._options.selectedKey !== newOptions.selectedKey) {
            this._viewModel.updateViewModel(newOptions.selectedKey);
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
