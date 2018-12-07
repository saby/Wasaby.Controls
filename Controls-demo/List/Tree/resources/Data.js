define('Controls-demo/List/Tree/resources/Data', function() {
   var
      data = {
         generate: function(count) {
            var
               rootItemsCount = count || 3,
               result = [],
               id, parent;

            for (var rootItemIdx = 0; rootItemIdx < rootItemsCount; rootItemIdx++) {
               result.push({
                  id: String(rootItemIdx),
                  parent: null,
                  type: true,
                  title: 'item ' + String(rootItemIdx)
               });
               for (var i = 0; i < 3; i++) {
                  id = String(rootItemIdx) + String(i);
                  result.push({
                     id: id,
                     parent: String(rootItemIdx),
                     type: true,
                     title: 'item ' + id
                  });
                  for (var j = 0; j < 3; j++) {
                     parent = String(rootItemIdx) + String(i);
                     id = parent + String(j);
                     result.push({
                        id: id,
                        parent: parent,
                        type: null,
                        title: 'item ' + id
                     });
                  }
               }
            }
            return result;
         }
      };
   return data;
});
