define('Controls/Layouts/SearchLayout',
   [
      'Core/Control',
      'tmpl!Controls/Layouts/SearchLayout/SearchLayout',
      'Controls/Event/Listener'
   ],
   
   function(Control, template) {
      
      /**
       * @class Controls/Layout/SearchLayout
       * @extends Controls/Control
       * @control
       * @public
       */
      
      'use strict';
      
      var SearchLayout = Control.extend({
         
         _template: template,
   
         _changeValueHandler: function(event, value) {
            this._children.searchChangeDetect.start(value);
         }
         
      });
      
      return SearchLayout;
   });