/**
 * Created by kraynovdo on 16.11.2017.
 */
define('Controls/List/SimpleList/ItemsViewModel',
   ['Core/Abstract', 'Controls/List/resources/utils/ItemsUtil', 'Core/core-instance'],
   function(Abstract, ItemsUtil, cInstance) {

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
            var dispItem = this._display.at(this._curIndex);

            return {
               getPropValue: ItemsUtil.getPropertyValue,
               idProperty: this._options.idProperty,
               displayProperty: this._options.displayProperty,
               index : this._curIndex,
               item: dispItem.getContents(),
               dispItem: dispItem,
               key: ItemsUtil.getPropertyValue(dispItem.getContents(), this._options.idProperty)
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

         getIndexBySourceItem: function(item) {
            return this._display ? this._display.getIndexBySourceItem(item) : undefined;
         },

         at: function(index) {
            return this._display ? this._display.at(index) : undefined;
         },

         removeItems: function(items) {
            var item;
            this._items.setEventRaising(false, true);
            for (var i = 0; i < items.length; i++) {
               item = this._items.getRecordById(items[i]);
               item && this._items.remove(item);
            }
            this._items.setEventRaising(true, true);
         }
      });

      return ItemsViewModel;
   });