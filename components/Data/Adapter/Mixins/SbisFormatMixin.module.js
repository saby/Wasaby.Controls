/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Adapter.SbisFormatMixin', [
   'js!SBIS3.CONTROLS.Data.Format.FieldsFactory',
   'js!SBIS3.CONTROLS.Data.Format.UniversalField',
   'js!SBIS3.CONTROLS.Data.Utils',
   'js!SBIS3.CONTROLS.Data.Adapter.FieldType'
], function (FieldsFactory, UniversalField, Utils, FIELD_TYPE) {
   'use strict';

   /**
    * Миксин для работы с СБИС-форматом в адаптерах
    * @mixin SBIS3.CONTROLS.Data.Adapter.SbisFormatMixin
    * @public
    * @author Мальцев Алексей
    */

   var SbisFormatMixin = /** @lends SBIS3.CONTROLS.Data.Adapter.SbisFormatMixin.prototype */{
      $protected: {
         /**
          * @member {Object} Сырые данные
          */
         _data: null,

         /**
          * @member {Object<String, Number>} Название поля -> индекс в d
          */
         _fieldIndexes: null,

         /**
          * @member {Object.<String, SBIS3.CONTROLS.Data.Format.Field>} Форматы полей
          */
         _format: {},

         /**
          * @member {Object} Формат поля, отдаваемый через getSharedFormat()
          */
         _sharedFieldFormat: null,

         /**
          * @member {Object} Мета данные поля, отдаваемого через getSharedFormat()
          */
         _sharedFieldMeta: null
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

      //region Public methods

      getData: function () {
         return this._data;
      },

      getFields: function () {
         var fields = [];
         for (var i = 0, count = this._data.s.length; i < count; i++) {
            fields.push(this._data.s[i].n);
         }
         return fields;
      },

      clear: function () {
         this._data.d.length = 0;
         this._data.s.length = 0;
      },

      getEmpty: function () {
         Utils.logger.stack(this._moduleName + '::getEmpty(): method is deprecated and will be removed in 3.7.4. Use clear() instead.');
         return {
            d: [],
            s: $ws.core.clone(this._data.s || [])
         };
      },

      getFormat: function (name) {
         if (!this._has(name)) {
            throw new ReferenceError(this._moduleName + '::getFormat(): field "' + name + '" is not exists');
         }
         if (!this._format.hasOwnProperty(name)) {
            this._format[name] = this._buildFormat(name);
         }
         return this._format[name].clone();
      },

      getSharedFormat: function (name) {
         if (this._sharedFieldFormat === null) {
            this._sharedFieldFormat = new UniversalField();
         }
         var format = this._sharedFieldFormat,
            index = this._getFieldIndex(name);
         if (index === -1) {
            throw new ReferenceError(this._moduleName + '::getSharedFormat(): field "' + name + '" is not exists');
         }
         format.name = name;
         format.type = this._getFieldType(index);
         format.meta = this._getFieldMeta(index, format.type, true);

         return format;
      },

      addField: function(format, at) {
         if (!format || !$ws.helpers.instanceOfModule(format, 'SBIS3.CONTROLS.Data.Format.Field')) {
            throw new TypeError(this._moduleName + '::addField(): format should be an instance of SBIS3.CONTROLS.Data.Format.Field');
         }
         var name = format.getName();
         if (this._has(name)) {
            throw new Error(this._moduleName + '::addField(): field "' + name + '" already exists');
         }

         if (at === undefined) {
            at = this._data.s.length;
         }
         this._checkFieldIndex(at, true);

         this._format[name] = format;
         this._resetFieldIndexes();
         this._data.s.splice(at, 0, this._buildS(format));
         this._buildD(at, format.getDefaultValue());
      },

      removeField: function(name) {
         var index = this._getFieldIndex(name);
         if (index === -1) {
            throw new ReferenceError(this._moduleName + '::removeField(): field "' + name + '" is not exists');
         }
         delete this._format[name];
         this._resetFieldIndexes();
         this._data.s.splice(index, 1);
         this._removeD(index);
      },

      removeFieldAt: function(index) {
         this._checkFieldIndex(index);
         var name = this._data.s[index].n;
         delete this._format[name];
         this._resetFieldIndexes();
         this._data.s.splice(index, 1);
         this._removeD(index);
      },

      //endregion Public methods

      //region Protected methods

      _has: function (name) {
         return this._getFieldIndex(name) >= 0;
      },

      _getFieldIndex: function (name) {
         if (this._fieldIndexes === null) {
            this._fieldIndexes = {};
            for (var i = 0, count = this._data.s.length; i < count; i++) {
               this._fieldIndexes[this._data.s[i].n] = i;
            }
         }
         return this._fieldIndexes.hasOwnProperty(name) ? this._fieldIndexes[name] : -1;
      },
      
      _resetFieldIndexes: function (name) {
         this._fieldIndexes = null;
      },

      _checkFieldIndex: function(index, appendMode) {
         var max = this._data.s.length - 1;
         if (appendMode) {
            max++;
         }
         if (!(index >= 0 && index <= max)) {
            throw new RangeError(this._moduleName + ': field index ' + index + ' is out of bounds.');
         }
      },

      _getFieldType: function (index) {
         var typeName = this._data.s[index].t;
         if (typeName && typeof typeName === 'object') {
            typeName = typeName.n;
         }
         return this._getFieldTypeNameByInner(typeName);
      },

      _getFieldTypeNameByInner: function (innerName) {
         for (var typeCode in FIELD_TYPE) {
            if (FIELD_TYPE.hasOwnProperty(typeCode) && FIELD_TYPE[typeCode] === innerName) {
               return typeCode;
            }
         }
         return 'String';
      },

      _getFieldInnerTypeNameByOuter: function (outerName) {
         return NORMALIZED_FIELD_TYPE[(outerName + '').toLowerCase()];
      },

      _getFieldMeta: function (index, type, singleton) {
         if (singleton && this._sharedFieldMeta === null) {
            this._sharedFieldMeta = {};
         }
         var info = this._data.s[index],
            meta = singleton ? this._sharedFieldMeta : {};

         switch (type) {
            case 'Real':
            case 'Money':
              meta.precision = info.t.p;
               break;
            case 'Enum':
            case 'Flags':
               meta.dictionary = info.t.s;
               break;
            case 'Identity':
               meta.separator = ',';
               break;
            case 'Array':
               meta.kind = this._getFieldTypeNameByInner(info.t.t);
               break;
         }

         return meta;
      },

      _buildFormatDeclaration: function(name) {
         var index = this._getFieldIndex(name),
            type = this._getFieldType(index),
            declaration = this._getFieldMeta(index, type);
         declaration.name = name;
         declaration.type = type;
         return declaration;
      },

      _buildFormat: function(name) {
         return FieldsFactory.create(
            this._buildFormatDeclaration(name)
         );
      },

      _buildS: function(format) {
         if(format.getType() === 'Hierarchy') {
            return {
               n: format.getName(),
               t: this._getFieldInnerTypeNameByOuter(format.getKind()),
               s: FIELD_TYPE[format.getType()]
            };
         }
         return {
            n: format.getName(),
            t: this._buildSType(format, format.getType())
         };
      },

      _buildSType: function(format, type) {
         switch (type) {
            case 'Real':
            case 'Money':
               return {
                  n: FIELD_TYPE[type],
                  p: format.getPrecision()
               };
            case 'Enum':
            case 'Flags':
               return {
                  n: FIELD_TYPE[type],
                  s: format.getDictionary()
               };
            case 'Array':
               return {
                  n: FIELD_TYPE[type],
                  t: this._getFieldInnerTypeNameByOuter(format.getKind())
               };
            case 'Hierarchy':
               return {

               };
            default:
               return FIELD_TYPE[type];
         }
      },

      _buildD: function(at, value) {
         throw new Error('Method must be implemented');
      },

      _removeD: function(at) {
         throw new Error('Method must be implemented');
      }

      //endregion Protected methods

   };

   /**
    * @member {Object.<String, String>} Нормализованный набор типов полей
    */
   var NORMALIZED_FIELD_TYPE = {};
   for (var typeName in FIELD_TYPE) {
      if (FIELD_TYPE.hasOwnProperty(typeName)) {
         NORMALIZED_FIELD_TYPE[typeName.toLowerCase()] = FIELD_TYPE[typeName];
      }
   }

   return SbisFormatMixin;
});
