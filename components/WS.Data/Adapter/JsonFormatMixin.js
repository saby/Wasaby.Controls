/* global define */
define('js!WS.Data/Adapter/JsonFormatMixin', [
   'js!WS.Data/Format/FieldsFactory',
   'js!WS.Data/Format/UniversalField',
   'js!WS.Data/Utils',
   'Core/core-instance'
], function (
   FieldsFactory,
   UniversalField,
   Utils,
   CoreInstance
) {
   'use strict';

   /**
    * Миксин для работы с JSON-форматом в адаптерах
    * @mixin WS.Data/Adapter/JsonFormatMixin
    * @public
    * @author Мальцев Алексей
    */

   var JsonFormatMixin = /** @lends WS.Data/Adapter/JsonFormatMixin.prototype */{
      /**
       * @member {Object.<String, WS.Data/Format/Field>} Форматы полей
       */
      _format: null,

      //region Public methods

      constructor: function () {
         this._format = {};
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
         if (this._sharedFieldFormat === null) {
            this._sharedFieldFormat = new UniversalField();
         }
         var format = this._sharedFieldFormat;
         format.name = name;
         if (this._format.hasOwnProperty(name)) {
            format.type = this.getFormat(name).getType();
            format.meta = this._getFieldMeta(name);
         } else {
            format.type = 'String';
         }

         return format;
      },

      addField: function(format, at) {
         if (!format || !CoreInstance.instanceOfModule(format, 'WS.Data/Format/Field')) {
            throw new TypeError(this._moduleName + '::addField(): format should be an instance of WS.Data/Format/Field');
         }
         var name = format.getName();
         if (!name) {
            throw new Error(this._moduleName + '::addField(): field name is empty');
         }
         this._touchData();
         this._format[name] = format;
      },

      removeField: function(name) {
         if (!this._has(name)) {
            throw new ReferenceError(this._moduleName + '::removeField(): field "' + name + '" does not exist');
         }
         this._touchData();
         delete this._format[name];
      },

      removeFieldAt: function() {
         throw new Error(this._moduleName + '::removeFieldAt() is not supported');
      },

      //endregion Public methods

      //region Protected methods

      _touchData: function () {
         if (!(this._data instanceof Object)) {
            this._data = {};
         }
      },

      _isValidData: function () {
         return this._data instanceof Object;
      },

      _has: function (name) {
         throw new Error('Method must be implemented');
      },

      _buildFormat: function(name) {
         return FieldsFactory.create({
            name: name,
            type: 'string'
         });
      }

      //endregion Protected methods

   };

   return JsonFormatMixin;
});
