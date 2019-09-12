define('Controls-demo/MasterDetail/DemoSource', [
   'Core/Deferred',
   'Types/source',
   'Controls-demo/MasterDetail/Data'
], function (Deferred, source, Data) {
   var DemoSource = source.Memory.extend({
      query: function (filter) {
         var arr = null;
         switch (filter._where.myOpt) {
            case '0':
               arr = new source.DataSet({rawData: Data.incoming, keyProperty: 'id'});
               break;
            case '1':
               arr = new source.DataSet({rawData: Data.incomingTasks, keyProperty: 'id'});
               break;
            case '2':
               arr = new source.DataSet({rawData: Data.instructions, keyProperty: 'id'});
               break;
            case '3':
               arr = new source.DataSet({rawData: Data.plans, keyProperty: 'id'});
               break;
            case '4':
               arr = new source.DataSet({rawData: Data.andrewBTasks, keyProperty: 'id'});
               break;
            case '5':
               arr = new source.DataSet({rawData: Data.andrewSTasks, keyProperty: 'id'});
               break;
            case '6':
               arr = new source.DataSet({rawData: Data.dmitriyKTasks, keyProperty: 'id'});
               break;
            case '7':
               arr = new source.DataSet({rawData: Data.alexGTasks, keyProperty: 'id'});
               break;
            case '8':
               arr = new source.DataSet({rawData: Data.postponed, keyProperty: 'id'});
               break;
            case '9':
               arr = new source.DataSet({rawData: Data.levelUp, keyProperty: 'id'});
               break;
            case '10':
               arr = new source.DataSet({rawData: Data.criticalBugs, keyProperty: 'id'});
               break;
            case '11':
               arr = new source.DataSet({rawData: Data.postponedTasks, keyProperty: 'id'});
               break;
            case '12':
               arr = new source.DataSet({rawData: Data['3.18.710'], keyProperty: 'id'});
               break;
            case '13':
               arr = new source.DataSet({rawData: Data.todoTasks, keyProperty: 'id'});
               break;
            case '14':
               arr = new source.DataSet({rawData: Data.hotTasks, keyProperty: 'id'});
               break;
            case '15':
               arr = new source.DataSet({rawData: Data.otherTasks, keyProperty: 'id'});
               break;
            default:
               arr = new source.DataSet({rawData: [], keyProperty: 'id'});
               break;
         }


         return Deferred.success(arr);
      }
   });
   return DemoSource;
});
