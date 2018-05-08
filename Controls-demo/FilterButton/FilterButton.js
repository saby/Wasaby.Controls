define('Controls-demo/FilterButton/FilterButton',
   [
      'Core/Control',
      'tmpl!Controls-demo/FilterButton/FilterButton',
      'css!Controls-demo/FilterButton/FilterButton',
      'Controls/Filter/Button',
      'Controls/Button'
   ],
   
   function(Control, template) {
      
      /**
       * @class Controls/Container/Search
       * @extends Controls/Control
       * @control
       * @public
       */
      
      'use strict';
      
      var FilterButton = Control.extend({
         
         _template: template

      });
      
      return FilterButton;
   });