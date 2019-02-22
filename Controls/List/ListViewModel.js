/**
 * Created by kraynovdo on 16.11.2017.
 */
define('Controls/List/ListViewModel',
   ['Controls/List/ItemsViewModel', 'Types/entity', 'Controls/List/resources/utils/ItemsUtil', 'Core/core-instance'],
   function(ItemsViewModel, entityLib, ItemsUtil, cInstance) {
      /**
       *
       * @author Авраменко А.С.
       * @public
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

         constructor: function(cfg) {
            var self = this;
            this._actions = [];
            ListViewModel.superclass.constructor.apply(this, arguments);

            if (cfg.markedKey !== undefined) {
               this._markedKey = cfg.markedKey;
               this._markedItem = this.getItemById(cfg.markedKey, cfg.keyProperty);
            }
            if (!this._markedItem && (this._options.markerVisibility === 'always' || this._options.markerVisibility === 'visible') && this._items && this._items.getCount()) {
               this._markedKey = this._items.at(0).getId();
               this._markedItem = this.getItemById(this._markedKey, this._options.keyProperty);
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
               drawedActions;
            itemsModelCurrent.isSelected = itemsModelCurrent.dispItem === this._markedItem;
            itemsModelCurrent.itemActions = this._actions[this.getCurrentIndex()];
            itemsModelCurrent.isActive = this._activeItem && itemsModelCurrent.dispItem.getContents() === this._activeItem.item;
            itemsModelCurrent.showActions = !this._editingItemData && (!this._activeItem || (!this._activeItem.contextEvent && itemsModelCurrent.isActive));
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

            //When you drag'n'drop of items do not need to show itemActions.
            if (itemsModelCurrent.itemActions && !this._dragEntity) {
               if (itemsModelCurrent.itemActions.showed && itemsModelCurrent.itemActions.showed.length) {
                  drawedActions = itemsModelCurrent.itemActions.showed;
               } else {
                  drawedActions = itemsModelCurrent.itemActions.showedFirst;
               }
            }
            if (this._editingItemData) {
               itemsModelCurrent.drawActions = itemsModelCurrent.key === this._editingItemData.key;
            } else {
               itemsModelCurrent.drawActions = drawedActions && drawedActions.length;
            }
            if (itemsModelCurrent.drawActions && drawedActions) {
               itemsModelCurrent.hasShowedItemActionWithIcon = false;
               for (var i = 0; i < drawedActions.length; i++) {
                  if (drawedActions[i].icon) {
                     itemsModelCurrent.hasShowedItemActionWithIcon = true;
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
            var
               version = ListViewModel.superclass._calcItemVersion.apply(this, arguments);
            if (this._markedKey === key) {
               version = 'MARKED_' + version;
            }
            return version;
         },

         setMarkedKey: function(key) {
            if (key === this._markedKey) {
               return;
            }
            this._markedKey = key;
            this._markedItem = this.getItemById(key, this._options.keyProperty);
            this._nextModelVersion(true);
            this._notify('onMarkedKeyChanged', key);
         },

         setMarkerVisibility: function(markerVisibility) {
            this._options.markerVisibility = markerVisibility;
            this._nextModelVersion();
         },

         getFirstItemKey: function() {
            var
               nextItemId = 0,
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
         getSelectionStatus: function(key) {
            return this._selectedKeys[key] !== undefined;
         },

         getSwipeItem: function() {
            return this._swipeItem.item;
         },

         setActiveItem: function(itemData) {
            if (!this._activeItem || !itemData || itemData.dispItem.getContents() !== this._activeItem.item) {
               this._activeItem = itemData;
               this._nextModelVersion();
            }
         },

         setDragEntity: function(entity) {
            if (this._dragEntity !== entity) {
               this._dragEntity = entity;
               this._nextModelVersion();
            }
         },

         getDragEntity: function() {
            return this._dragEntity;
         },

         setDragItemData: function(itemData) {
            this._draggingItemData = itemData;
            this._nextModelVersion();
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
            this._nextModelVersion();
         },

         getDragTargetPosition: function() {
            return this._dragTargetPosition;
         },

         setSwipeItem: function(itemData) {
            this._swipeItem = itemData;
            this._nextModelVersion();
         },

         setRightSwipedItem: function(itemData) {
            this._rightSwipedItem = itemData;
            this._nextModelVersion();
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
            ListViewModel.superclass.setItems.apply(this, arguments);
            if (this._options.markerVisibility !== 'hidden') {
               this._setMarkerAfterUpdateItems();
            }
            this._nextModelVersion();
         },

         // Поиск отмеченного элемента в коллекции по идентификатору отмеченного элементы.
         _restoreMarkedItem: function() {
            if (this._markedKey !== undefined) {
               this._markedItem = this.getItemById(this._markedKey, this._options.keyProperty);
            }
         },



         _setMarkerAfterUpdateItems: function() {

            // При обновлении коллекции объекты пересоздаются, поэтому нужно обновить ссылку на отмеченный элемент.
            this._restoreMarkedItem();

            // Если отмеченный элемент не найден, а маркер показывать нужно, то отмечаем первый элемент
            if (this._options.markerVisibility !== 'onactivated') {
               if (!this._markedItem && this._items.getCount()) {
                  this.setMarkedKey(this._items.at(0).getId());
               }
            }
         },

         _onBeginCollectionChange: function() {
            _private.updateIndexes(this, 0, this.getCount());
         },

         _setEditingItemData: function(itemData) {
            this._editingItemData = itemData;
            if (itemData && itemData.item) {
               this.setMarkedKey(itemData.item.get(this._options.keyProperty));
            }
            this._onCollectionChange();
            this._nextModelVersion();
         },

         setItemActions: function(item, actions) {
            if (item.get) {
               var itemById = this.getItemById(item.get(this._options.keyProperty));
               var collectionItem = itemById ? itemById.getContents() : item;
               this._actions[this.getIndexBySourceItem(collectionItem)] = actions;
               this._nextModelVersion(true);
            }
         },

         _prepareDisplayItemForAdd: function(item) {
            return ItemsUtil.getDefaultDisplayItem(this._display, item);
         },

         getItemActions: function(item) {
            var itemById = this.getItemById(item.getId());
            var collectionItem = itemById ? itemById.getContents() : item;
            return this._actions[this.getIndexBySourceItem(collectionItem)];
         },

         updateSelection: function(selectedKeys) {
            this._selectedKeys = selectedKeys || [];
            this._nextModelVersion();
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
            this._nextModelVersion();
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

      return ListViewModel;
   });
