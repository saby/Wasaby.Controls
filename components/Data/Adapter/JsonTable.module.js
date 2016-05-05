/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Adapter.JsonTable', [
   'js!SBIS3.CONTROLS.Data.Entity.Abstract',
   'js!SBIS3.CONTROLS.Data.Adapter.ITable',
   'js!SBIS3.CONTROLS.Data.Adapter.GenericFormatMixin',
   'js!SBIS3.CONTROLS.Data.Adapter.JsonFormatMixin',
   'js!SBIS3.CONTROLS.Data.Adapter.JsonRecord',
   'js!SBIS3.CONTROLS.Data.Utils'
], function (Abstract, ITable, GenericFormatMixin, JsonFormatMixin, JsonRecord, Utils) {
   'use strict';

   /**
    * Адаптер для таблицы данных в формате JSON
    * @class SBIS3.CONTROLS.Data.Adapter.JsonTable
    * @extends SBIS3.CONTROLS.Data.Entity.Abstract
    * @mixes SBIS3.CONTROLS.Data.Adapter.ITable
    * @mixes SBIS3.CONTROLS.Data.Adapter.GenericFormatMixin
    * @mixes SBIS3.CONTROLS.Data.Adapter.JsonFormatMixin
    * @public
    * @author Мальцев Алексей
    */

   var JsonTable = Abstract.extend([ITable, GenericFormatMixin, JsonFormatMixin], /** @lends SBIS3.CONTROLS.Data.Adapter.JsonTable.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Adapter.JsonTable',

      /**
       * @member {Array.<Object>} Сырые данные
       */
      _data: null,

      /**
       * Конструктор
       * @param {*} data Сырые данные
       */
      constructor: function (data) {
         if (!(data instanceof Array)) {
            data = [];
         }
         JsonTable.superclass.constructor.call(this, data);
         JsonFormatMixin.constructor.call(this, data);
         this._data = data;
      },

      //region SBIS3.CONTROLS.Data.Adapter.JsonFormatMixin

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

      //endregion SBIS3.CONTROLS.Data.Adapter.JsonFormatMixin

      //region Public methods

      getEmpty: function () {
         Utils.logger.stack(this._moduleName + '::getEmpty(): method is deprecated and will be removed in 3.7.4. Use clear() instead.');
         return [];
      },

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
         return this._data.length;
      },

      add: function (record, at) {
         if (at === undefined) {
            this._data.push(record);
         } else {
            this._checkPosition(at);
            this._data.splice(at, 0, record);
         }
      },

      at: function (index) {
         return this._data[index];
      },

      remove: function (at) {
         this._checkPosition(at);
         this._data.splice(at, 1);
      },

      replace: function (record, at) {
         this._checkPosition(at);
         this._data[at] = record;
      },

      move: function(source, target) {
         if (target === source) {
            return;
         }
         var removed = this._data.splice(source, 1);
         this._data.splice(target, 0, removed.shift());
      },

      merge: function(acceptor, donor, idProperty) {
         var first = this.at(acceptor),
            extention = this.at(donor),
            adapter = new JsonRecord(first),
            id = adapter.get(idProperty);
         $ws.core.merge(first, extention);
         adapter.set(idProperty, id);
         this.remove(donor);
      },

      copy: function(index) {
         var source = this.at(index),
            clone = $ws.core.clone(source);
         this.add(clone, index);
      },

      clear: function () {
         this._data.length = 0;
      },

      //endregion Public methods

      //region Protected methods

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

