define('js!WSControls/Lists/resources/utils/DataSourceUtil', [
   'js!WS.Data/Query/Query',
   'Core/core-instance'
], function(Query, cInstance) {
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

         var query = this._getQueryForCall(filter, sorting, offset, limit);

         return dataSource.query(query).addCallback((function(dataSet) {
            if (idProperty && idProperty !== dataSet.getIdProperty()) {
               dataSet.setIdProperty(idProperty);
            }
            return dataSet.getAll();
         }).bind(this));
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