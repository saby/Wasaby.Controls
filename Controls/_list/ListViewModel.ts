/**
 * Created by kraynovdo on 16.11.2017.
 */
import ItemsViewModel = require('Controls/_list/ItemsViewModel');
import entityLib = require('Types/entity');
import ItemsUtil = require('Controls/_list/resources/utils/ItemsUtil');
import cInstance = require('Core/core-instance');
import { Object as EventObject } from 'Env/Event';
import { IObservable } from 'Types/collection';
import { CollectionItem } from 'Types/display';
import {isPartialSupport} from 'Controls/_grid/utils/GridLayoutUtil'

/**
 *
 * @author Авраменко А.С.
 * @private
 */

var _private = {
    updateIndexes: function(self, startIndex, stopIndex) {
        self._startIndex = startIndex;
        self._stopIndex = stopIndex;
    },
    getItemPadding: function(cfg) {
        if (cfg.itemPadding) {
            return cfg.itemPadding;
        }
        return {
            left: cfg.leftSpacing || cfg.leftPadding,
            right: cfg.rightSpacing || cfg.rightPadding,
            top: cfg.rowSpacing,
            bottom: cfg.rowSpacing
        };
    },
    getSpacingClassList: function(cfg) {
        var
            classList = '',
            itemPadding = _private.getItemPadding(cfg);

        classList += ' controls-ListView__itemContent';
        classList += ' controls-ListView__item-topPadding_' + (itemPadding.top || 'default').toLowerCase();
        classList += ' controls-ListView__item-bottomPadding_' + (itemPadding.bottom || 'default').toLowerCase();
        classList += ' controls-ListView__item-rightPadding_' + (itemPadding.right || 'default').toLowerCase();

        if (cfg.multiSelectVisibility !== 'hidden') {
            classList += ' controls-ListView__itemContent_withCheckboxes';
        } else {
            classList += ' controls-ListView__item-leftPadding_' + (itemPadding.left || 'default').toLowerCase();
        }

        return classList;
    },
    getItemByMarkedKey: function(self, markedKey) {
        if (markedKey === null) {
            return;
        }
        return self.getItemById(markedKey, self._options.keyProperty);
    }
};

var ListViewModel = ItemsViewModel.extend([entityLib.VersionableMixin], {
    _markedItem: null,
    _dragEntity: null,
    _draggingItemData: null,
    _dragTargetPosition: null,
    _actions: null,
    _selectedKeys: null,
    _markedKey: null,
    _hoveredItem: null,

    constructor: function(cfg) {
        var self = this;
        this._actions = {};
        ListViewModel.superclass.constructor.apply(this, arguments);

        if (this._items && cfg.markerVisibility !== 'hidden') {
            if (cfg.markedKey !== null || cfg.markerVisibility === 'always' || cfg.markerVisibility === 'visible') {
                this._markedKey = cfg.markedKey;
                this.updateMarker(cfg.markedKey);
            }
        }

        this._selectedKeys = cfg.selectedKeys || [];

        // TODO надо ли?
        _private.updateIndexes(self, 0, self.getCount());
    },
    setItemPadding: function(itemPadding) {
        this._options.itemPadding = itemPadding;
        this._nextModelVersion();
    },
    setLeftPadding: function(leftPadding) {
        this._options.leftPadding = leftPadding;
        this._nextModelVersion();
    },
    setRightPadding: function(rightPadding) {
        this._options.rightPadding = rightPadding;
        this._nextModelVersion();
    },
    setLeftSpacing: function(leftSpacing) {
        this._options.leftSpacing = leftSpacing;
        this._nextModelVersion();
    },
    setRightSpacing: function(rightSpacing) {
        this._options.rightSpacing = rightSpacing;
        this._nextModelVersion();
    },
    setRowSpacing: function(rowSpacing) {
        this._options.rowSpacing = rowSpacing;
        this._nextModelVersion();
    },
    getItemPadding: function() {
        return _private.getItemPadding(this._options);
    },
    getItemDataByItem: function() {
        var
            itemsModelCurrent = ListViewModel.superclass.getItemDataByItem.apply(this, arguments),
            dragItems,
            drawnActions;
        itemsModelCurrent.isSelected = itemsModelCurrent.dispItem === _private.getItemByMarkedKey(this, this._markedKey);
        itemsModelCurrent.itemActions = this.getItemActions(itemsModelCurrent.item);
        itemsModelCurrent.isActive = this._activeItem && itemsModelCurrent.dispItem.getContents() === this._activeItem.item;
        itemsModelCurrent.isSwiped = this._swipeItem && itemsModelCurrent.dispItem.getContents() === this._swipeItem.item;
        itemsModelCurrent.isRightSwiped = this._rightSwipedItem && itemsModelCurrent.dispItem.getContents() === this._rightSwipedItem.item;
        itemsModelCurrent.multiSelectStatus = this._selectedKeys[itemsModelCurrent.key];
        itemsModelCurrent.searchValue = this._options.searchValue;
        itemsModelCurrent.multiSelectVisibility = this._options.multiSelectVisibility;
        itemsModelCurrent.markerVisibility = this._options.markerVisibility;
        itemsModelCurrent.itemTemplateProperty = this._options.itemTemplateProperty;
        itemsModelCurrent.isSticky = itemsModelCurrent.isSelected && itemsModelCurrent.style === 'master';
        itemsModelCurrent.spacingClassList = _private.getSpacingClassList(this._options);
        itemsModelCurrent.itemPadding = _private.getItemPadding(this._options);

        if (itemsModelCurrent.itemActions) {
           drawnActions = itemsModelCurrent.itemActions.showed;
        }
        if (this._editingItemData) {
            itemsModelCurrent.drawActions = itemsModelCurrent.key === this._editingItemData.key;
        } else {
            itemsModelCurrent.drawActions = drawnActions && drawnActions.length;
        }
        if (itemsModelCurrent.drawActions && drawnActions) {
            itemsModelCurrent.hasActionWithIcon = false;
            for (var i = 0; i < drawnActions.length; i++) {
                if (drawnActions[i].icon) {
                    itemsModelCurrent.hasActionWithIcon = true;
                    break;
                }
            }
        }
        if (this._editingItemData && itemsModelCurrent.key === this._editingItemData.key) {
            itemsModelCurrent.isEditing = true;
            itemsModelCurrent.item = this._editingItemData.item;
        }

        if (this._dragEntity) {
            dragItems = this._dragEntity.getItems();
            if (dragItems[0] === itemsModelCurrent.key) {
                itemsModelCurrent.isDragging = true;
            }
            if (dragItems.indexOf(itemsModelCurrent.key) !== -1) {
                itemsModelCurrent.isVisible = dragItems[0] === itemsModelCurrent.key ? !this._dragTargetPosition : false;
            }
            if (this._dragTargetPosition && this._dragTargetPosition.index === itemsModelCurrent.index) {
                itemsModelCurrent.dragTargetPosition = this._dragTargetPosition.position;
                itemsModelCurrent.draggingItemData = this._draggingItemData;
            }
        }
        return itemsModelCurrent;
    },

    _calcItemVersion: function(item, key) {
        var version = ListViewModel.superclass._calcItemVersion.apply(this, arguments);

        if (this._dragEntity && this._dragEntity.getItems().indexOf(key) !== -1) {
            version = 'DRAG_ITEM_' + version;
        }

        if (this._dragTargetPosition && this._dragTargetPosition.item === item) {
            version = 'DRAG_POSITION_' + this._dragTargetPosition.position + '_' + version;
        }

        if (this._markedKey === key) {
            version = 'MARKED_' + version;
        }
        if (this._activeItem && this._activeItem.item === item) {
            version = 'ACTIVE_' + version;
        }
        if (isPartialSupport && this._hoveredItem === item) {
            version = 'HOVERED_' + version;
        }
        if (this._selectedKeys && this._selectedKeys.hasOwnProperty(key)) {
            version = 'SELECTED_' + this._selectedKeys[key] + '_' + version;
        }

        return version;
    },

    setMarkedKey: function(key) {
        if (key === this._markedKey) {
            return;
        }
        this._markedKey = key;
        this._updateMarker(key);
        this._nextModelVersion(true);
        this._notify('onMarkedKeyChanged', this._markedKey);
    },

    _updateMarker: function(markedKey):void {
        if (!this.getCount() || this._options.markerVisibility === 'hidden') {
            return;
        }

        if (this._options.markerVisibility === 'onactivated' && this._markedKey === null) {
            return;
        }

        // If record with key equal markedKey not found in recordSet, set markedKey equal key first record in recordSet
        if (_private.getItemByMarkedKey(this, markedKey)) {
            this._markedKey = markedKey;
        } else {
            this._markedKey = this._items.at(0).getId();
        }
    },

    updateMarker: function(markedKey):void {
        const curMarkedKey = this._markedKey;

        this._updateMarker(markedKey);
        if (curMarkedKey !== this._markedKey) {
            this._notify('onMarkedKeyChanged', this._markedKey);
            this._nextModelVersion(true);
        }
    },

    setMarkerVisibility: function(markerVisibility) {
        this._options.markerVisibility = markerVisibility;
        this._nextModelVersion();
    },

    getFirstItem: function() {
        return ItemsUtil.getFirstItem(this._display);
    },
    getLastItem: function() {
        return ItemsUtil.getLastItem(this._display);
    },
    getIndexByKey: function(key) {
        var
            item = this.getItemById(key, this._options.keyProperty);
        return this._display.getIndex(item);
    },
    getNextItemKey: function(key) {
        var
            itemIdx = this.getIndexByKey(key),
            nextItemId = itemIdx + 1,
            nextItem,
            itemsCount = this._display.getCount();
        while (nextItemId < itemsCount) {
            nextItem = this._display.at(nextItemId).getContents();
            if (cInstance.instanceOfModule(nextItem, 'Types/entity:Model')) {
                return this._display.at(nextItemId).getContents().getId();
            }
            nextItemId++;
        }
    },
    getPreviousItemKey: function(key) {
        var
            itemIdx = this.getIndexByKey(key),
            prevItemId = itemIdx - 1,
            prevItem;
        while (prevItemId >= 0) {
            prevItem = this._display.at(prevItemId).getContents();
            if (cInstance.instanceOfModule(prevItem, 'Types/entity:Model')) {
                return this._display.at(prevItemId).getContents().getId();
            }
            prevItemId--;
        }
    },
    getMarkedKey: function() {
        return this._markedKey;
    },
    getMarkedItem: function() {
        return _private.getItemByMarkedKey(this, this._markedKey);
    },
    getSelectionStatus: function(key) {
        return this._selectedKeys[key] !== undefined;
    },

    getSwipeItem: function() {
        return this._swipeItem.item;
    },

    setActiveItem: function(itemData) {
        if (!this._activeItem || !itemData || itemData.dispItem.getContents() !== this._activeItem.item) {
            this._activeItem = itemData;
            this._nextModelVersion(true);
        }
    },

    setDragEntity: function(entity) {
        if (this._dragEntity !== entity) {
            this._dragEntity = entity;
            this._nextModelVersion(true);
        }
    },

    getDragEntity: function() {
        return this._dragEntity;
    },

    setDragItemData: function(itemData) {
        this._draggingItemData = itemData;
    },

    getDragItemData: function() {
        return this._draggingItemData;
    },

    calculateDragTargetPosition: function(targetData) {
        var
            position,
            prevIndex = -1;

        //If you hover on a record that is being dragged, then the position should not change.
        if (this._draggingItemData && this._draggingItemData.index === targetData.index) {
            return null;
        }

        if (this._dragTargetPosition) {
            prevIndex = this._dragTargetPosition.index;
        } else if (this._draggingItemData) {
            prevIndex = this._draggingItemData.index;
        }

        if (prevIndex === -1) {
            position = 'before';
        } else if (targetData.index > prevIndex) {
            position = 'after';
        } else if (targetData.index < prevIndex) {
            position = 'before';
        } else if (targetData.index === prevIndex) {
            position = this._dragTargetPosition.position === 'after' ? 'before' : 'after';
        }

        return {
            index: targetData.index,
            item: targetData.item,
            data: targetData,
            position: position
        };
    },

    setDragTargetPosition: function(position) {
        this._dragTargetPosition = position;
        this._nextModelVersion(true);
    },

    getDragTargetPosition: function() {
        return this._dragTargetPosition;
    },

    setSwipeItem: function(itemData) {
        if (!this._swipeItem || !itemData || itemData.item !== this._swipeItem.item) {
           this._swipeItem = itemData;
           this._nextModelVersion();
        }
    },

    setRightSwipedItem: function(itemData) {
        this._rightSwipedItem = itemData;
        this._nextModelVersion();
    },

    setHoveredItem: function(item){
        this._hoveredItem = item;
        this._nextModelVersion(true, 'hoveredItemChanged');
    },

    getHoveredItem: function () {
        return this._hoveredItem;
    },

    updateIndexes: function(startIndex, stopIndex) {
        if ((this._startIndex !== startIndex) || (this._stopIndex !== stopIndex)) {
            _private.updateIndexes(self, startIndex, stopIndex);
            this._nextModelVersion();
        }
    },

    getStartIndex: function() {
        return this._startIndex;
    },

    getStopIndex: function() {
        return this._stopIndex;
    },

    setItems: function(items) {
        var currentItems = this.getItems();

        ListViewModel.superclass.setItems.apply(this, arguments);

        //we should try to set markedKey by options, if there were no items before
        //this._markedKey setted in constructor only if items were in constructor config
        this.updateMarker(currentItems ? this._markedKey : this._options.markedKey);
        this._nextModelVersion();
    },

    _onBeginCollectionChange: function(action, newItems, newItemsIndex, removedItems, removedItemsIndex) {
        var
           self = this;
        if (action === IObservable.ACTION_CHANGE.ACTION_REMOVE && removedItems && removedItems.length) {
            // TODO KINGO. При удалении элементов очищаем закешированные для них операции над записью. Тем самым:
            // а) избавляемся от утечек (не храним в памяти лишние ссылки);
            // б) при создании записи с таким же ID мы сгенерим для неё новые операции над записью, а не переиспользуем старые.
            // https://online.sbis.ru/opendoc.html?guid=905c3018-384a-4587-845c-aca5dc51944b
            removedItems.forEach(function(removedItem) {
                var
                   removedItemContents = removedItem.getContents();
                if (removedItemContents.get) {
                    delete self._actions[removedItemContents.get(self._options.keyProperty)];
                }
            });
        }
        _private.updateIndexes(this, 0, this.getCount());
    },

    _setEditingItemData: function(itemData) {
        const data = itemData ? itemData : this._editingItemData;
        this._editingItemData = itemData;
        this._onCollectionChange(
           new EventObject('oncollectionchange', this._display),
           IObservable.ACTION_CHANGE,
           [new CollectionItem({
              contents: data.item
           })],
           data.index,
           [],
           0
        );
        this._nextModelVersion();
    },

    getEditingItemData(): object | null {
        return this._editingItemData;
    },

    setItemActions: function(item, actions) {
        if (item.get) {
            const id = item.get(this._options.keyProperty);
            if (this.getItemById(id, this._options.keyProperty)) {
               this._actions[id] = actions;
            }
        }
    },

    _prepareDisplayItemForAdd: function(item) {
        return ItemsUtil.getDefaultDisplayItem(this._display, item);
    },

    getItemActions: function(item) {
        const id = ItemsUtil.getPropertyValue(item, this._options.keyProperty);
        return this._actions[id];
    },

    updateSelection: function(selectedKeys) {
        this._selectedKeys = selectedKeys || [];
        this._nextModelVersion(true);
    },

    getActiveItem: function() {
        return this._activeItem;
    },

    setItemTemplateProperty: function(itemTemplateProperty) {
        this._options.itemTemplateProperty = itemTemplateProperty;
        this._nextModelVersion();
    },

    setMultiSelectVisibility: function(multiSelectVisibility) {
        this._options.multiSelectVisibility = multiSelectVisibility;
        this._nextModelVersion(true);
    },

    getMultiSelectVisibility: function() {
        return this._options.multiSelectVisibility;
    },

    setSorting: function(sorting) {
        this._options.sorting = sorting;
    },

    getSorting: function() {
        return this._options.sorting;
    },

    setSearchValue: function(value) {
        this._options.searchValue = value;
    },

    __calcSelectedItem: function(display, selKey, keyProperty) {

        // TODO надо вычислить индекс
        /* if(!this._markedItem) {
         if (!this._selectedIndex) {
         this._selectedIndex = 0;//переводим на первый элемент
         }
         else {
         this._selectedIndex++;//условно ищем ближайший элемент, рядом с удаленным
         }
         this._markedItem = this._display.at(this._selectedIndex);
         } */
    }
});

ListViewModel._private = _private;

export = ListViewModel;
