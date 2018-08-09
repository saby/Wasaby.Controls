define('Controls/List/Tree/TreeViewModel', [
   'Controls/List/ListViewModel',
   'Controls/List/resources/utils/ItemsUtil',
   'Controls/List/resources/utils/TreeItemsUtil',
   'Core/core-clone',
   'WS.Data/Relation/Hierarchy',
   'WS.Data/Collection/IBind',
   'Controls/Utils/ArraySimpleValuesUtil'
], function(
   ListViewModel,
   ItemsUtil,
   TreeItemsUtil,
   cClone,
   HierarchyRelation,
   IBindCollection,
   ArraySimpleValuesUtil
) {

   'use strict';

   var
      _private = {
         isVisibleItem: function(item) {
            var
               isExpanded,
               itemParent = item.getParent ? item.getParent() : undefined;
            if (itemParent) {
               isExpanded = this.expandedNodes[ItemsUtil.getPropertyValue(itemParent.getContents(), this.keyProperty)];
               if (itemParent.isRoot()) {
                  return itemParent.getOwner().isRootEnumerable() ? isExpanded : true;
               } else if (isExpanded) {
                  return _private.isVisibleItem.call(this, itemParent);
               } else {
                  return false;
               }
            } else {
               return true;
            }
         },

         displayFilterTree: function(item, index, itemDisplay) {
            return _private.isVisibleItem.call(this, itemDisplay);
         },

         getDisplayFilter: function(data, cfg) {
            var
               filter = [];
            filter.push(_private.displayFilterTree.bind(data));
            if (cfg.itemsFilterMethod) {
               filter.push(cfg.itemsFilterMethod);
            }
            return filter;
         },

         getAllChildren: function(hierarchyRelation, rootId, items) {
            var children = [];

            hierarchyRelation.getChildren(rootId, items).forEach(function(child) {
               if (hierarchyRelation.isNode(child)) {
                  ArraySimpleValuesUtil.addSubArray(children, _private.getAllChildren(hierarchyRelation, child.getId(), items));
               }
               ArraySimpleValuesUtil.addSubArray(children, [child]);
            });

            return children;
         },

         getSelectedChildrenCount: function(hierarchyRelation, rootId, items, selectedKeys) {
            var
               res = 0;

            hierarchyRelation.getChildren(rootId, items).forEach(function(child) {
               if (selectedKeys.indexOf(child.getId()) !== -1) {
                  if (hierarchyRelation.isNode(child)) {
                     res += 1 + _private.getSelectedChildrenCount(hierarchyRelation, child.getId(), items, selectedKeys);
                  } else {
                     res++;
                  }
               }
            });

            return res;
         },

         allChildrenSelected: function(hierarchyRelation, key, items, selectedKeys) {
            var
               res = true;

            _private.getAllChildren(hierarchyRelation, key, items).forEach(function(child) {
               if (selectedKeys.indexOf(child.getId()) === -1) {
                  res = false;
               }
            });

            return res;
         },

         onCollectionChange: function(self, event, action, newItems, newItemsIndex, removedItems, removedItemsIndex) {
            if (action === IBindCollection.ACTION_REMOVE) {
               _private.checkRemovedNodes(self, removedItems);
            }
         },

         checkRemovedNodes: function(self, removedItems) {
            var
               nodeId;
            if (removedItems.length) {
               for (var idx = 0; idx < removedItems.length; idx++) {
                  if (removedItems[idx].isNode && removedItems[idx].isNode()) {
                     nodeId = removedItems[idx].getContents().getId();

                     // clear only if node removed from items, else this is collapsed node
                     if (!self._items.getRecordById(nodeId)) {
                        delete self._expandedNodes[nodeId];
                        self._notify('onNodeRemoved', nodeId);
                     }
                  }
               }
            }
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
            this._hierarchyRelation = new HierarchyRelation({
               idProperty: cfg.keyProperty || 'id',
               parentProperty: cfg.parentProperty || 'Раздел',
               nodeProperty: cfg.nodeProperty || 'Раздел@'
            });
            TreeViewModel.superclass.constructor.apply(this, arguments);
         },

         _prepareDisplay: function(items, cfg) {
            return TreeItemsUtil.getDefaultDisplayTree(items, cfg, this.getDisplayFilter(this.prepareDisplayFilterData(), cfg));
         },

         toggleExpanded: function(dispItem) {
            var
               itemId = ItemsUtil.getPropertyValue(dispItem.getContents(), this._options.keyProperty);
            if (this._expandedNodes[itemId]) {
               delete this._expandedNodes[itemId];
            } else {
               this._expandedNodes[itemId] = true;
            }
            this._display.setFilter(this.getDisplayFilter(this.prepareDisplayFilterData(), this._options));
            this._nextVersion();
            this._notify('onListChange');
         },

         getDisplayFilter: function(data, cfg) {
            return Array.prototype.concat(TreeViewModel.superclass.getDisplayFilter.apply(this, arguments),
               _private.getDisplayFilter(data, cfg));
         },

         prepareDisplayFilterData: function() {
            var
               data = TreeViewModel.superclass.prepareDisplayFilterData.apply(this, arguments);
            data['expandedNodes'] = this._expandedNodes;
            data['keyProperty'] = this._options.keyProperty;
            return data;
         },

         _onCollectionChange: function(event, action, newItems, newItemsIndex, removedItems, removedItemsIndex) {
            TreeViewModel.superclass._onCollectionChange.apply(this, arguments);
            _private.onCollectionChange(this, event, action, newItems, newItemsIndex, removedItems, removedItemsIndex);
         },

         getCurrent: function() {
            var
               current = TreeViewModel.superclass.getCurrent.apply(this, arguments);
            current.isExpanded = !!this._expandedNodes[current.key];

            if (!current.isGroup && current.dispItem.isNode() && this._selectedKeys.indexOf(current.key) !== -1) {
               //TODO: проверка на hasMore должна быть тут
               if (_private.allChildrenSelected(this._hierarchyRelation, current.key, this._items, this._selectedKeys)) {
                  current.multiSelectStatus = true;
               } else if (_private.getSelectedChildrenCount(this._hierarchyRelation, current.key, this._items, this._selectedKeys)) {
                  current.multiSelectStatus = null;
               } else {
                  current.multiSelectStatus = false;
               }
            }

            return current;
         },

         setRoot: function(root) {
            this._expandedNodes = {};
            this._display.setRoot(root);
            this._nextVersion();
            this._notify('onListChange');
         }

      });

   TreeViewModel._private = _private;

   return TreeViewModel;
});
