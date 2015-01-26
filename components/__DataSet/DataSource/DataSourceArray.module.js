/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.DataSourceArray', ['js!SBIS3.CONTROLS.IDataSource', 'js!SBIS3.CONTROLS.DataSet'], function (IDataSource, DataSet) {
   'use strict';
   return IDataSource.extend({
      $protected: {
         _filter : {},
         _options: {
            data: [],
            keyField: ''
         }
      },
      $constructor: function () {

      },

      create: function () {

      },

      read: function (id) {
         var def = new $ws.proto.Deferred(),
            key;
         for (var i = 0; i < this._options.data.length; i++) {
            if (this._options.data[i][this._options.keyField] == parseInt(id, 10)) {
               key = i;
               break;
            }
         }
         def.callback(this._options.data[key]);
         return def;
      },

      update: function (record) {
         var def = new $ws.proto.Deferred(),
            rawData = record.getRawData(),
            key = rawData[this._options.keyField];
         for (var i = 0; i < this._options.data.length; i++) {
            if (this._options.data[i][this._options.keyField] == key) {
               this._options.data[i] = rawData;
               break;
            }
         }
         def.callback(true);
         return def;
      },

      destroy: function (id) {
         var def = new $ws.proto.Deferred(),
            key;
         for (var i = 0; i < this._options.data.length; i++) {
            if (this._options.data[i][this._options.keyField] == parseInt(id, 10)) {
               key = i;
               break;
            }

         }
         Array.remove(this._options.data, key);
         def.callback();
         return def;
      },

      query: function (filter, sorting, offset, limit) {
         var self = this,
            def = new $ws.proto.Deferred(),
            data = this._options.data;

         filter = filter ? filter : this._filter;
         this._filter = filter;

         if (!Object.isEmpty(filter)) {
            data = [];
            for (var i = 0; i < this._options.data.length; i++) {
               var equal = true;
               for (var j in filter) {
                  if (filter.hasOwnProperty(j)) {
                     if (this._options.data[i][j] != filter[j]) {
                        equal = false;
                        break;
                     }
                  }
               }
               if (equal) {
                  data.push(this._options.data[i]);
               }
            }
         }


         var DS = new DataSet({
            strategy: 'DataStrategyArray',
            data: data,
            keyField: this._options.keyField
         });

         // когда будет чудо-библиотека можно будет отсортировать, отфильтровать и потом только вернуть результат

         def.callback(DS);

         return def;
      }


   });
});