define('js!WSControls/Lists/TreeView2', [
      'js!WSControls/Lists/ListView2',
      'js!WSControls/Lists/resources/utils/ItemsUtil',
      'js!WSControls/Lists/resources/utils/TreeItemsUtil',
      'js!WSControls/Lists/resources/utils/DataSourceUtil',
      'Core/helpers/Object/isPlainObject',
      'Core/Deferred',
      'Core/helpers/collection-helpers',
      'Core/core-clone',
      'WS.Data/Relation/Hierarchy',
      'Core/helpers/functional-helpers',
      'tmpl!WSControls/Lists/resources/TreeView/ItemTemplate',
      'css!SBIS3.CONTROLS.TreeView'
   ], function(ListView, ItemsUtil, TreeItemsUtil, DataSourceUtil, isPlainObject, Deferred, collectionHelpers, coreClone, HierarchyRelation, FunctionalHelpers, ItemTemplate) {

   var TreeView = ListView.extend({
      _defaultItemTemplate: ItemTemplate,
      _hierRel:  null,
      _expandedItems: undefined,  // Состояние развернутости элементов ( Object )
      _loadMode: undefined,       // Режим загрузки данных ( "partial" / "full" )
      _expandMode: undefined,     // Режим разворота узлов ( "multiple" / "single" )

      _prepareMountingData: function(newOptions) {
         TreeView.superclass._prepareMountingData.apply(this, arguments);
         if (isPlainObject(newOptions.expandedItems)) {
            this._expandedItems = coreClone(newOptions.expandedItems);
         } else {
            this._expandedItems = {};
         }
         if (newOptions.loadMode === 'full') { // Режим загрузки может быть либо partial, либо full. По умолчанию partial.
            this._loadMode = newOptions.loadMode;
         } else {
            this._loadMode = 'partial';
         }
         if (newOptions.expandMode === 'single') { // Режим разворота может быть либо multiple, либо single. По умолчанию multiple.
            this._expandMode = newOptions.expandMode;
         } else {
            this._expandMode = 'multiple';
         }
      },
      constructor: function(cfg) {
         TreeView.superclass.constructor.apply(this, arguments);
         this._hierRel = new HierarchyRelation({
            idProperty: cfg.idProperty,
            parentProperty: cfg.parentProperty,
            nodeProperty: cfg.nodeProperty
         });
         this._publish('onExpandItem', 'onCollapseItem');
      },

      _getItemData: function(projItem) {
         //TODO возможно большую часть этого надо перенести на проекцию
         var
            templateData = {},
            item = projItem.getContents(),
            collection = projItem.getOwner().getCollection(),
            idPropertyValue = this._getPropertyValue(item, this._options.idProperty),
            nodePropertyValue = this._getPropertyValue(item, this._options.nodeProperty),
            collectionItem = collection.at(collection.getIndexByValue(this._options.idProperty, idPropertyValue));

         templateData.children = this._hierRel.getChildren(collectionItem, collection);
         templateData.isLoaded = projItem.isLoaded();
         templateData.itemLevel = projItem.getLevel() - 1;
         templateData.hasLoadedChild = templateData.children.length > 0;
         templateData.classIsLoaded = templateData.isLoaded ? ' controls-ListView__item-loaded' : '';
         templateData.classHasLoadedChild = templateData.hasLoadedChild ? ' controls-ListView__item-with-child' : ' controls-ListView__item-without-child';
         templateData.classNodeType = ' controls-ListView__item-type-' + (nodePropertyValue === null ? 'leaf' : nodePropertyValue === true ? 'node' : 'hidden');
         templateData.classNodeState = nodePropertyValue !== null ? (' controls-TreeView__item-' + (projItem.isExpanded() ? 'expanded' : 'collapsed')) : '';
         templateData.addClasses = templateData.classNodeType + templateData.classNodeState + templateData.classIsLoaded + templateData.classHasLoadedChild;
         return templateData;
      },
      _createDefaultDisplay: function(items, cfg) {
         return TreeItemsUtil.getDefaultTreeDisplay(items, cfg);
      },
      _onExpandClick: function(event, treeItem) {
         this.toggleItem(treeItem.getHash());
      },

      _collapseItems: function(notCollapseItemId, expandedItems) {
         this._display.setEventRaising(false, true);
         collectionHelpers.forEach(expandedItems, function(expanded, id) {
            if (!notCollapseItemId || id !== notCollapseItemId) {
               this.collapseItem(ItemsUtil.getDisplayItemById(this._display, id, this._options.idProperty).getHash());
            }
         }, this);
         this._display.setEventRaising(true, true);
      },

      toggleItem: function(itemHash) {
         var
            item = this._display.getByHash(itemHash);
         if (item) {
            this[item.isExpanded() ? 'collapseItem' : 'expandItem'](itemHash);
         } else {
            return Deferred.fail();
         }
      },

      expandItem: function(itemHash) {
         var
            item = this._display.getByHash(itemHash),
            itemId;
         if (item && ItemsUtil.getPropertyValue(item.getContents(), this._options.nodeProperty) !== null) {
            if (item.isExpanded()) {
               return Deferred.success();
            } else {
               itemId = ItemsUtil.getPropertyValue(item.getContents(), this._options.idProperty);
               if (this._expandMode === 'single') {
                  this._collapseItems(itemId, this._expandedItems);
               }
               return this._loadItem(item).addCallback(FunctionalHelpers.forAliveOnly(function() {
                  this._display.getByHash(itemHash).setExpanded(true);
                  this._expandedItems[itemId] = true;
                  this._notify('onExpandItem', itemHash);
               }, this));
            }
         }
         return Deferred.fail();
      },

      collapseItem: function(itemHash) {
         var
            item = this._display.getByHash(itemHash);
         if (item) {
            if (item.isExpanded()) {
               this._display.getByHash(itemHash).setExpanded(false);
               delete this._expandedItems[ItemsUtil.getPropertyValue(item.getContents(), this._options.idProperty)];
               this._notify('onExpandItem', itemHash);
            }
            return Deferred.success();
         }
         return Deferred.fail();
      },

      _prepareQueryFilter: function(root) {
         var
            filter = coreClone(this._filter) || {};
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
         if (this._dataSource && !item.isLoaded() && this._loadMode === 'partial') {
            return DataSourceUtil.callQuery(this._dataSource, this._options.idProperty, this._prepareQueryFilter(itemId), this._sorting, this._offset, this._limit)
               .addCallback(FunctionalHelpers.forAliveOnly(function (list) {
                  // Отдельное событие при загрузке данных узла. Сделано так как тут нельзя нотифаить onDataLoad, так как на него много всего завязано. (пользуется Янис)
                  this._notify('onDataMerge', list);
                  if (this._options.loadItemsStrategy === 'merge') {
                     this._items.merge(list, {remove: false});
                  } else {
                     this._items.append(list);
                  }
                  item.setLoaded(true);
                  this._notify('onDataLoad', list);
                  return list;
               }, this))
               .addErrback(FunctionalHelpers.forAliveOnly(this._loadErrorProcess, this));
         }
         return Deferred.success();
      }
   });

   return TreeView;
});