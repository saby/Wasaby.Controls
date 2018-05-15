define('Controls-demo/HighCharts/DemoSource', [
   'WS.Data/Source/Memory',
   'Core/Deferred',
   'WS.Data/Collection/RecordSet'
], function(MemorySource, Deferred, RecordSet) {
   var DemoSource = MemorySource.extend({
      query: function() {
         var arr = new RecordSet({
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
         return Deferred.success(arr);
      }
   });
   return DemoSource;
});
