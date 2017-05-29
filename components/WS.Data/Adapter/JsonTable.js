/* global define */
define('js!WS.Data/Adapter/JsonTable', [
   'js!WS.Data/Entity/Abstract',
   'js!WS.Data/Adapter/ITable',
   'js!WS.Data/Adapter/GenericFormatMixin',
   'js!WS.Data/Adapter/JsonFormatMixin',
   'js!WS.Data/Adapter/JsonRecord',
   'js!WS.Data/Utils',
   'Core/core-functions'
], function (
   Abstract,
   ITable,
   GenericFormatMixin,
   JsonFormatMixin,
   JsonRecord,
   Utils,
   CoreFunctions
) {
   'use strict';

   /**
    * Адаптер для таблицы данных в формате JSON.
    * Работает с данными, представленными в виде массива (Array.<Object.<String, *>>).
    *
    * Создадим адаптер для таблицы:
    * <pre>
    *    var adapter = new JsonTable([{
    *       id: 1,
    *       title: 'Test 1'
    *    }, {
    *       id: 2,
    *       title: 'Test 2'
    *    }]);
    *    adapter.at(0);//{id: 1, title: 'Test 1'}
    * </pre>
    * @class WS.Data/Adapter/JsonTable
    * @extends WS.Data/Entity/Abstract
    * @implements WS.Data/Adapter/ITable
    * @mixes WS.Data/Adapter/GenericFormatMixin
    * @mixes WS.Data/Adapter/JsonFormatMixin
    * @public
    * @author Мальцев Алексей
    */

   var JsonTable = Abstract.extend([ITable, GenericFormatMixin, JsonFormatMixin], /** @lends WS.Data/Adapter/JsonTable.prototype */{
      _moduleName: 'WS.Data/Adapter/JsonTable',

      /**
       * @member {Array.<Object>} Сырые данные
       */
      _data: null,

      /**
       * Конструктор
       * @param {*} data Сырые данные
       */
      constructor: function (data) {
         JsonTable.superclass.constructor.call(this, data);
         GenericFormatMixin.constructor.call(this, data);
         JsonFormatMixin.constructor.call(this, data);
      },

      //region WS.Data/Adapter/JsonFormatMixin

      addField: function(format, at) {
         JsonFormatMixin.addField.call(this, format, at);

         var name = format.getName(),
            value = format.getDefaultValue(),
            item;
         for (var i = 0; i < this._data.length; i++) {
            item = this._data[i];
            if (!item.hasOwnProperty(name)) {
               item[name] = value;
            }
         }
      },

      removeField: function(name) {
         JsonFormatMixin.removeField.call(this, name);
         var i;
         for (i = 0; i < this._data.length; i++) {
            delete this._data[i][name];
         }
      },

      //endregion WS.Data/Adapter/JsonFormatMixin

      //region Public methods

      getFields: function () {
         var count = this.getCount(),
            i,
            item;
         for (i = 0; i < count; i++) {
            item = this.at(i);
            if (item instanceof Object) {
               return Object.keys(item);
            }
         }
         return [];
      },

      getCount: function () {
         return this._isValidData() ? this._data.length : 0;
      },

      add: function (record, at) {
         this._touchData();
         if (at === undefined) {
            this._data.push(record);
         } else {
            this._checkPosition(at);
            this._data.splice(at, 0, record);
         }
      },

      at: function (index) {
         return this._isValidData() ? this._data[index] : undefined;
      },

      remove: function (at) {
         this._touchData();
         this._checkPosition(at);
         this._data.splice(at, 1);
      },

      replace: function (record, at) {
         this._touchData();
         this._checkPosition(at);
         this._data[at] = record;
      },

      move: function(source, target) {
         this._touchData();
         if (target === source) {
            return;
         }
         var removed = this._data.splice(source, 1);
         if (target === -1) {
            this._data.unshift(removed.shift());
         } else {
            this._data.splice(target, 0, removed.shift());
         }
      },

      merge: function(acceptor, donor, idProperty) {
         this._touchData();

         var first = this.at(acceptor),
            extention = this.at(donor),
            adapter = new JsonRecord(first),
            id = adapter.get(idProperty);
         CoreFunctions.merge(first, extention);
         adapter.set(idProperty, id);
         this.remove(donor);
      },

      copy: function(index) {
         this._touchData();

         var source = this.at(index),
            clone = CoreFunctions.clone(source);
         this.add(clone, 1 + index);
         return clone;
      },

      clear: function () {
         this._touchData();
         this._data.length = 0;
      },

      //endregion Public methods

      //region Protected methods

      _touchData: function () {
         GenericFormatMixin._touchData.call(this);
         if (!(this._data instanceof Array)) {
            this._data = [];
         }
      },

      _isValidData: function () {
         return this._data instanceof Array;
      },

      _has: function (name) {
         var count = this.getCount(),
            has = false,
            i,
            item;
         for (i = 0; i < count; i++) {
            item = this.at(i);
            if (item instanceof Object) {
               has = item.hasOwnProperty(name);
               break;
            }
         }
         return has;
      },

      _checkPosition: function (at) {
         if (at < 0 || at > this._data.length) {
            throw new Error('Out of bounds');
         }
      }

      //endregion Protected methods
   });

   return JsonTable;
});

