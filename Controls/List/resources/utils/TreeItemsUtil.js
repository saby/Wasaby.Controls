define('js!Controls/List/resources/utils/TreeItemsUtil', [
   'WS.Data/Display/Tree',
   'WS.Data/Entity/Model',
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
      }
   };
});
