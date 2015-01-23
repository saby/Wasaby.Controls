/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.DataSourceBL', ['js!SBIS3.CONTROLS.IDataSource', 'js!SBIS3.CONTROLS.DataSet'], function (IDataSource, DataSet) {
   'use strict';
   return IDataSource.extend({
      $protected: {
         _options: {
            queryMethodName: 'Список',
            readMethodName: 'Прочитать',
            updateMethodName: 'Записать',
            destroyMethodName: 'Удалить'
         },
         _BL: undefined
      },
      $constructor: function (cfg) {
         this._BL = new $ws.proto.ClientBLObject(cfg);
      },

      create: function () {

      },

      read: function (id) {
         var self = this,
            def = new $ws.proto.Deferred();
         self._BL.call(self._options.readMethodName, {'ИдО': id, 'ИмяМетода': 'Список'}, $ws.proto.BLObject.RETURN_TYPE_ASIS).addCallback(function (res) {
            def.callback(res);
         });
         return def;
      },

      update: function (record) {
         var self = this,
            rawData = record.getRawData(),
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

      destroy: function (id) {
         var self = this,
            def = new $ws.proto.Deferred();

         self._BL.call(self._options.destroyMethodName, {'ИдО': id}, $ws.proto.BLObject.RETURN_TYPE_ASIS).addCallback(function (res) {
            def.callback();
         });

         return def;
      },

      query: function (filter, sorting, offset, limit) {

         var self = this,
            def = new $ws.proto.Deferred();

         self._BL.call(self._options.queryMethodName, {'ДопПоля': [], 'Фильтр': {'d': [], 's': []}, 'Сортировка': null, 'Навигация': null}, $ws.proto.BLObject.RETURN_TYPE_ASIS).addCallback(function (res) {

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