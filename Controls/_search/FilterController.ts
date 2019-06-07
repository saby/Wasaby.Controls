import Control = require('Core/Control');
import template = require('wml!Controls/_search/FilterController');
import clone = require('Core/core-clone');

export = Control.extend({
   _template: template,
   _filter: null,

   _beforeMount: function(options) {
      let filter = clone(options.filter);

      if (options.searchValue) {
         filter[options.searchParam] = options.searchValue;
      }

      this._filter = filter;
   },

   _beforeUpdate: function(newOptions) {
      if (this._options.filter !== newOptions.filter) {
         this._filter = newOptions.filter;
      }
   }
});
