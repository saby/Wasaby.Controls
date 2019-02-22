define('Controls/Utils/getItemsBySelection', [
   'Types/source',
   'Types/entity',
   'Types/chain',
   'Core/core-clone',
   'Core/Deferred'
], function(source, entity, chain, cClone, Deferred) {

   'use strict';

   var
      prepareArray = function(array) {
         return array.map(function(value) {
            return value !== null ? '' + value : value;
         });
      },
      selectionToRecord = function(selection, adapter) {
         var
            result = new entity.Record({
               adapter: adapter,
               format: [
                  {name: 'marked', type: 'array', kind: 'string'},
                  {name: 'excluded', type: 'array', kind: 'string'}
               ]
            });

         result.set('marked', prepareArray(selection.selected));
         result.set('excluded', prepareArray(selection.excluded));

         return result;
      };

   return function(selection, dataSource, items, filter) {
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

      //Do not load the data if they are all in the current recordSet.
      if (selectedItems.length === selection.selected.length && !selection.excluded.length) {
         result = Deferred.success(selectedItems);
      } else {
         query = new source.Query();

         filter = filter ? cClone(filter) : {};
         filter.selection = selectionToRecord(selection, 'adapter.sbis');

         result = dataSource.query(query.where(filter)).addCallback(function(list) {
            return chain.factory(list.getAll()).toArray().map(function(item) {
               return item.getId();
            });
         }).addErrback(function() {
            return [];
         });
      }

      return result;
   };
});
