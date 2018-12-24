define('Controls/List/Container',
   [
      'Core/Control',
      'wml!Controls/List/Container',
      'Controls/Container/Data/ContextOptions'
   ],
   
   /**
    * Container component for List. Options from context -> List.
    * @param Control
    * @param template
    * @param DataOptions
    */
   
   function(Control, template, DataOptions) {
      
      'use strict';
      
      var List = Control.extend({
         
         _template: template,
         
         _beforeMount: function(options, context) {
            this._dataOptions = context.dataOptions;
         },
   
         _beforeUpdate: function(options, context) {
            this._dataOptions = context.dataOptions;
         }
         
      });
      
      List.contextTypes = function() {
         return {
            dataOptions: DataOptions
         };
      };
      
      return List;
      
   });
