/* global define */
define('js!WS.Data/Adapter/SbisTable', [
   'js!WS.Data/Entity/Abstract',
   'js!WS.Data/Adapter/ITable',
   'js!WS.Data/Adapter/SbisFormatMixin',
   'Core/core-functions',
   'Core/helpers/collection-helpers'
], function (
   Abstract,
   ITable,
   SbisFormatMixin,
   CoreFunctions,
   CollectionHelpers
) {
   'use strict';

   /**
    * Адаптер для таблицы данных в формате СБиС.
    * Работает с данными, представленными в виде объекта ({_type: 'recordset', d: [], s: []}), где
    * <ul>
    *    <li>d - значения полей для каждой записи;</li>
    *    <li>s - описание полей записи.</li>
    * </ul>
    *
    * Создадим адаптер для таблицы:
    * <pre>
    *    var adapter = new SbisTable({
    *       _type: 'recordset',
    *       d: [
    *          [1, 'Test 1'],
    *          [2, 'Test 2']
    *       ],
    *       s: [
    *          {n: 'id', t: 'Число целое'},
    *          {n: 'title', t: 'Строка'}
    *       ]
    *    });
    *    adapter.at(0);//{d: [1, 'Test 1'], s: [{n: 'id', t: 'Число целое'}, {n: 'title', t: 'Строка'}]}
    * </pre>
    * @class WS.Data/Adapter/SbisTable
    * @extends WS.Data/Entity/Abstract
    * @implements WS.Data/Adapter/ITable
    * @mixes WS.Data/Adapter/SbisFormatMixin
    * @public
    * @author Мальцев Алексей
    */
   var SbisTable = Abstract.extend([ITable, SbisFormatMixin], /** @lends WS.Data/Adapter/SbisTable.prototype */{
      _moduleName: 'WS.Data/Adapter/SbisTable',
      _type: 'recordset',

      /**
       * Конструктор
       * @param {*} data Сырые данные
       */
      constructor: function (data) {
         SbisTable.superclass.constructor.call(this, data);
         SbisFormatMixin.constructor.call(this, data);
      },

      //region WS.Data/Adapter/SbisFormatMixin

      _buildD: function(at, value) {
         CollectionHelpers.forEach(this._data.d, function(item) {
            item.splice(at, 0, value);
         });
      },

      _removeD: function(at) {
         CollectionHelpers.forEach(this._data.d, function(item) {
            item.splice(at, 1);
         });
      },

      //endregion WS.Data/Adapter/SbisFormatMixin

      //region Public methods

      getCount: function () {
         return this._isValidData() ? this._data.d.length : 0;
      },

      add: function (record, at) {
         this._touchData();

         if (this._data.d.length === 0 && record.s) {
            this._data.s = record.s;
         }

         this._checkFormat(record, '::add()');
         record.s = this._data.s;

         if (at === undefined) {
            this._data.d.push(record.d);
         } else {
            this._checkRowIndex(at, true);
            this._data.d.splice(at, 0, record.d);
         }
      },

      at: function (index) {
         return this._isValidData() && this._data.d[index] ? {
            d: this._data.d[index],
            s: this._data.s
         } : undefined;
      },

      remove: function (at) {
         this._touchData();
         this._checkRowIndex(at);
         this._data.d.splice(at, 1);
      },

      replace: function (record, at) {
         this._touchData();
         this._checkRowIndex(at);
         if (!this._data.s.length && record.s.length) {
            this._data.s = record.s;
         }
         this._checkFormat(record, '::replace()');
         this._data.d[at] = record.d;
      },

      move: function(source, target) {
         this._touchData();
         if (target === source) {
            return;
         }
         var removed = this._data.d.splice(source, 1);
         target === -1 ? this._data.d.unshift(removed.shift()) : this._data.d.splice(target, 0, removed.shift());
      },

      merge: function(acceptor, donor){
         this._touchData();
         this._checkRowIndex(acceptor);
         this._checkRowIndex(donor);
         CoreFunctions.merge(
            this._data.d[acceptor],
            this._data.d[donor]
         );
         this.remove(donor);
      },

      copy: function(index){
         this._touchData();
         this._checkRowIndex(index);
         var source = this._data.d[index],
            clone = CoreFunctions.clone(source);
         this._data.d.splice(1 + index, 0, clone);
         return clone;
      },

      //endregion Public methods

      //region Protected methods

      _checkRowIndex: function(index, addMode) {
         var max = this._data.d.length + (addMode ? 0 : -1);
         if (!(index >= 0 && index <= max)) {
            throw new RangeError(this._moduleName + ': row index ' + index + ' is out of bounds.');
         }
      }

      //endregion Protected methods

   });

   return SbisTable;
});
