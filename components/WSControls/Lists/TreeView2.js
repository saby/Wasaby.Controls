define('js!WSControls/Lists/TreeView2', [
      'js!WSControls/Lists/ListView2',
      'js!WSControls/Lists/resources/utils/ItemsUtil',
      'js!WSControls/Lists/resources/utils/TreeItemsUtil',
      'js!WSControls/Lists/resources/utils/DataSourceUtil',
      'Core/Deferred',
      'Core/core-functions',
      'js!WS.Data/Relation/Hierarchy',
      'Core/helpers/functional-helpers',
      'tmpl!WSControls/Lists/resources/TreeView/ItemTemplate',
      'css!SBIS3.CONTROLS.TreeView'
   ], function(ListView, ItemsUtil, TreeItemsUtil, DataSourceUtil, Deferred, cFunctions, HierarchyRelation, functionalHelpers, ItemTemplate) {

   var TreeView = ListView.extend({
      _defaultItemTemplate: ItemTemplate,

      _expandedItems: undefined,  // Состояние развернутости элементов
      _loadingType: undefined,    // Тип загрузки данных

      _prepareInitalState: function() {
         this._expandedItems = this._options.expandedItems || {};
         this._loadingType = this._options.loadingType || 'partial';
      },
      constructor: function() {
         TreeView.superclass.constructor.apply(this, arguments);
         this._publish('onExpandItem', 'onCollapseItem');
         this._prepareInitalState();
      },
      _getItemData: function() {
         var
            itemData = TreeView.superclass._getItemData.apply(this, arguments);
         itemData.getTemplateData = TreeItemsUtil.getTemplateData;
         itemData.nodeProperty = this._options.nodeProperty;
         itemData.parentProperty = this._options.parentProperty;
         itemData.hierarchyRelation = new HierarchyRelation({
            idProperty: itemData.idProperty,
            parentProperty: itemData.parentProperty,
            nodeProperty: itemData.nodeProperty
         });
         return itemData;
      },
      _createDefaultProjection: function() {
         return TreeItemsUtil.getDefaultTreeDisplay(this._items, this._options);
      },
      onClick: function(event) {
         var
            target = $(event.target);
         TreeView.superclass.onClick.apply(this, arguments);
         if (target.closest('.js-controls-TreeView__expand').length) {
            this.toggleItem(target.closest('.js-controls-ListView__item').attr('data-hash'));
         }
      },

      /****************************** dataSource ******************************/
      toggleItem: function(itemHash) {
         var
            item = this._itemsProjection.getByHash(itemHash);
         if (item) {
            this[item.isExpanded() ? 'collapseItem' : 'expandItem'](itemHash);
         } else {
            return Deferred.fail();
         }
      },

      expandItem: function(itemHash) {
         var
            item = this._itemsProjection.getByHash(itemHash);
         if (item) {
            if (item.isExpanded()) {
               return Deferred.success();
            } else {
               /*if (this._options.singleExpand) {
                this._collapseNodes(this.getOpenedPath(), id);
                }*/
               //this._options._folderOffsets[id] = 0;
               return this._loadItem(item).addCallback(functionalHelpers.forAliveOnly(function() {
                  this._itemsProjection.getByHash(itemHash).setExpanded(true);
                  this._expandedItems[ItemsUtil.getPropertyValue(item.getContents(), this._options.idProperty)] = true;
                  this._notify('onExpandItem', itemHash);
               }).bind(this));
            }
         } else {
            return Deferred.fail();
         }
      },

      collapseItem: function(itemHash) {
         var
            item = this._itemsProjection.getByHash(itemHash);
         if (item) {
            if (!item.isExpanded()) {
               return Deferred.success();
            } else {
               this._itemsProjection.getByHash(itemHash).setExpanded(false);
               delete this._expandedItems[ItemsUtil.getPropertyValue(item.getContents(), this._options.idProperty)];
               this._notify('onExpandItem', itemHash);
            }
         } else {
            return Deferred.fail();
         }
      },

      _prepareQueryFilter: function(root) {
         var
            filter = cFunctions.clone(this._filter) || {};
         if (this._options.expand) {
            filter['Разворот'] = 'С разворотом';
            filter['ВидДерева'] = 'Узлы и листья';
         }
         filter[this._options.parentProperty] = root;
         return filter;
      },

      _loadItem: function(item) {
         var
            itemId = ItemsUtil.getPropertyValue(item.getContents(), this._options.idProperty);
         if (this._dataSource && !item.isLoaded() && this._loadingType === 'partial') {
            return DataSourceUtil.callQuery(this._dataSource, this._options.idProperty, this._prepareQueryFilter(itemId), this._sorting, this._offset, this._limit)
               .addCallback(functionalHelpers.forAliveOnly(function (list) {
                  // Отдельное событие при загрузке данных узла. Сделано так как тут нельзя нотифаить onDataLoad, так как на него много всего завязано. (пользуется Янис)
                  this._notify('onDataMerge', list);
                  if (this._options.loadItemsStrategy === 'merge') {
                     this._items.merge(list, {remove: false});
                  } else {
                     this._items.append(list);
                  }
                  item.setLoaded(true);
                  //this._dataLoadedCallback();

                  this._notify('onDataLoad', list);
                  return list;
               }, this))
               .addErrback(functionalHelpers.forAliveOnly(this._loadErrorProcess, this));
         }
         return Deferred.success();
      }
   });

   return TreeView;
});