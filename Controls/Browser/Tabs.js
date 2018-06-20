
define('Controls/Browser/Tabs', [
   'Core/Control',
   'tmpl!Controls/Browser/Tabs/Tabs',
   'css!Controls/Browser/Tabs/Tabs'
], function(Control, template) {
   'use strict';
   var _private = {
      setTabContent: function(options, self) {
         var item = options.tabsSource._getRecordByKey(options.tabsSelectedKey);
         if (item.content) {
            self._tabContent = item.content;
         }
         if (item.controlsAreaTemplate) {
            self._controlsAreaTemplate = item.controlsAreaTemplate;
         }
      }
   };
   var browserTabs = Control.extend({
      _template: template,
      _controlAreaTemplate: null,

      _beforeMount: function(options) {
         _private.setTabContent(options, this);
      },
      _beforeUpdate: function(options) {
         _private.setTabContent(options, this);
      }
   });
   return browserTabs;
});
