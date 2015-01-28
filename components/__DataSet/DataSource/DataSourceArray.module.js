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

   /**
    * Класс, реализующий интерфейс IDataSource, для работы с массивами как с источником данных
    */

   return IDataSource.extend({
      $protected: {
         _filter: {},
         _options: {
            /**
             * @cfg {Array} Исходный массив данных, с которым работает DataSourceArray
             */
            data: [],
            /**
             * @cfg {String} Название поля, являющегося первичных ключом
             */
            keyField: ''
         }
      },
      $constructor: function () {

      },

      /**
       * Метод создает запись в источнике данных
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения. В колбэке придет js!SBIS3.CONTROLS.Record
       */
      create: function () {
         var def = new $ws.proto.Deferred();
         var record = new Record(new DataStrategyArray());
         // идентификатор берем на 1 больще, чем у последней записи
         record.set(this._options.keyField, this._options.data[this._options.data.length - 1][this._options.keyField] + 1);
         this._options.data.push(record.getRaw());
         def.callback(record);
         return def;
      },

      /**
       * Метод для чтения записи из массива по ее идентификатору
       * @param {Number} id - идентификатор записи
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения. В колбэке придет js!SBIS3.CONTROLS.Record
       */
      read: function (id) {
         var def = new $ws.proto.Deferred(),
            key;
         //перебиаем массим исходных данных пока не найдем нужный элемент
         //TODO: сделать ошибку если такой записи не нашлось
         for (var i = 0; i < this._options.data.length; i++) {
            if (this._options.data[i][this._options.keyField] == parseInt(id, 10)) {
               key = i;
               break;
            }
         }
         //TODO: переделать установку стратегии
         var record = new Record(new DataStrategyArray());
         //установка "сырых" данных для записи
         record.setRaw(this._options.data[key]);
         def.callback(record);
         return def;
      },

      /**
       * Метод для обновления записи в источнике данных
       * @param (js!SBIS3.CONTROLS.Record) record - измененная запись
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения. В колбэке придет Boolean - результат успешности выполнения операции
       */
      update: function (record) {
         var def = new $ws.proto.Deferred(),
            rawData = record.getRaw(),
            key = rawData[this._options.keyField];
         // проходим по исходному массиву, когда находим нужных элемент - заменяем
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
       * Метод для удаления записи из источника данных
       * @param {Number} id - идентификатор записи
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения. В колбэке придет Boolean - результат успешности выполнения операции
       */
      destroy: function (id) {
         var def = new $ws.proto.Deferred(),
            key;
         // проходим по исходному массиву, пока не найдем позицию искомого элемента
         for (var i = 0; i < this._options.data.length; i++) {
            if (this._options.data[i][this._options.keyField] == parseInt(id, 10)) {
               key = i;
               break;
            }
         }
         // удаляем эемент из исходного набора
         Array.remove(this._options.data, key);
         def.callback(true);
         return def;
      },

      /**
       * Метод для получения набора записей из источника данных
       * Возможно применене фильтрации, сортировки и выбора определенного количества записей с заданной позиции
       * @param {Object} filter - {property: value}
       * @param {Array} sorting - [{property1: 'ASC'},{property2: 'DESC'}]
       * @param {Number} offset смещение начала выборки
       * @param {Number} limit количество возвращаемых записей
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения. В колбэке придет js!SBIS3.CONTROLS.DataSet - набор отобранных элементов
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
         def.callback(DS);
         return def;
      }


   });
});