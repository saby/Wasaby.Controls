define('Controls/List/resources/utils/DataSourceUtil', [
   'WS.Data/Query/Query',
   'Core/core-instance',
   'Core/Deferred'
], function(Query, cInstance, cDeferred) {
   
   function getQueryForCall(filter, sorting, offset, limit) {
      var query = new Query();
      query.where(filter)
         .offset(offset)
         .limit(limit)
         .orderBy(sorting);
      return query;
   }
   
   var DataSourceUtil = {
      prepareSource: function(sourceOpt) {
         var result;

         switch (typeof sourceOpt) {
            case 'object':
               if (cInstance.instanceOfMixin(sourceOpt, 'WS.Data/Source/ISource')) {
                  result = sourceOpt;
               }
               if ('module' in sourceOpt) {
                  var DataSourceConstructor = requirejs(sourceOpt.module);
                  result = new DataSourceConstructor(sourceOpt.options || {});
               }
               if (sourceOpt && sourceOpt.getData) {
                  result = sourceOpt.getData();
               }
               break;
         }
         return result;
      },

      callQuery: function(dataSource, keyProperty, filter, sorting, offset, limit) {
         var queryDef, query = getQueryForCall(filter, sorting, offset, limit);


         queryDef = dataSource.query(query).addCallback((function(dataSet) {
            if (keyProperty && keyProperty !== dataSet.keyProperty) {
               dataSet.keyProperty = keyProperty;
            }
            return dataSet.getAll();
         }));

         if (cInstance.instanceOfModule(dataSource, 'WS.Data/Source/Memory')) {

            /*TODO временное решение. Проблема в том что деферред с синхронным кодом статического источника выполняется сихронно.
            в итоге в коолбэк релоада мы приходим в тот момент, когда еще не отработал _beforeMount и заполнение опций, и не можем обратиться к this._options*/
            var queryDefAsync = cDeferred.fromTimer(0);
            queryDefAsync.addCallback(function() {
               return queryDef;
            });
            return queryDefAsync;
         } else {
            return queryDef;
         }
      }
   };
   return DataSourceUtil;
});
