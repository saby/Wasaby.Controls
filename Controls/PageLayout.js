
define('Controls/PageLayout', [
   'Core/Control',
   'tmpl!Controls/PageLayout/PageLayout',
   'css!Controls/PageLayout/PageLayout'
], function(Control, template) {
   'use strict';
   var _private = {
      setCurrentItemState: function (options, self) {
         if (options.tabsSource) {
            options.tabsSource.read(options.tabsSelectedKey).addCallback(function (item) {
               this._controlPanelTemplate = item.get('controlPanelTemplate');
               this._content = item.get('content');
            }.bind(self))
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
      },

      getContent: function() {
         return this._content || this._options.content;
      },

      getControlPanelTemplate: function() {
         return this._controlPanelTemplate || this._options.controlPanelTemplate;
      }
   });
   return browserTabs;
});
