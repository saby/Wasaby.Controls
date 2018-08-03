define('Controls-demo/MasterDetail/DemoSource', [
   'WS.Data/Source/Memory',
   'Core/Deferred',
   'WS.Data/Source/DataSet',
   'Controls-demo/MasterDetail/Data'
], function(MemorySource, Deferred, DataSet, Data) {
   var DemoSource = MemorySource.extend({
      query: function(filter) {
         var arr = null;
         switch (filter._where.myOpt) {
            case '0':
               arr = new DataSet({rawData: Data.incoming});
               break;
            case '1':
               arr = new DataSet({rawData: Data.incomingTasks});
               break;
            case '2':
               arr = new DataSet({rawData: Data.instructions});
               break;
            case '3':
               arr = new DataSet({rawData: Data.plans});
               break;
            default:
               arr = new DataSet({rawData: []});
               break;
         }


         return Deferred.success(arr);
      }
   });
   return DemoSource;
});
