define('Controls-demo/SwitchableArea/resources/bigContent', ['wml!Controls-demo/SwitchableArea/resources/bigContent', 'Core/Control'], function(template, Control) {
   'use strict';

   var BigContent = Control.extend({
      _template: template
   });

   return BigContent;
});
