define('Controls/Utils/getItemsBySelection', [
   'Types/source',
   'Types/entity',
   'Types/chain',
   'Core/core-clone',
   'Core/Deferred',
   'Controls/operations'
], function(source, entity, chain, cClone, Deferred, operations) {
   'use strict';

   var
      prepareArray = function(array) {
         return array.map(function(value) {
            return value !== null ? '' + value : value;
         });
      },
      selectionToRecord = function(selection, adapter, type) {
         var recursive = selection.recursive === undefined ? true : selection.recursive;
         return operations.selectionToRecord(selection, adapter, type, recursive);
      };

   return function(selection, dataSource, items, filter, limit, selectionType) {
      var
         item,
         query,
         result,
         selectedItems = [];

      selection.selected.forEach(function(key) {
         item = items.getRecordById(key);
         if (item) {
            selectedItems.push(item.getId());
         }
      });

      // Do not load the data if they are all in the current recordSet.
      if (selectedItems.length === selection.selected.length && !selection.excluded.length) {
         result = Deferred.success(selectedItems);
      } else {
         query = new source.Query();

         var filterClone = filter ? cClone(filter) : {};
         filterClone.selection = selectionToRecord(selection, 'adapter.sbis', selectionType);
         if (limit) {
            query.limit(limit);
         }
         result = dataSource.query(query.where(filterClone)).addCallback(function(list) {
            return chain.factory(list.getAll()).toArray().map(function(curItem) {
               return curItem.getId();
            });
         }).addErrback(function() {
            return [];
         });
      }

      return result;
   };
});
