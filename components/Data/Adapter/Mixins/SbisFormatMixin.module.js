/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Adapter.SbisFormatMixin', [
   'js!SBIS3.CONTROLS.Data.Format.FieldsFactory',
   'js!SBIS3.CONTROLS.Data.Adapter.FieldType'
], function (FieldsFactory, FIELD_TYPE) {
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
         _format: {}
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

      getEmpty: function () {
         return {
            d: [],
            s: $ws.core.clone(this._data.s || [])
         };
      },

      getFormat: function (name) {
         if (!this.has(name)) {
            throw new ReferenceError(this._moduleName + '::getFormat(): field "' + name + '" is not exists');
         }
         if (!this._format.hasOwnProperty(name)) {
            this._format[name] = this._buildFormat(name);
         }
         return this._format[name].clone();
      },

      addField: function(format, at) {
         if (!format || !$ws.helpers.instanceOfModule(format, 'SBIS3.CONTROLS.Data.Format.Field')) {
            throw new TypeError(this._moduleName + '::addField(): format should be an instance of SBIS3.CONTROLS.Data.Format.Field');
         }
         var name = format.getName();
         if (this.has(name)) {
            throw new Error(this._moduleName + '::addField(): field "' + name + '" already exists');
         }

         if (at === undefined) {
            at = this._data.s.length;
         }
         this._checkFieldIndex(at, true);

         this._format[name] = format;
         this._fieldIndexes = null;
         this._data.s.splice(at, 0, this._buildS(format));
         this._data.d.splice(
            at,
            0,
            this._buildD(format.getDefaultValue())
         );
      },

      removeField: function(name) {
         var index = this._getFieldIndex(name);
         if (index === -1) {
            throw new ReferenceError(this._moduleName + '::removeField(): field "' + name + '" is not exists');
         }
         delete this._format[name];
         this._fieldIndexes = null;
         this._data.s.splice(index, 1);
         this._data.d.splice(index, 1);
      },

      removeFieldAt: function(index) {
         this._checkFieldIndex(index);
         var name = this._data.s[index].n;
         delete this._format[name];
         this._fieldIndexes = null;
         this._data.s.splice(index, 1);
         this._data.d.splice(index, 1);
      },

      //endregion Public methods

      //region Protected methods

      _getFieldIndex: function (name) {
         if (this._fieldIndexes === null) {
            this._fieldIndexes = {};
            for (var i = 0, count = this._data.s.length; i < count; i++) {
               this._fieldIndexes[this._data.s[i].n] = i;
            }
         }
         return this._fieldIndexes.hasOwnProperty(name) ? this._fieldIndexes[name] : -1;
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
         for (var typeCode in FIELD_TYPE) {
            if (FIELD_TYPE.hasOwnProperty(typeCode) && FIELD_TYPE[typeCode] === typeName) {
               return typeCode;
            }
         }
         return undfined;
      },

      _getFieldMeta: function (index, type) {
         var info =this._data.s[index],
            meta = {};
         switch (type) {
            case 'Money':
               meta.precision = info.p;
               break;
         }
         return meta;
      },
      
      _buildFormat: function(name) {
         var index = this._getFieldIndex(name),
            type = this._getFieldType(index),
            declaration = this._getFieldMeta(index, type);
         declaration.name = name;
         declaration.type = type;
         return FieldsFactory.create(declaration);
      },

      _buildS: function(format) {
         return {
            n: format.getName()
         };
      },

      _buildD: function(value) {
         throw new Error('Method must be implemented');
      }

      //endregion Protected methods

   };

   return SbisFormatMixin;
});
