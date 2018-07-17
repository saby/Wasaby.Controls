define('Controls-demo/Explorer/ExplorerMemory', [
   'WS.Data/Source/Memory',
   'Core/Deferred'
], function(MemorySource, Deferred) {

   'use strict';

   var
      TreeMemory = MemorySource.extend({
         _path: [],
         query: function(query) {
            var
               result = new Deferred(),
               filter = query.getWhere(),
               parent = filter['parent'];
            query.where(function(item, idx) {
               if (parent !== undefined) {
                  return item.get('parent') === parent;
               } else {
                  return item.get('parent') === null;
               }
            });
            TreeMemory.superclass.query.apply(this, arguments).addCallback(function(data) {
               var
                  originalGetAll = data.getAll;
               data.getAll = function() {
                  var
                     result = originalGetAll.apply(this, arguments),
                     meta = result.getMetaData(),
                     path = [];
                  if (parent !== undefined) {
                     path.push({
                        id: 1,
                        title: 'Node'
                     });
                  }
                  meta.path = path;
                  result.setMetaData(meta);
                  return result;
               };
               result.callback(data);
            });
            return result;
         }
      });

   return TreeMemory;
});
