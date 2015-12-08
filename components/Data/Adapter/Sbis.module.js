/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Adapter.Sbis', [
   'js!SBIS3.CONTROLS.Data.Adapter.Abstract',
   'js!SBIS3.CONTROLS.Data.Adapter.ITable',
   'js!SBIS3.CONTROLS.Data.Adapter.IRecord',
   'js!SBIS3.CONTROLS.Data.Source.DataSet',
   'js!SBIS3.CONTROLS.Data.Model'
], function (Abstract, ITable, IRecord) {
   'use strict';
   /**
    * Адаптер для данных в формате СБиС
    * @class SBIS3.CONTROLS.Data.Adapter.Sbis
    * @extends SBIS3.CONTROLS.Data.Adapter.Abstract
    * @public
    * @author Мальцев Алексей
    */

   var Sbis = Abstract.extend(/** @lends SBIS3.CONTROLS.Data.Adapter.Sbis.prototype */{
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
      },

      getKeyField: function (data) {
         if (!data) {
            return undefined;
         }
         var s = data.s,
            index;
         if (s) {
            for (var i = 0, l = s.length; i < l; i++) {
               if (s[i].n[0] === '@') {
                  index = i;
                  break;
               }
            }
            if (index === undefined && s.length) {
               index = 0;
            }
         }

         return index === undefined ? undefined : s[index].n;
      },

      /**
       * Сериализует данные
       * @param {*} data
       * @returns {Object}
       * @static
       */
      serialize: function (data) {
         return serializer.serialize(data);
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

      merge: function(data, one, two){
         $ws.core.merge(data.d[one], data.d[two]);
         this.remove(data, two);
      },

      copy: function(data, index){
         this._checkPosition(data, index);
         var source = data.d[index],
            clone = $ws.core.clone(source);
         data.d.splice(index, 0, clone);
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

      move: function(data, source, target) {
         this._checkData(data);
         if (target === source) {
            return;
         }
         var removed = data.d.splice(source, 1);
         data.d.splice(target, 0, removed.shift());
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

      set: function (data, name, value) {
         this._checkData(data);
         var index = this._getFieldIndex(data, name);
         if (index < 0) {
            throw new Error('Property is not defined');
         }
         data.d[index] = value;
         return data;
      },

      getFields: function (data) {
         var fields = [];
         if (data && data.s) {
            for (var i = 0, count = data.s.length; i < count; i++) {
               fields.push(data.s[i].n);
            }
         }
         return fields;
      },

      getEmpty: function (data) {
         return {
            d: [],
            s: data ? $ws.core.clone(data.s) : []
         };
      },

      getFullFieldData: function (data, name) {
         var index = this._getFieldIndex(data, name),
            meta = index >= 0 ? data.s[index] : undefined,
            fieldData = {meta: undefined, type: undefined};
         if (meta) {
            var type = this._getType(meta, data.d[index]);
            fieldData.meta = type.meta;
            fieldData.type = type.name;
         }
         return fieldData;
      },

      _getType: function (meta, value, key) {
         key = key || 't';
         var typeSbis = meta[key],
            type;
         if (typeof typeSbis === 'object') {
            return this._getType(typeSbis, value, 'n');
         }
         for (var fieldType in Sbis.FIELD_TYPE) {
            if (typeSbis === Sbis.FIELD_TYPE[fieldType]) {
               type = fieldType;
               break;
            }
         }
         var prepareMeta = this._prepareMetaInfo(type, $ws.core.clone(meta), value);
         return {
            name: type,
            meta: prepareMeta
         };
      },

      _prepareMetaInfo: function (type, meta, value) {
         switch (type) {
            case 'Identity':
               meta.separator = ',';
               meta.isArray = value instanceof Array;
               break;
            case 'Enum':
               meta.source = meta.s;
               break;
            case 'Money':
               meta.precision = meta.p;
               break;
            case 'Flags':
               meta.makeData = function (value) {
                  value = value || {};
                  var st = [],
                     pairs = Object.sortedPairs(meta.s),
                     fData = [];
                  for (var pI = 0, pL = pairs.keys.length; pI < pL; pI++) {
                     st.push({
                        t: Sbis.FIELD_TYPE.Boolean,
                        n: pairs.values[pI]
                     });
                     fData.push(value[pI]);
                  }
                  return {
                     d: fData,
                     s: st
                  };
               };
               meta.adapter = new Sbis();
               break;
         }
         return meta;
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

   var serializer = (function() {
      var
         serialize = function(data) {
            if (data instanceof Array) {
               return serializeArray(data);
            } else if (data instanceof Object) {
               return serializeObject(data);
            } else {
               return data;
            }
         },

         serializeArray = function (arr) {
            var i,
               count,
               result;
            if (arr._type == 'recordset') {
               result = {
                  s: [],
                  d: []
               };
               var mapper = function(val) {
                  return arr[i][val.n];
               };
               for (i = 0, count = arr.length; i < count; i++) {
                  if (i === 0) {
                     result.s = makeS(arr[i]);
                  }
                  result.d.push($ws.helpers.map(result.s, mapper));
               }
            } else {
               result = $ws.helpers.map(arr, function(item) {
                  return serialize(item);
               });
            }

            return result;
         },

         serializeObject = function (obj) {
            if ($ws.helpers.instanceOfModule(obj, 'SBIS3.CONTROLS.Data.Model')) {
               return $ws.core.merge({
                  _type: 'record'
               }, obj.getRawData() || {});
            } else if ($ws.helpers.instanceOfModule(obj, 'SBIS3.CONTROLS.Data.Source.DataSet')) {
               return $ws.core.merge({
                  _type: 'recordset'
               }, obj.getRawData() || {});
            } else if ($ws.helpers.instanceOfModule(obj, 'SBIS3.CONTROLS.Record')) {
               return $ws.core.merge({
                  _type: 'record'
               }, obj.getRaw() || {});
            } else if ($ws.helpers.instanceOfModule(obj, 'SBIS3.CONTROLS.DataSet')) {
               return $ws.core.merge({
                  _type: 'recordset'
               }, obj.getRawData() || {});
            } else if (obj instanceof Date) {
               return obj.toSQL();
            } else {
               var result = {
                  d: [],
                  s: []
               };
               result.s = makeS(obj);
               result.d = makeD(obj, result.s);
               return result;
            }
         },

         getValueType = function (val) {
            switch (typeof val) {
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
                  if (val === null) {
                     return Sbis.FIELD_TYPE.String;
                  } else if ($ws.helpers.instanceOfModule(val, 'SBIS3.CONTROLS.Data.Model') || $ws.helpers.instanceOfModule(val, 'SBIS3.CONTROLS.Record')) {
                     return Sbis.FIELD_TYPE.Model;
                  } else if ($ws.helpers.instanceOfModule(val, 'SBIS3.CONTROLS.Data.Source.DataSet') || $ws.helpers.instanceOfModule(val, 'SBIS3.CONTROLS.DataSet')) {
                     return Sbis.FIELD_TYPE.DataSet;
                  } else if (val instanceof Date) {
                     return Sbis.FIELD_TYPE.DateTime;
                  } else if (val instanceof Array) {
                     return {
                        n: Sbis.FIELD_TYPE.Array,
                        t: getValueType(val[0])
                     };
                  } else {
                     return Sbis.FIELD_TYPE.Model;
                  }
                  break;
            }
            return Sbis.FIELD_TYPE.String;
         },

         makeS = function (obj) {
            var s = [];
            for (var key in obj) {
               if (!obj.hasOwnProperty(key)) {
                  continue;
               }
               s.push({
                  n: key,
                  t: getValueType(obj[key])
               });
            }
            return s;
         },

         makeD = function (obj, s) {
            var d = [];
            for (var i = 0, count = s.length; i < count; i++) {
               d.push(serialize(obj[s[i].n]));
            }
            return d;
         };

      return {
         serialize: serialize
      };
   })();

   return Sbis;
});
