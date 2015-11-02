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
      },

      getKeyField: function (data) {
         /*if (typeof data === 'object') {
            for (var key in data) {
               if (data.hasOwnProperty(key)) {
                  return key;
               }
            }
         }*/

         return undefined;
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

      merge: function(data, one, two, idProperty) {
         var first = this.at(data, one),
             extention = this.at(data, two),
             record = new JsonRecord(),
             id = record.get(first,idProperty);
         $ws.core.merge(first, extention);
         record.set(first,idProperty,id);
         this.remove(data, two);
      },

      copy: function(data, index) {
         var source = this.at(data, index),
            clone = $ws.core.clone(source);
         this.add(data, clone, index);
      },

      replace: function (data, record, at) {
         if (!(data instanceof Array)) {
            throw new Error('Invalid argument');
         }
         this._checkPosition(data, at);
         data[at] = record;
      },

      move: function(data, source, target) {
         if (target === source) {
            return;
         }
         var removed = data.splice(source, 1);
         data.splice(target, 0, removed.shift());
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

      set: function (data, name, value) {
         if (!(data instanceof Object)) {
            throw new Error('Invalid argument');
         }
         data[name] = value;
      },

      getFields: function (data) {
         return Object.keys(data);
      },

      getEmpty: function () {
         return [];
      },

      getFullFieldData: function(data, name) {
         return {};
      },

      getType: function(data, name) {
         return 'AsIs';
      },

      getConfig: function(data, name) {
         return {};
      }
   });

   return Json;
});
