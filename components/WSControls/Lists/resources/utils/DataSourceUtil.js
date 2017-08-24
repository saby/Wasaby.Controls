define('js!WSControls/Lists/resources/utils/DataSourceUtil', [
   'js!WS.Data/Query/Query',
   'Core/core-instance',
   'Core/Deferred'
], function(Query, cInstance, Deferred) {
   var DataSourceUtil = {
      prepareSource: function(sourceOpt) {
         var result;

         switch (typeof sourceOpt) {
            case 'function':
               result = sourceOpt.call(this);
               break;
            case 'object':
               if (cInstance.instanceOfMixin(sourceOpt, 'WS.Data/Source/ISource')) {
                  result = sourceOpt;
               }
               if ('module' in sourceOpt) {
                  var DataSourceConstructor = requirejs(sourceOpt.module);
                  result = new DataSourceConstructor(sourceOpt.options || {});
               }
               break;
         }
         return result;
      },

      callQuery: function (dataSource, idProperty, filter, sorting, offset, limit) {

         var query = this._getQueryForCall(filter, sorting, offset, limit);

         var def = new Deferred();

         dataSource.query(query).addCallback(function(dataSet) {
            if (idProperty && idProperty !== dataSet.getIdProperty()) {
               dataSet.setIdProperty(idProperty);
            }
            //Деферред должен сработать асинхронно, иначе опции будут не готовы
            window.setTimeout(function(){
               def.callback(dataSet.getAll());
            }, 0);

            return dataSet.getAll();

         });
         return def;
      },

      _getQueryForCall: function(filter, sorting, offset, limit){
         var query = new Query();
         query.where(filter)
            .offset(offset)
            .limit(limit)
            .orderBy(sorting);
         return query;
      }
   };
   return DataSourceUtil;
});