/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Adapter.RecordSetRecord', [
   'js!SBIS3.CONTROLS.Data.Adapter.IRecord',
   'js!SBIS3.CONTROLS.Data.Adapter.GenericFormatMixin'
], function (IRecord, GenericFormatMixin) {
   'use strict';

   /**
    * Адаптер для записи таблицы данных в формате записи
    * @class SBIS3.CONTROLS.Data.Adapter.RecordSetRecord
    * @mixes SBIS3.CONTROLS.Data.Adapter.IRecord
    * @mixes SBIS3.CONTROLS.Data.Adapter.GenericFormatMixin
    * @public
    * @author Мальцев Алексей
    */

   var RecordSetRecord = $ws.core.extend({}, [IRecord, GenericFormatMixin], /** @lends SBIS3.CONTROLS.Data.Adapter.RecordSetRecord.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Adapter.RecordSetRecord',
      $protected: {
         /**
          * @member {SBIS3.CONTROLS.Data.Record} Запись
          */
         _data: null
      },

      $constructor: function (data) {
         if (!data || !$ws.helpers.instanceOfModule(data, 'SBIS3.CONTROLS.Data.Record')) {
            throw new TypeError('Argument data should be an instance of SBIS3.CONTROLS.Data.Record');
         }
         this._data = data;
      },

      //region SBIS3.CONTROLS.Data.Adapter.IRecord

      has: function (name) {
         return this._data.has(name);
      },

      get: function (name) {
         return this._data.get(name);
      },

      set: function (name, value) {
         return this._data.set(name, value);
      },

      getEmpty: function () {
         var record = this._data.clone();
         record.setRawData(null);
         return record;
      },

      getFields: function () {
         return this._data.getFields();
      },

      getFormat: function (name) {
         return this._data.getFormat(name);
      },

      addField: function(format, at) {
         this._data.addField(format, at);
      },

      removeField: function(name) {
         this._data.removeField(name);
      },

      removeFieldAt: function(index) {
         this._data.removeFieldAt(index);
      }

      //endregion SBIS3.CONTROLS.Data.Adapter.IRecord

      //region Protected methods

      //endregion Protected methods
   });

   return RecordSetRecord;
});
