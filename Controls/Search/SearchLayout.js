define('Controls/Search/SearchLayout',
   [
      'Core/Control',
      'tmpl!Controls/Search/SearchLayout/SearchLayout',
      'Controls/Search/SearchResult',
      'Controls/Event/Listener'
   ],
   
   function(Control, template) {
      
      /**
       * @class Controls/Search/SearchLayout
       * @extends Controls/Control
       * @control
       * @public
       */
      
      'use strict';
      
      var SearchLayout = Control.extend({
         
         _template: template,
   
         _changeValueHandler: function(event, value) {
            this._children.searchValueDetect.start(value);
         }
         
      });
      
      return SearchLayout;
   });