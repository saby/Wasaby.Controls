/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Adapter.GenericFormatMixin', [
   'js!SBIS3.CONTROLS.Data.Format.FieldsFactory',
   'js!SBIS3.CONTROLS.Data.Format.UniversalField'
], function (FieldsFactory, UniversalField) {
   'use strict';

   /**
    * Миксин для работы с форматом в адаптерах
    * @mixin SBIS3.CONTROLS.Data.Adapter.GenericFormatMixin
    * @public
    * @author Мальцев Алексей
    */

   var GenericFormatMixin = /** @lends SBIS3.CONTROLS.Data.Adapter.GenericFormatMixin.prototype */{
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
            throw new ReferenceError(this._moduleName + '::getFormat(): field "' + name + '" is not exists');
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
         if (!format || !$ws.helpers.instanceOfModule(format, 'SBIS3.CONTROLS.Data.Format.Field')) {
            throw new TypeError(this._moduleName + '::addField(): format should be an instance of SBIS3.CONTROLS.Data.Format.Field');
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
         fields.add(format, at);
      },

      removeField: function(name) {
         var fields = this._getFieldsFormat(),
            index = fields ? fields.getFieldIndex(name) : -1;
         if (index === -1) {
            throw new ReferenceError(this._moduleName + '::removeField(): field "' + name + '" is not exists');
         }
         fields.removeAt(index);
      },

      removeFieldAt: function(index) {
         var fields = this._getFieldsFormat();
         if (fields) {
            fields.removeAt(index);
         }
      },

      //endregion Public methods

      //region Protected methods

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
