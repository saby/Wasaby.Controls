define('Controls-demo/dateRange/RelationController', [
   'Core/Control',
   'wml!Controls-demo/dateRange/RelationController',
   'css!Controls-demo/dateRange/RelationController'
], function(
   BaseControl,
   template
) {
   'use strict';

   var ModuleClass = BaseControl.extend({
      _template: template,

      _startValue0: new Date(2017, 0, 1),
      _endValue0: new Date(2017, 1, 0),
      _startValue1: new Date(2017, 1, 1),
      _endValue1: new Date(2017, 2, 0),
      _startValue2: new Date(2017, 1, 1),
      _endValue2: new Date(2017, 2, 0)

   });
   return ModuleClass;
});
