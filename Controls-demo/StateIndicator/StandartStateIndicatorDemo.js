define('Controls-demo/StateIndicator/StandartStateIndicatorDemo', [
   'Core/Control',
   'wml!Controls-demo/StateIndicator/StandartStateIndicatorDemo',   
   'css!Controls-demo/StateIndicator/StandartStateIndicatorDemo',
], function(Control, template) {
   'use strict';
   var Index = Control.extend(
      {
         _template: template,
      });
   return Index;
});
