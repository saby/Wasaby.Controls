define('Controls-demo/CompatibleDemo/WasabyEnv/Demo',
   [
      'Core/Control',
      'wml!Controls-demo/CompatibleDemo/WasabyEnv/Demo',
      'css!Controls-demo/CompatibleDemo/CompatibleDemo'
   ],
   function(Control, template) {
      'use strict';

      var CompatibleDemo = Control.extend({
         _template: template,
      });
      return CompatibleDemo;
   }
);
