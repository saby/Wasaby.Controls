/* global define */
define('js!WS.Data/Adapter/GenericFormatMixin', [
   'js!WS.Data/Format/FieldsFactory',
   'js!WS.Data/Format/UniversalField',
   'Core/core-instance'
], function (
   FieldsFactory,
   UniversalField,
   CoreInstance
) {
   'use strict';

   /**
    * Миксин для работы с форматом в адаптерах
    * @mixin WS.Data/Adapter/GenericFormatMixin
    * @public
    * @author Мальцев Алексей
    */

   var GenericFormatMixin = /** @lends WS.Data/Adapter/GenericFormatMixin.prototype */{
      /**
       * @member {Object} Сырые данные
       */
      _data: null,

      /**
       * @member {Object} Формат поля, отдаваемый через getSharedFormat()
       */
      _sharedFieldFormat: null,

      /**
       * @member {Object} Мета данные поля, отдаваемого через getSharedFormat()
       */
      _sharedFieldMeta: null,

      /**
       * Конструктор
       * @param {*} data Сырые данные
       */
      constructor: function (data) {
         this._data = data;
      },

      //region Public methods

      getData: function () {
         return this._data;
      },

      getFields: function () {
         throw new Error('Method must be implemented');
      },

      getFormat: function (name) {
         var fields = this._getFieldsFormat(),
            index = fields ? fields.getFieldIndex(name) : -1;
         if (index === -1) {
            throw new ReferenceError(this._moduleName + '::getFormat(): field "' + name + '" does not exist');
         }
         return fields.at(index);
      },

      getSharedFormat: function (name) {
         if (this._sharedFieldFormat === null) {
            this._sharedFieldFormat = new UniversalField();
         }
         var fieldFormat = this._sharedFieldFormat,
            fields = this._getFieldsFormat(),
            index = fields ? fields.getFieldIndex(name) : -1;

         fieldFormat.name = name;
         fieldFormat.type = index === -1 ? 'String' : fields.at(index).getType();
         fieldFormat.meta = index === -1 ? {} : this._getFieldMeta(name);

         return fieldFormat;
      },

      addField: function(format, at) {
         if (!format || !CoreInstance.instanceOfModule(format, 'WS.Data/Format/Field')) {
            throw new TypeError(this._moduleName + '::addField(): format should be an instance of WS.Data/Format/Field');
         }
         var name = format.getName();
         if (!name) {
            throw new Error(this._moduleName + '::addField(): field name is empty');
         }
         var fields = this._getFieldsFormat(),
            index = fields ? fields.getFieldIndex(name) : -1;
         if (index > -1) {
            throw new Error(this._moduleName + '::addField(): field "' + name + '" already exists');
         }
         this._touchData();
         fields.add(format, at);
      },

      removeField: function(name) {
         var fields = this._getFieldsFormat(),
            index = fields ? fields.getFieldIndex(name) : -1;
         if (index === -1) {
            throw new ReferenceError(this._moduleName + '::removeField(): field "' + name + '" does not exist');
         }
         this._touchData();
         fields.removeAt(index);
      },

      removeFieldAt: function(index) {
         this._touchData();
         var fields = this._getFieldsFormat();
         if (fields) {
            fields.removeAt(index);
         }
      },

      //endregion Public methods

      //region Protected methods

      _touchData: function () {
      },

      _isValidData: function () {
         return true;
      },

      _getFieldsFormat: function() {
         throw new Error('Method must be implemented');
      },

      _getFieldMeta: function (name) {
         if (this._sharedFieldMeta === null) {
            this._sharedFieldMeta = {};
         }
         var format = this.getFormat(name),
            meta = this._sharedFieldMeta;

         switch (format.getType()) {
            case 'Real':
            case 'Money':
               meta.precision = format.getPrecision();
               break;
            case 'Enum':
            case 'Flags':
               meta.dictionary = format.getDictionary();
               break;
            case 'Identity':
               meta.separator = format.getSeparator();
               break;
            case 'Array':
               meta.kind = format.getKind();
               break;
         }

         return meta;
      }

      //endregion Protected methods

   };

   return GenericFormatMixin;
});
