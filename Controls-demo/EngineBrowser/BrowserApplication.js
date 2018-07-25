define('Controls-demo/EngineBrowser/BrowserApplication', [
   'Core/Control',
   'tmpl!Controls-demo/EngineBrowser/BrowserApplication',
], function(BaseControl, template) {
   
   'use strict';
   
   var Browser = BaseControl.extend({
      _template: template
   });
   
   return Browser;
});
