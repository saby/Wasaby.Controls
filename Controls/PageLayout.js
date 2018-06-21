
define('Controls/PageLayout', [
   'Core/Control',
   'Controls/Controllers/SourceController',
   'tmpl!Controls/PageLayout/PageLayout',
   'css!Controls/PageLayout/PageLayout'
], function(Control, SourceController, template) {
   'use strict';
   var _private = {
      initItems: function(source, self) {
         self._sourceController = new SourceController({
            source: source,
            idProperty: 'id'
         });
         return self._sourceController.load().addCallback(function(items) {
            return items;
         });
      }
   };
   var browserTabs = Control.extend({
      _template: template,

      _beforeMount: function(options, context, receivedState) {
         if (receivedState) {
            this._items = receivedState;
         } else if (options.tabsSource) {
            return _private.initItems(options.tabsSource, this).addCallback(function(items) {
               this._items = items;
               return items;
            }.bind(this));
         }
         if (this._items) {
            this._selectedItem = this._items.at(this._options.tabsSelectedKey);
         }
      },
      _beforeUpdate: function(newOptions) {
         var self = this;
         if (newOptions.tabsSource && newOptions.tabsSource !== this._options.tabsSource) {
            return _private.initItems(newOptions.tabsSource, this).addCallback(function(items) {
               this._items = items;
               self._forceUpdate();
            }.bind(this));
         }
         if (this._items) {
            this._selectedItem = this._items.at(this._options.tabsSelectedKey);
         }
      },

      getCurrentControlPanel: function() {
         if (this._selectedItem) {
            return this._selectedItem.get('controlPanelTemplate') || this._options.controlPanelTemplate;
         }
         return this._options.controlPanelTemplate;
      },

      getCurrentTabContent: function() {
         if (this._selectedItem) {
            return this._selectedItem.get('content') || this._options.content;
         }
         return this._options.content;
      }
   });
   return browserTabs;
});
