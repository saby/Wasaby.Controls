/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Adapter.JsonRecord', [
   'js!SBIS3.CONTROLS.Data.Adapter.IRecord',
   'js!SBIS3.CONTROLS.Data.Adapter.GenericFormatMixin',
   'js!SBIS3.CONTROLS.Data.Adapter.JsonFormatMixin',
   'js!SBIS3.CONTROLS.Data.Utils'
], function (IRecord, GenericFormatMixin, JsonFormatMixin, Utils) {
   'use strict';

   /**
    * Адаптер для записи таблицы данных в формате JSON
    * @class SBIS3.CONTROLS.Data.Adapter.JsonRecord
    * @mixes SBIS3.CONTROLS.Data.Adapter.IRecord
    * @mixes SBIS3.CONTROLS.Data.Adapter.GenericFormatMixin
    * @mixes SBIS3.CONTROLS.Data.Adapter.JsonFormatMixin
    * @public
    * @author Мальцев Алексей
    */

   var JsonRecord = $ws.core.extend({}, [IRecord, GenericFormatMixin, JsonFormatMixin], /** @lends SBIS3.CONTROLS.Data.Adapter.JsonRecord.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Adapter.JsonRecord',
      $protected: {
         /**
          * @member {Object.<String, *>} Сырые данные
          */
         _data: null
      },

      $constructor: function (data) {
         if (!(data instanceof Object)) {
            data = {};
         }
         this._data = data;
      },

      //region SBIS3.CONTROLS.Data.Adapter.JsonFormatMixin

      addField: function(format, at) {
         if (!format || !$ws.helpers.instanceOfModule(format, 'SBIS3.CONTROLS.Data.Format.Field')) {
            throw new TypeError(this._moduleName + '::addField(): format should be an instance of SBIS3.CONTROLS.Data.Format.Field');
         }
         var name = format.getName();
         if (this.has(name)) {
            throw new Error(this._moduleName + '::addField(): field "' + name + '" already exists');
         }

         JsonRecord.superclass.addField.call(this, format, at);
         this.set(name, format.getDefaultValue());
      },

      removeField: function(name) {
         JsonRecord.superclass.removeField.call(this, name);
         delete this._data[name];
      },

      //endregion SBIS3.CONTROLS.Data.Adapter.JsonFormatMixin

      //region Public methods

      has: function (name) {
         return this._data.hasOwnProperty(name);
      },

      get: function (name) {
         return this._data[name];
      },

      set: function (name, value) {
         if (!name) {
            throw new ReferenceError(this._moduleName + '::set(): field name is not defined');
         }
         this._data[name] = value;
      },

      getEmpty: function () {
         return {};
      },

      getFields: function () {
         return Object.keys(this._data);
      },

      getInfo: function() {
         Utils.logger.stack(this._moduleName + '::getInfo(): method is deprecated and will be removed in 3.7.4. Use \'getFormat\' instead.');
         return {};
      },

      getKeyField: function () {
         return undefined;
      },

      //endregion Public methods

      //region Protected methods

      _has: function (name) {
         return this.has(name);
      }

      //endregion Protected methods
   });

   return JsonRecord;
});
