/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.DataSourceBL', [
   'js!SBIS3.CONTROLS.IDataSource',
   'js!SBIS3.CONTROLS.Record',
   'js!SBIS3.CONTROLS.DataSet',
   'js!SBIS3.CONTROLS.DataStrategyBL'
], function (IDataSource, Record, DataSet, DataStrategyBL) {
   'use strict';
   return IDataSource.extend({
      $protected: {
         _filter: {},
         _options: {
            queryMethodName: 'Список',
            crateMethodName: 'Создать',
            readMethodName: 'Прочитать',
            updateMethodName: 'Записать',
            destroyMethodName: 'Удалить'
         },
         /**
          * Объект, который умеет ходить на бизнес-логику
          */
         _BL: undefined
      },
      $constructor: function (cfg) {
         this._BL = new $ws.proto.ClientBLObject(cfg);
      },

      create: function () {
         var self = this,
            def = new $ws.proto.Deferred();
         self._BL.call(self._options.crateMethodName, {'Фильтр': null, 'ИмяМетода': null}, $ws.proto.BLObject.RETURN_TYPE_ASIS).addCallback(function (res) {
            var record = new Record(new DataStrategyBL());
            record.setRaw(res);
            def.callback(record);
         });
         return def;
      },

      /**
       * Прочитать запись
       * @param id - идентификатор записи
       */
      read: function (id) {
         var self = this,
            def = new $ws.proto.Deferred();
         self._BL.call(self._options.readMethodName, {'ИдО': id, 'ИмяМетода': 'Список'}, $ws.proto.BLObject.RETURN_TYPE_ASIS).addCallback(function (res) {
            //TODO: переделать установку стратегии стратегию
            var record = new Record(new DataStrategyBL());
            record.setRaw(res);
            def.callback(record);
         });
         return def;
      },

      /**
       * Обновить запись
       * @param record - измененная запись
       */
      update: function (record) {
         var self = this,
            rawData = record.getRaw(),
            def = new $ws.proto.Deferred();
         var rec = {
            s: rawData.s,
            d: rawData.d,
            //FixME: можно ли раскомментить
            /*_key: 2,*/
            _type: 'record'
         };

         self._BL.call(self._options.updateMethodName, {'Запись': rec}, $ws.proto.BLObject.RETURN_TYPE_ASIS).addCallback(function (res) {
            def.callback(true);
         });

         return def;
      },

      /**
       * Удалить запись
       * @param id - идентификатор записи
       */
      destroy: function (id) {
         var self = this,
            def = new $ws.proto.Deferred();

         self._BL.call(self._options.destroyMethodName, {'ИдО': id}, $ws.proto.BLObject.RETURN_TYPE_ASIS).addCallback(function (res) {
            def.callback();
         });

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
            def = new $ws.proto.Deferred();

         filter = filter ? filter : this._filter;
         this._filter = filter;

         var filterParam = {
            d: [],
            s: []
         };

         if (!Object.isEmpty(filter)) {
            for (var j in filter) {
               if (filter.hasOwnProperty(j)) {
                  if (typeof filter[j] == 'boolean') {
                     filterParam.s.push({
                        n: j,
                        t: 'Логическое'
                     });
                  }
                  else {
                     filterParam.s.push({
                        n: j,
                        t: 'Строка'
                     });
                  }
                  filterParam.d.push(filter[j])
               }
            }
         }

         self._BL.call(self._options.queryMethodName, {'ДопПоля': [], 'Фильтр': filterParam, 'Сортировка': null, 'Навигация': null}, $ws.proto.BLObject.RETURN_TYPE_ASIS).addCallback(function (res) {

            var DS = new DataSet({
               strategy: 'DataStrategyBL',
               data: res
            });

            def.callback(DS);

         });

         return def;

      }

   });
});