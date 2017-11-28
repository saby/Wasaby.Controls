define('js!Controls/List/resources/utils/DataSourceUtil', [
   'WS.Data/Query/Query',
   'Core/core-instance',
   'Core/Deferred'
], function(Query, cInstance, cDeferred) {
   
   function getQueryForCall (filter, sorting, offset, limit) {
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

      callQuery: function (dataSource, idProperty, filter, sorting, offset, limit) {

         //TODO временное решение. Проблема в том что деферред с синхронным кодом на самом деле не сихронный. И в коллбэке релоада у контрола нет опций
         var queryDef = cDeferred.fromTimer(50);

         queryDef.addCallback(function(){
            var query = getQueryForCall(filter, sorting, offset, limit);

            return dataSource.query(query).addCallback((function(dataSet) {
               if (idProperty && idProperty !== dataSet.getIdProperty()) {
                  dataSet.setIdProperty(idProperty);
               }
               return dataSet.getAll();
            }));
         });

         return queryDef;
      }
   };
   return DataSourceUtil;
});