define('Controls/Layout/Filter',
   [
      'Core/Control',
      'tmpl!Controls/Layout/Filter/Filter',
      'Controls/Layout/Filter/FilterContextField'
   ],
   
   function(Control, template, FilterContextField) {
      
      /**
       * @class Controls/Filter/FilterLayout
       * @extends Controls/Control
       * @control
       * @public
       */
      
      'use strict';
      
      return Control.extend({
         
         _template: template,
         
         _changeFilterHandler: function(event, filter) {
            this._filter = filter;
         },
   
         _getChildContext: function() {
            return {
               filterLayoutField: new FilterContextField(this._filter)
            };
         }
         
      });
   });