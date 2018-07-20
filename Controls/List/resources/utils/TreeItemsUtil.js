define('Controls/List/resources/utils/TreeItemsUtil', [
   'WS.Data/Display/Tree',
   'WS.Data/Entity/Model',
   'Core/helpers/Object/isPlainObject'
], function(DisplayTree, Model, isPlainObject) {
   var
      _private = {

      },
      TreeItemsUtil = {
         getDefaultDisplayTree: function(items, cfg, filter) {
            var
               displayProperties = {
                  collection: items,
                  idProperty: cfg.keyProperty,
                  parentProperty: cfg.parentProperty,
                  nodeProperty: cfg.nodeProperty,
                  loadedProperty: '!' + cfg.parentProperty + '$',
                  unique: cfg.loadItemsStrategy === 'merge',
                  filter: filter,
                  sort: cfg.itemsSortMethod
               },
               root, rootAsNode;

            if (cfg.itemsGroup && cfg.itemsGroup.method) {
               displayProperties.group = cfg.itemsGroup.method;
            }

            if (typeof cfg.root !== 'undefined') {
               root = cfg.root;
            } else {
               root = null;
            }
            rootAsNode = isPlainObject(root);
            if (rootAsNode) {
               root = Model.fromObject(root, 'adapter.sbis');
               root.keyProperty = cfg.keyProperty;
               displayProperties.rootEnumerable = true;
            }
            displayProperties.root = root;

            return new DisplayTree(displayProperties);
         }
      };
   return TreeItemsUtil;
});
