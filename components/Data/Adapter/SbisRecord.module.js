define('js!SBIS3.CONTROLS.Data.Adapter.SbisRecord', [
   'js!SBIS3.CONTROLS.Data.Adapter.IRecord',
   'js!SBIS3.CONTROLS.Data.Adapter.FieldType'
], function (IRecord, FIELD_TYPE) {
   'use strict';

   /**
    * Адаптер для записи таблицы данных в формате СБиС
    * @class SBIS3.CONTROLS.Data.Adapter.SbisRecord
    * @mixes SBIS3.CONTROLS.Data.Adapter.IRecord
    * @public
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
               meta.source = [];
               for (var index in  meta.s){
                  if(meta.s.hasOwnProperty(index))
                     meta.source[index] = meta.s[index];
               }
               break;
            case 'Money':
               meta.precision = meta.p;
               break;
            case 'Flags':
               meta.makeData = function (value) {
                  value = value || {};
                  var s = meta.s,
                     res = {};
                  for (var index in s) {//s - объект из бл вида {0:key, 1:key1 ...}
                     if (s.hasOwnProperty(index)) {
                        res[s[index]] = value[index];
                     }
                  }
                  return res;
               };
               break;
            case 'Array':
               var type = this._getType(meta);
               meta.elementsType = type.name;
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