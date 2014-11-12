/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.DataSourceBL', ['js!SBIS3.CONTROLS.IDataSource'], function (IDataSource) {
   'use strict';
   return IDataSource.extend({
      $protected: {
         _name: '',
         _serviceUrl: ''
      },
      $constructor: function (cfg) {
         this._name = cfg.name;
      },
      read: function () {

      },
      query: function (method, filter, paging, sorting) {
         /*
          if(!method || typeof(method) != 'string')
          throw new TypeError("Method name must be specified");
          if(paging) {
          if(typeof paging != 'object') {
          throw new TypeError("Paging parameter must be an object");
          } else {
          if(paging.type) {
          paging.page = +paging.page;
          paging.pageSize = +paging.pageSize;
          if(isNaN(paging.page))
          throw new TypeError("Page must be a number (paging.page)");
          if(isNaN(paging.pageSize))
          throw new TypeError("Page size must be a number (paging.pageSize)");
          }
          }
          }
          if(sorting && !(sorting instanceof Array))
          throw new TypeError("Sorting parameter must be an array");
          return $ws.helpers.newRecordSet(this._name, method, filter, undefined, !(sorting || paging), this._serviceUrl, undefined).addCallback(function(rs){
          if(sorting || paging) {
          var loadRes = new $ws.proto.Deferred();
          if(sorting)
          rs.setSorting(sorting, undefined, undefined, true);
          if(paging && paging.type) {
          rs.setUsePages(paging.type);
          rs.setPageSize(paging.pageSize, true);
          rs.setPage(paging.page, true);
          }
          rs.once('onAfterLoad', function(event, recordSet, isSuccess, error){
          if(isSuccess)
          loadRes.callback(recordSet);
          else
          loadRes.errback(error);

          });
          rs.reload();
          return loadRes;
          } else
          return rs;
          });
          */
      },
      create: function () {
      },
      destroy: function () {
      },
      update: function () {
      }
   });
});