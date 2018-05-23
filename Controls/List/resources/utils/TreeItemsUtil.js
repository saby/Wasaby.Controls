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
                  keyProperty: cfg.keyProperty,
                  parentProperty: cfg.parentProperty,
                  nodeProperty: cfg.nodeProperty,
                  loadedProperty: '!' + cfg.parentProperty + '$',
                  unique: cfg.loadItemsStrategy === 'merge',
                  filter: filter,
                  sort: cfg.itemsSortMethod
               },
               root, rootAsNode;

            if (typeof cfg.root !== 'undefined') {
               root = cfg.root;
            } else {
               root = null;
            }
            rootAsNode = isPlainObject(root);
            if (rootAsNode) {
               root = Model.fromObject(root, 'adapter.sbis');
               root.keyProperty = cfg.keyProperty;
            }
            displayProperties.root = root;

            return new DisplayTree(displayProperties);
         }
      };
   return TreeItemsUtil;
});
