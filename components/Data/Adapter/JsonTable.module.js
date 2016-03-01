/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Adapter.JsonTable', [
   'js!SBIS3.CONTROLS.Data.Adapter.ITable',
   'js!SBIS3.CONTROLS.Data.Adapter.JsonFormatMixin',
   'js!SBIS3.CONTROLS.Data.Adapter.JsonRecord'
], function (ITable, JsonFormatMixin, JsonRecord) {
   'use strict';

   /**
    * Адаптер для таблицы данных в формате JSON
    * @class SBIS3.CONTROLS.Data.Adapter.JsonTable
    * @mixes SBIS3.CONTROLS.Data.Adapter.ITable
    * @mixes SBIS3.CONTROLS.Data.Adapter.JsonFormatMixin
    * @public
    * @author Мальцев Алексей
    */

   var JsonTable = $ws.core.extend({}, [ITable, JsonFormatMixin], /** @lends SBIS3.CONTROLS.Data.Adapter.JsonTable.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Adapter.JsonTable',
      $protected: {
         /**
          * @member {Array.<Object>} Сырые данные
          */
         _data: []
      },

      $constructor: function (data) {
         if (!(data instanceof Array)) {
            data = [];
         }
         this._data = data;
      },

      //region SBIS3.CONTROLS.Data.Adapter.JsonFormatMixin

      getFormat: function (name) {
         if (!this._has(name)) {
            throw new ReferenceError(this._moduleName + '::getFormat(): field "' + name + '" is not exists');
         }
         return JsonTable.superclass.getFormat.call(this, name);
      },

      addField: function(format, at) {
         JsonTable.superclass.addField.call(this, format, at);

         var name = format.getName();
         if (this._has(name)) {
            delete this._format[name];
            throw new Error(this._moduleName + '::addField(): field "' + name + '" already exists');
         }

         for (var i = 0; i < this._data.length; i++) {
            this._data[i][name] = format.getDefaultValue();
         }
      },

      removeField: function(name) {
         if (!this._has(name)) {
            throw new Error(this._moduleName + '::removeField(): field "' + name + '" is not exists');
         }
         JsonTable.superclass.removeField.call(this, name);
         var i;
         for (i = 0; i < this._data.length; i++) {
            delete this._data[i][name];
         }
      },

      //endregion SBIS3.CONTROLS.Data.Adapter.JsonFormatMixin

      //region Public methods

      getEmpty: function () {
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

      //endregion Public methods

      //region Protected methods

      _has: function (name) {
         var count = this.getCount(),
            has = false,
            i,
            item;
         for (i = 0; i < count; i++) {
            item = this.at(i);
            if (item instanceof Object && item.hasOwnProperty(name)) {
               has = true;
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

