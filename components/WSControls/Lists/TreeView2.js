define('js!WSControls/Lists/TreeView2', [
      'js!WSControls/Lists/ListView2',
      'js!WSControls/Lists/resources/utils/ItemsUtil',
      'js!WSControls/Lists/resources/utils/TreeItemsUtil',
      'Core/Deferred',
      'js!WS.Data/Relation/Hierarchy',
      'Core/helpers/functional-helpers',
      'tmpl!WSControls/Lists/TreeView2',
      'tmpl!WSControls/Lists/resources/TreeView/ItemTemplate',
      'tmpl!WSControls/Lists/resources/TreeView/ItemContentTemplate',
      'css!WSControls/Lists/TreeView'
   ], function(ListView, ItemsUtil, TreeItemsUtil, Deferred, HierarchyRelation, functionalHelpers, ViewTemplate, ItemTemplate, ItemContentTemplate) {

   function getTemplateData(data) {
      var
         templateData = {},
         collection = data.projItem.getOwner().getCollection(),
         idPropertyValue = data.getPropertyValue(data.item, data.idProperty),
         nodePropertyValue = data.getPropertyValue(data.item, data.nodeProperty),
         collectionItem = collection.at(collection.getIndexByValue(data.idProperty, idPropertyValue));

      templateData.children = data.hierarchyRelation.getChildren(collectionItem, collection);
      templateData.isLoaded = data.projItem.isLoaded();
      templateData.itemLevel = data.projItem.getLevel() - 1;
      templateData.hasLoadedChild = templateData.children.length > 0;
      templateData.classIsLoaded = templateData.isLoaded ? ' controls-ListView__item-loaded' : '';
      templateData.classHasLoadedChild = templateData.hasLoadedChild ? ' controls-ListView__item-with-child' : ' controls-ListView__item-without-child';
      templateData.classNodeType = ' controls-ListView__item-type-' + (nodePropertyValue === null ? 'leaf' : nodePropertyValue === true ? 'node' : 'hidden');
      templateData.classNodeState = nodePropertyValue !== null ? (' controls-TreeView__item-' + (data.projItem.isExpanded() ? 'expanded' : 'collapsed')) : '';
      templateData.addClasses = templateData.classNodeType + templateData.classNodeState + templateData.classIsLoaded + templateData.classHasLoadedChild;
      return templateData;
   }

   var TreeView = ListView.extend({
      _template: ViewTemplate,
      _defaultItemTemplate: ItemTemplate,
      _defaultItemContentTemplate: ItemContentTemplate,
      constructor: function() {
         TreeView.superclass.constructor.apply(this, arguments);
         this._publish('onExpandItem', 'onCollapseItem');
         if (!this._options.expandedItems) {
            this._options.expandedItems = {};
         }
      },
      _getItemData: function() {
         var
            itemData = TreeView.superclass._getItemData.apply(this, arguments);
         itemData.getTemplateData = getTemplateData;
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
                  this._options.expandedItems[ItemsUtil.getPropertyValue(item.getContents(), this._options.idProperty)] = true;
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
               delete this._options.expandedItems[ItemsUtil.getPropertyValue(item.getContents(), this._options.idProperty)];
               this._notify('onExpandItem', itemHash);
            }
         } else {
            return Deferred.fail();
         }
      },

      _loadItem: function(item) {
         /*if (this._dataSource && !item.isLoaded() && this._options.partialyReload) {
            this._toggleIndicator(true);
            this._notify('onBeforeDataLoad', this._createTreeFilter(id), this.getSorting(), 0, this._limit);
            return this._callQuery(this._createTreeFilter(id), this.getSorting(), 0, this._limit).addCallback(functionalHelpers.forAliveOnly(function (list) {
               this._options._folderHasMore[id] = list.getMetaData().more;
               this._loadedNodes[id] = true;
               this._notify('onDataMerge', list); // Отдельное событие при загрузке данных узла. Сделано так как тут нельзя нотифаить onDataLoad, так как на него много всего завязано. (пользуется Янис)
               if (this._options.loadItemsStrategy == 'merge') {
                  this._options._items.merge(list, {remove: false});
               }
               else {
                  this._options._items.append(list);
               }
               this._getItemProjectionByItemId(id).setLoaded(true);
               this._dataLoadedCallback();
            }).bind(this))
               .addBoth(function(error){
                  this._toggleIndicator(false);
                  return error;
               }.bind(this));
         }*/
         return Deferred.success();
      }
   });

   return TreeView;
});