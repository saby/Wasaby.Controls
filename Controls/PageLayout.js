
define('Controls/PageLayout', [
   'Core/Control',
   'tmpl!Controls/PageLayout/PageLayout',
   'css!Controls/PageLayout/PageLayout'
], function(Control, template) {
   'use strict';
   var _private = {
      setCurrentItemState: function(options, self) {
         if (options.tabsSource) {
            options.tabsSource.read(options.tabsSelectedKey).addCallback(function(item) {
               self._controlPanelTemplate = item.get('controlPanelTemplate');
               self._content = item.get('content');
            });
         }
      }
   };
   var browserTabs = Control.extend({
      _template: template,

      _beforeMount: function(options) {
         _private.setCurrentItemState(options, this);
      },
      _beforeUpdate: function(newOptions) {
         _private.setCurrentItemState(newOptions, this);
      }
   });
   return browserTabs;
});
