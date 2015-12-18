/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Adapter.JsonRecord', [
   'js!SBIS3.CONTROLS.Data.Adapter.IRecord'
], function (IRecord) {
   'use strict';

   /**
    * Адаптер для записи таблицы данных в формате JSON
    * @class SBIS3.CONTROLS.Data.Adapter.JsonRecord
    * @mixes SBIS3.CONTROLS.Data.Adapter.IRecord
    * @author Мальцев Алексей
    */

   var JsonRecord = $ws.core.extend({}, [IRecord], /** @lends SBIS3.CONTROLS.Data.Adapter.JsonRecord.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Adapter.JsonRecord',
      $protected: {
         /**
          * @var {Object} Сырые данные
          */
         _data: undefined
      },

      $constructor: function (data) {
         if (!(data instanceof Object)) {
            data = {};
         }
         this._data = data;
      },

      has: function (name) {
         return this._data.hasOwnProperty(name);
      },

      get: function (name) {
         return this._data[name];
      },

      set: function (name, value) {
         this._data[name] = value;
      },

      getFields: function () {
         return Object.keys(this._data);
      },

      getEmpty: function () {
         return [];
      },

      getInfo: function(name) {
         return {};
      },

      getKeyField: function () {
         /*
         for (var key in this._data) {
            if (data.hasOwnProperty(key)) {
               return key;
            }
         }*/
         return undefined;
      },

      getData: function () {
         return this._data;
      }
   });

   return JsonRecord;
});

