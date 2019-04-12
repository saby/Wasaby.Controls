import Control = require('Core/Control');
import ViewModel = require('Controls/_SwitchableArea/ViewModel');
import template = require('wml!Controls/_SwitchableArea/SwitchableArea');
import defaultItemTemplate = require('Controls/_SwitchableArea/ItemTpl');


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

   export = SwitchableArea;

