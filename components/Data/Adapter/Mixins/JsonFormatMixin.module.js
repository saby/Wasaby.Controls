/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Adapter.JsonFormatMixin', [
   'js!SBIS3.CONTROLS.Data.Format.StringField'
], function (StringField) {
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
            throw new ReferenceError('Field "' + name + '" is not exists');
         }
         if (!this._format.hasOwnProperty(name)) {
            this._format[name] = new StringField({
               name: name
            });
         }
         return this._format[name].clone();
      },

      addField: function(format, at) {
         if (!format || !$ws.helpers.instanceOfModule(format, 'SBIS3.CONTROLS.Data.Format.Field')) {
            throw new TypeError('Format should be an instance of SBIS3.CONTROLS.Data.Format.Field');
         }
         if (!this._format.hasOwnProperty(format.getName())) {
            throw new Error('Field "' + name + '" already exists');
         }
         if (at >= 0) {
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Adapter.JsonRecord::addField()', 'Argument "at" is not supported.');
         }
         this._format[format.getName()] = format;
      },

      removeField: function(name) {
         delete this._format[name];
      },

      removeFieldAt: function() {
         throw new Error('SBIS3.CONTROLS.Data.Adapter.JsonRecord::removeFieldAt() is not supported');
      }

      //endregion Public methods

      //region Protected methods

      //endregion Protected methods

   };

   return JsonFormatMixin;
});
