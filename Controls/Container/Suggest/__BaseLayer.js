define('Controls/Container/Suggest/__BaseLayer',
   [
      'Core/Control',
      'Controls/Container/Search/SearchContextField',
      'Controls/Container/Filter/FilterContextField',
   ],
   
   function(Control, SearchContextField, FilterContextField) {
      
      'use strict';
      
      var __LayerBase = Control.extend({
         
         setLayerContext: function(options) {
            this._filterLayoutField = new FilterContextField({filter: options.filter});
            this._searchLayoutField = new SearchContextField(options.searchValue);
         },
         
         updateLayerContext: function(newOptions) {
            if (newOptions.filter !== this._options.filter) {
               this._filterLayoutField.filter = newOptions.filter;
               this._filterLayoutField.updateConsumers();
            }
            
            if (newOptions.searchValue !== this._options.searchValue) {
               this._searchLayoutField.searchValue = newOptions.searchValue;
               this._searchLayoutField.updateConsumers();
            }
         },
         
         getLayerContext: function() {
            return {
               filterLayoutField: this._filterLayoutField,
               searchLayoutField: this._searchLayoutField
            };
         }
      });
      
      return __LayerBase;
   });


