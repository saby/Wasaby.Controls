/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.DataSourceArray', [
   'js!SBIS3.CONTROLS.IDataSource',
   'js!SBIS3.CONTROLS.Record',
   'js!SBIS3.CONTROLS.DataSet',
   'js!SBIS3.CONTROLS.DataStrategyArray'
], function (IDataSource, Record, DataSet, DataStrategyArray) {
   'use strict';
   return IDataSource.extend({
      $protected: {
         _filter : {},
         _options: {
            /**
             * Массив сырых данных, по которым строится DataSource
             */
            data: [],
            /**
             * @cfg {String}  Ключевое поле
             */
            keyField: ''
         }
      },
      $constructor: function () {

      },

      create: function () {

      },

      /**
       * Прочитать запись
       * @param id - идентификатор записи
       */
      read: function (id) {
         var def = new $ws.proto.Deferred(),
            key;
         for (var i = 0; i < this._options.data.length; i++) {
            if (this._options.data[i][this._options.keyField] == parseInt(id, 10)) {
               key = i;
               break;
            }
         }
         //TODO: переделать установку стратегии
         var record = new Record(new DataStrategyArray());
         record.setRaw(this._options.data[key]);
         def.callback(record);
         return def;
      },

      /**
       * Обновить запись
       * @param record - измененная запись
       */
      update: function (record) {
         var def = new $ws.proto.Deferred(),
            rawData = record.getRaw(),
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

      /**
       * Удалить запись
       * @param id - идентификатор записи
       */
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

      /**
       * Вызов списочного метода
       * @param filter - [{property: 'id', value: 2}]
       * @param sorting - [{property1: 'id', direction: 'ASC'},{property2: 'name', direction: 'DESC'}]
       * @param offset - number
       * @param limit - number
       */
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