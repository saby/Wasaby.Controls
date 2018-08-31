define('Controls/Selector/__BrowserLayout', [
   'Core/Control',
   'tmpl!Controls/Selector/__BrowserLayout',
   'css!Controls/EngineBrowser/EngineBrowser'
   
], function(BaseControl, template) {
   
   'use strict';
   
   var Browser = BaseControl.extend({
      _template: template
   });
   
   return Browser;
});
