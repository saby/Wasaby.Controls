/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.DataSourceArray', ['js!SBIS3.CONTROLS.IDataSource', 'js!SBIS3.CONTROLS.DataSet'], function (IDataSource, DataSet) {
   'use strict';
   return IDataSource.extend({
      $protected: {
         _data: undefined
      },
      $constructor: function (cfg) {
         this._data = cfg.data;
      },

      create: function () {

      },

      read: function (pk) {

      },

      update: function () {

      },

      destroy: function (pk) {

      },

      query: function (filter, sorting, offset, limit) {
         var self = this,
            def = new $ws.proto.Deferred();

         var DS = new DataSet({
            strategy: 'Array',
            dataSource: self,
            columns: self._options.columns,
            data: self._options.data
         });

         // когда будет чудо-библиотека можно будет отсортировать, отфильтровать и потом только вернуть результат

         def.callback(DS);

         return def;
      }


   });
});