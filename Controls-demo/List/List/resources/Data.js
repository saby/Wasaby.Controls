define('Controls-demo/List/List/resources/Data', function() {
   var
      data = {
         generate: function(count) {
            var
               result = [];
            for (var i = 0; i < count; i++) {
               result.push({
                  id: i,
                  title: 'item ' + i
               });
            }
            return result;
         }
      };
   return data;
});
