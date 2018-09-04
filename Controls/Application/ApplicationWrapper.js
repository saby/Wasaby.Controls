define('Controls/Application/ApplicationWrapper', [
   'Core/Control',
   'wml!Controls/Application/ApplicationWrapper'
], function(Control, template) {
   'use strict';


   var ModuleClass = Control.extend(
      {
         _template: template
      });
   return ModuleClass;
});
