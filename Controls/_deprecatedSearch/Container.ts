import Control = require('Core/Control');
import template = require('wml!Controls/_deprecatedSearch/Container');
import {SearchContextField} from 'Controls/context';
import {Logger} from 'UI/Utils';

var Search = Control.extend({

   _searchValue: null,
   _template: template,

   constructor: function() {
      Logger.error('Controls/deprecatedSearch:Container', 'Component is deprecated and will be deleted in 3.18.600, use Controls/search:Controller instead.', this);
      Search.superclass.constructor.apply(this, arguments);
   },

   _changeValueHandler: function(event, value) {
      this._searchValue = value;
   },

   _getChildContext: function() {
      return {
         searchLayoutField: new SearchContextField(this._searchValue)
      };
   }

});

export default Search;
