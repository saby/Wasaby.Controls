import {Control} from 'UI/Base';
import {SearchContextField} from 'Controls/context';

var __LayerBase = Control.extend({

   _beforeMount: function(options) {
      this._searchLayoutField = new SearchContextField(options.searchValue);
   },

   _beforeUpdate: function(newOptions) {
      if (this._options.searchValue !== newOptions.searchValue) {
         this._searchLayoutField.searchValue = newOptions.searchValue;
         this._searchLayoutField.updateConsumers();
      }
   },

   _getChildContext: function() {
      return {
         searchLayoutField: this._searchLayoutField
      };
   }
});

export default __LayerBase;
