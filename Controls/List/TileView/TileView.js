define('Controls/List/TileView/TileView', [
   'Controls/List/ListView',
   'wml!Controls/List/TileView/TileView',
   'wml!Controls/List/TileView/DefaultItemTpl',
   'Controls/Context/TouchContextField',
   'Controls/List/TileView/resources/ItemSizeUtils',
   'css!Controls/List/TileView/TileView'
], function(ListView, template, defaultItemTpl, TouchContextField, ItemSizeUtils) {

   'use strict';
   var _private = {
      getFixedPosition: function(itemNewSize, itemRect, containerRect, zoomCoefficient) {
         var
            result,
            additionalWidth = (itemNewSize.width - itemRect.width) / 2,
            additionalHeightBottom = (itemNewSize.height - itemRect.height * zoomCoefficient),
            additionalHeight = (itemNewSize.height - itemRect.height - additionalHeightBottom) / 2,
            leftOffset = itemRect.left - additionalWidth,
            topOffset = itemRect.top - additionalHeight,
            rightOffset = containerRect.width - (itemRect.right + additionalWidth),
            bottomOffset = containerRect.height - (itemRect.bottom + additionalHeight + additionalHeightBottom);

         if (leftOffset < 0) {
            rightOffset += leftOffset;
            leftOffset = 0;
         } else if (rightOffset < 0) {
            leftOffset += rightOffset;
            rightOffset = 0;
         }
         if (topOffset < 0) {
            bottomOffset += topOffset;
            topOffset = 0;
         } else if (bottomOffset < 0) {
            topOffset += bottomOffset;
            bottomOffset = 0;
         }

         if (leftOffset < 0 || rightOffset < 0 || topOffset < 0 || bottomOffset < 0) {
            result = null;
         } else {
            result = {
               left: leftOffset,
               right: rightOffset,
               top: topOffset,
               bottom: bottomOffset
            };
         }
         return result;
      },
      getItemPosition: function(itemContainerRect, containerRect) {
         return {
            top: itemContainerRect.top,
            left: itemContainerRect.left,
            right: containerRect.width - itemContainerRect.right,
            bottom: containerRect.height - itemContainerRect.bottom
         };
      },
      onScroll: function(self) {
         _private.clearMouseMoveTimeout(self);
         self._listModel.setHoveredItem(null);
      },
      clearMouseMoveTimeout: function(self) {
         clearTimeout(self._mouseMoveTimeout);
         self._mouseMoveTimeout = null;
      },
      isTouch: function(self) {
         return self._context.isTouch.isTouch;
      },
      getPositionStyle: function(position) {
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
      ZOOM_DELAY = 150,
      ZOOM_COEFFICIENT = 1.5;

   var TileView = ListView.extend({
      _template: template,
      _defaultItemTemplate: defaultItemTpl,
      _hoveredItem: undefined,
      _mouseMoveTimeout: undefined,

      _afterMount: function() {
         this._notify('register', ['controlResize', this, this._onResize], {bubbling: true});
         this._notify('register', ['scroll', this, this._onScroll], {bubbling: true});
      },

      _onResize: function() {
         this._listModel.setHoveredItem(null);
      },

      _beforeUpdate: function(newOptions) {
         if (this._options.tileMode !== newOptions.tileMode) {
            this._listModel.setTileMode(newOptions.tileMode);
         }
         if (this._options.itemsHeight !== newOptions.itemsHeight) {
            this._listModel.setItemsHeight(newOptions.itemsHeight);
         }
      },

      _afterUpdate: function() {
         var hoveredItem = this._listModel.getHoveredItem();

         if (hoveredItem && hoveredItem.endPosition && this._hasFixedItemInDOM()) {
            this._listModel.setHoveredItem({
               key: hoveredItem.key,
               isAnimated: true,
               position: hoveredItem.endPosition
            });
         }
      },

      //TODO: Удалить проверку на DOM. https://online.sbis.ru/opendoc.html?guid=85bf65db-66a4-4b17-a59d-010a5ecb15a9
      _hasFixedItemInDOM: function() {
         return !!this._children.tileContainer.querySelector('.controls-TileView__item_fixed');
      },

      _onItemMouseLeave: function(event, itemData) {
         var hoveredItem = this._listModel.getHoveredItem();
         if (hoveredItem && hoveredItem.key === itemData.key) {
            if (!itemData.isActive || hoveredItem.key !== itemData.key) {
               this._listModel.setHoveredItem(null);
            }
         }
         _private.clearMouseMoveTimeout(this);
      },

      _onItemMouseMove: function(event, itemData) {
         if (!this._listModel.getHoveredItem() && !_private.isTouch(this)) {
            _private.clearMouseMoveTimeout(this);

            this._calculateHoveredItemPosition(event, itemData);
         }
      },

      _calculateHoveredItemPosition: function(event, itemData) {
         var
            itemSize,
            itemContainer,
            containerRect,
            itemContainerRect;

         //If the hover on the checkbox does not increase the element
         if (!event.target.closest('.js-controls-TileView__withoutZoom')) {
            itemContainer = event.target.closest('.controls-TileView__item');
            itemContainerRect = itemContainer.getBoundingClientRect();
            containerRect = document.documentElement.getBoundingClientRect();
            itemSize = ItemSizeUtils.getItemSize(itemContainer, this._getZoomCoefficient());
            this._prepareHoveredItem(itemData, itemContainerRect, itemSize, containerRect);
         }
      },

      _prepareHoveredItem: function(itemData, itemContainerRect, itemSize, containerRect) {
         var
            self = this,
            position = _private.getFixedPosition(itemSize, itemContainerRect, containerRect, this._getZoomCoefficient());

         if (position) {
            this._mouseMoveTimeout = setTimeout(function() {
               self._setHoveredItem(itemData, position, !!self._options.hoverMode ? _private.getItemPosition(itemContainerRect, containerRect) : null);
            }, ZOOM_DELAY);
         } else {
            this._setHoveredItem(itemData);
         }
      },

      _getZoomCoefficient: function() {
         return !!this._options.hoverMode ? ZOOM_COEFFICIENT : 1;
      },

      _setHoveredItem: function(itemData, position, startPosition) {
         this._listModel.setHoveredItem({
            key: itemData.key,
            position: _private.getPositionStyle(startPosition || position),
            endPosition: _private.getPositionStyle(position)
         });
      },

      _onItemWheel: function() {
         _private.onScroll(this);
      },

      _onScroll: function() {
         _private.onScroll(this);
      },

      _beforeUnmount: function() {
         this._notify('unregister', ['controlResize', this], {bubbling: true});
         this._notify('unregister', ['scroll', this], {bubbling: true});
      }
   });

   TileView.getDefaultOptions = function() {
      return {
         itemsHeight: 150,
         tileMode: 'static',
         hoverMode: 'outside'
      };
   };

   TileView.contextTypes = function contextTypes() {
      return {
         isTouch: TouchContextField
      };
   };

   TileView._private = _private;

   return TileView;
});
