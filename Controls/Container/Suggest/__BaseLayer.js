define('Controls/Container/Suggest/__BaseLayer',
   [
      'Core/Control',
      'Controls/Container/Search/SearchContextField',
      'Controls/Container/Filter/FilterContextField',
   ],
   
   function(Control, SearchContextField, FilterContextField) {
      
      'use strict';
      
      var __LayerBase = Control.extend({
   
         _getChildContext: function() {
            return {
               filterLayoutField: new FilterContextField({filter: this._options.filter}),
               searchLayoutField: new SearchContextField(this._options.searchValue)
            };
         }
      });
      
      return __LayerBase;
   });


