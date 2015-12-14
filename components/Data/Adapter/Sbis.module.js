/* global define, require, $ws */

var FIELD_TYPE = {
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

define('js!SBIS3.CONTROLS.Data.Adapter.SbisRecord', [
   'js!SBIS3.CONTROLS.Data.Adapter.IRecord'
], function (IRecord) {
   'use strict';

   /**
    * Адаптер для записи таблицы данных в формате СБиС
    * @class SBIS3.CONTROLS.Data.Adapter.SbisRecord
    * @mixes SBIS3.CONTROLS.Data.Adapter.IRecord
    * @author Мальцев Алексей
    */
   var SbisRecord = $ws.core.extend({}, [IRecord], /** @lends SBIS3.CONTROLS.Data.Adapter.SbisRecord.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Adapter.SbisRecord',
      $protected: {
         /**
          * @var {Object} Сырые данные
          */
         _data: undefined,

         /**
          * @var {Object<String, Number>} Название поля -> индекс в d
          */
         _fieldIndexes: undefined
      },

      $constructor: function (data) {
         if (!(data instanceof Object)) {
            data = {};
         }
         if (!(data.s instanceof Array)) {
            data.s = [];
         }
         if (!(data.d instanceof Array)) {
            data.d = [];
         }
         this._data = data;
      },

      has: function (name) {
         return this._getFieldIndex(name) >= 0;
      },

      get: function (name) {
         var index = this._getFieldIndex(name);
         return index >= 0 ? this._data.d[index] : undefined;
      },

      set: function (name, value) {
         var index = this._getFieldIndex(name);
         if (index < 0) {
            throw new Error('Property is not defined');
         }
         this._data.d[index] = value;
      },

      getFields: function () {
         var fields = [];
         for (var i = 0, count = this._data.s.length; i < count; i++) {
            fields.push(this._data.s[i].n);
         }
         return fields;
      },

      getEmpty: function () {
         return {
            d: [],
            s: $ws.core.clone(this._data.s)
         };
      },

      getInfo: function (name) {
         var index = this._getFieldIndex(name),
            meta = index >= 0 ? this._data.s[index] : undefined,
            fieldData = {meta: undefined, type: undefined};
         if (meta) {
            var type = this._getType(meta, this._data.d[index]);
            fieldData.meta = type.meta;
            fieldData.type = type.name;
         }
         return fieldData;
      },

      getKeyField: function () {
         var s = this._data.s,
            index;
         for (var i = 0, l = s.length; i < l; i++) {
            if (s[i].n[0] === '@') {
               index = i;
               break;
            }
         }
         if (index === undefined && s.length) {
            index = 0;
         }

         return index === undefined ? undefined : s[index].n;
      },

      getData: function () {
         return this._data;
      },

      _getType: function (meta, value, key) {
         key = key || 't';
         var typeSbis = meta[key],
            type;
         if (typeof typeSbis === 'object') {
            return this._getType(typeSbis, value, 'n');
         }
         for (var fieldType in FIELD_TYPE) {
            if (typeSbis === FIELD_TYPE[fieldType]) {
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
                        t: FIELD_TYPE.Boolean,
                        n: pairs.values[pI]
                     });
                     fData.push(value[pI]);
                  }
                  return {
                     d: fData,
                     s: st
                  };
               };
               var Adapter = require('js!SBIS3.CONTROLS.Data.Adapter.Sbis');
               meta.adapter = new Adapter();
               break;
         }
         return meta;
      },

      _getFieldIndex: function (name) {
         if (this._fieldIndexes === undefined) {
            this._fieldIndexes = {};
            for (var i = 0, count = this._data.s.length; i < count; i++) {
               this._fieldIndexes[this._data.s[i].n] = i;
            }
         }
         return this._fieldIndexes.hasOwnProperty(name) ? this._fieldIndexes[name] : -1;
      }
   });

   return SbisRecord;
});

define('js!SBIS3.CONTROLS.Data.Adapter.SbisTable', [
   'js!SBIS3.CONTROLS.Data.Adapter.ITable'
], function (ITable) {
   'use strict';

   /**
    * Адаптер для таблицы данных в формате СБиС
    * @class SBIS3.CONTROLS.Data.Adapter.SbisTable
    * @mixes SBIS3.CONTROLS.Data.Adapter.ITable
    * @author Мальцев Алексей
    */
   var SbisTable = $ws.core.extend({}, [ITable], /** @lends SBIS3.CONTROLS.Data.Adapter.SbisTable.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Adapter.SbisTable',
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
         if (!(data.s instanceof Array)) {
            data.s = [];
         }
         if (!(data.d instanceof Array)) {
            data.d = [];
         }
         this._data = data;
      },

      getEmpty: function () {
         return {
            d: [],
            s: $ws.core.clone(this._data.s || [])
         };
      },

      getCount: function () {
         return this._data.d.length;
      },

      add: function (record, at) {
         if (!this._data.s.length) {
            this._data.s = record.s || [];
         }
         if (at === undefined) {
            this._data.d.push(record.d);
         } else {
            this._checkPosition(at);
            this._data.d.splice(at, 0, record.d);
         }
      },

      at: function (index) {
         return this._data.d[index] ? {
            d: this._data.d[index],
            s: this._data.s
         } : undefined;
      },

      merge: function(one, two){
         $ws.core.merge(
            this._data.d[one],
            this._data.d[two]
         );
         this.remove(two);
      },

      copy: function(index){
         this._checkPosition(index);
         var source = this._data.d[index],
            clone = $ws.core.clone(source);
         this._data.d.splice(index, 0, clone);
      },

      remove: function (at) {
         this._checkPosition(at);
         this._data.d.splice(at, 1);
      },

      replace: function (record, at) {
         this._checkPosition(at);
         if (!this._data.s.length) {
            this._data.s = record.s || [];
         }
         this._data.d[at] = record.d;
      },

      move: function(source, target) {
         if (target === source) {
            return;
         }
         var removed = this._data.d.splice(source, 1);
         this._data.d.splice(target, 0, removed.shift());
      },

      getData: function () {
         return this._data;
      },

      _checkPosition: function (at) {
         if (at < 0 || at > this._data.d.length) {
            throw new Error('Out of bounds');
         }
      }
   });

   return SbisTable;
});

define('js!SBIS3.CONTROLS.Data.Adapter.Sbis', [
   'js!SBIS3.CONTROLS.Data.Adapter.Abstract',
   'js!SBIS3.CONTROLS.Data.Adapter.SbisTable',
   'js!SBIS3.CONTROLS.Data.Adapter.SbisRecord',
   'js!SBIS3.CONTROLS.Data.Source.DataSet',
   'js!SBIS3.CONTROLS.Data.Model'
], function (Abstract, SbisTable, SbisRecord) {
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

      forTable: function (data) {
         return new SbisTable(data);
      },

      forRecord: function (data) {
         return new SbisRecord(data);
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

   Sbis.FIELD_TYPE = FIELD_TYPE;

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
            if (arr._type === 'recordset') {
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
