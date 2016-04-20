/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Adapter.RecordSetRecord', [
   'js!SBIS3.CONTROLS.Data.Adapter.IRecord',
   'js!SBIS3.CONTROLS.Data.Adapter.GenericFormatMixin',
   'js!SBIS3.CONTROLS.Data.Record',
   'js!SBIS3.CONTROLS.Data.Utils'
], function (IRecord, GenericFormatMixin, Record, Utils) {
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
         if (!data) {
            data = new Record();
         }
         if (!$ws.helpers.instanceOfModule(data, 'SBIS3.CONTROLS.Data.Record')) {
            throw new TypeError('Argument data should be an instance of SBIS3.CONTROLS.Data.Record');
         }
         this._data = data;
         this._format = data.getFormat();
      },

      //region SBIS3.CONTROLS.Data.Adapter.IRecord

      has: function (name) {
         return this._data.has(name);
      },

      get: function (name) {
         return this._data.get(name);
      },

      set: function (name, value) {
         if (!name) {
            throw new ReferenceError(this._moduleName + '::set(): field name is not defined');
         }
         return this._data.set(name, value);
      },

      clear: function () {
         var fields = [];
         this._data.each(function(field) {
            fields.push(field);
         });
         for (var i = 0; i < fields.length; i++) {
            this._data.removeField(fields[i]);
         }
      },

      getEmpty: function () {
         Utils.logger.stack(this._moduleName + '::getEmpty(): method is deprecated and will be removed in 3.7.4. Use clear() instead.');
         var record = this._data.clone();
         record.setRawData(null);
         return record;
      },

      addField: function(format, at) {
         this._data.addField(format, at);
         this._format.add(format, at);
      },

      removeField: function(name) {
         this._data.removeField(name);
         this._format.removeField(name);
      },

      removeFieldAt: function(index) {
         this._data.removeFieldAt(index);
         this._format.removeAt(index);
      }

      //endregion SBIS3.CONTROLS.Data.Adapter.IRecord

      //region Protected methods

      //endregion Protected methods
   });

   return RecordSetRecord;
});
