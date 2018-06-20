
define('Controls/PageLayout', [
   'Core/Control',
   'tmpl!Controls/PageLayout/PageLayout',
   'css!Controls/PageLayout/PageLayout'
], function(Control, template) {
   'use strict';
   var _private = {
      setTabContent: function(options, self) {
         if (options.tabsSource) {
            var item = options.tabsSource._getRecordByKey(options.tabsSelectedKey);
            if (item.content) {
               self._tabContent = item.content;
            }
            if (item.controlsAreaTemplate) {
               self._controlsAreaTemplate = item.controlsAreaTemplate;
            }
            else {
               self._controlsAreaTemplate = options.controlsAreaTemplate;
            }
         }
         else {
            self._controlsAreaTemplate = options.controlsAreaTemplate;
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
