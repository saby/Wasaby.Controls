define('Controls/Filter/Button/Container',
   [
      'Core/Control',
      'tmpl!Controls/Filter/Button/Container'
   ],
   
   function(Control, template) {
      
      /**
       * Container component for FilterButton
       * Receives props from context and pass to FilterButton.
       * Should be located inside Controls/Container/Filter.
       * @class Controls/Container/Filter/Button
       * @extends Core/Control
       * @author Герасимов Александр
       * @control
       * @public
       */
      
      'use strict';
      
      var Container = Control.extend({
         
         _template: template
      });
      
      
      return Container;
   });
