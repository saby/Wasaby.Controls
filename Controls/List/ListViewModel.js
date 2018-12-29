/**
 * Created by kraynovdo on 16.11.2017.
 */
define('Controls/List/ListViewModel',
   ['Controls/List/ItemsViewModel', 'WS.Data/Entity/VersionableMixin', 'Controls/List/resources/utils/ItemsUtil', 'Core/core-instance', 'Core/IoC'],
   function(ItemsViewModel, VersionableMixin, ItemsUtil, cInstance, IOC) {
      /**
       *
       * @author Авраменко А.С.
       * @public
       */

      var _private = {
         updateIndexes: function(self, startIndex, stopIndex) {
            self._startIndex = startIndex;
            self._stopIndex = stopIndex;
         }
      };

      var ListViewModel = ItemsViewModel.extend([VersionableMixin], {
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
            if (!this._markedItem && this._options.markerVisibility === 'always' && this._items && this._items.getCount()) {
               this._markedKey = this._items.at(0).getId();
               this._markedItem = this.getItemById(this._markedKey, this._options.keyProperty);
            }

            this._selectedKeys = cfg.selectedKeys || [];

            // TODO надо ли?
            _private.updateIndexes(self, 0, self.getCount());
         },

         getItemDataByItem: function() {
            var
               itemsModelCurrent = ListViewModel.superclass.getItemDataByItem.apply(this, arguments),
               drawedActions;
            itemsModelCurrent.isSelected = itemsModelCurrent.dispItem === this._markedItem;
            itemsModelCurrent.itemActions = this._actions[this.getCurrentIndex()];
            itemsModelCurrent.isActive = this._activeItem && itemsModelCurrent.dispItem.getContents() === this._activeItem.item;
            itemsModelCurrent.showActions = !this._editingItemData && (!this._activeItem || (!this._activeItem.contextEvent && itemsModelCurrent.isActive));
            itemsModelCurrent.isSwiped = this._swipeItem && itemsModelCurrent.dispItem.getContents() === this._swipeItem.item;
            itemsModelCurrent.multiSelectStatus = this._selectedKeys.indexOf(itemsModelCurrent.key) !== -1;
            itemsModelCurrent.multiSelectVisibility = this._options.multiSelectVisibility;
            if (itemsModelCurrent.itemActions) {
               if (itemsModelCurrent.itemActions.showed && itemsModelCurrent.itemActions.showed.length) {
                  drawedActions = itemsModelCurrent.itemActions.showed;
               } else {
                  drawedActions = itemsModelCurrent.itemActions.showedFirst;
               }
            }
            itemsModelCurrent.drawActions = drawedActions && drawedActions.length;
            if (itemsModelCurrent.drawActions) {
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
            if (this._draggingItemData) {
               if (this._draggingItemData.key === itemsModelCurrent.key) {
                  itemsModelCurrent.isDragging = true;
               }
               if (this._dragEntity.getItems().indexOf(itemsModelCurrent.key) !== -1) {
                  itemsModelCurrent.isVisible = this._draggingItemData.key === itemsModelCurrent.key ? !this._dragTargetPosition : false;
               }
               if (this._dragTargetPosition && this._dragTargetPosition.index === itemsModelCurrent.index) {
                  itemsModelCurrent.dragTargetPosition = this._dragTargetPosition.position;
                  itemsModelCurrent.draggingItemData = this._draggingItemData;
               }
            }
            return itemsModelCurrent;
         },

         setMarkedKey: function(key) {
            if (key === this._markedKey) {
               return;
            }
            this._markedKey = key;
            this._markedItem = this.getItemById(key, this._options.keyProperty);
            this._nextVersion();
            this._notify('onListChange');
            this._notify('onMarkedKeyChanged', key);
         },
         getFirstItemKey: function() {
            var
               nextItemId = 0,
               nextItem,
               itemsCount = this._display.getCount();
            while (nextItemId < itemsCount) {
               nextItem = this._display.at(nextItemId).getContents();
               if (cInstance.instanceOfModule(nextItem, 'WS.Data/Entity/Model')) {
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
               if (cInstance.instanceOfModule(nextItem, 'WS.Data/Entity/Model')) {
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
               if (cInstance.instanceOfModule(prevItem, 'WS.Data/Entity/Model')) {
                  return this._display.at(prevItemId).getContents().getId();
               }
               prevItemId--;
            }
         },
         getMarkedKey: function() {
            return this._markedKey;
         },
         getSelectionStatus: function(key) {
            return this._selectedKeys.indexOf(key) !== -1;
         },

         getSwipeItem: function() {
            return this._swipeItem.item;
         },

         setActiveItem: function(itemData) {
            this._activeItem = itemData;
            this._nextVersion();
         },

         setDragEntity: function(entity) {
            if (this._dragEntity !== entity) {
               this._dragEntity = entity;
               this._nextVersion();
               this._notify('onListChange');
            }
         },

         getDragEntity: function() {
            return this._dragEntity;
         },

         setDragItemData: function(itemData) {
            this._draggingItemData = itemData;
            if (this._draggingItemData) {
               this._draggingItemData.isDragging = true;
            }
            this._nextVersion();
            this._notify('onListChange');
         },

         getDragItemData: function() {
            return this._draggingItemData;
         },

         calculateDragTargetPosition: function(targetData) {
            var
               position,
               prevIndex = -1;

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
            this._nextVersion();
            this._notify('onListChange');
         },

         getDragTargetPosition: function() {
            return this._dragTargetPosition;
         },

         setSwipeItem: function(itemData) {
            this._swipeItem = itemData;
            this._nextVersion();
         },

         updateIndexes: function(startIndex, stopIndex) {
            if ((this._startIndex !== startIndex) || (this._stopIndex !== stopIndex)) {
               _private.updateIndexes(self, startIndex, stopIndex);
               this._nextVersion();
               this._notify('onListChange');
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
            if (this._markedKey !== undefined) {
               this._markedItem = this.getItemById(this._markedKey, this._options.keyProperty);
            }
            if (this._options.markerVisibility === 'always') {
               IOC.resolve('ILogger').warn('ListControl', 'Value "always" for property Controls/List/interface/IListControl#markerVisibility is deprecated, use value "visible" instead');
            }
            if (!this._markedItem && (this._options.markerVisibility === 'visible' || this._options.markerVisibility === 'always' && this._items.getCount())) {
               this._markedKey = this._items.at(0).getId();
               this._markedItem = this.getItemById(this._markedKey, this._options.keyProperty);
            }
            this._nextVersion();
         },

         _onBeginCollectionChange: function() {
            _private.updateIndexes(this, 0, this.getItems().getCount());
         },

         _setEditingItemData: function(itemData) {
            this._editingItemData = itemData;
            if (itemData && itemData.item) {
               this.setMarkedKey(itemData.item.get(this._options.keyProperty));
            } else {
               this._nextVersion();
            }
         },

         setItemActions: function(item, actions) {
            if (item.get) {
               var itemById = this.getItemById(item.get(this._options.keyProperty));
               var collectionItem = itemById ? itemById.getContents() : item;
               this._actions[this.getIndexBySourceItem(collectionItem)] = actions;
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
            this._nextVersion();
            this._notify('onListChange');
         },

         getActiveItem: function() {
            return this._activeItem;
         },

         setMultiSelectVisibility: function(multiSelectVisibility) {
            this._options.multiSelectVisibility = multiSelectVisibility;
            this._nextVersion();
            this._notify('onListChange');
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

      return ListViewModel;
   });
