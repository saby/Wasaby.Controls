/* global define, $ws, require */
define('js!SBIS3.CONTROLS.Data.Adapter.Sbis', [
   'js!SBIS3.CONTROLS.Data.Adapter.IAdapter',
   'js!SBIS3.CONTROLS.Data.Adapter.ITable',
   'js!SBIS3.CONTROLS.Data.Adapter.IRecord',
   'js!SBIS3.CONTROLS.Data.Factory'
], function (IAdapter, ITable, IRecord, Factory) {
   'use strict';
   /**
    * Адаптер для данных в формате СБиС
    * @class SBIS3.CONTROLS.Data.Adapter.Sbis
    * @mixes SBIS3.CONTROLS.Data.Adapter.IAdapter
    * @public
    * @author Мальцев Алексей
    */

   var Sbis = $ws.core.extend({}, [IAdapter], /** @lends SBIS3.CONTROLS.Data.Adapter.Sbis.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Adapter.Sbis',
      $protected: {
         /**
          * @var {SBIS3.CONTROLS.Data.Adapter.SbisTable} Адаптер для таблицы
          */
         _table: undefined,
         /**
          * @var {SBIS3.CONTROLS.Data.Adapter.SbisRecord} Адаптер для записи
          */
         _record: undefined
      },
      forTable: function () {
         return this._table || (this._table = new SbisTable());
      },
      forRecord: function () {
         return this._record || (this._record = new SbisRecord());
      }

   });
   Sbis.FIELD_TYPE = {
      DataSet: 'Выборка',
      Model: 'Запись',
      Integer: 'Число целое',
      String: 'Строка',
      Text: 'Текст',
      Double: 'Число вещественное',
      Money: 'Деньги',
      Date: 'Дата',
      DateTime: 'Дата и время',
      Time: 'Время',
      Array: 'Массив',
      Boolean: 'Логическое',
      Hierarchy: 'Иерархия',
      Identity: 'Идентификатор',
      Enum: 'Перечисляемое',
      Flags: 'Флаги',
      Link: 'Связь',
      Binary: 'Двоичное',
      UUID: 'UUID',
      RpcFile: 'Файл-rpc',
      TimeInterval: 'Временной интервал'
   };
   /**
    * Сериализует данные
    * @param {*} data
    * @returns {Object}
    * @static
    */
   Sbis.serialize = function (data) {
      var getType = function (val) {
            var type = typeof val;
            switch (type) {
               case 'boolean':
                  return Sbis.FIELD_TYPE.Boolean;
               case 'number':
                  if (val % 1 === 0) {
                     return Sbis.FIELD_TYPE.Integer;
                  }
                  return Sbis.FIELD_TYPE.Double;
               case 'string':
                  return Sbis.FIELD_TYPE.String;
               case 'object':
                  if (val instanceof Date) {
                     return Sbis.FIELD_TYPE.DateTime;
                  }
                  break;
            }
            return type;
         },
         serializeValue = function (value, type) {
            switch (type) {
               case Sbis.FIELD_TYPE.Time:
                  return value.toSQL();
            }
            return value;
         },
         makeS = function (obj) {
            var s = [];
            for (var key in obj) {
               if (!obj.hasOwnProperty(key)) {
                  continue;
               }
               s.push({
                  n: key,
                  t: getType(obj[key])
               });
            }
            return s;
         },
         makeD = function (obj, s) {
            var d = [];
            for (var i = 0, count = s.length; i < count; i++) {
               d.push(serializeValue(obj[s[i].n], s[i].t));
            }
            return d;
         },
         result,
         key;
      if (data instanceof Array) {
         var i,
            count;
         result = {
            s: [],
            d: []
         };
         for (i = 0, count = data.length; i < count; i++) {
            if (i === 0) {
               result.s = makeS(data[i]);
            }
            result.d.push(makeD(data[i], result.s));
         }
         return result;
      }
      else if (typeof data === 'object' && data !== null) {
         var allScalars = true;
         for (key in data) {
            if (!data.hasOwnProperty(key)) {
               continue;
            }
            var val = data[key];
            if (typeof val === 'object' && !(val instanceof Date)) {
               allScalars = false;
               break;
            }
         }
         result = {};
         if (allScalars) {
            result.s = makeS(data);
            result.d = makeD(data, result.s);
         }
         else {
            for (key in data) {
               if (!data.hasOwnProperty(key)) {
                  continue;
               }
               result[key] = Sbis.serialize(data[key]);
            }
         }
         return result;
      }
      else {
         return data;
      }
   };
   /**
    * Серелиализует датасет или рекордсет
    * @param data {SBIS3.CONTROLS.Data.Source.DataSet||$ws.proto.RecordSet}
    * @returns {*}
    */
   Sbis.serializeDataSet = function (data) {
      var DataSet;
      try {
         DataSet = require('js!SBIS3.CONTROLS.Data.Source.DataSet');
      } catch (e) {
      }
      if (DataSet && data instanceof DataSet) {
         return $ws.core.clone(data.getScalar());
      } else if (data instanceof $ws.proto.RecordSet || data instanceof $ws.proto.RecordSetStatic) {
         return data.toJSON();
      } else {
         return Sbis.serialize(data);
      }
   };
   /**
    * Серелиализует модель или рекорд
    * @param data {SBIS3.CONTROLS.Data.Model||$ws.proto.Record}
    * @returns {*}
    */
   Sbis.serializeModel = function (data) {
      var Model;
      try {
         Model = require('js!SBIS3.CONTROLS.Data.Model');
      } catch (e) {
      }
      if (data instanceof Model) {
         return $ws.core.clone(data.getData());
      } else if (data instanceof $ws.proto.Record) {
         return data.toJSON();
      } else {
         return Sbis.serialize(data);
      }
   };
   /**
    * Сериализует поле флагов
    * @param data - {$ws.proto.Record||}
    * @returns {*}
    */
   Sbis.serializeFlags = function (data) {
      var Model;
      try {
         Model = require('js!SBIS3.CONTROLS.Data.Model');
      } catch (e) {
      }
      var dt = [];
      if (data instanceof $ws.proto.Record) {
         var s = {},
            t = data.getColumns();
         for (var x = 0, l = t.length; x < l; x++) {
            s[data.getColumnIdx(t[x])] = t[x];
         }
         var sorted = Object.sortedPairs(s),
            rO = data.toObject();
         for (var y = 0, ly = sorted.keys.length; y < ly; y++) {
            dt.push(rO[sorted.values[y]]);
         }
         return dt;
      } else if (data instanceof Model) {
         data.each(function (value) {
            dt.push(value);
         });
         return dt;
      } else if (data instanceof Array) {
         return data;
      } else {
         return null;
      }
   };
   /**
    * Адаптер для таблицы данных в формате СБиС
    * @class SBIS3.CONTROLS.Data.Adapter.SbisTable
    * @mixes SBIS3.CONTROLS.Data.Adapter.ITable
    * @author Мальцев Алексей
    */
   var SbisTable = $ws.core.extend({}, [ITable], /** @lends SBIS3.CONTROLS.Data.Adapter.SbisTable.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Adapter.SbisTable',
      getEmpty: function (data) {
         return {
            d: [],
            s: data ? $ws.core.clone(data.s) : []
         };
      },
      getCount: function (data) {
         return data && data.d ? data.d.length || 0 : 0;
      },
      add: function (data, record, at) {
         this._checkData(data);
         if (!data.s || !data.s.length) {
            data.s = record.s;
         }
         if (at === undefined) {
            data.d.push(record.d);
         } else {
            this._checkPosition(data, at);
            data.d.splice(at, 0, record.d);
         }
      },
      at: function (data, index) {
         return data && data.d && data.d[index] ? {
            d: data.d[index],
            s: data.s
         } : undefined;
      },
      remove: function (data, at) {
         this._checkData(data);
         this._checkPosition(data, at);
         data.d.splice(at, 1);
      },
      replace: function (data, record, at) {
         this._checkData(data);
         this._checkPosition(data, at);
         if (!data.s || !data.s.length) {
            data.s = record.s;
         }
         data.d[at] = record.d;
      },
      getProperty: function (data, property) {
         property = property || '';
         var parts = property.split('.'),
            result;
         for (var i = 0; i < parts.length; i++) {
            result = i ?
               (result ? result[parts[i]] : undefined) :
               (data ? data[parts[i]] : undefined);
         }
         return result;
      },
      _checkData: function (data) {
         if (!(data instanceof Object)) {
            throw new Error('Invalid argument');
         }
         if (!(data.d instanceof Array)) {
            throw new Error('Invalid argument');
         }
      },
      _checkPosition: function (data, at) {
         if (at < 0 || at > data.d.length) {
            throw new Error('Out of bounds');
         }
      }
   });
   /**
    * Адаптер для записи таблицы данных в формате СБиС
    * @class SBIS3.CONTROLS.Data.Adapter.SbisRecord
    * @mixes SBIS3.CONTROLS.Data.Adapter.IRecord
    * @author Мальцев Алексей
    */
   var SbisRecord = $ws.core.extend({}, [IRecord], /** @lends SBIS3.CONTROLS.Data.Adapter.SbisRecord.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Adapter.SbisRecord',
      get: function (data, name) {
         var index = this._getFieldIndex(data, name);
         return index >= 0 ? data.d[index] : undefined;
      },

      getFullFieldData: function (data,name) {
         var index = this._getFieldIndex(data, name),
            meta = index >= 0 ? data.s[index] : undefined,
            value = index >= 0 ? data.d[index] : undefined,
            data = {meta: undefined, type: undefined};
         if (meta) {
            var type = this._getType(meta);
            data.meta = type.meta;
            data.type = type.name;
         }
         return data;
      },
      _getType: function (meta, key) {
         key = key || 't';
         var typeSbis = meta[key],
            type;
         if (typeof typeSbis === 'object') {
            return this._getType(typeSbis, 'n');
         }
         for (var fieldType in Sbis.FIELD_TYPE) {
            if (typeSbis === Sbis.FIELD_TYPE[fieldType]) {
               type = fieldType;
               break;
            }
         }
         var prepareMeta = this._prepareMetaInfo(type, $ws.core.clone(meta));
         return {'name': type, 'meta': prepareMeta};
      },
      _prepareMetaInfo: function (type, meta) {
         switch (type) {
            case 'Enum':
            {
               meta.source = meta.s;
               break;
            }
            case 'Money':
            {
               meta.precision = meta.p;
               break;
            }
            case 'Flags':
            {
               meta.makeData = function (value) {
                  var st = {},
                     pairs = Object.sortedPairs(meta.s),
                     fData = [];
                  for (var pI = 0, pL = pairs.keys.length; pI < pL; pI++) {
                     st[pI] = {
                        type: Sbis.FIELD_TYPE.Boolean,
                        title: pairs.values[pI],
                        index: pairs.keys[pI]
                     };
                     fData[pI] = value[pI];
                  }
                  return {
                     d: fData,
                     s: st
                  };
               };
               meta.adapter = new Sbis();
            }
         }
         return meta;
      },
      set: function (data, name, value) {
         this._checkData(data);
         var index = this._getFieldIndex(data, name);
         if (index < 0) {
            throw new Error('Field is not defined');
         }
         var meta = data.s[index],
            type = this._getType(meta);
         data.d[index] = Factory.serialize(value, type.name, Sbis, type.meta);
      },
      getEmpty: function (data) {
         return {
            d: [],
            s: data ? $ws.core.clone(data.s) : []
         };
      },
      _getFieldIndex: function (data, name) {
         if (data && data.s) {
            for (var i = 0, count = data.s.length; i < count; i++) {
               if (data.s[i].n === name) {
                  return i;
               }
            }
         }
         return -1;
      },
      _checkData: function (data) {
         if (!(data instanceof Object)) {
            throw new Error('Invalid argument');
         }
         if (!(data.d instanceof Array)) {
            throw new Error('Invalid argument');
         }
      }

   });
   return Sbis;
});
