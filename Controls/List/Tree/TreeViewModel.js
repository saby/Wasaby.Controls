define('Controls/List/Tree/TreeViewModel', [
   'Controls/List/ListViewModel',
   'Controls/List/resources/utils/ItemsUtil',
   'Controls/List/resources/utils/TreeItemsUtil',
   'Core/core-clone',
   'WS.Data/Relation/Hierarchy',
   'Controls/Utils/ArraySimpleValuesUtil'
], function(
   ListViewModel,
   ItemsUtil,
   TreeItemsUtil,
   cClone,
   HierarchyRelation,
   ArraySimpleValuesUtil
) {

   'use strict';

   var
      _private = {
         isVisibleItem: function(item) {
            var
               itemParent = item.getParent ? item.getParent() : undefined;
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
