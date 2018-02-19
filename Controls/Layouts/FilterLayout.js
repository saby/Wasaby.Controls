define('Controls/Layouts/FilterLayout',
   [
      'Core/Control',
      'tmpl!Controls/Layouts/FilterLayout/FilterLayout',
      'Controls/Event/Listener'
   ],
   
   function(Control, template) {
      
      /**
       * @class Controls/Filter/FilterLayout
       * @extends Controls/Control
       * @control
       * @public
       */
      
      'use strict';
      
      var FilterLayout = Control.extend({
         
         _template: template,
   
         _filterChangeHandler: function(event, filter) {
            this._children.changeFilterDetect.start(filter);
         }
         
      });
      
      return FilterLayout;
   });