/* global define */
define('js!WS.Data/Adapter/SbisFormatMixin', [
   'js!WS.Data/Format/FieldsFactory',
   'js!WS.Data/Format/UniversalField',
   'js!WS.Data/Format/IdentityField',
   'js!WS.Data/Adapter/SbisFieldType',
   'js!WS.Data/Shim/Map',
   'js!WS.Data/Utils',
   'Core/core-instance'
], function (
   FieldsFactory,
   UniversalField,
   IdentityField,
   FIELD_TYPE,
   Map,
   Utils,
   CoreInstance
) {
   'use strict';

   /**
    * Миксин для работы с СБИС-форматом в адаптерах
    * @mixin WS.Data/Adapter/SbisFormatMixin
    * @public
    * @author Мальцев Алексей
    */

   var
      /**
       * @member {Object} Инвертированный FIELD_TYPE
       */
      FIELD_TYPE_INVERTED = {},
      /**
       * @member {Symbol} Символ для кэширования индексов полей
       */
      fieldIndicesSymbol = typeof Symbol === 'undefined' ? undefined : Symbol('fieldIndices'),
      SbisFormatMixin;

   for (var key in FIELD_TYPE) {
      if (FIELD_TYPE.hasOwnProperty(key)) {
         FIELD_TYPE_INVERTED[FIELD_TYPE[key]] = key;
      }
   }

   SbisFormatMixin = /** @lends WS.Data/Adapter/SbisFormatMixin.prototype */{
      /**
       * @member {Object} Сырые данные
       */
      _data: null,

      /**
       * @member {String} Сигнатура типа
       */
      _type: '',

      /**
       * @member {Map.<String, Number>} Название поля -> индекс в d
       */
      _fieldIndices: null,

      /**
       * @member {Object.<String, WS.Data/Format/Field>} Форматы полей
       */
      _format: null,

      /**
       * @member {Object} Формат поля, отдаваемый через getSharedFormat()
       */
      _sharedFieldFormat: null,

      /**
       * @member {Object} Мета данные поля, отдаваемого через getSharedFormat()
       */
      _sharedFieldMeta: null,

      constructor: function (data) {
         if (data && data._type && data._type !== this._type) {
            throw new TypeError('Wrong data type signature "' + data._type + '". "' + this._type + '" expected.');
         }
         this._data = data;
         this._format = {};
      },

      //region Public methods

      getData: function () {
         return this._data;
      },

      getFields: function () {
         var fields = [];
         if (this._isValidData()) {
            for (var i = 0, count = this._data.s.length; i < count; i++) {
               fields.push(this._data.s[i].n);
            }
         }
         return fields;
      },

      clear: function () {
         this._touchData();
         this._data.d.length = 0;
      },

      getFormat: function (name) {
         if (!this._has(name)) {
            throw new ReferenceError(this._moduleName + '::getFormat(): field "' + name + '" does not exist');
         }
         if (!this._format.hasOwnProperty(name)) {
            this._format[name] = this._buildFormat(name);
         }
         return this._format[name];
      },

      getSharedFormat: function (name) {
         var format = this._sharedFieldFormat || (this._sharedFieldFormat = new UniversalField()),
            index = this._getFieldIndex(name);
         if (index === -1) {
            throw new ReferenceError(this._moduleName + '::getSharedFormat(): field "' + name + '" does not exist');
         }
         format.name = name;
         format.type = this._getFieldType(index);
         format.meta = this._getFieldMeta(index, format.type, true);

         return format;
      },

      addField: function(format, at) {
         if (!format || !CoreInstance.instanceOfModule(format, 'WS.Data/Format/Field')) {
            throw new TypeError(this._moduleName + '::addField(): format should be an instance of WS.Data/Format/Field');
         }
         var name = format.getName();
         if (this._has(name)) {
            throw new ReferenceError(this._moduleName + '::addField(): field "' + name + '" already exists');
         }

         this._touchData();
         if (at === undefined) {
            at = this._data.s.length;
         }
         this._checkFieldIndex(at, true);

         this._format[name] = format;
         this._resetFieldIndices();
         this._data.s.splice(at, 0, this._buildS(format));
         this._buildD(at, format.getDefaultValue());
      },

      removeField: function(name) {
         this._touchData();
         var index = this._getFieldIndex(name);
         if (index === -1) {
            throw new ReferenceError(this._moduleName + '::removeField(): field "' + name + '" does not exist');
         }
         delete this._format[name];
         this._resetFieldIndices();
         this._data.s.splice(index, 1);
         this._removeD(index);
      },

      removeFieldAt: function(index) {
         this._touchData();
         this._checkFieldIndex(index);
         var name = this._data.s[index].n;
         delete this._format[name];
         this._resetFieldIndices();
         this._data.s.splice(index, 1);
         this._removeD(index);
      },

      //endregion Public methods

      //region Protected methods

      _touchData: function () {
         if (!(this._data instanceof Object)) {
            this._data = {};
         }
         if (!(this._data.s instanceof Array)) {
            this._data.s = [];
         }
         if (!(this._data.d instanceof Array)) {
            this._data.d = [];
         }
         this._data._type = this._type;
      },

      _isValidData: function () {
         return this._data && (this._data.s instanceof Array);
      },

      _has: function (name) {
         return this._getFieldIndex(name) >= 0;
      },

      _getFieldIndex: function (name) {
         if (!this._isValidData()) {
            return -1;
         }

         var s = this._data.s,
            fieldIndices = fieldIndicesSymbol ? s[fieldIndicesSymbol] : this._fieldIndices;

         if (!fieldIndicesSymbol && fieldIndices && this._fieldIndices['[{s}]'] !== s) {
            fieldIndices = null;
         }

         if (!fieldIndices) {
            fieldIndices = new Map();
            if (fieldIndicesSymbol) {
               s[fieldIndicesSymbol] = fieldIndices;
            } else {
               this._fieldIndices = fieldIndices;
               this._fieldIndices['[{s}]'] = s;
            }

            for (var i = 0, count = s.length; i < count; i++) {
               fieldIndices.set(s[i].n, i);
            }
         }

         return fieldIndices.has(name) ? fieldIndices.get(name) : -1;
      },

      _resetFieldIndices: function () {
         if (this._isValidData()) {
            if (fieldIndicesSymbol) {
               this._data.s[fieldIndicesSymbol] = null;
            } else {
               this._fieldIndices = null;
            }
         }
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
         var field = this._data.s[index];
         var typeName = field.t;
         if (typeName && (typeName instanceof Object)) {
            typeName = typeName.n;
         }
         return this._getFieldTypeNameByInner(typeName);
      },

      _getFieldTypeNameByInner: function (innerName) {
         return FIELD_TYPE_INVERTED[innerName] || 'string';
      },

      _getFieldInnerTypeNameByOuter: function (outerName) {
         return FIELD_TYPE[(outerName + '').toLowerCase()];
      },

      _getFieldMeta: function (index, type, singleton) {
         if (singleton && this._sharedFieldMeta === null) {
            this._sharedFieldMeta = {};
         }
         var info = this._data.s[index],
            meta = singleton ? this._sharedFieldMeta : {};

         switch (type) {
            case 'real':
            case 'money':
              meta.precision = info.t.p;
               break;
            case 'enum':
            case 'flags':
               meta.dictionary = info.t.s;
               break;
            case 'identity':
               meta.separator = ',';
               break;
            case 'array':
               meta.kind = this._getFieldTypeNameByInner(info.t.t);
               break;
         }

         return meta;
      },

      _checkFormat: function (record, prefix) {
         var self = this._isValidData() ? this._data.s : [],
            outer = record ? record.s || [] : [],
            count = self.length,
            i,
            error;

         if (self === outer) {
            return;
         }

         prefix = prefix || '';

         if (count !== outer.length) {
            error = count + ' columns expected instead of ' + outer.length;
         } else {
            for (i = 0; i < count; i++) {
               error = this._checkFormatColumns(self[i], outer[i] || {}, i);
               if (error) {
                  break;
               }
            }
         }

         if (error) {
            Utils.logger.info(this._moduleName + prefix + ': the formats are not equal (' + error + ')');
         }
      },

      _checkFormatColumns: function (self, outer, index) {
         if (self.n !== outer.n) {
            return 'field with name "' + self.n + '" at position ' + index + ' expected instead of "' + outer.n + '"';
         }

         var selfType = self.t,
            outerType;

         if (selfType && selfType.n) {
            selfType = selfType.n;
         }
         outerType = outer.t;
         if (outerType && outerType.n) {
            outerType = outerType.n;
         }
         if (selfType !== outerType) {
            return 'expected field type for "' + self.n + '" at position ' + index + ' is "' + selfType + '" instead of "' + outerType + '"';
         }
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
         var data = {
            n: format.getName()
         };
         this._buildSType(data, format);

         return data;
      },

      _buildSType: function(data, format) {
         var type = (format.getType() + '').toLowerCase();
         switch (type) {
            case 'enum':
            case 'flags':
               data.t = {
                  n: FIELD_TYPE[type],
                  s: format.getDictionary()
               };
               break;

            case 'array':
               data.t = {
                  n: FIELD_TYPE[type],
                  t: this._getFieldInnerTypeNameByOuter(format.getKind())
               };
               break;

            default:
               data.t = FIELD_TYPE[type];
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

   return SbisFormatMixin;
});
