/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Adapter.RecordSetTable', [
   'js!SBIS3.CONTROLS.Data.Entity.Abstract',
   'js!SBIS3.CONTROLS.Data.Adapter.ITable',
   'js!SBIS3.CONTROLS.Data.Adapter.GenericFormatMixin',
   'js!SBIS3.CONTROLS.Data.Collection.RecordSet',
   'js!SBIS3.CONTROLS.Data.Utils'
], function (Abstract, ITable, GenericFormatMixin, RecordSet, Utils) {
   'use strict';

   /**
    * Адаптер для таблицы данных в формате списка
    * @class SBIS3.CONTROLS.Data.Adapter.RecordSetTable
    * @extends SBIS3.CONTROLS.Data.Entity.Abstract
    * @mixes SBIS3.CONTROLS.Data.Adapter.ITable
    * @mixes SBIS3.CONTROLS.Data.Adapter.GenericFormatMixin
    * @public
    * @author Мальцев Алексей
    */

   var RecordSetTable = Abstract.extend([ITable, GenericFormatMixin], /** @lends SBIS3.CONTROLS.Data.Adapter.RecordSetTable.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Adapter.RecordSetTable',

      /**
       * @member {SBIS3.CONTROLS.Data.Collection.RecordSet} Список
       */
      _data: null,

      /**
       * Конструктор
       * @param {*} data Сырые данные
       */
      constructor: function (data) {
         if (!data) {
            data = new RecordSet();
         }
         if (!$ws.helpers.instanceOfModule(data, 'SBIS3.CONTROLS.Data.Collection.RecordSet')) {
            throw new TypeError('Argument data should be an instance of SBIS3.CONTROLS.Data.Collection.RecordSet');
         }
         RecordSetTable.superclass.constructor.call(this, data);
         GenericFormatMixin.constructor.call(this, data);
      },

      //region SBIS3.CONTROLS.Data.Adapter.ITable

      getEmpty: function () {
         Utils.logger.stack(this._moduleName + '::getEmpty(): method is deprecated and will be removed in 3.7.4. Use clear() instead.');
         var empty = this._data.clone();
         empty.clear();
         return empty;
      },

      getFields: function () {
         var fields = [];
         if (this._data.getCount() > 0) {
            this._data.at(0).each(function(name) {
               fields.push(name);
            });
         }
         return fields;
      },

      getCount: function () {
         return this._data.getCount();
      },

      add: function (record, at) {
         this._data.add(record, at);
      },

      at: function (index) {
         return this._data.at(index);
      },

      remove: function (at) {
         return this._data.removeAt(at);
      },

      replace: function (record, at) {
         return this._data.replace(record, at);
      },

      move: function(source, target) {
         var rec = this._data.at(source);
         this._data.removeAt(source);
         this._data.add(rec, target);
      },

      merge: function(acceptor, donor, idProperty) {
         acceptor = this._data.at(acceptor);
         this._data.at(donor).each(function(name, value) {
            if (name !== idProperty) {
               acceptor.set(name, value);
            }
         }, this);
         this._data.removeAt(donor);
      },

      copy: function(index) {
         var clone = this._data.at(index).clone();
         this.add(clone, 1 + index);
         return clone;
      },

      clear: function () {
         var count = this._data.getCount();
         for (var i = count - 1; i >= 0; i--) {
            this._data.removeAt(i);
         }
      },

      addField: function(format, at) {
         this._data.addField(format, at);
      },

      removeField: function(name) {
         this._data.removeField(name);
      },

      removeFieldAt: function(index) {
         this._data.removeFieldAt(index);
      },

      //endregion SBIS3.CONTROLS.Data.Adapter.ITable

      //region Public methods

      //endregion Public methods

      //region Protected methods

      _getFieldsFormat: function() {
         return this._data.getFormat();
      }

      //endregion Protected methods
   });

   return RecordSetTable;
});
