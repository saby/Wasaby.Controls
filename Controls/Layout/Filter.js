define('Controls/Layout/Filter',
   [
      'Core/Control',
      'tmpl!Controls/Layout/Filter/Filter',
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
      
      return Control.extend({
         
         _template: template,
   
         _filterChangeHandler: function(event, filter) {
            this._children.changeFilterDetect.start(filter);
         }
         
      });
   });