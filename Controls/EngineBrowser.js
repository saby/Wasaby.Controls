define('Controls/EngineBrowser', [
   'Core/Control',
   'tmpl!Controls/EngineBrowser/EngineBrowser',
   'css!Controls/EngineBrowser/EngineBrowser'
], function(BaseControl, template) {

   'use strict';

   var Browser = BaseControl.extend({
      _template: template
   });

   return Browser;
});
