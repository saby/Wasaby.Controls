/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Adapter.JsonFormatMixin', [
   'js!SBIS3.CONTROLS.Data.Format.FieldsFactory',
   'js!SBIS3.CONTROLS.Data.Format.UniversalField'
], function (FieldsFactory, UniversalField) {
   'use strict';

   /**
    * Миксин для работы с JSON-форматом в адаптерах
    * @mixin SBIS3.CONTROLS.Data.Adapter.JsonFormatMixin
    * @public
    * @author Мальцев Алексей
    */

   var JsonFormatMixin = /** @lends SBIS3.CONTROLS.Data.Adapter.JsonFormatMixin.prototype */{
      $protected: {
         /**
          * @member {Object.<String, SBIS3.CONTROLS.Data.Format.Field>} Форматы полей
          */
         _format: {}
      },

      //region Public methods

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
         if (!format || !$ws.helpers.instanceOfModule(format, 'SBIS3.CONTROLS.Data.Format.Field')) {
            throw new TypeError(this._moduleName + '::addField(): format should be an instance of SBIS3.CONTROLS.Data.Format.Field');
         }
         var name = format.getName();
         if (!name) {
            throw new Error(this._moduleName + '::addField(): field name is empty');
         }
         if (this._has(name)) {
            throw new Error(this._moduleName + '::addField(): field "' + name + '" already exists');
         }
         if (at >= 0) {
            $ws.single.ioc.resolve('ILogger').info(this._moduleName + '::addField()', 'Argument "at" is not supported and will be ignored.');
         }
         this._format[name] = format;
      },

      removeField: function(name) {
         if (!this._has(name)) {
            throw new ReferenceError(this._moduleName + '::removeField(): field "' + name + '" is not exists');
         }
         delete this._format[name];
      },

      removeFieldAt: function() {
         throw new Error(this._moduleName + '::removeFieldAt() is not supported');
      },

      //endregion Public methods

      //region Protected methods

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
