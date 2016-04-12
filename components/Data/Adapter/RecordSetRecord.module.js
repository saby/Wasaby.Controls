/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Adapter.RecordSetRecord', [
   'js!SBIS3.CONTROLS.Data.Entity.Abstract',
   'js!SBIS3.CONTROLS.Data.Adapter.IRecord',
   'js!SBIS3.CONTROLS.Data.Adapter.GenericFormatMixin',
   'js!SBIS3.CONTROLS.Data.Record'
], function (Abstract, IRecord, GenericFormatMixin, Record) {
   'use strict';

   /**
    * Адаптер для записи таблицы данных в формате записи
    * @class SBIS3.CONTROLS.Data.Adapter.RecordSetRecord
    * @extends SBIS3.CONTROLS.Entity.Abstract
    * @mixes SBIS3.CONTROLS.Data.Adapter.IRecord
    * @mixes SBIS3.CONTROLS.Data.Adapter.GenericFormatMixin
    * @public
    * @author Мальцев Алексей
    */

   var RecordSetRecord = Abstract.extend([IRecord, GenericFormatMixin], /** @lends SBIS3.CONTROLS.Data.Adapter.RecordSetRecord.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Adapter.RecordSetRecord',

      /**
       * @member {SBIS3.CONTROLS.Data.Record} Запись
       */
      _data: null,

      constructor: function (data) {
         if (!data) {
            data = new Record();
         }
         if (!$ws.helpers.instanceOfModule(data, 'SBIS3.CONTROLS.Data.Record')) {
            throw new TypeError('Argument data should be an instance of SBIS3.CONTROLS.Data.Record');
         }
         RecordSetRecord.superclass.constructor.call(this, data);
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

      getEmpty: function () {
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
