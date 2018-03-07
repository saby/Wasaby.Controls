define('Controls/Layout/Search',
   [
      'Core/Control',
      'tmpl!Controls/Layout/Search/Search',
      'Controls/Layout/Search/SearchContextField'
   ],
   
   function(Control, template, SearchContextField) {
      
      /**
       * @class Controls/Layout/Search
       * @extends Controls/Control
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