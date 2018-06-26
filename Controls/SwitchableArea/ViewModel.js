define('Controls/SwitchableArea/ViewModel',
   [
      'Core/Control',
      'tmpl!Controls/SwitchableArea/SwitchableArea'
   ],
   function(Control, template) {

      'use strict';

      var _private = {
         updateLoadStatus: function(options) {
            options.items.getRecordById(options.selectedKey).beLoad = true;
         }
      };

      var ViewModel = Control.extend({
         _template: template,
         _beforeMount: function(options) {
            _private.updateLoadStatus(options);
         },
         _beforeUpdate: function(newOptions) {
            _private.updateLoadStatus(newOptions);
         }
      });

      return ViewModel;
   }
);
