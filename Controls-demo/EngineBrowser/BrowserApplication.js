define('Controls-demo/EngineBrowser/BrowserApplication', [
   'Core/Control',
   'wml!Controls-demo/EngineBrowser/BrowserApplication',
], function(BaseControl, template) {
   
   'use strict';
   
   var Browser = BaseControl.extend({
      _template: template
   });
   
   return Browser;
});
