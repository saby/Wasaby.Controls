define('js!WSControls/Lists/resources/utils/TreeItemsUtil', [
   'js!WS.Data/Display/Tree',
   'js!WS.Data/Entity/Model',
   'Core/core-instance',
   'Core/helpers/Object/isPlainObject'
], function(TreeDisplay, Model, CoreInstance, isPlainObject) {

   function isVisibleItem(item, onlyFolders) {
      if (onlyFolders && item.isNode() !== true) {
         return false;
      }
      var itemParent = item.getParent();
      return itemParent ? itemParent.isExpanded() ? isVisibleItem(itemParent) : false : true;
   }

   function displayFilter(item, index, itemDisplay) {
      var
         itemParent = itemDisplay.getParent(),
         itemParentContent = itemParent && itemParent.getContents();
      return isVisibleItem(itemDisplay); /*|| (CoreInstance.instanceOfModule(itemParentContent, 'WS.Data/Entity/Record') && itemParent.isNode() !== false && this._isSearchMode && this._isSearchMode())*/
   }

   function displayFilterOnlyFolders(item, index, itemDisplay) {
      return isVisibleItem(itemDisplay, true); /* || (this._isSearchMode && this._isSearchMode())*/
   }

   return {
      getDefaultTreeDisplay: function(items, cfg) {
         var
            displayProperties, root, rootAsNode, filter = [];

         if (typeof cfg._curRoot != 'undefined') {
            root = cfg._curRoot;
         } else {
            if (typeof cfg.root != 'undefined') {
               root = cfg.root;
            } else {
               root = null;
            }
         }

         rootAsNode = isPlainObject(root);
         if (rootAsNode) {
            root = Model.fromObject(root, 'adapter.sbis');
            root.setIdProperty(cfg.idProperty);
         }

         if (cfg.displayType == 'folders') {
            filter.push(displayFilterOnlyFolders);
         } else {
            filter.push(displayFilter);
         }

         if (cfg.itemsFilterMethod) {
            filter.push(cfg.itemsFilterMethod);
         }

         displayProperties = {
            collection: items,
            idProperty: cfg.idProperty,
            parentProperty: cfg.parentProperty,
            nodeProperty: cfg.nodeProperty,
            loadedProperty: '!' + cfg.parentProperty + '$',
            unique: true,
            root: root,
            rootEnumerable: rootAsNode,
            filter: filter,
            sort: cfg.itemsSortMethod
         };

         if (cfg.loadItemsStrategy == 'append') {
            displayProperties.unique = false;
         }

         return new TreeDisplay(displayProperties);
      },

      getTemplateData: function(data) {
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
   };
});
