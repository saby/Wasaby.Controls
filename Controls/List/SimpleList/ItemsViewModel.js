/**
 * Created by kraynovdo on 16.11.2017.
 */
define('Controls/List/SimpleList/ItemsViewModel',
   ['Core/Abstract', 'Controls/List/resources/utils/ItemsUtil', 'Core/core-instance', 'WS.Data/Display/CollectionItem'],
   function(Abstract, ItemsUtil, cInstance, CollectionItem) {

      /**
       *
       * @author Крайнов Дмитрий
       * @public
       */
      var _private = {
         //проверка на то, нужно ли создавать новый инстанс рекордсета или же можно положить данные в старый
         isEqualItems: function (oldList, newList) {
            return oldList && cInstance.instanceOfModule(oldList, 'WS.Data/Collection/RecordSet')
               && (newList.getModel() === oldList.getModel())
               && (Object.getPrototypeOf(newList).constructor == Object.getPrototypeOf(newList).constructor)
               && (Object.getPrototypeOf(newList.getAdapter()).constructor == Object.getPrototypeOf(oldList.getAdapter()).constructor)
         },
         getEditingItemIndex: function(self, editingItem) {
            var
               index = -1,
               originalItem = self.getItemById(ItemsUtil.getPropertyValue(editingItem, self._options.idProperty), self._options.idProperty);

            if (originalItem) {
               index = self.getItems().getIndex(originalItem.getContents());
            }

            return index;
         }
      };
      var ItemsViewModel = Abstract.extend({

         _display: null,
         _items: null,
         _curIndex: 0,

         constructor: function(cfg) {
            this._options = cfg;
            ItemsViewModel.superclass.constructor.apply(this, arguments);
            this._onCollectionChangeFnc = this._onCollectionChange.bind(this);
            if (cfg.items) {
               if (cfg.itemsReadyCallback) {
                  cfg.itemsReadyCallback(cfg.items);
               }
               this._items = cfg.items;
               this._display = ItemsUtil.getDefaultDisplayFlat(cfg.items, cfg);
               this._display.subscribe('onCollectionChange', this._onCollectionChangeFnc);
            }
         },

         reset: function() {
            this._curIndex = 0;
         },

         isEnd: function() {
            return this._curIndex < (this._display ? this._display.getCount() : 0);
         },

         goToNext: function() {
            this._curIndex++;
         },

         getCurrent: function() {
            var
               dispItem = this._display.at(this._curIndex),
               isEditingItem = this._curIndex === this.getEditingItemIndex(this, dispItem.getContents());

            return {
               getPropValue: ItemsUtil.getPropertyValue,
               idProperty: this._options.idProperty,
               displayProperty: this._options.displayProperty,
               index : this._curIndex,
               item: isEditingItem ? this.getEditingItem() : dispItem.getContents(),
               dispItem: dispItem,
               isEditing: isEditingItem
            }
         },

         getCurrentIndex: function() {
            return this._curIndex;
         },

         getItemById: function(id, idProperty) {
            return this._display ? ItemsUtil.getDisplayItemById(this._display, id, idProperty) : undefined;
         },

         getCount: function() {
            return this._display ? this._display.getCount() : 0;
         },

         _onCollectionChange: function() {
            this._notify('onListChange');
         },

         setItems: function(items) {
            if (_private.isEqualItems(this._items, items)) {
               this._items.assign(items);
            } else {
               if (this._options.itemsReadyCallback) {
                  this._options.itemsReadyCallback(items);
               }
               this._items = items;
               if (this._display) {
                  this._display.destroy();
               }
               this._display = ItemsUtil.getDefaultDisplayFlat(this._items, this._options);
               this._display.subscribe('onCollectionChange', this._onCollectionChangeFnc);
               this._notify('onListChange');
            }

         },
         appendItems: function(items) {
            this._items.append(items);
         },

         prependItems: function(items) {
            this._items.prepend(items);
         },
         getItems: function() {
            return this._display ? this._display.getCollection() : undefined;
         },
         setEditingItem: function(item) {
            var index;

            if (item) {
               this._editingItem = item;
               index = _private.getEditingItemIndex(this, item);
               this._isAdd = index === -1;
               if (this._isAdd) {
                  this._editingItemProjection = new CollectionItem({ contents: this._editingItem });
               }
               this._editingItemData = {
                  getPropValue: ItemsUtil.getPropertyValue,
                  idProperty: this._options.idProperty,
                  displayProperty: this._options.displayProperty,
                  index: this._isAdd ? this.getItems().getCount() : index,
                  item: this._editingItem,
                  dispItem: this._editingItemProjection,
                  isEditing: true
               };
            } else {
               this._editingItem = null;
               this._isAdd = null;
               this._editingItemProjection = null;
               this._editingItemData = null;
            }
         },
         getEditingItem: function() {
            return this._editingItem;
         },
         getEditingItemData: function() {
            return this._editingItemData;
         },
         getEditingItemIndex: function() {
            return this._editingItemData ? this._editingItemData.index : null;
         },
         getEditingItemProjection: function() {
            return this._editingItemProjection;
         }
      });

      return ItemsViewModel;
   });