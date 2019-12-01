define('Controls-demo/operations/ShowSelectedMemory', [
   'Types/source',
   'Types/collection'
], function (source, collection) {
   'use strict';

   function includes(collection, item) {
      if (typeof item === 'number') {
         item = String(item);
      }

      return collection.includes(item);
   }

   function getById(items, id) {
      for (var index = 0; index < items.length; index++) {
         if (items[index].id === id) {
            return items[index];
         }
      }
   }

   function getChildren(items, parent) {
      return items.filter((item) => {
         return isChildByNode(item, items, parent)
      });
   }
   
   function isChildByNode(item, items, nodeId) {
      var isChild = nodeId === null || nodeId === undefined;

      if (!isChild) {
         for (var currentItem = item; currentItem['Раздел'] !== null; currentItem = getById(items, currentItem['Раздел'])) {
            if (nodeId === currentItem['Раздел']) {
               isChild = true;
               break;
            }
         }
      }

      return isChild;
   }

   function isSelected(item, items, selection) {
      var selected = selection.get('marked');

      return includes(selected, item.id) || getChildren(items, item.id).filter((item) => {
            return includes(selected, item.id);
         }).length;
   }

   function getFullPath(items, currentRoot) {
      var path = [];

      for (var currentNode = getById(items, currentRoot); currentNode; currentNode = getById(items, currentNode['Раздел'])) {
         path.push(currentNode);
      }

      return new collection.RecordSet({
         rawData: path.reverse(),
         keyProperty: 'id'
      });
   }

   var ShowSelectedMemory = source.Memory.extend({
      query: function (query) {
         var items = this._$data;
         var filter = query.getWhere();
         var selection = filter.selectionWithPaths;
         var parent = filter['Раздел'] instanceof Array ? filter['Раздел'][0] : filter['Раздел'];

         if (selection) {
            var isAllSelected = selection.get('marked').includes(null) && selection.get('excluded').includes(null);

            query.where((item) => {
               item = getById(items, item.get('id'));
               if (isSelected(item, items, selection) && isChildByNode(item, items, parent) ||
                  isAllSelected && item['Раздел'] === null && !includes(selection.get('excluded'), item.id)) {

                  return true;
               }
            });
         } else {
            query.where(function (item) {
               if (parent !== undefined) {
                  return item.get('Раздел') === parent;
               } else {
                  return item.get('Раздел') === null;
               }
            });
         }

         return ShowSelectedMemory.superclass.query.apply(this, arguments).addCallback((data) => {
            var originalGetAll = data.getAll;

            data.getAll = function() {
               var result = originalGetAll.apply(this, arguments);
               var meta = result.getMetaData();

               if (parent !== undefined && parent !== null) {
                  meta.path = getFullPath(items, parent);
                  result.setMetaData(meta);
               }

               return result;
            };

            return data;
         });
      }
   });

   return ShowSelectedMemory;
});
