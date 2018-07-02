/**
 * Created by kraynovdo on 16.11.2017.
 */
define('Controls/List/ListViewModel',
   ['Controls/List/ItemsViewModel', 'WS.Data/Entity/VersionableMixin', 'Controls/List/resources/utils/ItemsUtil'],
   function(ItemsViewModel, VersionableMixin, ItemsUtil) {
      /**
       *
       * @author Крайнов Дмитрий
       * @public
       */

      var _private = {
         updateIndexes: function(self) {
            self._startIndex = 0;
            self._stopIndex = self.getCount();
         }
      };

      var ListViewModel = ItemsViewModel.extend([VersionableMixin], {
         _markedItem: null,
         _dragItems: null,
         _dragTargetItem: null,
         _draggingItemData: null,
         _dragTargetPosition: null,
         _actions: null,
         _selectedKeys: null,

         constructor: function(cfg) {
            var self = this;
            this._actions = [];
            ListViewModel.superclass.constructor.apply(this, arguments);

            if (cfg.markedKey !== undefined) {
               this._markedItem = this.getItemById(cfg.markedKey, cfg.keyProperty);
            }

            this._selectionInstance = cfg.selectionInstance;

            //TODO надо ли?
            _private.updateIndexes(self);
         },

         _getItemDataByItem: function() {
            var itemsModelCurrent = ListViewModel.superclass._getItemDataByItem.apply(this, arguments);
            itemsModelCurrent.isSelected = itemsModelCurrent.dispItem === this._markedItem;
            itemsModelCurrent.itemActions =  this._actions[this.getCurrentIndex()];
            itemsModelCurrent.isActive = this._activeItem && itemsModelCurrent.dispItem.getContents() === this._activeItem.item;
            itemsModelCurrent.showActions = !this._editingItemData && (!this._activeItem || (!this._activeItem.contextEvent && itemsModelCurrent.isActive));
            itemsModelCurrent.isSwiped = this._swipeItem && itemsModelCurrent.dispItem.getContents() === this._swipeItem.item;
            if (this._selectionInstance) { //Будем считать, что если не пришёл selectionInstance, То multiSelectStatus вообще не нужен
               itemsModelCurrent.multiSelectStatus = this._selectionInstance.getSelectionStatus(itemsModelCurrent.key);
            }
            itemsModelCurrent.multiSelectVisibility = this._options.multiSelectVisibility === 'visible';
            itemsModelCurrent.drawActions =
               itemsModelCurrent.itemActions &&
               ((itemsModelCurrent.itemActions.showed &&
               itemsModelCurrent.itemActions.showed.length) ||
               (itemsModelCurrent.itemActions.showedFirst &&
               itemsModelCurrent.itemActions.showedFirst.length));
            if (this._editingItemData && itemsModelCurrent.index === this._editingItemData.index) {
               itemsModelCurrent.isEditing = true;
               itemsModelCurrent.item = this._editingItemData.item;
            }
            if (this._dragItems) {
               if (this._dragItems[0] === itemsModelCurrent.key) {
                  itemsModelCurrent.isDragging = true;
               }
               if (this._dragItems.indexOf(itemsModelCurrent.key) !== -1) {
                  itemsModelCurrent.isVisible = this._dragItems[0] === itemsModelCurrent.key ? !this._dragTargetItem : false;
               }
            }
            return itemsModelCurrent;
         },

         setMarkedKey: function(key) {
            this._markedItem = this.getItemById(key, this._options.keyProperty);
            this._nextVersion();
            this._notify('onListChange');
         },

         getSwipeItem: function() {
            return this._swipeItem.item;
         },

         setActiveItem: function(itemData) {
            this._activeItem = itemData;
            this._nextVersion();
         },

         getDraggingItemData: function() {
            return this._draggingItemData;
         },

         setDragItems: function(items) {
            if (this._dragItems !== items) {
               this._dragItems = items;
               this._draggingItemData = items ? this._getItemDataByItem(this.getItemById(items[0], this._options.keyProperty)) : null;
               this._nextVersion();
               this._notify('onListChange');
            }
         },

         getDragTargetItem: function() {
            return this._dragTargetItem;
         },

         setDragTargetItem: function(itemData) {
            if (this._dragTargetItem !== itemData) {
               this._dragTargetItem = itemData;
               this._updateDragTargetPosition(itemData);
               this._nextVersion();
               this._notify('onListChange');
            }
         },

         getDragTargetPosition: function() {
            return this._dragTargetPosition;
         },

         _updateDragTargetPosition: function(targetData) {
            var
               position,
               prevIndex;

            if (targetData) {
               prevIndex = this._dragTargetPosition ? this._dragTargetPosition.index : this._draggingItemData.index;
               if (targetData.index > prevIndex) {
                  position = 'after';
               } else if (targetData.index < prevIndex) {
                  position = 'before';
               } else {
                  position = this._dragTargetPosition.position === 'after' ? 'before' : 'after';
               }
               this._dragTargetPosition = {
                  index: targetData.index,
                  position: position
               };
            } else {
               this._dragTargetPosition = null;
            }
         },

         setSwipeItem: function(itemData) {
            this._swipeItem = itemData;
            this._nextVersion();
         },

         updateIndexes: function(startIndex, stopIndex) {
            if ((this._startIndex !== startIndex) || (this._stopIndex !== stopIndex)) {
               this._startIndex = startIndex;
               this._stopIndex = stopIndex;
               this._nextVersion();
               this._notify('onListChange');
            }
         },

         setItems: function(items) {
            ListViewModel.superclass.setItems.apply(this, arguments);
            if (this._options.markedKey !== undefined) {
               this._markedItem = this.getItemById(this._options.markedKey, this._options.keyProperty);
            }
            this._nextVersion();
            _private.updateIndexes(this);
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
            if (item.getId) {
               var itemById = this.getItemById(item.getId());
               var collectionItem = itemById ?  itemById.getContents() : item;
               this._actions[this.getIndexBySourceItem(collectionItem)] = actions;
            }
         },
         _prepareDisplayItemForAdd: function(item) {
            return ItemsUtil.getDefaultDisplayItem(this._display, item);
         },

         getItemActions: function(item) {
            var itemById = this.getItemById(item.getId());
            var collectionItem = itemById ?  itemById.getContents() : item;
            return this._actions[this.getIndexBySourceItem(collectionItem)];
         },

         __calcSelectedItem: function(display, selKey, keyProperty) {

            //TODO надо вычислить индекс
            /*if(!this._markedItem) {
             if (!this._selectedIndex) {
             this._selectedIndex = 0;//переводим на первый элемент
             }
             else {
             this._selectedIndex++;//условно ищем ближайший элемент, рядом с удаленным
             }
             this._markedItem = this._display.at(this._selectedIndex);
             }*/
         }
      });

      return ListViewModel;
   });
