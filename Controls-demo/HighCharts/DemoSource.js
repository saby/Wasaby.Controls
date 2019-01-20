define('Controls-demo/HighCharts/DemoSource', [
   'Core/Deferred',
   'Types/source'
], function(Deferred, source) {
   var DemoSource = source.Memory.extend({
      query: function(filter) {
         var arr = null;
         switch (filter) {
            case '1':
               arr = new source.DataSet({
                  rawData: [
                     {
                        title: 'hello',
                        value: 5
                     },
                     {
                        title: 'world',
                        value: 6
                     }
                  ]
               });
               break;
            case '2':
               arr = new source.DataSet({
                  rawData: [
                     {
                        title: 'Bye',
                        value: 11
                     },
                     {
                        title: 'World',
                        value: 50
                     },
                     {
                        title: '!',
                        value: 130
                     }
                  ]
               });
               break;
         }

         return Deferred.success(arr);
      }
   });
   return DemoSource;
});
