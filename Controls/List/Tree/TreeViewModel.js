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

         hasChildItem: function(self, key) {
            if (self._options.hasChildrenProperty) {
               return !!self._items.getRecordById(key).get(self._options.hasChildrenProperty);
            }
            return self._hierarchyRelation.getChildren(key, self._items).length;
         },

         determinePresenceChildItem: function(self) {
            var
               thereIsChildItem = false,
               items = self._items,
               rootItems;
            if (items) {
               rootItems = self._hierarchyRelation.getChildren(self._display.getRoot().getContents(), items);
               for (var idx = 0; idx < rootItems.length; idx++) {
                  if (_private.hasChildItem(self, rootItems[idx].getId())) {
                     thereIsChildItem = true;
                     break;
                  }
               }
            }
            self._thereIsChildItem = thereIsChildItem;
         },

         onCollectionChange: function(self, event, action, newItems, newItemsIndex, removedItems, removedItemsIndex) {
            if (action === IBindCollection.ACTION_REMOVE) {
               _private.checkRemovedNodes(self, removedItems);
            }
            if (self._options.expanderDisplayMode === 'adaptive') {
               _private.determinePresenceChildItem(self);
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
            return (itemData.expanderDisplayMode !== 'adaptive' || itemData.thereIsChildItem && itemData.hasChildItem) &&
               itemType !== null && expanderIcon !== 'none';
         },
         shouldDrawExpanderPadding: function(itemData, expanderIcon, expanderSize) {
            return (itemData.expanderDisplayMode !== 'adaptive' || itemData.thereIsChildItem) &&
               !expanderSize && expanderIcon !== 'none';
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
         _thereIsChildItem: false,

         constructor: function(cfg) {
            this._options = cfg;
            this._expandedItems = _private.prepareExpandedItems(cfg.expandedItems);
            this._hierarchyRelation = new HierarchyRelation({
               idProperty: cfg.keyProperty || 'id',
               parentProperty: cfg.parentProperty || 'Раздел',
               nodeProperty: cfg.nodeProperty || 'Раздел@'
            });
            TreeViewModel.superclass.constructor.apply(this, arguments);
            if (this._options.expanderDisplayMode === 'adaptive') {
               _private.determinePresenceChildItem(this);
            }
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

         setItems: function() {
            TreeViewModel.superclass.setItems.apply(this, arguments);
            if (this._options.expanderDisplayMode === 'adaptive') {
               _private.determinePresenceChildItem(this);
            }
         },

         getItemDataByItem: function(dispItem) {
            var
               current = TreeViewModel.superclass.getItemDataByItem.apply(this, arguments);
            current.isExpanded = !!this._expandedItems[current.key];
            current.parentProperty = this._options.parentProperty;
            current.nodeProperty = this._options.nodeProperty;
            current.expanderDisplayMode = this._options.expanderDisplayMode;
            current.thereIsChildItem = this._thereIsChildItem;
            current.hasChildItem = !current.isGroup && _private.hasChildItem(this, current.key);
            current.shouldDrawExpander = _private.shouldDrawExpander;
            current.shouldDrawExpanderPadding = _private.shouldDrawExpanderPadding;
            current.prepareExpanderClasses = _private.prepareExpanderClasses;

            // todo https://online.sbis.ru/opendoc.html?guid=0649e69a-d507-4024-9f99-c70205f535ef
            current.expanderTemplate = this._options.expanderTemplate;

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
                  if (_private.allChildrenSelected(this._hierarchyRelation, current.key, this._items, this._selectedKeys)) {
                     current.multiSelectStatus = true;
                  } else {
                     current.multiSelectStatus = null;
                  }
               }
            }
            return current;
         },

         setDragEntity: function(entity) {
            var item;

            if (entity) {
               //Collapse all the nodes that we move.
               entity.getItems().forEach(function(id) {
                  item = this.getItemById(id, this._options.keyProperty);

                  //Not all of the moved items can be in the current recordSet
                  if (item) {
                     this.toggleExpanded(item, false);
                  }
               }, this);
            }

            TreeViewModel.superclass.setDragEntity.apply(this, arguments);
         },

         setDragItemData: function(itemDragData) {
            //Displays the movable item as closed
            if (itemDragData && itemDragData.isExpanded) {
               itemDragData.isExpanded = false;
            }
            TreeViewModel.superclass.setDragItemData.apply(this, arguments);
         },

         calculateDragTargetPosition: function(targetData, position) {
            var result;

            if (targetData && targetData.dispItem.isNode()) {
               if (position === 'after' || position === 'before') {
                  result = this._calculateDragTargetPosition(targetData, position);
               } else {
                  result = {
                     index: targetData.index,
                     position: 'on',
                     item: targetData.item,
                     data: targetData
                  };
               }
            } else {
               result = TreeViewModel.superclass.calculateDragTargetPosition.apply(this, arguments);
            }

            return result;
         },

         _calculateDragTargetPosition: function(itemData, position) {
            var
               result,
               startPosition,
               afterExpandedNode = position === 'after' && this._expandedItems[ItemsUtil.getPropertyValue(itemData.dispItem.getContents(), this._options.keyProperty)];

            //The position should not change if the record is dragged from the
            //bottom/top to up/down and brought to the bottom/top of the folder.
            if (this._prevDragTargetPosition) {
               if (this._prevDragTargetPosition.index === itemData.index) {
                  startPosition = this._prevDragTargetPosition.position;
               } else {
                  startPosition = this._prevDragTargetPosition.index < itemData.index ? 'before' : 'after';
               }
            }

            if (position !== startPosition && !afterExpandedNode) {
               result = {
                  index: itemData.index,
                  item: itemData.item,
                  data: itemData,
                  position: position
               };
            }

            return result;
         },

         setDragTargetPosition: function(targetPosition) {
            if (targetPosition && targetPosition.position === 'on') {

               //When an item is moved to a folder, the fake record should be displayed at the previous position.
               //If do not display the fake entry, there will be a visual jump of the interface.
               this._setPrevDragTargetPosition(targetPosition);
            } else {
               this._prevDragTargetPosition = null;

               //The fake item must be displayed at the correct level.
               if (targetPosition) {
                  this._draggingItemData.level = targetPosition.data.level;
               }
            }
            TreeViewModel.superclass.setDragTargetPosition.apply(this, arguments);
         },

         _setPrevDragTargetPosition: function(targetPosition) {
            if (!this._prevDragTargetPosition) {
               if (this._dragTargetPosition) {
                  this._prevDragTargetPosition = this._dragTargetPosition;
               } else if (this._draggingItemData) {
                  this._prevDragTargetPosition = {
                     index: this._draggingItemData.index,
                     item: this._draggingItemData.item,
                     data: this._draggingItemData,
                     position: this._draggingItemData.index > targetPosition.index ? 'after' : 'before'
                  };
               }
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
