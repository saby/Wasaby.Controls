define('Controls/Container/Search',
   [
      'Core/Control',
      'tmpl!Controls/Container/Search/Search',
      'Controls/Container/Search/SearchContextField',
      'Core/IoC'
   ],
   
   function(Control, template, SearchContextField, IoC) {
      
      'use strict';
      
      var Search = Control.extend({
         
         _searchValue: null,
         _template: template,
   
         constructor: function() {
            IoC.resolve('ILogger').error('Controls/Container/Search', 'Component is deprecated and will be deleted in 3.18.600, use Controls/Search/Controller instead.');
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
