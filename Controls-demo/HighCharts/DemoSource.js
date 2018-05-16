define('Controls-demo/HighCharts/DemoSource', [
   'WS.Data/Source/Memory',
   'Core/Deferred',
   'WS.Data/Collection/RecordSet'
], function(MemorySource, Deferred, RecordSet) {
   var DemoSource = MemorySource.extend({
      query: function(filter) {
         var arr = null;
         switch (filter) {
            case '1':
               arr = new RecordSet({
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
               arr = new RecordSet({
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
