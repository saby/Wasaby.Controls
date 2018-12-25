define('Controls-demo/TestNewThemes/Main1', [
   'Core/Control',
   'wml!Controls-demo/TestNewThemes/Main'
], function(
   Control,
   template
) {
   'use strict';
   var Main1 = Control.extend({
      _template: template
   });

   return Main1;
});
