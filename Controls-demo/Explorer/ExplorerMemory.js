define('Controls-demo/Explorer/ExplorerMemory', [
   'WS.Data/Source/Memory',
   'Core/Deferred',
   'Core/core-clone'
], function(MemorySource, Deferred, cClone) {

   'use strict';

   function getById(items, id) {
      for (var i = 0; i < items.length; i++) {
         if (items[i].id === id) {
            return cClone(items[i]);
         }
      }
   }

   function getFullPath(items, currentRoot) {
      var
         path = [],
         currentNode = getById(items, currentRoot);
      while (currentNode.parent !== null) {
         currentNode = getById(items, currentNode.parent);
         path.unshift(currentNode);
      }
      path.unshift(getById(items, currentRoot));
      return path;
   }

   var
      TreeMemory = MemorySource.extend({
         constructor: function() {
            TreeMemory.superclass.constructor.apply(this, arguments);
         },
         query: function(query) {
            var
               self = this,
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
                     meta = result.getMetaData();
                  if (parent !== undefined && parent !== null) {
                     meta.path = getFullPath(self._$data, parent);
                  }
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
