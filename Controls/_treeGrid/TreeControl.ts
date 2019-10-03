import Control = require('Core/Control');
import TreeControlTpl = require('wml!Controls/_treeGrid/TreeControl/TreeControl');
import cClone = require('Core/core-clone');
import Env = require('Env/Env');
import Deferred = require('Core/Deferred');
import keysHandler = require('Controls/Utils/keysHandler');
import selectionToRecord = require('Controls/_operations/MultiSelector/selectionToRecord');
import {Controller as SourceController} from 'Controls/source';
import {isEqual} from 'Types/object';

var
    HOT_KEYS = {
        expandMarkedItem: Env.constants.key.right,
        collapseMarkedItem: Env.constants.key.left
    };

var DRAG_MAX_OFFSET = 15,
    EXPAND_ON_DRAG_DELAY = 1000,
    DEFAULT_COLUMNS_VALUE = [];

var _private = {
    nodesSourceControllersIterator: function(nodesSourceControllers, callback) {
        for (var prop in nodesSourceControllers) {
            if (nodesSourceControllers.hasOwnProperty(prop)) {
                callback(prop, nodesSourceControllers[prop]);
            }
        }
    },
    clearNodeSourceController: function(sourceControllers, node) {
        sourceControllers[node].destroy();
        delete sourceControllers[node];
        return sourceControllers;
    },
    clearSourceControllers: function(self) {
        _private.nodesSourceControllersIterator(self._nodesSourceControllers, function(node) {
            _private.clearNodeSourceController(self._nodesSourceControllers, node);
        });
    },
    createSourceController: function(source, navigation) {
        return new SourceController({
            source: source,
            navigation: navigation
        });
    },
    toggleExpandedOnModel: function(self, listViewModel, dispItem, expanded) {
        listViewModel.toggleExpanded(dispItem, expanded);
        self._notify(expanded ? 'itemExpanded' : 'itemCollapsed', [dispItem.getContents()]);
    },
    expandMarkedItem: function(self) {
        var
            model = self._children.baseControl.getViewModel(),
            markedItemKey = model.getMarkedKey(),
            markedItem = model.getMarkedItem();
        if (!model.isExpanded(markedItem)) {
            self.toggleExpanded(markedItemKey);
        }
    },
    collapseMarkedItem: function(self) {
        var
            model = self._children.baseControl.getViewModel(),
            markedItemKey = model.getMarkedKey(),
            markedItem = model.getMarkedItem();
        if (model.isExpanded(markedItem)) {
            self.toggleExpanded(markedItemKey);
        }
    },
    toggleExpanded: function(self, dispItem) {
        var
            filter = cClone(self._options.filter),
            listViewModel = self._children.baseControl.getViewModel(),
            item = dispItem.getContents(),
            nodeKey = item.getId(),
            expanded = !listViewModel.isExpanded(dispItem);
        self._notify(expanded ? 'itemExpand' : 'itemCollapse', [item]);
        if (
            !_private.isExpandAll(self._options.expandedItems) &&
            !self._nodesSourceControllers[nodeKey] &&
            !dispItem.isRoot() &&
            _private.shouldLoadChildren(self, item)
        ) {
            self._nodesSourceControllers[nodeKey] = _private.createSourceController(self._options.source, self._options.navigation);

            filter[self._options.parentProperty] = nodeKey;
            self._nodesSourceControllers[nodeKey].load(filter, self._options.sorting).addCallback(function(list) {
                listViewModel.setHasMoreStorage(_private.prepareHasMoreStorage(self._nodesSourceControllers));
                if (self._options.uniqueKeys) {
                    listViewModel.mergeItems(list);
                } else {
                    listViewModel.appendItems(list);
                }
                _private.toggleExpandedOnModel(self, listViewModel, dispItem, expanded);
                if (self._options.nodeLoadCallback) {
                    self._options.nodeLoadCallback(list, nodeKey);
                }
            });
        } else {
            _private.toggleExpandedOnModel(self, listViewModel, dispItem, expanded);
        }
    },
    shouldLoadChildren: function(self, node): boolean {
        if (self._options.hasChildrenProperty) {
            const
                listViewModel = self._children.baseControl.getViewModel(),
                hasChildren = node.get(self._options.hasChildrenProperty),
                children = hasChildren && listViewModel.getChildren(node.getId());
            return hasChildren && (!children || children.length === 0);
        }
        return true;
    },
    prepareHasMoreStorage: function(sourceControllers) {
        var
            hasMore = {};
        for (var i in sourceControllers) {
            if (sourceControllers.hasOwnProperty(i)) {
                hasMore[i] = sourceControllers[i].hasMoreData('down');
            }
        }
        return hasMore;
    },

    getEntries: function(selectedKeys: string|number[], excludedKeys: string|number[], source) {
        let entriesRecord;

        if (selectedKeys && selectedKeys.length) {
            entriesRecord = selectionToRecord({
                selected: selectedKeys || [],
                excluded: excludedKeys || []
            }, _private.getOriginalSource(source).getAdapter());
        }

        return entriesRecord;
    },

    loadMore: function(self, dispItem) {
        var
            filter = cClone(self._options.filter),
            listViewModel = self._children.baseControl.getViewModel(),
            nodeKey = dispItem.getContents().getId();
        filter[self._options.parentProperty] = nodeKey;
        self._nodesSourceControllers[nodeKey].load(filter, self._options.sorting, 'down').addCallback(function(list) {
            listViewModel.setHasMoreStorage(_private.prepareHasMoreStorage(self._nodesSourceControllers));
            if (self._options.uniqueKeys) {
                listViewModel.mergeItems(list);
            } else {
                listViewModel.appendItems(list);
            }
            if (self._options.task1177940587 && self._options.dataLoadCallback) {
                self._options.dataLoadCallback(list);
            }
        });
    },
    onNodeRemoved: function(self, nodeId) {
        if (self._nodesSourceControllers[nodeId]) {
            self._nodesSourceControllers[nodeId].destroy();
        }
        delete self._nodesSourceControllers[nodeId];
    },
    isExpandAll: function(expandedItems) {
        return expandedItems instanceof Array && expandedItems[0] === null;
    },
    isDeepReload: function({deepReload}, deepReloadState: boolean): boolean {
        return  deepReload || deepReloadState;
    },
    beforeReloadCallback: function(self, filter, sorting, navigation, cfg) {
        const parentProperty = cfg.parentProperty;
        const baseControl = self._children.baseControl;
        const entries = _private.getEntries(cfg.selectedKeys, cfg.excludedKeys, cfg.source);

        let nodeSourceControllers = self._nodesSourceControllers;
        let expandedItemsKeys: Array[number|string|null] = [];
        let isExpandAll: boolean;

        if (baseControl) {
            const viewModel = baseControl.getViewModel();
            isExpandAll = viewModel.isExpandAll();
            if (!isExpandAll) {
                viewModel.getExpandedItems().forEach((key) => {
                    expandedItemsKeys.push(key);
                });
            }
            _private.nodesSourceControllersIterator(nodeSourceControllers, function(node) {
                // _nodesSourceControllers is an Object and the field type of the object will be lost,
                // so need to check both types (sting and number)
                // https://online.sbis.ru/opendoc.html?guid=b4657be2-8fa5-41e1-8629-83465a4ef9d8
                if (expandedItemsKeys.indexOf(String(node)) === -1 && expandedItemsKeys.indexOf(Number(node)) === -1) {
                    _private.clearNodeSourceController(nodeSourceControllers, node);
                }
            });
            viewModel.setHasMoreStorage(_private.prepareHasMoreStorage(nodeSourceControllers));
        } else {
            expandedItemsKeys = cfg.expandedItems || [];
            isExpandAll = _private.isExpandAll(expandedItemsKeys);
        }

        if (_private.isDeepReload(cfg, self._deepReload) && expandedItemsKeys.length && !isExpandAll) {
            filter[parentProperty] = filter[parentProperty] instanceof Array ? filter[parentProperty] : [];
            filter[parentProperty].push(self._root);
            filter[parentProperty] = filter[parentProperty].concat(expandedItemsKeys);
        } else {
            filter[parentProperty] = self._root;
            _private.clearSourceControllers(self);
        }

        if (entries) {
            filter.entries = entries;
        }
    },

    afterReloadCallback: function(self, options) {
        const baseControl = self._children.baseControl;
        const viewModel = baseControl && baseControl.getViewModel();

        if (viewModel) {
            const modelRoot = viewModel.getRoot();
            const root = self._options.root !== undefined ? self._options.root : self._root;
            const viewModelRoot = modelRoot ? modelRoot.getContents() : root;

            // https://online.sbis.ru/opendoc.html?guid=d99190bc-e3e9-4d78-a674-38f6f4b0eeb0
            if (!_private.isDeepReload(options, self._deepReload)) {
                viewModel.resetExpandedItems();
            }

            if (viewModelRoot !== root) {
                viewModel.setRoot(root);
            }
            if (self._deepReload && viewModel.getExpandedItems().length) {
                const sourceController = baseControl.getSourceController();
                const hasMore = {};
                let hasMoreData: unknown;

                viewModel.getExpandedItems().forEach((key) => {
                    hasMoreData = sourceController.hasMoreData('down', key);

                    if (hasMoreData !== undefined) {
                        hasMore[key] = hasMoreData;
                    }
                });

                // if method does not support multi navigation hasMore object will be empty
                if (!isEqual({}, hasMore)) {
                    viewModel.setHasMoreStorage(hasMore);
                }
            }
        }
        // reset deepReload after loading data (see reload method or constructor)
        self._deepReload = false;
    },

    beforeLoadToDirectionCallback: function(self, filter, cfg) {
        const entries = _private.getEntries(cfg.selectedKeys, cfg.excludedKeys, cfg.source);

        if (entries) {
            filter.entries = entries;
        }
        filter[cfg.parentProperty] = self._root;
    },

    reloadItem: function(self, key) {
        var viewModel = self._children.baseControl.getViewModel();
        var filter = cClone(self._options.filter);
        var nodes = [key !== undefined ? key : null];
        var nodeProperty = self._options.nodeProperty;
        var keyProperty = self._options.keyProperty;

        filter[self._options.parentProperty] = nodes.concat(_private.getReloadableNodes(viewModel, key, keyProperty, nodeProperty));

        return _private.createSourceController(self._options.source, self._options.navigation).load(filter).addCallback(function(result) {
            _private.applyReloadedNodes(viewModel, key, keyProperty, nodeProperty, result);
            return result;
        });
    },

    getReloadableNodes: function(viewModel, nodeKey, keyProp, nodeProp) {
        var nodes = [];
        _private.nodeChildsIterator(viewModel, nodeKey, nodeProp, function(elem) {
            nodes.push(elem.get(keyProp));
        });
        return nodes;
    },

    applyReloadedNodes: function(viewModel, nodeKey, keyProp, nodeProp, newItems) {
        var itemsToRemove = [];
        var items = viewModel.getItems();
        var checkItemForRemove = function(item) {
            if (newItems.getIndexByValue(keyProp, item.get(keyProp)) === -1) {
                itemsToRemove.push(item);
            }
        };

        _private.nodeChildsIterator(viewModel, nodeKey, nodeProp, checkItemForRemove, checkItemForRemove);

        items.setEventRaising(false, true);

        itemsToRemove.forEach(function(item) {
            items.remove(item);
        });
        items.merge(newItems, {
            remove: false,
            inject: true
        });

        items.setEventRaising(true, true);
    },

    initListViewModelHandler(self, listModel): void {
        // https://online.sbis.ru/opendoc.html?guid=d99190bc-e3e9-4d78-a674-38f6f4b0eeb0
        listModel.subscribe('onNodeRemoved', self._onNodeRemovedFn);
        listModel.subscribe('expandedItemsChanged', self._onExpandedItemsChanged.bind(self));
        listModel.subscribe('collapsedItemsChanged', self._onCollapsedItemsChanged.bind(self));
    },

    nodeChildsIterator: function(viewModel, nodeKey, nodeProp, nodeCallback, leafCallback) {
        var findChildNodesRecursive = function(key) {
            viewModel.getChildren(key).forEach(function(elem) {
                if (elem.get(nodeProp) !== null) {
                    if (nodeCallback) {
                        nodeCallback(elem);
                    }
                    findChildNodesRecursive(elem.get(nodeProp));
                } else if (leafCallback) {
                    leafCallback(elem);
                }
            });
        };

        findChildNodesRecursive(nodeKey);
    },

    getOriginalSource: function(source) {
        while(source.getOriginal) {
            source = source.getOriginal();
        }

        return source;
    }
};

/**
 * Hierarchical list control with custom item template. Can load data from data source.
 *
 * @class Controls/_treeGrid/TreeControl
 * @mixes Controls/interface/IEditableList
 * @mixes Controls/_treeGrid/TreeGridView/Styles
 * @extends Controls/_list/ListControl
 * @control
 * @private
 * @category List
 */

var TreeControl = Control.extend(/** @lends Controls/_treeGrid/TreeControl.prototype */{
    _onNodeRemovedFn: null,
    _template: TreeControlTpl,
    _root: null,
    _updatedRoot: false,
    _deepReload: false,
    _nodesSourceControllers: null,
    _needResetExpandedItems: false,
    _beforeReloadCallback: null,
    _afterReloadCallback: null,
    _beforeLoadToDirectionCallback: null,
    _expandOnDragData: null,
    constructor: function(cfg) {
        this._nodesSourceControllers = {};
        this._onNodeRemovedFn = this._onNodeRemoved.bind(this);
        if (typeof cfg.root !== 'undefined') {
            this._root = cfg.root;
        }
        if (cfg.expandedItems && cfg.expandedItems.length > 0) {
            this._deepReload = true;
        }
        this._beforeReloadCallback = _private.beforeReloadCallback.bind(null, this);
        this._afterReloadCallback = _private.afterReloadCallback.bind(null, this);
        this._beforeLoadToDirectionCallback = _private.beforeLoadToDirectionCallback.bind(null, this);
        return TreeControl.superclass.constructor.apply(this, arguments);
    },
    _afterMount: function() {
        _private.initListViewModelHandler(this, this._children.baseControl.getViewModel());
    },
    _onNodeRemoved: function(event, nodeId) {
        _private.onNodeRemoved(this, nodeId);
    },
    _beforeUpdate: function(newOptions) {
        if (typeof newOptions.root !== 'undefined' && this._root !== newOptions.root) {
            this._root = newOptions.root;
            this._updatedRoot = true;
            this._children.baseControl.cancelEdit();
        }
        if (this._needResetExpandedItems) {
            this._children.baseControl.getViewModel().resetExpandedItems();
            this._needResetExpandedItems = false;
        }
        //если expandedItems задана статично, то при обновлении в модель будет отдаваться всегда изначальная опция. таким образом происходит отмена разворота папок.
        if (newOptions.expandedItems) {
            this._children.baseControl.getViewModel().setExpandedItems(newOptions.expandedItems);
        }
        if (newOptions.collapsedItems) {
            this._children.baseControl.getViewModel().setCollapsedItems(newOptions.collapsedItems);
        }

        if (newOptions.nodeFooterTemplate !== this._options.nodeFooterTemplate) {
            this._children.baseControl.getViewModel().setNodeFooterTemplate(newOptions.nodeFooterTemplate);
        }
        if (newOptions.expanderDisplayMode !== this._options.expanderDisplayMode) {
            this._children.baseControl.getViewModel().setExpanderDisplayMode(newOptions.expanderDisplayMode);
        }
        if (newOptions.expanderVisibility !== this._options.expanderVisibility) {
            this._children.baseControl.getViewModel().setExpanderVisibility(newOptions.expanderVisibility);
        }
    },
    _afterUpdate: function(oldOptions) {
        if (this._updatedRoot) {
            this._updatedRoot = false;
            _private.clearSourceControllers(this);
            var self = this;
            // При смене корне, не надо запрашивать все открытые папки, т.к. их может не быть и мы загрузим много лишних данных.
            this._needResetExpandedItems = true;
            // If filter or source was changed, do not need to reload again, baseControl reload list in beforeUpdate
            if (isEqual(this._options.filter, oldOptions.filter) && this._options.source === oldOptions.source) {
                this._children.baseControl.reload();
            }
        }
        if ((oldOptions.groupMethod !== this._options.groupMethod) || (oldOptions.viewModelConstructor !== this._viewModelConstructor)) {
            _private.initListViewModelHandler(this, this._children.baseControl.getViewModel());
        }
    },
    resetExpandedItems(): void {
        this._children.baseControl.getViewModel().resetExpandedItems();
    },
    toggleExpanded: function(key) {
        var
            item = this._children.baseControl.getViewModel().getItemById(key, this._options.keyProperty);
        _private.toggleExpanded(this, item);
    },
    _onExpanderClick: function(e, dispItem) {
        _private.toggleExpanded(this, dispItem);
        if (this._options.markItemByExpanderClick) {
            this._children.baseControl.getViewModel().setMarkedKey(dispItem.getContents().getId());
        }
        e.stopImmediatePropagation();
    },
    _onLoadMoreClick: function(e, dispItem) {
        _private.loadMore(this, dispItem);
    },
    _onExpandedItemsChanged(e, expandedItems) {
        this._notify('expandedItemsChanged', [expandedItems]);
        //вызываем обновление, так как, если нет биндинга опции, то контрол не обновится. А обновление нужно, чтобы отдать в модель нужные expandedItems
        this._forceUpdate();
    },
    _onCollapsedItemsChanged(e, collapsedItems) {
        this._notify('collapsedItemsChanged', [collapsedItems]);
        //вызываем обновление, так как, если нет биндинга опции, то контрол не обновится. А обновление нужно, чтобы отдать в модель нужные collapsedItems
        this._forceUpdate();
    },
    reload: function() {
        var self = this;

        //deep reload is needed only if reload was called from public API.
        //otherwise, option changing will work incorrect.
        //option changing may be caused by search or filtering
        self._deepReload = true;
        return this._children.baseControl.reload();
    },

    setMarkedKey: function(key) {
        this._children.baseControl.getViewModel().setMarkedKey(key);
    },
    scrollToItem(key: string|number, toBottom: boolean): void {
        this._children.baseControl.scrollToItem(key, toBottom);
    },
    reloadItem: function(key, readMeta, direction):Deferred {
        let baseControl = this._children.baseControl;
        let result;

        if (direction === 'depth') {
            result = _private.reloadItem(this, key);
        } else {
            result = baseControl.reloadItem.apply(baseControl, arguments);
        }

        return result;
    },
    beginEdit: function(options) {
        return this._options.readOnly ? Deferred.fail() : this._children.baseControl.beginEdit(options);
    },
    beginAdd: function(options) {
        return this._options.readOnly ? Deferred.fail() : this._children.baseControl.beginAdd(options);
    },

    cancelEdit: function() {
        return this._options.readOnly ? Deferred.fail() : this._children.baseControl.cancelEdit();
    },

    commitEdit: function() {
        return this._options.readOnly ? Deferred.fail() : this._children.baseControl.commitEdit();
    },

    _markedKeyChangedHandler: function(event, key) {
        this._notify('markedKeyChanged', [key]);
    },

    _itemMouseMove: function(event, itemData, nativeEvent) {
        var model = this._children.baseControl.getViewModel();

        if ((model.getDragEntity() || model.getDragItemData()) && itemData.dispItem.isNode()) {
            this._nodeMouseMove(itemData, nativeEvent);
        }
    },

    _onItemMouseLeave: function() {
        this._clearTimeoutForExpandOnDrag(this);
        this._expandOnDragData = null;
    },
    _dragEnd: function() {
        this._clearTimeoutForExpandOnDrag(this);
    },

    _clearTimeoutForExpandOnDrag: function() {
        if (this._timeoutForExpandOnDrag) {
            clearTimeout(this._timeoutForExpandOnDrag);
            this._timeoutForExpandOnDrag = null;
        }
        this._expandOnDragData = null;
    },

    _expandNodeOnDrag: function(itemData) {
        if (!itemData.isExpanded) {
            _private.toggleExpanded(this, itemData.dispItem);
        }
    },
    _setTimeoutForExpandOnDrag: function (itemData) {
        this._timeoutForExpandOnDrag = setTimeout(() => {
                this._expandNodeOnDrag(itemData);
            },
            EXPAND_ON_DRAG_DELAY);
    },
    _nodeMouseMove: function(itemData, event) {
        var
            position,
            topOffset,
            bottomOffset,
            dragTargetRect,
            dragTargetPosition,
            model = this._children.baseControl.getViewModel(),
            dragTarget = event.target.closest('.js-controls-TreeView__dragTargetNode');

        if (dragTarget) {
            dragTargetRect = dragTarget.getBoundingClientRect();
            topOffset = event.nativeEvent.pageY - dragTargetRect.top;
            bottomOffset = dragTargetRect.top + dragTargetRect.height - event.nativeEvent.pageY;

            if (topOffset < DRAG_MAX_OFFSET || bottomOffset < DRAG_MAX_OFFSET) {
                if (model.getDragItemData()) {
                    position = topOffset < DRAG_MAX_OFFSET ? 'before' : 'after';
                    dragTargetPosition = model.calculateDragTargetPosition(itemData, position);

                    if (dragTargetPosition && this._notify('changeDragTarget', [model.getDragEntity(), dragTargetPosition.item, dragTargetPosition.position]) !== false) {
                        model.setDragTargetPosition(dragTargetPosition);
                    }
                }
                if (itemData.item.get(itemData.nodeProperty) !== null && (!this._expandOnDragData || this._expandOnDragData !== itemData) && !itemData.isExpanded) {
                    this._clearTimeoutForExpandOnDrag(this);
                    this._expandOnDragData = itemData;
                    this._setTimeoutForExpandOnDrag(this._expandOnDragData);
                }
            }
        }
    },

    _onItemClick: function(e, item, originalEvent) {
        e.stopPropagation();
        const eventResult = this._notify('itemClick', [item, originalEvent], { bubbling: true });
        if (eventResult !== false && this._options.expandByItemClick && item.get(this._options.nodeProperty) !== null) {
            let display = this._children.baseControl.getViewModel().getDisplay();
            _private.toggleExpanded(this, display.getItemBySourceItem(item));
        }
    },

    _onTreeViewKeyDown: function(event) {
        keysHandler(event, HOT_KEYS, _private, this);
    },

    _beforeUnmount: function() {
        _private.clearSourceControllers(this);
        TreeControl.superclass._beforeUnmount.apply(this, arguments);
        this._clearTimeoutForExpandOnDrag();
    }
});

TreeControl.getDefaultOptions = function() {
    return {
        uniqueKeys: true,
        filter: {},
        markItemByExpanderClick: true,
        expandByItemClick: false,
        root: null,
        columns: DEFAULT_COLUMNS_VALUE
    };
};

TreeControl._private = _private;

export = TreeControl;

/**
 * @event Controls/_treeGrid/TreeControl#expandedItemsChanged
 * @param {Vdom/Vdom:SyntheticEvent} eventObject Дескриптор события.
 * @param {Array.<Number|String>} expandedItems Массив с идентификаторами развернутых элементов.
 */
