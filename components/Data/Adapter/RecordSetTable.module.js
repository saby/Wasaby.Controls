/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Adapter.RecordSetTable', [
   'js!SBIS3.CONTROLS.Data.Adapter.ITable',
   'js!SBIS3.CONTROLS.Data.Adapter.GenericFormatMixin',
   'js!SBIS3.CONTROLS.Data.Collection.RecordSet'
], function (ITable, GenericFormatMixin, RecordSet) {
   'use strict';

   /**
    * Адаптер для таблицы данных в формате списка
    * @class SBIS3.CONTROLS.Data.Adapter.RecordSetTable
    * @mixes SBIS3.CONTROLS.Data.Adapter.ITable
    * @mixes SBIS3.CONTROLS.Data.Adapter.GenericFormatMixin
    * @public
    * @author Мальцев Алексей
    */

   var RecordSetTable = $ws.core.extend({}, [ITable, GenericFormatMixin], /** @lends SBIS3.CONTROLS.Data.Adapter.RecordSetTable.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Adapter.RecordSetTable',
      $protected: {
         /**
          * @member {SBIS3.CONTROLS.Data.Collection.RecordSet} Список
          */
         _data: null
      },

      $constructor: function (data) {
         if (!data) {
            data = new RecordSet();
         }
         if (!$ws.helpers.instanceOfModule(data, 'SBIS3.CONTROLS.Data.Collection.RecordSet')) {
            throw new TypeError('Argument data should be an instance of SBIS3.CONTROLS.Data.Collection.RecordSet');
         }
         this._data = data;
         this._format = data.getFormat();
      },

      //region SBIS3.CONTROLS.Data.Adapter.ITable

      getEmpty: function () {
         var empty = this._data.clone();
         empty.clear();
         return empty;
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

      //endregion SBIS3.CONTROLS.Data.Adapter.ITable

      //region Public methods

      //endregion Public methods

      //region Protected methods

      //endregion Protected methods
   });

   return RecordSetTable;
});
