import Control = require('Core/Control');
import template = require('wml!Controls/_SwitchableArea/ItemTpl');

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

   export = SwitchableAreaItem;

