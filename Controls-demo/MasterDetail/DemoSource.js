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
               arr = new DataSet({rawData: Data.incoming, idProperty: 'id'});
               break;
            case '1':
               arr = new DataSet({rawData: Data.incomingTasks, idProperty: 'id'});
               break;
            case '2':
               arr = new DataSet({rawData: Data.instructions, idProperty: 'id'});
               break;
            case '3':
               arr = new DataSet({rawData: Data.plans, idProperty: 'id'});
               break;
            default:
               arr = new DataSet({rawData: [], idProperty: 'id'});
               break;
         }


         return Deferred.success(arr);
      }
   });
   return DemoSource;
});
