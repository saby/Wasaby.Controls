import TileViewModel = require('Controls/_tile/TileView/TileViewModel');
import {TreeViewModel} from 'Controls/treeGrid';
import cMerge = require('Core/core-merge');
import InvisibleFor = require('wml!Controls/_tile/TileView/resources/InvisibleFor');

var DEFAULT_FOLDER_WIDTH = 250;

var TreeTileViewModel = TreeViewModel.extend({
    constructor: function (cfg) {
        TreeTileViewModel.superclass.constructor.apply(this, arguments);
        this._tileModel = new TileViewModel(cfg);
        this._onListChangeFn = function(event, changesType) {
            this._nextVersion();
            this._notify('onListChange', changesType);
        }.bind(this);
        this._tileModel.subscribe('onListChange', this._onListChangeFn);
    },

    getItemDataByItem: function (dispItem) {
        var
            prevItem,
            hoveredItem = this._tileModel.getHoveredItem(),
            current = TreeTileViewModel.superclass.getItemDataByItem.apply(this, arguments);

        prevItem = this._display.at(current.index - 1);

        //before grouping and when moving from folders to records, you need to draw invisible items
        if (current.isGroup || prevItem && prevItem.isNode && prevItem.isNode() && !current.dispItem.isNode()) {
            current.beforeItemTemplate = InvisibleFor;
        }

        if (hoveredItem && hoveredItem.key === current.key) {
            current.isHovered = true;
            if (hoveredItem.position) {
                current.isFixed = true;
                current.position = hoveredItem.position;
            }
            current.isAnimated = hoveredItem.isAnimated;
            current.zoomCoefficient = hoveredItem.zoomCoefficient;
        }

        current = cMerge(current, this.getTileItemData());
        if (current.dispItem.isNode && current.dispItem.isNode()) {
            current.itemsHeight = this._options.nodesHeight || current.itemsHeight;
        }

        var
            originalGetVersion = current.getVersion;

        current.getVersion = function () {
            var
                version = originalGetVersion();
            if (current.isHovered) {
                version = 'HOVERED_' + version;
            }
            if (current.isAnimated) {
                version = 'ANIMATED_' + version;
            }
            return version;
        };

        return current;
    },

    getTileItemData: function () {
        var opts = this._tileModel.getTileItemData();
        opts.defaultFolderWidth = DEFAULT_FOLDER_WIDTH;
        return opts;
    },

    setTileMode: function (tileMode) {
        this._tileModel.setTileMode(tileMode);
    },

    getTileMode: function () {
        return this._tileModel.getTileMode();
    },

    setItemsHeight: function (itemsHeight) {
        this._tileModel.setItemsHeight(itemsHeight);
    },

    getItemsHeight: function () {
        return this._tileModel.getItemsHeight();
    },

    setHoveredItem: function (itemData) {
        this._tileModel.setHoveredItem(itemData);
    },

    getHoveredItem: function () {
        return this._tileModel.getHoveredItem();
    },

    setActiveItem: function (itemData) {
        this._tileModel.setActiveItem(itemData);
        TreeTileViewModel.superclass.setActiveItem.apply(this, arguments);
    },

    setDragEntity: function (entity) {
        this._tileModel.setDragEntity(entity);
        TreeTileViewModel.superclass.setDragEntity.apply(this, arguments);
    },

    setRoot: function () {
        this._tileModel.setHoveredItem(null);
        TreeTileViewModel.superclass.setRoot.apply(this, arguments);
    },

    destroy: function () {
        this._tileModel.unsubscribe('onListChange', this._onListChangeFn);
        this._tileModel.destroy();
        TreeTileViewModel.superclass.destroy.apply(this, arguments);
    }
});

export = TreeTileViewModel;
