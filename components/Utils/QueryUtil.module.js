/**
 * Created by am.gerasimov on 09.02.2017.
 */
define('js!SBIS3.CONTROLS.Utils.Query', [
   'js!WS.Data/Query/Query',
   'js!WS.Data/Source/SbisService',
   'Core/core-instance'],
   function (Query, SbisService, cInstance) {

   'use strict';

   function getQueryForCall(filter, sorting, offset, limit) {
      var query = new Query();

      query.where(filter || {})
           .offset(offset)
           .limit(limit)
           .orderBy(sorting || {});

      return query;
   }

   return function query(dataSource, queryArgs) {
      if (!cInstance.instanceOfModule(dataSource, 'WS.Data/Source/Base')) {
         dataSource = new SbisService(dataSource);
      }
      return dataSource.query(getQueryForCall.apply(null, queryArgs));
   };
});