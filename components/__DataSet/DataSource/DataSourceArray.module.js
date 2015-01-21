/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.DataSourceArray', ['js!SBIS3.CONTROLS.IDataSource', 'js!SBIS3.CONTROLS.DataSet'], function (IDataSource, DataSet) {
   'use strict';
   return IDataSource.extend({
      $protected: {
         _data: undefined,
         _keyField: undefined,
         _options: {
            data: [],
            keyField: ''
         }
      },
      $constructor: function () {
         if (this._options.data) {
            this._data = this._options.data;
         }
         if (this._options.keyField) {
            this._keyField = this._options.keyField;
         }
      },

      create: function () {

      },

      read: function (id) {

      },

      update: function () {

      },

      delete: function (id) {

      },

      query: function (filter, sorting, offset, limit) {
         var self = this,
            def = new $ws.proto.Deferred();

         var DS = new DataSet({
            strategy: 'DataStrategyArray',
            data: self._options.data,
            keyField: self._keyField
         });

         // когда будет чудо-библиотека можно будет отсортировать, отфильтровать и потом только вернуть результат

         def.callback(DS);

         return def;
      }


   });
});