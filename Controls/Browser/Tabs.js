
define('Controls/Browser/Tabs', [
   'Core/Control',
   'tmpl!Controls/Browser/Tabs/Tabs'
], function(Control, template) {
   'use strict';
   var browserTabs = Control.extend({
      _template: template
   });
   return browserTabs;
});
