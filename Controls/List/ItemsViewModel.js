/**
 * Created by kraynovdo on 16.11.2017.
 */
define('Controls/List/ItemsViewModel', [
   'Controls/List/BaseViewModel',
   'Controls/List/resources/utils/ItemsUtil',
   'Core/core-instance',
   'Controls/Constants'
], function(BaseViewModel, ItemsUtil, cInstance, ControlsConstants) {
   /**
    *
    * @author Авраменко А.С.
    * @public
    */

   var _private = {

      // проверка на то, нужно ли создавать новый инстанс рекордсета или же можно положить данные в старый
      isEqualItems: function(oldList, newList) {
         return oldList && cInstance.instanceOfModule(oldList, 'WS.Data/Collection/RecordSet') &&
            (newList.getModel() === oldList.getModel()) &&
            (Object.getPrototypeOf(newList).constructor == Object.getPrototypeOf(newList).constructor) &&
            (Object.getPrototypeOf(newList.getAdapter()).constructor == Object.getPrototypeOf(oldList.getAdapter()).constructor);
      },
      displayFilterGroups: function(item, index, displayItem) {
         return item === ControlsConstants.view.hiddenGroup || !item.get || !this.collapsedGroups[displayItem.getOwner().getGroup()(item, index, displayItem)];
      },
      prepareCollapsedGroupsByArray: function(collapsedGroups) {
         var
            result = {};
         if (collapsedGroups) {
            collapsedGroups.forEach(function(group) {
               result[group] = true;
            });
         }
         return result;
      },
      prepareCollapsedGroupsByObject: function(collapsedGroups) {
         var
            result = [];
         if (collapsedGroups) {
            for (var group in collapsedGroups) {
               if (collapsedGroups.hasOwnProperty(group)) {
                  result.push(group);
               }
            }
         }
         return result;
      },
      getDisplayFilter: function(data, cfg) {
         var
            filter = [];
         if (cfg.groupMethod) {
            filter.push(_private.displayFilterGroups.bind({ collapsedGroups: data.collapsedGroups }));
         }
         if (cfg.itemsFilterMethod) {
            filter.push(cfg.itemsFilterMethod);
         }
         return filter;
      }
   };
   var ItemsViewModel = BaseViewModel.extend({

      _display: null,
      _items: null,
      _curIndex: 0,
      _onCollectionChangeFnc: null,
      _collapsedGroups: null,

      constructor: function(cfg) {
         ItemsViewModel.superclass.constructor.apply(this, arguments);
         this._onCollectionChangeFnc = this._onCollectionChange.bind(this);
         this._collapsedGroups = _private.prepareCollapsedGroupsByArray(cfg.collapsedGroups);
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
         var
            filter = this.getDisplayFilter(this.prepareDisplayFilterData(), cfg);
         return ItemsUtil.getDefaultDisplayFlat(items, cfg, filter);
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
         return this.getItemDataByItem(dispItem);
      },

      getItemDataByItem: function(dispItem) {
         var
            itemData = {
               getPropValue: ItemsUtil.getPropertyValue,
               style: this._options.style,
               keyProperty: this._options.keyProperty,
               displayProperty: this._options.displayProperty,
               index: this._display.getIndex(dispItem),
               item: dispItem.getContents(),
               dispItem: dispItem,
               key: ItemsUtil.getPropertyValue(dispItem.getContents(), this._options.keyProperty),
               getVersion: function() {
                  // records have defined method nextVersion, groups haven't
                  if (this.item.getVersion) {
                     return this.item.getVersion();
                  }
                  return this.item;
               },
               spacingClassList: this.getSpacingClassList()
            };
         if (this._options.groupMethod) {
            if (itemData.item === ControlsConstants.view.hiddenGroup || !itemData.item.get) {
               itemData.isGroup = true;
               itemData.isHiddenGroup = itemData.item === ControlsConstants.view.hiddenGroup;
               itemData.isGroupExpanded = !this._collapsedGroups[itemData.item];
               itemData.metaData = this._items.getMetaData();
            }
         }
         return itemData;
      },

      getSpacingClassList: function() {
         var classList = '';
         if (this._options.multiSelectVisibility === 'hidden') {
            classList += ' controls-ListView__item-leftPadding_' + (this._options.leftPadding || this._options.leftSpacing || 'default');
         }
         classList += ' controls-ListView__item-rightPadding_' + (this._options.rightPadding || this._options.rightSpacing || 'default');
         return classList;
      },

      toggleGroup: function(group, state) {
         if (typeof state === 'undefined') {
            state = typeof this._collapsedGroups[group] !== 'undefined';
         }
         if (state) {
            delete this._collapsedGroups[group];
         } else {
            this._collapsedGroups[group] = true;
         }
         this.setFilter(this.getDisplayFilter(this.prepareDisplayFilterData(), this._options));
         this._nextVersion();
         this._notify('onGroupsExpandChange', {
            group: group,
            changeType: state ? 'expand' : 'collapse',
            collapsedGroups: _private.prepareCollapsedGroupsByObject(this._collapsedGroups)
         });
         this._notify('onListChange');
      },

      setFilter: function(filter) {
         this._display.setFilter(filter);
      },

      prepareDisplayFilterData: function() {
         return {
            collapsedGroups: this._collapsedGroups
         };
      },

      getDisplayFilter: function(data, cfg) {
         return _private.getDisplayFilter(data, cfg);
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

      getCount: function() {
         return this._display ? this._display.getCount() : 0;
      },

      _onCollectionChange: function() {
         this._nextVersion();
         this._notify('onListChange');
      },

      setItems: function(items) {
         if (_private.isEqualItems(this._items, items)) {
            this._items.setMetaData(items.getMetaData());
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

      getItems: function() {
         return this._items;
      },

      appendItems: function(items) {
         this._items.append(items);
      },

      mergeItems: function(items) {
         this._items.merge(items, {
            remove: false
         });
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

      getDisplay: function() {
         return this._display;
      },

      destroy: function() {
         ItemsViewModel.superclass.destroy.apply(this, arguments);
         if (this._display) {
            this._display.destroy();
            this._display = null;
         }
         this._items = null;
         this._curIndex = null;
         this._onCollectionChangeFnc = null;
      }
   });

   return ItemsViewModel;
});
