define('Controls-demo/Explorer/ExplorerMemory', [
   'WS.Data/Source/Memory',
   'WS.Data/Source/DataSet',
   'WS.Data/Collection/RecordSet',
   'Core/Deferred',
   'Core/core-clone'
], function(MemorySource, DataSet, RecordSet, Deferred, cClone) {

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
      path.unshift(getById(items, currentRoot));
      while (currentNode.parent !== null) {
         currentNode = getById(items, currentNode.parent);
         path.unshift(currentNode);
      }
      return new RecordSet({
         rawData: path,
         idProperty: 'id'
      });
   }

   var
      TreeMemory = MemorySource.extend({
         query: function(query) {
            var
               self = this,
               result = new Deferred(),
               rootData = [],
               data = [],
               items = {},
               parents,
               filter = query.getWhere(),
               parent = filter.parent;

            // if search mode
            if (filter.title) {
               this._$data.forEach(function(item) {
                  if (item.title.toUpperCase().indexOf(filter.title.toUpperCase()) !== -1) {
                     items[item.id] = item;
                  }
               });
               for (var i in items) {
                  if (items.hasOwnProperty(i)) {
                     if (items[i].parent !== null) {
                        parents = getFullPath(self._$data, items[i].parent);
                        parents.forEach(function(par) {
                           data.push(par);
                        });
                        data.push(items[i]);
                     } else {
                        rootData.push(items[i]);
                     }
                  }
               }
               data.concat(rootData);
               result.callback(new DataSet({
                  rawData: data,
                  adapter: this.getAdapter(),
                  idProperty: 'id'
               }));
            } else {
               query.where(function(item) {
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
            }
            return result;
         }
      });

   return TreeMemory;
});
