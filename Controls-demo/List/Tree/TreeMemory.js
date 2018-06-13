define('Controls-demo/List/Tree/TreeMemory', [
   'WS.Data/Source/Memory'
], function(MemorySource) {

   'use strict';

   var
      TreeMemory = MemorySource.extend({
         query: function(query) {
            var
               filter = query.getWhere();
            query.where(function(item, idx) {
               if (filter['Раздел'] !== undefined) {
                  return item.get('Раздел') === filter['Раздел'];
               } else {
                  return item.get('Раздел') === null;
               }
            });
            return TreeMemory.superclass.query.apply(this, arguments);
         }
      });

   return TreeMemory;
});
