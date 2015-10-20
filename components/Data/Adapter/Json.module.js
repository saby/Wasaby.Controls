/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Adapter.Json', [
   'js!SBIS3.CONTROLS.Data.Adapter.Abstract',
   'js!SBIS3.CONTROLS.Data.Adapter.ITable',
   'js!SBIS3.CONTROLS.Data.Adapter.IRecord'
], function (Abstract, ITable, IRecord) {
   'use strict';

   /**
    * Адаптер для данных в формате JSON
    * @class SBIS3.CONTROLS.Data.Adapter.Json
    * @extends SBIS3.CONTROLS.Data.Adapter.Abstract
    * @public
    * @author Мальцев Алексей
    */

   var Json = Abstract.extend(/** @lends SBIS3.CONTROLS.Data.Adapter.Json.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Adapter.Json',
      $protected: {
         /**
          * @var {SBIS3.CONTROLS.Data.Adapter.JsonTable} Адаптер для таблицы
          */
         _table: undefined,

         /**
          * @var {SBIS3.CONTROLS.Data.Adapter.JsonRecord} Адаптер для записи
          */
         _record: undefined
      },

      destroy: function () {
         this._table = undefined;
         this._record = undefined;
      },

      forTable: function () {
         return this._table || (this._table = new JsonTable());
      },

      forRecord: function () {
         return this._record || (this._record = new JsonRecord());
      }
   });

   /**
    * Адаптер для таблицы данных в формате JSON
    * @class SBIS3.CONTROLS.Data.Adapter.JsonTable
    * @mixes SBIS3.CONTROLS.Data.Adapter.ITable
    * @author Мальцев Алексей
    */
   var JsonTable = $ws.core.extend({}, [ITable], /** @lends SBIS3.CONTROLS.Data.Adapter.JsonTable.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Adapter.JsonTable',
      getEmpty: function () {
         return [];
      },

      getCount: function (data) {
         return data ? data.length || 0 : 0;
      },

      add: function (data, record, at) {
         if (!(data instanceof Array)) {
            throw new Error('Invalid argument');
         }

         if (at === undefined) {
            data.push(record);
         } else {
            this._checkPosition(data, at);
            data.splice(at, 0, record);
         }
      },

      at: function (data, index) {
         return data ? data[index] : undefined;
      },

      remove: function (data, at) {
         if (!(data instanceof Array)) {
            throw new Error('Invalid argument');
         }
         this._checkPosition(data, at);
         data.splice(at, 1);
      },

      replace: function (data, record, at) {
         if (!(data instanceof Array)) {
            throw new Error('Invalid argument');
         }
         this._checkPosition(data, at);
         data[at] = record;
      },

      _checkPosition: function (data, at) {
         if (at < 0 || at > data.length) {
            throw new Error('Out of bounds');
         }
      }
   });

   /**
    * Адаптер для записи таблицы данных в формате JSON
    * @class SBIS3.CONTROLS.Data.Adapter.JsonRecord
    * @mixes SBIS3.CONTROLS.Data.Adapter.IRecord
    * @author Мальцев Алексей
    */
   var JsonRecord = $ws.core.extend({}, [IRecord], /** @lends SBIS3.CONTROLS.Data.Adapter.JsonRecord.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Adapter.JsonRecord',
      get: function (data, name) {
         return data ? data[name] : undefined;
      },

      getFullFieldData: function(data, name) {
         return {};
      },

      set: function (data, name, value) {
         if (!(data instanceof Object)) {
            throw new Error('Invalid argument');
         }
         data[name] = value;
      },

      getType: function(data, name) {
         return 'AsIs';
      },
      getConfig: function(data, name) {
         return {};
      },

      getEmpty: function () {
         return [];
      }
   });

   return Json;
});
