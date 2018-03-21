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
         isAdd: function(self) {
            var editingItem = self.getEditingItem();

            if (editingItem) {
               return !self.getItemById(ItemsUtil.getPropertyValue(editingItem, self._options.idProperty), self._options.idProperty);
            }

            return false;
         },
         isEditingItem: function(self, item) {
            return self.getEditingItem() && ItemsUtil.getPropertyValue(item, self._options.idProperty) === ItemsUtil.getPropertyValue(self.getEditingItem(), self._options.idProperty);
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
               this._items = cfg.items;
               this._display = ItemsUtil.getDefaultDisplayFlat(cfg.items, cfg);
               this._display.subscribe('onCollectionChange', this._onCollectionChangeFnc);
            }
         },

         reset: function() {
            this._curIndex = 0;
         },

         isEnd: function() {
            return this._curIndex < (this._display ? this._isAdd ? this._display.getCount() + 1 : this._display.getCount() : 0);
         },

         goToNext: function() {
            this._curIndex++;
         },

         getCurrent: function() {
            var dispItem = this._display.at(this._curIndex);

            //TODO: непонятно как проставлять markedItem при добавлении, т.к. записи с таким ключом нет, а сейчас запись проставляется по ключу
            if (!dispItem) {
               //TODO: я сюда попаду в нужный момент только если добавление происходит в конец
               dispItem = new CollectionItem({ contents: this.getEditingItem() });
            }

            return {
               getPropValue: ItemsUtil.getPropertyValue,
               idProperty: this._options.idProperty,
               displayProperty: this._options.displayProperty,
               index : this._curIndex,
               item: _private.isEditingItem(this, dispItem.getContents()) ? this.getEditingItem() : dispItem.getContents(),
               dispItem: dispItem,
               isEditing: _private.isEditingItem(this, dispItem.getContents())
            }
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
            }
            else {
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
            this._editingItem = item;
            this._isAdd = _private.isAdd(this);
         },
         getEditingItem: function() {
            return this._editingItem;
         },
         getEditingItemIndex: function() {
            //TODO: надо бы тоже высчитывать не каждый раз, а один
            var
               index = -1,
               editingItem = this.getEditingItem();

            if (editingItem) {
               if (this._isAdd) {
                  //TODO: на самом деле добавлять могут куда угодно и нужно будет высчитывать иначе
                  return this.getItems().getCount();
               } else {
                  return this.getItems().getIndex(this.getItemById(ItemsUtil.getPropertyValue(editingItem, this._options.idProperty), this._options.idProperty).getContents());
               }
            }

            return index;
         }
      });

      return ItemsViewModel;
   });