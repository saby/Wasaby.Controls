/**
 * Created by as.krasilnikov on 26.12.2017.
 */
define('Controls/Dropdown/resources/DropdownViewModel',
   [
      'Controls/List/BaseViewModel',
      'Controls/List/resources/utils/ItemsUtil',
      'Controls/List/ItemsViewModel',
      'WS.Data/Entity/Model',
      'WS.Data/Relation/Hierarchy',
      'Controls/List/ItemActions/Utils/getStyle'
   ],

   function(BaseViewModel, ItemsUtil, ItemsViewModel, Model, Hierarchy, getStyle) {
      var _private = {
         filterHierarchy: function(item) {
            var parent;
            if (!this._options.parentProperty || !this._options.nodeProperty || !item.get) {
               return true;
            }
            parent = item.get(this._options.parentProperty);
            if (typeof parent === 'undefined') {
               parent = null;
            }
            return parent === this._options.rootKey;
         },
         
         isHistoryItem: function(item) {
            return !!(item.get('pinned') || item.get('recent') || item.get('frequent'));
         },
         
         filterAdditional: function(item) {
            var isAdditional, isHistory;
            
            if (!this._options.additionalProperty || this._expanded === true || !item.get) {
               return true;
            }
            
            isAdditional = item.get(this._options.additionalProperty);
            isHistory = _private.isHistoryItem(item);
            
            //additional item in history must be showed
            return isAdditional !== true || isHistory;
         },

         needToDrawSeparator: function(item, nextItem) {
            if (!nextItem.get) {
               return false;
            }
            var itemInHistory = _private.isHistoryItem(item) && !item.get('parent');
            var nextItemInHistory = _private.isHistoryItem(nextItem);
            return itemInHistory && !nextItemInHistory;
         },
         
         needHideGroup: function(self, key) {
            //FIXME временное решение, переделывается тут: https://online.sbis.ru/opendoc.html?guid=8760f6d2-9ab3-444b-a83b-99019207a9ca
            return self._itemsModel._display.getGroupItems(key).length === 0;
         },
      };

      var DropdownViewModel = BaseViewModel.extend({
         _itemsModel: null,
         _expanded: false,

         constructor: function(cfg) {
            this._options = cfg;
            DropdownViewModel.superclass.constructor.apply(this, arguments);
            this._itemsModel = new ItemsViewModel({
               groupMethod: cfg.groupMethod,
               groupTemplate: cfg.groupTemplate,
               items: cfg.items,
               keyProperty: cfg.keyProperty,
               displayProperty: 'title'
            });
            this._hierarchy = new Hierarchy({
               idProperty: cfg.keyProperty,
               parentProperty: cfg.parentProperty,
               nodeProperty: cfg.nodeProperty
            });
            this.setFilter(this.getDisplayFilter());
         },

         setFilter: function(filter) {
            this._itemsModel.setFilter(filter);
         },

         getDisplayFilter: function() {
            var filter = [];
            filter.push(_private.filterHierarchy.bind(this));
            filter.push(_private.filterAdditional.bind(this));
            return filter;
         },

         setItems: function(options) {
            this._itemsModel.setItems(options.items);
         },

         setRootKey: function(key) {
            this._options.rootKey = key;
            this.setFilter(this.getDisplayFilter());
         },

         destroy: function() {
            this._itemsModel.destroy();
            this._hierarchy.destroy();
            DropdownViewModel.superclass.destroy.apply(this, arguments);
         },

         reset: function() {
            return this._itemsModel.reset();
         },

         isEnd: function() {
            return this._itemsModel.isEnd();
         },

         goToNext: function() {
            return this._itemsModel.goToNext();
         },

         getCurrent: function() {
            var itemsModelCurrent = this._itemsModel.getCurrent();

            //if we had group element we should return it without changes
            if (itemsModelCurrent.isGroup) {
               //FIXME временное решение, переделывается тут: https://online.sbis.ru/opendoc.html?guid=8760f6d2-9ab3-444b-a83b-99019207a9ca
               if (_private.needHideGroup(this, itemsModelCurrent.key)) {
                  itemsModelCurrent.isHiddenGroup = true;
               }
               return itemsModelCurrent;
            }
            itemsModelCurrent.hasChildren = this._hasItemChildren(itemsModelCurrent.item);
            itemsModelCurrent.hasParent = this._hasParent(itemsModelCurrent.item);
            itemsModelCurrent.isSelected = this._isItemSelected(itemsModelCurrent.item);
            itemsModelCurrent.icon = itemsModelCurrent.item.get('icon');
            itemsModelCurrent.isSwiped = this._swipeItem && itemsModelCurrent.dispItem.getContents() === this._swipeItem;

            //Draw the separator to split history and nohistory items.
            //Separator is needed only when list has both history and nohistory items
            //if the last item is in history then separator is unnecessary
            if (!this._itemsModel.isLast()) {
               itemsModelCurrent.hasSeparator = _private.needToDrawSeparator(itemsModelCurrent.item, this._itemsModel.getNext().item);
            }
            itemsModelCurrent.iconStyle = getStyle(itemsModelCurrent.item.get('iconStyle'), 'DropdownList');
            itemsModelCurrent.itemTemplateProperty = this._options.itemTemplateProperty;
            itemsModelCurrent.template = itemsModelCurrent.item.get(itemsModelCurrent.itemTemplateProperty);
            return itemsModelCurrent;
         },
         _isItemSelected: function(item) {
            var keys = this._options.selectedKeys;
            if (keys instanceof Array) {
               return keys.indexOf(item.get(this._options.keyProperty)) > -1;
            }
            return keys !== undefined && keys === item.get(this._options.keyProperty);
         },
         _hasItemChildren: function(item) {
            return this._hierarchy.isNode(item) && !!this._hierarchy.getChildren(item, this._options.items).length;
         },
         setSwipeItem: function(itemData) {
            this._swipeItem = itemData;
            this._nextVersion();
         },
         hasHierarchy: function() {
            if (!this._options.parentProperty || !this._options.nodeProperty) {
               return false;
            }
            var display = this._itemsModel._display;
            for (var i = 0; i < display.getCount(); i++) {
               var item = display.at(i).getContents();
               if (item.get && item.get(this._options.nodeProperty)) {
                  return true;
               }
            }
            return false;
         },
         hasAdditional: function() {
            var self = this;
            var hasAdditional = false;

            if (this._options.additionalProperty && this._options.rootKey === null) {
               this._options.items.each(function(item) {
                  if (!hasAdditional) {
                     hasAdditional = item.get(self._options.additionalProperty) && !_private.isHistoryItem(item);
                  }
               });
            }
            return hasAdditional;
         },
         _hasParent: function(item) {
            return this._hierarchy.hasParent(item, this._options.items);
         },
         getItems: function() {
            return this._itemsModel._options.items;
         },
         getCount: function() {
            return this._itemsModel.getCount();
         },
         toggleExpanded: function(expanded) {
            this._expanded = expanded;
            this.setFilter(this.getDisplayFilter());
            this._nextVersion();
         },
         isExpanded: function() {
            return this._expanded;
         },
         getEmptyItem: function() {
            if (this._options.emptyText) {
               var emptyItem = {};
               var itemData = {};
               itemData[this._options.displayProperty] = this._options.emptyText;
               itemData[this._options.keyProperty] = null;
               var item = new Model({
                  rawData: itemData
               });
               emptyItem.item = item;
               emptyItem.isSelected = this._isItemSelected(item);
               emptyItem.getPropValue = ItemsUtil.getPropertyValue;
               emptyItem.emptyText = this._options.emptyText;
               return emptyItem;
            }
         }
      });

      DropdownViewModel._private = _private;
      return DropdownViewModel;
   });
