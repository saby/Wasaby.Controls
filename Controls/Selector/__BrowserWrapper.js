define('Controls/Selector/__BrowserWrapper', [
   'Core/Control',
   'tmpl!Controls/Selector/__BrowserWrapper'
], function(BaseControl, template) {
   
   'use strict';
   
   var Browser = BaseControl.extend({
      _template: template
   });
   
   return Browser;
});
