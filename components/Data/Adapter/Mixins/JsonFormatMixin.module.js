/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Adapter.JsonFormatMixin', [
   'js!SBIS3.CONTROLS.Data.Format.FieldsFactory'
], function (FieldsFactory) {
   'use strict';

   /**
    * Миксин для работы с СБИС-форматом в адаптерах
    * @mixin SBIS3.CONTROLS.Data.Adapter.JsonFormatMixin
    * @public
    * @author Мальцев Алексей
    */

   var JsonFormatMixin = /** @lends SBIS3.CONTROLS.Data.Adapter.JsonFormatMixin.prototype */{
      $protected: {
         /**
          * @member {Object} Сырые данные
          */
         _data: null,

         /**
          * @member {Object.<String, SBIS3.CONTROLS.Data.Format.Field>} Форматы полей
          */
         _format: {}
      },

      //region Public methods

      getData: function () {
         return this._data;
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
         if (this._format.hasOwnProperty(name)) {
            throw new Error(this._moduleName + '::addField(): field "' + name + '" already exists');
         }
         if (at >= 0) {
            $ws.single.ioc.resolve('ILogger').log(this._moduleName + '::addField()', 'Argument "at" is not supported and will be ignored.');
         }
         this._format[name] = format;
      },

      removeField: function(name) {
         delete this._format[name];
      },

      removeFieldAt: function() {
         throw new Error(this._moduleName + '::removeFieldAt() is not supported');
      },

      //endregion Public methods

      //region Protected methods
      
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
