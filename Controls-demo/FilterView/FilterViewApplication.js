define('Controls-demo/FilterView/FilterViewApplication', [
   'Core/Control',
   'wml!Controls-demo/FilterView/FilterViewApplication'
], function(BaseControl, template) {
   'use strict';

   return BaseControl.extend({
      _template: template
   });
});
