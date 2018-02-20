define('Controls/Layout/Search',
   [
      'Core/Control',
      'tmpl!Controls/Layout/Search/Search',
      'Controls/Event/Listener'
   ],
   
   function(Control, template) {
      
      /**
       * @class Controls/Layout/Search
       * @extends Controls/Control
       * @control
       * @public
       */
      
      'use strict';
      
      return Control.extend({
         
         _template: template,
   
         _changeValueHandler: function(event, value) {
            this._children.searchChangeDetect.start(value);
         }
         
      });
   });