define('Controls/Filter/Container',
   [
      'Core/Control',
      'tmpl!Controls/Filter/Container',
      'Controls/Container/Data/ContextOptions'
   ],
   
   function(Control, template, DataOptions) {
      
      'use strict';
      
      var Container = Control.extend({
         
         _template: template
         
      });
      
      Container.contextTypes = function() {
         return {
            dataOptions: DataOptions
         };
      };
      
      return Container;
      
   });
