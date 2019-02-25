define('Controls-demo/ProcessStateIndicator/StandartProcessStateIndicatorDemo', [
   'Core/Control',
   'wml!Controls-demo/ProcessStateIndicator/StandartProcessStateIndicatorDemo',   
   'css!Controls-demo/ProcessStateIndicator/StandartProcessStateIndicatorDemo',
], function(Control, template) {
   'use strict';
   var Index = Control.extend(
      {
         _template: template,
      });
   return Index;
});
