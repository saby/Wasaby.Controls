/**
 * Created by kraynovdo on 16.11.2017.
 */
define('Controls/List/ItemsViewModel',
   ['Controls/List/BaseViewModel', 'Controls/List/resources/utils/ItemsUtil', 'Core/core-instance', 'WS.Data/Source/ISource'],
   function(BaseViewModel, ItemsUtil, cInstance, ISource) {

      /**
       *
       * @author Крайнов Дмитрий
       * @public
       */
      var _private = {

         //проверка на то, нужно ли создавать новый инстанс рекордсета или же можно положить данные в старый
         isEqualItems: function(oldList, newList) {
            return oldList && cInstance.instanceOfModule(oldList, 'WS.Data/Collection/RecordSet') &&
               (newList.getModel() === oldList.getModel()) &&
               (Object.getPrototypeOf(newList).constructor == Object.getPrototypeOf(newList).constructor) &&
               (Object.getPrototypeOf(newList.getAdapter()).constructor == Object.getPrototypeOf(oldList.getAdapter()).constructor);
         }
      };
      var ItemsViewModel = BaseViewModel.extend({

         _display: null,
         _items: null,
         _curIndex: 0,
         _onCollectionChangeFnc: null,

         constructor: function(cfg) {
            ItemsViewModel.superclass.constructor.apply(this, arguments);
            this._onCollectionChangeFnc = this._onCollectionChange.bind(this);
            if (cfg.items) {
               if (cfg.itemsReadyCallback) {
                  cfg.itemsReadyCallback(cfg.items);
               }
               this._items = cfg.items;
               this._display = this._prepareDisplay(cfg.items, cfg);
               this._display.subscribe('onCollectionChange', this._onCollectionChangeFnc);
            }
         },

         _prepareDisplay: function(items, cfg) {
            if (cfg.display) {
               return cfg.display;
            } else {
               return ItemsUtil.getDefaultDisplayFlat(items, cfg);
            }
         },

         reset: function() {
            this._curIndex = 0;
         },

         isEnd: function() {
            return this._curIndex < (this._display ? this._display.getCount() : 0);
         },

         isLast: function() {
            return this._curIndex === (this._display ? this._display.getCount() - 1 : 0);
         },

         goToNext: function() {
            this._curIndex++;
         },

         getCurrent: function() {
            var dispItem = this._display.at(this._curIndex);

            return {
               getPropValue: ItemsUtil.getPropertyValue,
               keyProperty: this._options.keyProperty,
               displayProperty: this._options.displayProperty,
               index: this._curIndex,
               item: dispItem.getContents(),
               dispItem: dispItem,
               key: ItemsUtil.getPropertyValue(dispItem.getContents(), this._options.keyProperty)
            };
         },

         getNext: function() {
            var
               itemIndex = this._curIndex + 1,
               dispItem = this._display.at(itemIndex);
            return {
               getPropValue: ItemsUtil.getPropertyValue,
               keyProperty: this._options.keyProperty,
               displayProperty: this._options.displayProperty,
               index: itemIndex,
               item: dispItem.getContents(),
               dispItem: dispItem
            };
         },

         getCurrentIndex: function() {
            return this._curIndex;
         },

         getItemById: function(id, keyProperty) {
            return this._display ? ItemsUtil.getDisplayItemById(this._display, id, keyProperty) : undefined;
         },

         moveItems: function(movedItems, target, position) {
            var
               itemIndex,
               targetIndex,
               items = this._items;
            movedItems.forEach(function(movedItem) {
               itemIndex = items.getIndex(movedItem);
               if (itemIndex === -1) {
                  items.add(movedItem);
                  itemIndex = items.getCount() - 1;
               }

               targetIndex = items.getIndex(target);
               if (position === ISource.MOVE_POSITION.after && targetIndex < itemIndex) {
                  targetIndex = (targetIndex + 1) < items.getCount() ? targetIndex + 1 : items.getCount();
               } else if (position === ISource.MOVE_POSITION.before && targetIndex > itemIndex) {
                  targetIndex = targetIndex !== 0  ? targetIndex - 1 : 0;
               }
               items.move(itemIndex, targetIndex);
            });
         },

         getCount: function() {
            return this._display ? this._display.getCount() : 0;
         },

         _onCollectionChange: function() {
            this._nextVersion();
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
               this._display = this._prepareDisplay(this._items, this._options);
               this._display.subscribe('onCollectionChange', this._onCollectionChangeFnc);
               this._nextVersion();
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
         },

         destroy: function() {
            ItemsViewModel.superclass.destroy.apply(this, arguments);
            this._display = null;
            this._items = null;
            this._curIndex = null;
            this._onCollectionChangeFnc = null;
         }
      });

      return ItemsViewModel;
   });
