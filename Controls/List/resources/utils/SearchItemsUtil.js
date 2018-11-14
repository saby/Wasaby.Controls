define('Controls/List/resources/utils/SearchItemsUtil', [
   'WS.Data/Display/Search'
], function(DisplaySearch) {
   var
      TreeItemsUtil = {
         getDefaultDisplaySearch: function(items, cfg, filter) {
            var
               displayProperties = {
                  collection: items,
                  idProperty: cfg.keyProperty,
                  parentProperty: cfg.parentProperty,
                  nodeProperty: cfg.nodeProperty,
                  unique: true,
                  filter: filter,
                  root: null
               };
            return new DisplaySearch(displayProperties);
         }
      };
   return TreeItemsUtil;
});
