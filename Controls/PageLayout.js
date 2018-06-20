
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
            if (item.controlPanelTemplate) {
               self._controlPanelTemplate = item.controlPanelTemplate;
            }
         }
      }
   };
   var browserTabs = Control.extend({
      _template: template,

      _beforeMount: function(options) {
         _private.setTabContent(options, this);
      },
      _beforeUpdate: function(options) {
         _private.setTabContent(options, this);
      },

      getCurrentControlPanel: function() {
         return this._controlPanelTemplate || this._options.controlPanelTemplate;
      }
   });
   return browserTabs;
});
