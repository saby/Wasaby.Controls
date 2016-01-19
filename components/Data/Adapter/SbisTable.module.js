define('js!SBIS3.CONTROLS.Data.Adapter.SbisTable', [
   'js!SBIS3.CONTROLS.Data.Adapter.ITable'
], function (ITable) {
   'use strict';

   /**
    * Адаптер для таблицы данных в формате СБиС
    * @class SBIS3.CONTROLS.Data.Adapter.SbisTable
    * @mixes SBIS3.CONTROLS.Data.Adapter.ITable
    * @public
    * @author Мальцев Алексей
    */
   var SbisTable = $ws.core.extend({}, [ITable], /** @lends SBIS3.CONTROLS.Data.Adapter.SbisTable.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Adapter.SbisTable',
      $protected: {
         /**
          * @var {Object} Сырые данные
          */
         _data: undefined
      },

      $constructor: function (data) {
         if (!(data instanceof Object)) {
            data = {};
         }
         if (!(data.s instanceof Array)) {
            data.s = [];
         }
         if (!(data.d instanceof Array)) {
            data.d = [];
         }
         this._data = data;
      },

      getEmpty: function () {
         return {
            d: [],
            s: $ws.core.clone(this._data.s || [])
         };
      },

      getCount: function () {
         return this._data.d.length;
      },

      add: function (record, at) {
         if (!this._data.s.length) {
            this._data.s = record.s || [];
         }
         if (at === undefined) {
            this._data.d.push(record.d);
         } else {
            this._checkPosition(at);
            this._data.d.splice(at, 0, record.d);
         }
      },

      at: function (index) {
         return this._data.d[index] ? {
            d: this._data.d[index],
            s: this._data.s
         } : undefined;
      },

      merge: function(one, two){
         $ws.core.merge(
            this._data.d[one],
            this._data.d[two]
         );
         this.remove(two);
      },

      copy: function(index){
         this._checkPosition(index);
         var source = this._data.d[index],
            clone = $ws.core.clone(source);
         this._data.d.splice(index, 0, clone);
      },

      remove: function (at) {
         this._checkPosition(at);
         this._data.d.splice(at, 1);
      },

      replace: function (record, at) {
         this._checkPosition(at);
         if (!this._data.s.length) {
            this._data.s = record.s || [];
         }
         this._data.d[at] = record.d;
      },

      move: function(source, target) {
         if (target === source) {
            return;
         }
         var removed = this._data.d.splice(source, 1);
         this._data.d.splice(target, 0, removed.shift());
      },

      getData: function () {
         return this._data;
      },

      _checkPosition: function (at) {
         if (at < 0 || at > this._data.d.length) {
            throw new Error('Out of bounds');
         }
      }
   });

   return SbisTable;
});