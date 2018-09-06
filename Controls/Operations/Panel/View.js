define('Controls/Operations/Panel/View', [
   'Core/Control',
   'tmpl!Controls/Operations/Panel/View/View',
   'tmpl!Controls/Operations/Panel/ItemTemplate',
   'WS.Data/Source/Memory',
   'Controls/Operations/Panel/Utils',
   'Controls/Toolbar',
   'css!Controls/Operations/Panel/View/View'
], function(Control, template, ItemTemplate, Memory, WidthUtils) {
   'use strict';

   var _private = {
      recalculateToolbarItems: function(self, items) {
         var
            toolbarWidth,
            toolbarBlock = self._children.toolbarBlock;
         if (items && toolbarBlock) {
            //In ie clientWidth is 0. But in fact, the element already exists in the DOM and it is visible.
            toolbarWidth = parseInt(getComputedStyle(toolbarBlock).width, 10);
            self._toolbarSource = new Memory({
               idProperty: 'id',
               data: WidthUtils.fillItemsType(self, items, toolbarWidth).getRawData()
            });
            self._forceUpdate();
         }
      },
      checkToolbarWidth: function(self) {
         var newWidth = self._children.toolbarBlock.clientWidth;
         if (self._oldToolbarWidth !== newWidth) {
            self._oldToolbarWidth = newWidth;
            _private.recalculateToolbarItems(self, self._items);
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
      _toolbarSource: undefined,
      _loadItemsDeferred: undefined,
      _lastWidth: undefined,
      _items: undefined,
      _oldToolbarWidth: 0,

      _beforeMount: function(options) {
         return _private.loadData(this, options.source);
      },

      _afterMount: function() {
         this._oldToolbarWidth = this._children.toolbarBlock.clientWidth;
         _private.recalculateToolbarItems(this, this._items);
      },

      _beforeUpdate: function(newOptions) {
         var self = this;
         if (newOptions.source !== this._options.source) {
            _private.loadData(this, newOptions.source).addCallback(function() {
               _private.recalculateToolbarItems(self, self._items);
            });
         }
      },

      _afterUpdate: function() {
         _private.checkToolbarWidth(this);
      },

      _onResize: function() {
         _private.recalculateToolbarItems(this, this._items);
      },

      _toolbarItemClick: function(event, item) {
         this._notify('itemClick', [item]);
      }
   });
});
