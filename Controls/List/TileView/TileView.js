define('Controls/List/TileView/TileView', [
   'Controls/List/ListView',
   'wml!Controls/List/TileView/TileView',
   'wml!Controls/List/TileView/DefaultItemTpl',
   'Controls/Application/TouchDetector/TouchContextField',
   'css!Controls/List/TileView/TileView'
], function(ListView, template, defaultItemTpl, TouchContextField) {

   'use strict';
   var _private = {
      getFixedPosition: function(itemRect, containerRect) {
         var
            result,
            additionalWidth = itemRect.width / 2,
            additionalHeight = itemRect.height / 2,
            leftOffset = itemRect.left - additionalWidth / 2,
            topOffset = itemRect.top - additionalHeight / 2,
            rightOffset = containerRect.width - (itemRect.right + additionalWidth / 2),
            bottomOffset = containerRect.height - (itemRect.bottom + additionalHeight / 2);

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

   var ZOOM_DELAY = 250;

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
         var self = this;

         if (!this._listModel.getHoveredItem()) {
            if (this._options.hoverMode && !_private.isTouch(this)) {
               if (this._mouseMoveTimeout) {
                  _private.clearMouseMoveTimeout(this);
               }
               this._mouseMoveTimeout = setTimeout(function() {
                  var itemRect = event.target.closest('.controls-TileView__item').getBoundingClientRect();

                  //If the hover on the checkbox does not increase the element
                  if (!event.target.closest('.js-controls-ListView__checkbox')) {
                     self._setFixedItem(itemRect, document.body.getBoundingClientRect(), itemData.key);
                  }
               }, ZOOM_DELAY);
            } else {
               this._listModel.setHoveredItem(itemData);
            }
         }
      },

      _setFixedItem: function(itemContainerRect, containerRect, key) {
         var position = _private.getFixedPosition(itemContainerRect, containerRect);

         this._listModel.setHoveredItem({
            key: key,
            fixedPosition: _private.getPositionStyle(position)
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
