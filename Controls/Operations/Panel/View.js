define('Controls/Operations/Panel/View', [
   'Core/Control',
   'wml!Controls/Operations/Panel/View/View',
   'wml!Controls/Operations/Panel/ItemTemplate',
   'WS.Data/Source/Memory',
   'Controls/Operations/Panel/Utils',
   'Controls/Toolbar',
   'css!Controls/Operations/Panel/View/View'
], function(Control, template, ItemTemplate, Memory, WidthUtils) {
   'use strict';

   var _private = {
      recalculateToolbarItems: function(self, items, toolbarWidth) {
         if (items) {
            self._toolbarSource = new Memory({
               idProperty: self._options.keyProperty,
               data: WidthUtils.fillItemsType(self._options.keyProperty, self._options.parentProperty, items, toolbarWidth).getRawData()
            });
            self._forceUpdate();
         }
      },
      checkToolbarWidth: function(self) {
         var newWidth = self._children.toolbarBlock.clientWidth;
         if (self._oldToolbarWidth !== newWidth) {
            self._oldToolbarWidth = newWidth;
            _private.recalculateToolbarItems(self, self._items, newWidth);
         }
      },
      loadData: function(self, source) {
         var result;
         if (source) {
            result = source.query().addCallback(function(dataSet) {
               self._items = dataSet.getAll();
               return self._items;
            });
         }
         return result;
      }
   };

   return Control.extend({
      _template: template,
      _itemTemplate: ItemTemplate,
      _oldToolbarWidth: 0,

      _beforeMount: function(options) {
         return _private.loadData(this, options.source);
      },

      _afterMount: function() {
         _private.checkToolbarWidth(this);
      },

      _beforeUpdate: function(newOptions) {
         var self = this;
         if (newOptions.source !== this._options.source) {
            _private.loadData(this, newOptions.source).addCallback(function() {
               _private.recalculateToolbarItems(self, self._items, self._children.toolbarBlock.clientWidth);
            });
         }
      },

      _afterUpdate: function() {
         _private.checkToolbarWidth(this);
      },

      _onResize: function() {
         _private.checkToolbarWidth(this);
      },

      _toolbarItemClick: function(event, item) {
         this._notify('itemClick', [item]);
      }
   });
});
