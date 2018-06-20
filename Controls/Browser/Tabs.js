
define('Controls/Browser/Tabs', [
   'Core/Control',
   'tmpl!Controls/Browser/Tabs/Tabs'
], function(Control, template) {
   'use strict';
   var _private = {
      setTabContent: function(options, self) {
         self._tabContent = options.tabsSource._getRecordByKey(options.tabsSelectedKey).content;
      }
   };
   var browserTabs = Control.extend({
      _template: template,

      _beforeMount: function(options) {
         _private.setTabContent(options, this);
      },
      _beforeUpdate: function(options) {
         _private.setTabContent(options, this);
      }
   });
   return browserTabs;
});
