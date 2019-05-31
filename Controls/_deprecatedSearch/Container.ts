define('Controls/Container/Search',
   [
      'Core/Control',
      'wml!Controls/Container/Search/Search',
      'Controls/Container/Search/SearchContextField',
      'Env/Env'
   ],

   function(Control, template, SearchContextField, Env) {

      'use strict';

      var Search = Control.extend({

         _searchValue: null,
         _template: template,

         constructor: function() {
            Env.IoC.resolve('ILogger').error('Controls/Container/Search', 'Component is deprecated and will be deleted in 3.18.600, use Controls/search:Controller instead.');
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

      return Search;
   });
