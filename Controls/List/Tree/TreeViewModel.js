define('Controls/List/Tree/TreeViewModel', [
   'Controls/List/ListViewModel',
   'Controls/List/resources/utils/ItemsUtil',
   'Controls/List/resources/utils/TreeItemsUtil',
   'WS.Data/Relation/Hierarchy',
   'WS.Data/Collection/IBind',
   'Controls/Utils/ArraySimpleValuesUtil'
], function(
   ListViewModel,
   ItemsUtil,
   TreeItemsUtil,
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
               isExpanded = this.expandedItems[ItemsUtil.getPropertyValue(itemParent.getContents(), this.keyProperty)];
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

                  // removedItems[idx].isNode - fast check on item type === 'group'
                  if (removedItems[idx].isNode && removedItems[idx].getContents().get(self._options.nodeProperty) !== null) {
                     nodeId = removedItems[idx].getContents().getId();

                     // If it is necessary to delete only the nodes deleted from the items, add this condition:
                     // if (!self._items.getRecordById(nodeId)) {
                     delete self._expandedItems[nodeId];
                     self._notify('onNodeRemoved', nodeId);
                  }
               }
            }
         },
         shouldDrawExpander: function(itemData, expanderIcon) {
            var
               itemType = itemData.item.get(itemData.nodeProperty);

            // Show expander icon if it is not equal 'none' or render leafs
            return itemType !== null && expanderIcon !== 'none';
         },
         prepareExpanderClasses: function(itemData, expanderIcon, expanderSize) {
            var
               itemType = itemData.item.get(itemData.nodeProperty),
               expanderClasses = 'controls-TreeGrid__row-expander',
               expanderIconClass;

            expanderClasses += ' controls-TreeGrid__row-expander_size_' + (expanderSize || 'default');
            expanderClasses += ' js-controls-ListView__notEditable';

            if (expanderIcon) {
               expanderIconClass = ' controls-TreeGrid__row-expander_' + expanderIcon;
            } else {
               expanderIconClass = ' controls-TreeGrid__row-expander_' + (itemType === true ? 'node' : 'hiddenNode');
            }

            expanderClasses += expanderIconClass;
            expanderClasses += expanderIconClass + (itemData.isExpanded ? '_expanded' : '_collapsed');

            return expanderClasses;
         },
         prepareExpandedItems: function(expandedItems) {
            var
               result = {};
            if (expandedItems) {
               expandedItems.forEach(function(item) {
                  result[item] = true;
               });
            }
            return result;
         }
      },

      TreeViewModel = ListViewModel.extend({
         _expandedItems: null,
         _hasMoreStorage: null,

         constructor: function(cfg) {
            this._options = cfg;
            this._expandedItems = _private.prepareExpandedItems(cfg.expandedItems);
            this._hierarchyRelation = new HierarchyRelation({
               idProperty: cfg.keyProperty || 'id',
               parentProperty: cfg.parentProperty || 'Раздел',
               nodeProperty: cfg.nodeProperty || 'Раздел@'
            });
            TreeViewModel.superclass.constructor.apply(this, arguments);
         },

         setExpandedItems: function(expandedItems) {
            this._expandedItems = _private.prepareExpandedItems(expandedItems);
            this._display.setFilter(this.getDisplayFilter(this.prepareDisplayFilterData(), this._options));
            this._nextVersion();
            this._notify('onListChange');
         },

         _prepareDisplay: function(items, cfg) {
            return TreeItemsUtil.getDefaultDisplayTree(items, cfg, this.getDisplayFilter(this.prepareDisplayFilterData(), cfg));
         },

         isExpanded: function(dispItem) {
            var
               itemId = dispItem.getContents().getId();
            return !!this._expandedItems[itemId];
         },

         toggleExpanded: function(dispItem, expanded) {
            var
               itemId = dispItem.getContents().getId(),
               currentExpanded = this._expandedItems[itemId] || false;

            if (expanded !== currentExpanded || expanded === undefined) {
               if (this._expandedItems[itemId]) {
                  delete this._expandedItems[itemId];
               } else {
                  this._expandedItems[itemId] = true;
               }
               this._display.setFilter(this.getDisplayFilter(this.prepareDisplayFilterData(), this._options));
               this._nextVersion();
               this._notify('onListChange');
            }
         },

         getDisplayFilter: function(data, cfg) {
            return Array.prototype.concat(TreeViewModel.superclass.getDisplayFilter.apply(this, arguments),
               _private.getDisplayFilter(data, cfg));
         },

         prepareDisplayFilterData: function() {
            var
               data = TreeViewModel.superclass.prepareDisplayFilterData.apply(this, arguments);
            data.expandedItems = this._expandedItems;
            data.keyProperty = this._options.keyProperty;
            return data;
         },

         _onCollectionChange: function(event, action, newItems, newItemsIndex, removedItems, removedItemsIndex) {
            TreeViewModel.superclass._onCollectionChange.apply(this, arguments);
            _private.onCollectionChange(this, event, action, newItems, newItemsIndex, removedItems, removedItemsIndex);
         },

         getItemDataByItem: function(dispItem) {
            var
               current = TreeViewModel.superclass.getItemDataByItem.apply(this, arguments);
            current.isExpanded = !!this._expandedItems[current.key];
            current.parentProperty = this._options.parentProperty;
            current.nodeProperty = this._options.nodeProperty;
            current.shouldDrawExpander = _private.shouldDrawExpander;
            current.prepareExpanderClasses = _private.prepareExpanderClasses;

            if (!current.isGroup) {
               current.level = current.dispItem.getLevel();
            }

            if (this._dragTargetPosition && this._dragTargetPosition.position === 'on') {
               if (this._dragTargetPosition.index === current.index) {
                  current.dragTargetNode = true;
               }
               if (this._prevDragTargetPosition && this._prevDragTargetPosition.index === current.index) {
                  current.dragTargetPosition = this._prevDragTargetPosition.position;
                  current.draggingItemData = this._draggingItemData;
               }
            }


            if (!current.isGroup && current.item.get(current.nodeProperty) !== null) {
               if (current.isExpanded) {
                  current.hasChildren = this._display.getChildren(current.dispItem).getCount();

                  if (this._options.nodeFooterTemplate) {
                     current.footerStorage = {};
                     current.footerStorage.template = this._options.nodeFooterTemplate;
                  }

                  if (this._hasMoreStorage && this._hasMoreStorage[current.item.getId()]) {
                     if (!current.footerStorage) {
                        current.footerStorage = {};
                     }
                     current.footerStorage.hasMoreStorage = this._hasMoreStorage[current.item.getId()];
                  }
               }
               if (this._selectedKeys.indexOf(current.key) !== -1) {

                  //TODO: проверка на hasMore должна быть тут
                  if (_private.allChildrenSelected(this._hierarchyRelation, current.key, this._items, this._selectedKeys)) {
                     current.multiSelectStatus = true;
                  } else if (_private.getSelectedChildrenCount(this._hierarchyRelation, current.key, this._items, this._selectedKeys)) {
                     current.multiSelectStatus = null;
                  } else {
                     current.multiSelectStatus = false;
                  }
               }
            }
            return current;
         },

         setDragItems: function(items, itemDragData) {
            if (items) {
               //Collapse all the nodes that we move.
               items.forEach(function(item) {
                  this.toggleExpanded(this.getItemById(item, this._options.keyProperty), false);
               }, this);
               itemDragData.isExpanded = false;
            }

            TreeViewModel.superclass.setDragItems.apply(this, arguments);
         },

         _updateDragTargetPosition: function(targetData) {
            var
               prevIndex,
               position;

            if (targetData && targetData.dispItem.isNode()) {
               prevIndex = this._dragTargetPosition ? this._dragTargetPosition.index : this._draggingItemData.index;

               if (prevIndex === targetData.index) {
                  position = this._dragTargetPosition.position;
               } else {
                  position = prevIndex < targetData.index ? 'before' : 'after';
               }

               if (!this._prevDragTargetPosition) {
                  this._prevDragTargetPosition = this._dragTargetPosition || {
                     index: this._draggingItemData.index,
                     position: position
                  };
               }

               this._dragTargetPosition = {
                  index: targetData.index,
                  position: 'on',
                  startPosition: position
               };
            } else {
               if (targetData) {
                  this._draggingItemData.level = targetData.level;
               }
               this._prevDragTargetPosition = null;
               TreeViewModel.superclass._updateDragTargetPosition.apply(this, arguments);
            }
         },

         setDragPositionOnNode: function(itemData, position) {
            if (position !== this._dragTargetPosition.startPosition && !(position === 'after' && this._expandedItems[ItemsUtil.getPropertyValue(itemData.dispItem.getContents(), this._options.keyProperty)])) {
               this._dragTargetPosition = {
                  index: itemData.index,
                  position: position
               };
               this._prevDragTargetPosition = null;
               this._draggingItemData.level = itemData.level;
               this._nextVersion();
               this._notify('onListChange');
            }
         },

         setHasMoreStorage: function(hasMoreStorage) {
            this._hasMoreStorage = hasMoreStorage;
            this._nextVersion();
            this._notify('onListChange');
         },

         setRoot: function(root) {
            this._expandedItems = {};
            this._display.setRoot(root);
            this._nextVersion();
            this._notify('onListChange');
         }

      });

   TreeViewModel._private = _private;

   return TreeViewModel;
});
