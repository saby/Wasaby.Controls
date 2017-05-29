/* global define */
define('js!WS.Data/Adapter/JsonRecord', [
   'js!WS.Data/Entity/Abstract',
   'js!WS.Data/Adapter/IRecord',
   'js!WS.Data/Adapter/GenericFormatMixin',
   'js!WS.Data/Adapter/JsonFormatMixin',
   'js!WS.Data/Utils',
   'Core/core-instance'
], function (
   Abstract,
   IRecord,
   GenericFormatMixin,
   JsonFormatMixin,
   Utils,
   CoreInstance
) {
   'use strict';

   /**
    * Адаптер для записи таблицы данных в формате JSON
    * Работает с данными, представленными в виде объекта (Object.<String, *>).
    *
    * Создадим адаптер для записи:
    * <pre>
    *    var adapter = new JsonRecord({
    *       id: 1,
    *       title: 'Test'
    *    });
    *    adapter.get('title');//'Test'
    * </pre>
    * @class WS.Data/Adapter/JsonRecord
    * @extends WS.Data/Entity/Abstract
    * @implements WS.Data/Adapter/IRecord
    * @mixes WS.Data/Adapter/GenericFormatMixin
    * @mixes WS.Data/Adapter/JsonFormatMixin
    * @public
    * @author Мальцев Алексей
    */

   var JsonRecord = Abstract.extend([IRecord, GenericFormatMixin, JsonFormatMixin], /** @lends WS.Data/Adapter/JsonRecord.prototype */{
      _moduleName: 'WS.Data/Adapter/JsonRecord',
      /**
       * @member {Object.<String, *>} Сырые данные
       */
      _data: null,

      /**
       * Конструктор
       * @param {*} data Сырые данные
       */
      constructor: function (data) {
         JsonRecord.superclass.constructor.call(this, data);
         GenericFormatMixin.constructor.call(this, data);
         JsonFormatMixin.constructor.call(this, data);
      },

      //region WS.Data/Adapter/JsonFormatMixin

      addField: function(format, at) {
         if (!format || !CoreInstance.instanceOfModule(format, 'WS.Data/Format/Field')) {
            throw new TypeError(this._moduleName + '::addField(): format should be an instance of WS.Data/Format/Field');
         }
         var name = format.getName();
         if (this.has(name)) {
            throw new Error(this._moduleName + '::addField(): field "' + name + '" already exists');
         }

         JsonFormatMixin.addField.call(this, format, at);
         this.set(name, format.getDefaultValue());
      },

      removeField: function(name) {
         JsonFormatMixin.removeField.call(this, name);
         delete this._data[name];
      },

      //endregion WS.Data/Adapter/JsonFormatMixin

      //region Public methods

      has: function (name) {
         return this._isValidData() ? this._data.hasOwnProperty(name) : false;
      },

      get: function (name) {
         return this._isValidData() ? this._data[name] : undefined;
      },

      set: function (name, value) {
         if (!name) {
            throw new ReferenceError(this._moduleName + '::set(): field name is not defined');
         }
         this._touchData();
         this._data[name] = value;
      },

      clear: function () {
         this._touchData();
         var keys = Object.keys(this._data),
            count = keys.length,
            i;
         for (i = 0; i < count; i++) {
            delete this._data[keys[i]];
         }
      },

      getFields: function () {
         return this._isValidData() ? Object.keys(this._data) : [];
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
