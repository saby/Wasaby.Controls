define('Controls-demo/List/Tree/TreeMemory', [
   'Types/source'
], function(source) {

   'use strict';

   var
      TreeMemory = source.Memory.extend({
         query: function(query) {
            var
               filter = query.getWhere();
            query.where(function(item, idx) {
               var
                  folderId = filter['Раздел'] !== undefined ? filter['Раздел'] : null,
                  correct = item.get('Раздел') === folderId;
               if (correct && filter.onlyFolders) {
                  correct = item.get('Раздел@') === true;
               }

               return correct;
            });
            return TreeMemory.superclass.query.apply(this, arguments);
         }
      });

   return TreeMemory;
});
