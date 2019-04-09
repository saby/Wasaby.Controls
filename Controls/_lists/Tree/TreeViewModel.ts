import ListViewModel = require('Controls/_lists/ListViewModel');
import ItemsUtil = require('Controls/_lists/resources/utils/ItemsUtil');
import TreeItemsUtil = require('Controls/_lists/resources/utils/TreeItemsUtil');
import cClone = require('Core/core-clone');
import _entity = require('Types/entity');
import collection = require('Types/collection');
import ArraySimpleValuesUtil = require('Controls/Utils/ArraySimpleValuesUtil');
import {calcRowIndexByKey} from "../../_grids/utils/RowIndexUtil";

var
    _private = {
        isVisibleItem: function(item) {
            var
                itemParent = item.getParent ? item.getParent() : undefined,
                isExpandAll = this.isExpandAll(this.expandedItems),
                keyProperty = this.keyProperty,
                collapsedItems = this.collapsedItems,
                expandedItems = this.expandedItems,
                hasChildItem = this.hasChildItem,
                itemParentContents;
            function isExpanded(contents) {
                var
                    expanded = false,
                    key;
                if (contents) {
                    key = contents.get(keyProperty);
                    if (isExpandAll) {
                        expanded = !collapsedItems[key] && hasChildItem(key);
                    } else {
                        expanded = expandedItems[key];
                    }
                }
                return expanded;
            }
            if (itemParent) {
                itemParentContents = itemParent.getContents();
                if (itemParent.isRoot()) {
                    return itemParent.getOwner().isRootEnumerable() ? isExpanded(itemParentContents) : true;
                }
                if (isExpanded(itemParentContents)) {
                    return _private.isVisibleItem.call(this, itemParent);
                }
                return false;
            }
            return true;
        },

        getExpanderVisibility: function(cfg) {

            // Если передана новая опция, смотрим на нее, иначе приводим значения старой опции к новому,
            // поддерживая дефолтное значение "visible"
            // Выпилить в 19.200 https://online.sbis.ru/opendoc.html?guid=4e0354e9-0519-4714-a67c-a1af433820aa
            if (cfg.expanderVisibility) {
                return cfg.expanderVisibility;
            }
            return cfg.expanderDisplayMode === 'adaptive' ? 'hasChildren' : 'visible';
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

        hasChildItem: function(self, key) {
            var
                item;
            if (self._options.hasChildrenProperty) {
                item = self._items.getRecordById(key);
                return item ? !!item.get(self._options.hasChildrenProperty) : false;
            }
            return !!self._hierarchyRelation.getChildren(key, self._items).length;
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

        onBeginCollectionChange: function(self, action, newItems, newItemsIndex, removedItems, removedItemsIndex) {
            if (action === collection.IObservable.ACTION_REMOVE) {
                _private.checkRemovedNodes(self, removedItems);
            }
            if (_private.getExpanderVisibility(self._options) === 'hasChildren') {
                var currentValue = self._thereIsChildItem;

                _private.determinePresenceChildItem(self);

                if (currentValue !== self._thereIsChildItem) {
                    self._nextModelVersion();
                }
            }
        },

        removeNodeFromExpandedIfNeed: function(self, nodeId) {
            if (self._expandedItems[nodeId] && !_private.hasChildItem(self, nodeId)) {
                // If it is necessary to delete only the nodes deleted from the items, add this condition:
                // if (!self._items.getRecordById(nodeId)) {
                _private.removeNodeFromExpanded(self, nodeId);
            }
        },

        removeNodeFromExpanded: function(self, nodeId) {
            delete self._expandedItems[nodeId];
            self._notify('onNodeRemoved', nodeId);
        },


        checkRemovedNodes: function(self, removedItems) {
            if (removedItems.length) {
                for (var idx = 0; idx < removedItems.length; idx++) {

                    // removedItems[idx].isNode - fast check on item type === 'group'
                    if (removedItems[idx].isNode && removedItems[idx].getContents().get(self._options.nodeProperty) !== null) {
                        _private.removeNodeFromExpandedIfNeed(self, removedItems[idx].getContents().getId());
                    }
                }
            }
        },
        shouldDrawExpander: function(itemData, expanderIcon) {
            var
                itemType = itemData.item.get(itemData.nodeProperty);

            // Show expander icon if it is not equal 'none' or render leafs
            return (itemData.expanderVisibility !== 'hasChildren' || itemData.thereIsChildItem && itemData.hasChildItem) &&
                itemType !== null && expanderIcon !== 'none';
        },
        shouldDrawExpanderPadding: function(itemData, expanderIcon, expanderSize) {
            return (itemData.expanderVisibility !== 'hasChildren' || itemData.thereIsChildItem) &&
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
        },
        prepareCollapsedItems: function(expandedItems, collapsedItems) {
            if (_private.isExpandAll(expandedItems) && collapsedItems) {
                return cClone(collapsedItems);
            }
            return {};
        },
        isExpandAll: function(expandedItems) {
            return expandedItems && !!expandedItems[null];
        },

        resetExpandedItems: function(self) {
            if (_private.isExpandAll(self._expandedItems)) {
                self._expandedItems = { null: true };
            } else {
                for (var itemId in self._expandedItems) {
                    if (self._expandedItems.hasOwnProperty(itemId)) {
                        _private.removeNodeFromExpanded(self, itemId);
                    }
                }
            }
            self._collapsedItems = _private.prepareCollapsedItems(self._expandedItems, self._options.collapsedItems);
        },
        collapseChildNodes: function(self, nodeId) {
            self._hierarchyRelation.getChildren(nodeId, self._items).forEach(function(item) {
                var
                    itemId = item.getId();
                delete self._expandedItems[itemId];
                _private.collapseChildNodes(self, itemId);
            });
        },
        calcNodeFooterIndex: function(self, parentKey) {
            return 1 + calcRowIndexByKey(parentKey, self._display, false, null, self._hierarchyRelation, self._hasMoreStorage);
        }
    },

    TreeViewModel = ListViewModel.extend({
        _expandedItems: null,
        _collapsedItems: null,
        _hasMoreStorage: null,
        _thereIsChildItem: false,

        constructor: function(cfg) {
            this._options = cfg;
            this._expandedItems = _private.prepareExpandedItems(cfg.expandedItems);
            this._collapsedItems = _private.prepareCollapsedItems(cfg.expandedItems, cfg.collapsedItems);
            this._hierarchyRelation = new _entity.relation.Hierarchy({
                idProperty: cfg.keyProperty || 'id',
                parentProperty: cfg.parentProperty || 'Раздел',
                nodeProperty: cfg.nodeProperty || 'Раздел@'
            });
            TreeViewModel.superclass.constructor.apply(this, arguments);
            if (_private.getExpanderVisibility(this._options) === 'hasChildren') {
                _private.determinePresenceChildItem(this);
            }
        },

        setExpandedItems: function(expandedItems) {
            this._expandedItems = _private.prepareExpandedItems(expandedItems);
            this._collapsedItems = _private.prepareCollapsedItems(expandedItems, this._options.collapsedItems);
            this._display.setFilter(this.getDisplayFilter(this.prepareDisplayFilterData(), this._options));
            this._nextModelVersion();
        },

        getExpandedItems: function() {
            return this._expandedItems;
        },

        resetExpandedItems: function() {
            _private.resetExpandedItems(this);
        },

        _prepareDisplay: function(items, cfg) {
            return TreeItemsUtil.getDefaultDisplayTree(items, cfg, this.getDisplayFilter(this.prepareDisplayFilterData(), cfg));
        },

        isExpanded: function(dispItem) {
            var
                itemId = dispItem.getContents().getId();
            return _private.isExpandAll(this._expandedItems) ? !this._collapsedItems[itemId]
                : !!this._expandedItems[itemId];
        },

        isExpandAll: function() {
            return _private.isExpandAll(this.getExpandedItems());
        },

        toggleExpanded: function(dispItem, expanded) {
            var
                itemId = dispItem.getContents().getId(),
                currentExpanded = this.isExpanded(dispItem);

            if (expanded !== currentExpanded || expanded === undefined) {
                if (_private.isExpandAll(this._expandedItems)) {
                    if (expanded) {
                        delete this._collapsedItems[itemId];
                    } else {
                        this._collapsedItems[itemId] = true;
                    }
                } else {
                    if (this._expandedItems[itemId]) {
                        delete this._expandedItems[itemId];
                        _private.collapseChildNodes(this, itemId);
                    } else {
                        this._expandedItems[itemId] = true;
                    }
                }
                this._display.setFilter(this.getDisplayFilter(this.prepareDisplayFilterData(), this._options));
                this._nextModelVersion();
            }
        },

        getDisplayFilter: function(data, cfg) {
            return Array.prototype.concat(TreeViewModel.superclass.getDisplayFilter.apply(this, arguments),
                _private.getDisplayFilter(data, cfg));
        },

        getLastItem: function() {
            return ItemsUtil.getLastItem(this._display.getChildren(this._display.getRoot()));
        },

        prepareDisplayFilterData: function() {
            var
                data = TreeViewModel.superclass.prepareDisplayFilterData.apply(this, arguments);
            data.keyProperty = this._options.keyProperty;
            data.expandedItems = this._expandedItems;
            data.collapsedItems = this._collapsedItems;
            data.isExpandAll = _private.isExpandAll;
            data.hasChildItem = _private.hasChildItem.bind(null, this);
            return data;
        },

        _onBeginCollectionChange: function(action, newItems, newItemsIndex, removedItems, removedItemsIndex) {
            TreeViewModel.superclass._onBeginCollectionChange.apply(this, arguments);
            _private.onBeginCollectionChange(this, action, newItems, newItemsIndex, removedItems, removedItemsIndex);
        },

        setNodeFooterTemplate: function(nodeFooterTemplate) {
            this._options.nodeFooterTemplate = nodeFooterTemplate;
            this._nextModelVersion();
        },

        setExpanderDisplayMode: function(expanderDisplayMode) {
            this._options.expanderDisplayMode = expanderDisplayMode;
            this._nextModelVersion();
        },

        setExpanderVisibility: function(expanderVisibility) {
            this._options.expanderVisibility = expanderVisibility;
            this._nextModelVersion();
        },

        setItems: function() {
            TreeViewModel.superclass.setItems.apply(this, arguments);
            if (_private.getExpanderVisibility(this._options) === 'hasChildren') {
                _private.determinePresenceChildItem(this);
            }
        },

        getItemDataByItem: function(dispItem) {
            var
                current = TreeViewModel.superclass.getItemDataByItem.apply(this, arguments);
            current.isExpanded = current.item.get && this.isExpanded(dispItem);
            current.parentProperty = this._options.parentProperty;
            current.nodeProperty = this._options.nodeProperty;
            current.expanderVisibility = _private.getExpanderVisibility(this._options);
            current.thereIsChildItem = this._thereIsChildItem;
            current.hasChildItem = !current.isGroup && _private.hasChildItem(this, current.key);
            current.shouldDrawExpander = _private.shouldDrawExpander;
            current.shouldDrawExpanderPadding = _private.shouldDrawExpanderPadding;
            current.prepareExpanderClasses = _private.prepareExpanderClasses;

            // todo https://online.sbis.ru/opendoc.html?guid=0649e69a-d507-4024-9f99-c70205f535ef
            current.expanderTemplate = this._options.expanderTemplate;

            if (current.item.get) {
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

           if (current.item.get) {
              if (current.item.get(current.nodeProperty) !== null && current.isExpanded) {
                 current.hasChildren = this._display.getChildren(current.dispItem).getCount() || (this._editingItemData && this._editingItemData.item.get(current.parentProperty) === current.key);
              }
              var itemParent = current.dispItem.getParent();
              var itemParentKey = current.item.get(current.parentProperty);
              if (itemParentKey !== this._display.getRoot().getContents() && (this._options.nodeFooterTemplate || this._hasMoreStorage && this._hasMoreStorage[itemParentKey])) {
                 var itemParentChilds = this._hierarchyRelation.getChildren(itemParentKey, this._items);
                 if (itemParentChilds && itemParentChilds[itemParentChilds.length - 1].getId() === current.key) {
                    current.nodeFooter = {
                       key: itemParentKey,
                       item: itemParent.getContents(),
                       dispItem: itemParent,
                       multiSelectVisibility: current.multiSelectVisibility,
                       level: itemParent.getLevel(),
                       rowIndex: _private.calcNodeFooterIndex(this, current.key)
                    };
                    if (this._options.nodeFooterTemplate) {
                       current.nodeFooter.template = this._options.nodeFooterTemplate;
                    }
                    if (this._hasMoreStorage && this._hasMoreStorage[itemParentKey]) {
                       current.nodeFooter.hasMoreStorage = this._hasMoreStorage[itemParentKey];
                    }
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

            //If you hover over the dragged item, and the current position is on the folder,
            //then you need to return the position that was before the folder.
            if (this._draggingItemData && this._draggingItemData.index === targetData.index) {
                result = this._prevDragTargetPosition || null;
            } else if (targetData.dispItem.isNode()) {
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
            this._nextModelVersion();
        },

        getHasMoreStorage: function() {
            return this._hasMoreStorage;
        },

        getHierarchyRelation: function () {
            return this._hierarchyRelation;
        },

        setRoot: function(root) {
            this._expandedItems = {};
            this._display.setRoot(root);
            this.updateMarker(this._markedKey);
            this._nextModelVersion();
        },

        getChildren: function(rootId) {
            return this._hierarchyRelation.getChildren(rootId, this._items);
        }
    });

TreeViewModel._private = _private;

export = TreeViewModel;
