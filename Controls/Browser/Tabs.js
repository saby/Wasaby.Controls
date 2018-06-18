
define('Controls/Browser/Tabs', [
   'Core/Control',
   'tmpl!Controls/Browser/Tabs/Tabs',
   'WS.Data/Source/Memory',
   'Core/Deferred'
], function(Control, template, MemorySource, Deferred) {
   'use strict';
   var _private = {
      initContent: function(currentTab, self) {
         var def = new Deferred();
         requirejs([currentTab.content], function(tabContent) {
            self._content = tabContent;
            def.callback(tabContent);
         });
         return def;
      }
   };
   var browserTabs = Control.extend({
      _template: template,
      _beforeMount: function(options, context, receivedState) {
         if (receivedState) {
            this._content = receivedState;
         } else {
            return _private.initContent(options.tabsSource._getRecordByKey(options.tabsSelectedKey), this);
         }
      },

      _beforeUpdate: function(newOptions) {
         return _private.initContent(newOptions.tabsSource._getRecordByKey(newOptions.tabsSelectedKey), this);
      }
   });
   return browserTabs;
});
