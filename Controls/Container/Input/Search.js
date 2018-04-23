define('Controls/Container/Input/Search',
   [
      'Core/Control',
      'tmpl!Controls/Container/Input/Search/Search'
   ],
   
   function(Control, template) {
      
      /**
       * Container component for Search
       * Notify bubbling event "search".
       * Should be located inside Controls/Container/Search.
       * @class Controls/Container/Input/Search
       * @extends Controls/Control
       * @author Герасимов Александр
       * @control
       * @public
       */
      
      'use strict';
      
      var SearchContainer = Control.extend({
         
         _template: template,
         
         _searchHandler: function(event, value) {
            this._notify('search', [value], {bubbling: true});
         }
      });
      
      return SearchContainer;
   });
