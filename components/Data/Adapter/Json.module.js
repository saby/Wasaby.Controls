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

define('js!SBIS3.CONTROLS.Data.Adapter.JsonTable', [
   'js!SBIS3.CONTROLS.Data.Adapter.ITable',
   'js!SBIS3.CONTROLS.Data.Adapter.JsonRecord'
], function (ITable, JsonRecord) {
   'use strict';

   /**
    * Адаптер для таблицы данных в формате JSON
    * @class SBIS3.CONTROLS.Data.Adapter.JsonTable
    * @mixes SBIS3.CONTROLS.Data.Adapter.ITable
    * @author Мальцев Алексей
    */

   var JsonTable = $ws.core.extend({}, [ITable], /** @lends SBIS3.CONTROLS.Data.Adapter.JsonTable.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Adapter.JsonTable',
      $protected: {
         /**
          * @var {Array} Сырые данные
          */
         _data: []
      },

      $constructor: function (data) {
         if (!(data instanceof Array)) {
            data = [];
         }
         this._data = data;
      },

      getEmpty: function () {
         return [];
      },

      getCount: function () {
         return this._data.length;
      },

      add: function (record, at) {
         if (at === undefined) {
            this._data.push(record);
         } else {
            this._checkPosition(at);
            this._data.splice(at, 0, record);
         }
      },

      at: function (index) {
         return this._data[index];
      },

      remove: function (at) {
         this._checkPosition(at);
         this._data.splice(at, 1);
      },

      merge: function(one, two, idProperty) {
         var first = this.at(one),
            extention = this.at(two),
            adapter = new JsonRecord(first),
            id = adapter.get(idProperty);
         $ws.core.merge(first, extention);
         adapter.set(idProperty, id);
         this.remove(two);
      },

      copy: function(index) {
         var source = this.at(index),
            clone = $ws.core.clone(source);
         this.add(clone, index);
      },

      replace: function (record, at) {
         this._checkPosition(at);
         this._data[at] = record;
      },

      move: function(source, target) {
         if (target === source) {
            return;
         }
         var removed = this._data.splice(source, 1);
         this._data.splice(target, 0, removed.shift());
      },

      getData: function () {
         return this._data;
      },

      _checkPosition: function (at) {
         if (at < 0 || at > this._data.length) {
            throw new Error('Out of bounds');
         }
      }
   });

   return JsonTable;
});

define('js!SBIS3.CONTROLS.Data.Adapter.Json', [
   'js!SBIS3.CONTROLS.Data.Adapter.Abstract',
   'js!SBIS3.CONTROLS.Data.Adapter.JsonTable',
   'js!SBIS3.CONTROLS.Data.Adapter.JsonRecord'
], function (Abstract, JsonTable, JsonRecord) {
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

      forTable: function (data) {
         return new JsonTable(data);
      },

      forRecord: function (data) {
         return new JsonRecord(data);
      }
   });

   return Json;
});
