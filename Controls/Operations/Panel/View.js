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
         var toolbarBlock = self._children.toolbarBlock;
         if (items && toolbarBlock) {
            self._toolbarSource = new Memory({
               idProperty: 'id',
               data: WidthUtils.fillItemsType(self, items, toolbarBlock.clientWidth).getRawData()
            });
            self._forceUpdate();
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

      _beforeMount: function(options) {
         return _private.loadData(this, options.source);
      },

      _afterMount: function() {
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

      _afterUpdate: function(oldOptions) {
         if (oldOptions.multiSelectorVisibility !== this._options.multiSelectorVisibility ||
            oldOptions.rightTemplate !== this._options.rightTemplate) {
            _private.recalculateToolbarItems(this, this._items);
         }
      },

      _onResize: function() {
         _private.recalculateToolbarItems(this, this._items);
      },

      _toolbarItemClick: function(event, item) {
         this._notify('itemClick', [item]);
      }
   });
});
