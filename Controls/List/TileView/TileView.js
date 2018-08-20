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

         if (leftOffset < 0 && rightOffset < 0 || topOffset < 0 && bottomOffset < 0) {
            result = null;
         } else {
            if (leftOffset < 0 && rightOffset < 0) {
               leftOffset = rightOffset = 0;
            } else if (leftOffset < 0) {
               rightOffset += leftOffset;
               leftOffset = 0;
            } else if (rightOffset < 0) {
               leftOffset += rightOffset;
               rightOffset = 0;
            }
            if (topOffset < 0) {
               topOffset = 0;
            }

            result = {
               right: rightOffset,
               left: leftOffset,
               top: topOffset
            };
         }
         return result;
      },
      onScroll: function(self) {
         clearTimeout(self._mouseMoveTimeout);
         self._listModel.setHoveredItem(null);
      }
   };


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
         clearTimeout(this._mouseMoveTimeout);
      },

      _onItemMouseMove: function(event, itemData) {
         var self = this;

         if (!this._listModel.getHoveredItem()) {
            if (this._options.hoverMode && !this._context.isTouch.isTouch) {
               if (this._mouseMoveTimeout) {
                  clearTimeout(this._mouseMoveTimeout);
               }
               this._mouseMoveTimeout = setTimeout(function() {
                  var target = event.target;

                  //If the hover on the checkbox does not increase the element
                  if (!target.closest('.js-controls-ListView__checkbox')) {
                     self._setFixedItem(target.closest('.controls-TileView__item'), itemData);
                  }
               }, 250);
            } else {
               this._listModel.setHoveredItem(itemData);
            }
         }
      },

      _setFixedItem: function(itemContainer, itemData) {
         var
            style = '',
            position = _private.getFixedPosition(itemContainer.getBoundingClientRect(), {
               width: document.body.clientWidth,
               height: document.body.clientHeight
            });

         if (position) {
            for (var side in position) {
               if (position.hasOwnProperty(side)) {
                  style += side + ': ' + position[side] + 'px; ';
               }
            }
         }

         this._listModel.setHoveredItem({
            key: itemData.key,
            fixedPosition: style
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

   return TileView;
});
