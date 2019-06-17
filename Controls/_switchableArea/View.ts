import Control = require('Core/Control');
import ViewModel from './ViewModel';
import template = require('wml!Controls/_switchableArea/View');
import defaultItemTemplate from './ItemTpl';

/**
 * Компонент который переключает контентные области.
 *
 * @class Controls/_switchableArea/View
 * @extends Core/Control
 * @control
 * @public
 * @author Михайловский Д.С.
 * @demo Controls-demo/SwitchableArea/DemoSwitchableArea
 */

/*
 Component switches content areas.
*/
/**
 * @typedef {Object} SwitchableAreaItem
 * @property {String|Number} id
 * @property {Function} itemTemplate
 */

/**
 * @name Controls/_switchableArea/View#items
 * @cfg {Array.<SwitchableAreaItem>}
 */

/**
 * @name Controls/_switchableArea/View#selectedKey
 * @cfg {String} Key of selected item.
 */

/**
 * @name Controls/_switchableArea/View#itemTemplate
 * @cfg {Function} Template for item render.
 */

var View = Control.extend({
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

View.getDefaultOptions = function() {
   return {
      itemTemplate: defaultItemTemplate
   };
};

export default View;
