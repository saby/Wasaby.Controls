define('Controls/List/Tree/TreeViewModel', [
   'Controls/List/ListViewModel',
   'Controls/List/resources/utils/ItemsUtil',
   'Controls/List/resources/utils/TreeItemsUtil',
   'Core/core-clone'
], function(ListViewModel, ItemsUtil, TreeItemsUtil, cClone) {

   'use strict';

   var
      _private = {
         isVisibleItem: function(item) {
            var
               itemParent = item.getParent();
            if (itemParent && !itemParent.isRoot()) {
               if (this.expandedNodes[ItemsUtil.getPropertyValue(itemParent.getContents(), this.keyProperty)]) {
                  return _private.isVisibleItem.call(this, itemParent);
               } else {
                  return false;
               }
            } else {
               return true;
            }
         },

         displayFilter: function(item, index, itemDisplay) {
            return _private.isVisibleItem.call(this, itemDisplay);
         },

         getDisplayFilter: function(expandedNodes, cfg) {
            var
               filter = [];
            filter.push(_private.displayFilter.bind({
               expandedNodes: expandedNodes,
               keyProperty: cfg.keyProperty
            }));
            if (cfg.itemsFilterMethod) {
               filter.push(cfg.itemsFilterMethod);
            }
            return filter;
         }
      },

      TreeViewModel = ListViewModel.extend({
         _expandedNodes: null,

         constructor: function(cfg) {
            this._options = cfg;
            if (cfg.expandedNodes) {
               this._expandedNodes = cClone(cfg.expandedNodes);
            } else {
               this._expandedNodes = {};
            }
            TreeViewModel.superclass.constructor.apply(this, arguments);
         },

         _prepareDisplay: function(items, cfg) {
            return TreeItemsUtil.getDefaultDisplayTree(items, cfg, _private.getDisplayFilter(this._expandedNodes, cfg));
         },

         toggleExpanded: function(dispItem) {
            var
               itemId = ItemsUtil.getPropertyValue(dispItem.getContents(), this._options.keyProperty);
            if (this._expandedNodes[itemId]) {
               delete this._expandedNodes[itemId];
            } else {
               this._expandedNodes[itemId] = true;
            }
            this._display.setFilter(_private.getDisplayFilter(this._expandedNodes, this._options));
            this._nextVersion();
            this._notify('onListChange');
         },

         getCurrent: function() {
            var
               current = TreeViewModel.superclass.getCurrent.apply(this, arguments);
            current.isExpanded = !!this._expandedNodes[current.key];
            // current.multiSelectStatus = null;
            return current;
         }

      });

   TreeViewModel._private = _private;

   return TreeViewModel;
});
