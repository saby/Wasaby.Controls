define('Controls/Container/Search',
   [
      'Core/Control',
      'tmpl!Controls/Container/Search/Search',
      'Controls/Container/Search/SearchContextField'
   ],
   
   function(Control, template, SearchContextField) {
      
      /**
       * Container for content that can be filtered by Controls/Input/Search.
       *
       * @class Controls/Container/Search
       * @extends Core/Control
       * @author Герасимов Александр
       * @control
       * @public
       */
      
      'use strict';
      
      return Control.extend({
         
         _searchValue: null,
         _template: template,
   
         _changeValueHandler: function(event, value) {
            this._searchValue = value;
         },
   
         _getChildContext: function() {
            return {
               searchLayoutField: new SearchContextField(this._searchValue)
            };
         }
         
      });
   });
