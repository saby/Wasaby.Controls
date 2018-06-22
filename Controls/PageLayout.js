
define('Controls/PageLayout', [
   'Core/Control',
   'tmpl!Controls/PageLayout/PageLayout',
   'Controls/Controllers/SourceController',
   'css!Controls/PageLayout/PageLayout'
], function(Control, template, SourceController) {
   'use strict';
   var _private = {
      initItems: function(source, self) {
         self._sourceController = new SourceController({
            source: source
         });
         return self._sourceController.load().addCallback(function(items) {
            return items;
         });
      },
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

      _beforeMount: function(options, context, receivedState) {
         if (receivedState) {
            this._items = receivedState;
         } else {
            return _private.initItems(options.tabsSource, this).addCallback(function(items) {
               this._items = items;
               return items;
            }.bind(this));
         }
         _private.setCurrentItemState(options, this);
      },
      _beforeUpdate: function(newOptions) {
         var self = this;
         if (newOptions.tabsSource && newOptions.tabsSource !== this._options.tabsSource) {
            return _private.initItems(newOptions.tabsSource, this).addCallback(function(items) {
               this._items = items;
               self._forceUpdate();
            }.bind(this));
         }
         _private.setCurrentItemState(newOptions, this);
      }
   });
   return browserTabs;
});
