define('Controls/Button/SelectorButton', [
   'Core/Control',
   'wml!Controls/Button/SelectorButton/SelectorButton',
   'WS.Data/Chain',
   'WS.Data/Collection/List',
   'Core/helpers/Object/isEqual',
   'Controls/Controllers/SourceController',
   'Core/core-merge',
   'css!Controls/Button/SelectorButton/SelectorButton'
], function(Control, template, Chain, List, isEqual, SourceController, cMerge) {
   'use strict';

   var _private = {
      loadItems: function(self, source, filter, selectedKeys, keyProperty, displayProperty) {
         self._sourceController = new SourceController({
            source: source
         });
         var filterSelectedKeys = {};
         filterSelectedKeys[keyProperty] = selectedKeys;
         return self._sourceController.load(cMerge(filterSelectedKeys, filter || {})).addCallback(function(items) {
            _private.updateValues(self, items, displayProperty, keyProperty);
            return items;
         });
      },
      getVisibleItems: function(items, maxVisibilityItems) {
         return new List({
            items: Chain(items).last(maxVisibilityItems).value()
         });
      },
      getSelectedKeys: function(items, keyProperty) {
         var selKeys = [];
         Chain(items).each(function(item) {
            if (item.get(keyProperty)) {
               selKeys.push(item.get(keyProperty));
            }
         });
         return selKeys;
      },
      updateValues: function(self, items, displayProperty, keyProperty) {
         if (!self._selectedItems) {
            self._selectedItems = items;
         } else {
            self._selectedItems.assign(items);
         }
         self._selectedItemsVisible = _private.getVisibleItems(self._selectedItems, self._options.maxVisibilityItems);
         self._selectedKeys = _private.getSelectedKeys(items, keyProperty);
      },
      removeItem: function(self, item) {
         self._selectedItems.remove(item);
         _private.updateValues(self, self._selectedItems, self._options.displayProperty, self._options.keyProperty);
         _private.notifyChanges(self, self._selectedItems, self._selectedKeys);
      },
      notifyChanges: function(self, items, keys) {
         self._notify('selectedItemsChanged', [items]);
         self._notify('selectedKeysChanged', [keys]);
      },
      updateAndNotify: function(self, items) {
         _private.updateValues(self, items, self._options.displayProperty, self._options.keyProperty);
         _private.notifyChanges(self, self._selectedItems, self._selectedKeys);
      }
   };

   var SelectorButton = Control.extend({
      _template: template,
      _selectedItems: null,
      _selectedKeys: null,
      _selectedItemsVisible: null,

      _beforeMount: function(options, context, receivedState) {
         this._onResult = this._onResult.bind(this);
         this._resultHiddenItem = this._resultHiddenItem.bind(this);
         if (options.selectedKeys) {
            this._selectedKeys = options.selectedKeys;
            if (receivedState) {
               _private.updateValues(this, receivedState, options.displayProperty);
            } else if (options.source) {
               return _private.loadItems(this, options.source, options.filter,
                  options.selectedKeys, options.keyProperty, options.displayProperty);
            }
         }
      },

      _beforeUpdate: function(newOptions) {
         if (!isEqual(newOptions.selectedKeys, this._options.selectedKeys)) {
            this._selectedKeys = newOptions.selectedKeys;
            if (newOptions.source) {
               var self = this;
               return _private.loadItems(this, newOptions.source, newOptions.filter, newOptions.selectedKeys,
                  newOptions.keyProperty, newOptions.displayProperty).addCallback(function(items) {
                  self._forceUpdate();
                  return items;
               });
            }
         }
      },

      _open: function() {
         var tplOptions = {
            selectedItems: this._selectedItems,
            multiSelect: this._options.multiSelect
         };
         cMerge(tplOptions, this._options.templateOptions);
         this._children.selectorOpener.open({
            templateOptions: tplOptions,
            template: this._options.templateName,
            target: this._children.link
         });
      },

      _onResult: function(result) {
         _private.updateAndNotify(this, result);
      },

      _resultHiddenItem: function(item, eventType) {
         if (eventType === 'crossClick') {
            _private.removeItem(this, item);
            if (this._selectedItems.getCount() <= this._options.maxVisibilityItems) {
               this._children.stickyOpener.close();
            }
         } else if (eventType === 'itemClick') {
            this._itemClickHandler(item);
         }
      },

      _reset: function() {
         _private.updateAndNotify(this, []);
      },

      _crossClick: function(event, item) {
         _private.removeItem(this, item);
      },

      _showHiddenItems: function() {
         this._children.stickyOpener.open({
            templateOptions: {
               items: this._selectedItems,
               displayProperty: this._options.displayProperty,
               width: this._container.offsetWidth
            },
            target: this._children.hiddenItems,
            template: 'Controls/Button/SelectorButton/itemHiddenTemplate'
         });
      },

      _itemClickHandler: function(item) {
         this._notify('itemClick', [item]);
      }
   });

   SelectorButton.getDefaultOptions = function() {
      return {
         style: 'linkMain2',
         maxVisibilityItems: 7
      };
   };

   SelectorButton._private = _private;

   return SelectorButton;
});
