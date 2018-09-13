define('Controls-demo/MasterDetail/DemoSource', [
   'WS.Data/Source/Memory',
   'Core/Deferred',
   'WS.Data/Source/DataSet',
   'Controls-demo/MasterDetail/Data'
], function (MemorySource, Deferred, DataSet, Data) {
   var DemoSource = MemorySource.extend({
      query: function (filter) {
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
            case '4':
               arr = new DataSet({rawData: Data.andrewBTasks, idProperty: 'id'});
               break;
            case '5':
               arr = new DataSet({rawData: Data.andrewSTasks, idProperty: 'id'});
               break;
            case '6':
               arr = new DataSet({rawData: Data.dmitriyKTasks, idProperty: 'id'});
               break;
            case '7':
               arr = new DataSet({rawData: Data.alexGTasks, idProperty: 'id'});
               break;
            case '8':
               arr = new DataSet({rawData: Data.postponed, idProperty: 'id'});
               break;
            case '9':
               arr = new DataSet({rawData: Data.levelUp, idProperty: 'id'});
               break;
            case '10':
               arr = new DataSet({rawData: Data.criticalBugs, idProperty: 'id'});
               break;
            case '11':
               arr = new DataSet({rawData: Data.postponedTasks, idProperty: 'id'});
               break;
            case '12':
               arr = new DataSet({rawData: Data['3.18.710'], idProperty: 'id'});
               break;
            case '13':
               arr = new DataSet({rawData: Data.todoTasks, idProperty: 'id'});
               break;
            case '14':
               arr = new DataSet({rawData: Data.hotTasks, idProperty: 'id'});
               break;
            case '15':
               arr = new DataSet({rawData: Data.otherTasks, idProperty: 'id'});
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
