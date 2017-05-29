/* global define */
define('js!WS.Data/Adapter/RecordSetRecord', [
   'js!WS.Data/Entity/Abstract',
   'js!WS.Data/Adapter/IRecord',
   'js!WS.Data/Adapter/GenericFormatMixin',
   'js!WS.Data/Entity/Record',
   'js!WS.Data/Format/Format',
   'js!WS.Data/Di',
   'js!WS.Data/Utils',
   'Core/core-instance'
], function (
   Abstract,
   IRecord,
   GenericFormatMixin,
   Record,
   Format,
   Di,
   Utils,
   CoreInstance
) {
   'use strict';

   /**
    * Адаптер для записи таблицы данных в формате записи.
    * Работает с данными, представленными в виде экземлпяра {@link WS.Data/Entity/Record}.
    *
    * Создадим адаптер для записи:
    * <pre>
    *    var record = new Record({
    *          rawData: {
    *             id: 1,
    *             title: 'Test'
    *          }
    *       }),
    *       adapter = new RecordSetRecord(record);
    *    adapter.get('title');//'Test'
    * </pre>
    * @class WS.Data/Adapter/RecordSetRecord
    * @extends WS.Data/Entity/Abstract
    * @implements WS.Data/Adapter/IRecord
    * @mixes WS.Data/Adapter/GenericFormatMixin
    * @public
    * @author Мальцев Алексей
    */

   var RecordSetRecord = Abstract.extend([IRecord, GenericFormatMixin], /** @lends WS.Data/Adapter/RecordSetRecord.prototype */{
      _moduleName: 'WS.Data/Adapter/RecordSetRecord',

      /**
       * @member {WS.Data/Entity/Record} Запись
       */
      _data: null,

      /**
       * @member {WS.Data/Collection/RecordSet} Таблица
       */
      _tableData: null,

      /**
       * Конструктор
       * @param {WS.Data/Entity/Record} data Сырые данные
       * @param {WS.Data/Collection/RecordSet} [tableData] Таблица
       */
      constructor: function (data, tableData) {
         if (data && !CoreInstance.instanceOfModule(data, 'WS.Data/Entity/Record')) {
            throw new TypeError('Argument data should be an instance of WS.Data/Entity/Record');
         }
         RecordSetRecord.superclass.constructor.call(this, data);
         GenericFormatMixin.constructor.call(this, data);
         this._tableData = tableData;
      },

      //region WS.Data/Adapter/IRecord

      has: function (name) {
         return this._isValidData() ? this._data.has(name) : false;
      },

      get: function (name) {
         return this._isValidData() ? this._data.get(name) : undefined;
      },

      set: function (name, value) {
         if (!name) {
            throw new ReferenceError(this._moduleName + '::set(): field name is not defined');
         }
         this._touchData();
         if (!this._isValidData()) {
            throw new TypeError('Passed data has invalid format');
         }

         return this._data.set(name, value);
      },

      clear: function () {
         this._touchData();
         if (!this._isValidData()) {
            throw new TypeError('Passed data has invalid format');
         }

         var fields = this.getFields(),
            format = this._data.getFormat(),
            field,
            index;
         if (format) {
            for (var i = 0; i < fields.length; i++) {
               field = fields[i];
               index = format.getFieldIndex(field);
               if (index > -1) {
                  this._data.removeField(field);
               }
            }
         }
      },

      getFields: function () {
         var fields = [];
         if (this._isValidData()) {
            this._data.each(function (name) {
               fields.push(name);
            });
         }
         return fields;
      },

      addField: function(format, at) {
         this._touchData();
         if (!this._isValidData()) {
            throw new TypeError('Passed data has invalid format');
         }

         this._data.addField(format, at);
      },

      removeField: function(name) {
         this._touchData();
         if (!this._isValidData()) {
            throw new TypeError('Passed data has invalid format');
         }

         this._data.removeField(name);
      },

      removeFieldAt: function(index) {
         this._touchData();
         if (!this._isValidData()) {
            throw new TypeError('Passed data has invalid format');
         }

         this._data.removeFieldAt(index);
      },

      //endregion WS.Data/Adapter/IRecord

      //region Protected methods

      _touchData: function () {
         if (!this._data && this._tableData && this._tableData._wsDataEntityFormattableMixin) {//instanceOfMixin WS.Data/Entity/FormattableMixin
            var model = this._tableData.getModel(),
               adapter = this._tableData.getAdapter();

            this._data = Di.resolve(model, {
               adapter: adapter
            });
         }
      },

      _isValidData: function () {
         return this._data instanceof Record;
      },

      _getFieldsFormat: function() {
         return this._isValidData() ? this._data.getFormat() : new Format();
      }

      //endregion Protected methods
   });

   return RecordSetRecord;
});
