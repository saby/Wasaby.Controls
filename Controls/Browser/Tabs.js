
define('Controls/Browser/Tabs', [
   'Core/Control',
   'tmpl!Controls/Browser/Tabs/Tabs',
   'WS.Data/Source/Memory'
], function(Control, template, MemorySource) {
   'use strict';
   var _private = {
   };
   var browserTabs = Control.extend({
      _template: template
   });
   return browserTabs;
});
