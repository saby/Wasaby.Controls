import {ListView} from 'Controls/list';
import template = require('wml!Controls/_tile/TileView/TileView');
import defaultItemTpl = require('wml!Controls/_tile/TileView/DefaultItemTpl');
import TouchContextField = require('Controls/Context/TouchContextField');
import ItemSizeUtils = require('Controls/_tile/TileView/resources/ItemSizeUtils');
import { IoC } from 'Env/Env';
import 'css!theme?Controls/tile';

var _private = {
    getPositionInContainer: function (itemNewSize, itemRect, containerRect, zoomCoefficient) {
        var
            result,
            additionalWidth = (itemNewSize.width - itemRect.width) / 2,
            additionalHeightBottom = (itemNewSize.height - itemRect.height * zoomCoefficient),
            additionalHeight = (itemNewSize.height - itemRect.height - additionalHeightBottom) / 2,
            leftOffset = itemRect.left - (containerRect.left + additionalWidth),
            topOffset = itemRect.top - (containerRect.top + additionalHeight),
            rightOffset = containerRect.right - (itemRect.right + additionalWidth),
            bottomOffset = containerRect.bottom - (itemRect.bottom + additionalHeight + additionalHeightBottom);

        return _private.getCorrectPosition(topOffset, rightOffset, bottomOffset, leftOffset);
    },
    getPositionInDocument: function(position, containerRect, documentRect) {
        var
            left = position.left + containerRect.left,
            right = position.right + (documentRect.width - containerRect.right),
            top = position.top + containerRect.top,
            bottom = position.bottom + (documentRect.height - containerRect.bottom);

        return _private.getCorrectPosition(top, right, bottom, left);
    },
    getCorrectPosition: function(top, right, bottom, left) {
        if (left < 0) {
            right += left;
            left = 0;
        } else if (right < 0) {
            left += right;
            right = 0;
        }
        if (top < 0) {
            bottom += top;
            top = 0;
        } else if (bottom < 0) {
            top += bottom;
            bottom = 0;
        }

        if (left < 0 || right < 0 || top < 0 || bottom < 0) {
            return null;
        } else {
            return {left, right, top, bottom};
        }
    },
    getItemStartPosition: function (itemContainerRect, containerRect) {
        return {
            top: itemContainerRect.top,
            left: itemContainerRect.left,
            right: containerRect.width - itemContainerRect.right,
            bottom: containerRect.height - itemContainerRect.bottom
        };
    },
    onScroll: function (self) {
        _private.clearMouseMoveTimeout(self);
        self._listModel.setHoveredItem(null);
    },
    clearMouseMoveTimeout: function (self) {
        clearTimeout(self._mouseMoveTimeout);
        self._mouseMoveTimeout = null;
    },
    isTouch: function (self) {
        return self._context.isTouch.isTouch;
    },
    getPositionStyle: function (position) {
        var result = '';
        if (position) {
            for (var side in position) {
                if (position.hasOwnProperty(side)) {
                    result += side + ': ' + position[side] + 'px; ';
                }
            }
        }
        return result;
    }
};

var
    ZOOM_DELAY = 100,
    ZOOM_COEFFICIENT = 1.5;

var TILE_SCALING_MODE = {
    NONE: 'none',
    OUTSIDE: 'outside',
    INSIDE: 'inside'
};


var TileView = ListView.extend({
    _template: template,
    _defaultItemTemplate: defaultItemTpl,
    _hoveredItem: undefined,
    _mouseMoveTimeout: undefined,
    _resizeFromSelf: false,

    _beforeMount: function(options) {
        if (options.hasOwnProperty('hoverMode')) {
            IoC.resolve('ILogger').warn(this._moduleName, 'Используется устаревшая опция hoverMode, используйте tileScalingMode');
            this._tileScalingMode = !!options.hoverMode ? TILE_SCALING_MODE.OUTSIDE : TILE_SCALING_MODE.NONE;
        } else {
            this._tileScalingMode = options.tileScalingMode;
        }

        TileView.superclass._beforeMount.apply(this, arguments);
    },

    _afterMount: function () {
        this._notify('register', ['controlResize', this, this._onResize], {bubbling: true});
        this._notify('register', ['scroll', this, this._onScroll], {bubbling: true});
        TileView.superclass._afterMount.apply(this, arguments);
    },

    _onResize: function () {
       this._listModel.setHoveredItem(null);
    },

    _beforeUpdate: function (newOptions) {
        if (this._options.tileMode !== newOptions.tileMode) {
            this._listModel.setTileMode(newOptions.tileMode);
        }
        if (this._options.itemsHeight !== newOptions.itemsHeight) {
            this._listModel.setItemsHeight(newOptions.itemsHeight);
        }
        TileView.superclass._beforeUpdate.apply(this, arguments);
    },

    _afterUpdate: function () {
        var hoveredItem = this._listModel.getHoveredItem();

        if (hoveredItem && hoveredItem.endPosition && this._hasFixedItemInDOM()) {
            this._listModel.setHoveredItem({
                key: hoveredItem.key,
                isAnimated: true,
                zoomCoefficient: this._getZoomCoefficient(),
                position: hoveredItem.endPosition
            });
        }
        TileView.superclass._afterUpdate.apply(this, arguments);
    },

    //TODO: Удалить проверку на DOM. https://online.sbis.ru/opendoc.html?guid=85bf65db-66a4-4b17-a59d-010a5ecb15a9
    _hasFixedItemInDOM: function () {
        return !!this._children.tileContainer.querySelector('.controls-TileView__item_fixed');
    },

    _onItemMouseLeave: function (event, itemData) {
        var hoveredItem = this._listModel.getHoveredItem();
        if (hoveredItem && hoveredItem.key === itemData.key) {
            if (!itemData.isActive || hoveredItem.key !== itemData.key) {
                this._listModel.setHoveredItem(null);
            }
        }
        _private.clearMouseMoveTimeout(this);
        TileView.superclass._onItemMouseLeave.apply(this, arguments);
    },

    _onItemMouseMove: function (event, itemData) {
        if (!this._listModel.getHoveredItem() && !_private.isTouch(this) && !this._listModel.getDragEntity()) {
            _private.clearMouseMoveTimeout(this);

            this._calculateHoveredItemPosition(event, itemData);
        }
        TileView.superclass._onItemMouseMove.apply(this, arguments);
    },

    _calculateHoveredItemPosition: function (event, itemData) {
        var
            itemSize,
            container,
            itemContainer,
            containerRect,
            itemContainerRect;

        //If the hover on the checkbox does not increase the element
        if (!event.target.closest('.js-controls-TileView__withoutZoom')) {
            if (this._options.tileScalingMode === TILE_SCALING_MODE.NONE) {
                this._setHoveredItem(itemData);
            } else {
                itemContainer = event.target.closest('.controls-TileView__item');
                itemContainerRect = itemContainer.getBoundingClientRect();
                container = this._options.tileScalingMode === TILE_SCALING_MODE.INSIDE ? this._children.tileContainer : document.documentElement;
                containerRect = container.getBoundingClientRect();
                itemSize = ItemSizeUtils.getItemSize(itemContainer, this._getZoomCoefficient(), this._options.tileMode);
                this._prepareHoveredItem(itemData, itemContainerRect, itemSize, containerRect);
            }
        }
    },

    _prepareHoveredItem: function (itemData, itemContainerRect, itemSize, containerRect) {
        var
            self = this,
            documentRect,
            itemStartPosition,
            position = _private.getPositionInContainer(itemSize, itemContainerRect, containerRect, this._getZoomCoefficient());

        if (position) {
            documentRect = document.documentElement.getBoundingClientRect();
            itemStartPosition = this._tileScalingMode !== TILE_SCALING_MODE.NONE ? _private.getItemStartPosition(itemContainerRect, documentRect) : null;
            this._mouseMoveTimeout = setTimeout(function () {
                self._setHoveredItem(itemData, _private.getPositionInDocument(position, containerRect, documentRect), itemStartPosition);
            }, ZOOM_DELAY);
        } else {
            this._setHoveredItem(itemData);
        }
    },

    _getZoomCoefficient: function () {
        return this._tileScalingMode !== TILE_SCALING_MODE.NONE ? ZOOM_COEFFICIENT : 1;
    },

    _setHoveredItem: function (itemData, position, startPosition) {
        this._listModel.setHoveredItem({
            key: itemData.key,
            zoomCoefficient: this._getZoomCoefficient(),
            position: _private.getPositionStyle(startPosition || position),
            endPosition: _private.getPositionStyle(position)
        });
    },

    _onItemWheel: function () {
        _private.onScroll(this);
    },

    _onScroll: function () {
        _private.onScroll(this);
    },

    getItemsContainer: function () {
        return this._children.tileContainer;
    },

    _beforeUnmount: function () {
        this._notify('unregister', ['controlResize', this], {bubbling: true});
        this._notify('unregister', ['scroll', this], {bubbling: true});
    },

    _onTileViewKeyDown: function () {
    }
});

TileView.getDefaultOptions = function () {
    return {
        itemsHeight: 150,
        tileMode: 'static',
        tileScalingMode: TILE_SCALING_MODE.NONE
    };
};

TileView.contextTypes = function contextTypes() {
    return {
        isTouch: TouchContextField
    };
};

TileView._private = _private;

export = TileView;
