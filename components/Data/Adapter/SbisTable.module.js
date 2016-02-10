/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Adapter.SbisTable', [
   'js!SBIS3.CONTROLS.Data.Adapter.ITable',
   'js!SBIS3.CONTROLS.Data.Adapter.SbisFormatMixin'
], function (ITable, SbisFormatMixin) {
   'use strict';

   /**
    * Адаптер для таблицы данных в формате СБиС
    * @class SBIS3.CONTROLS.Data.Adapter.SbisTable
    * @mixes SBIS3.CONTROLS.Data.Adapter.ITable
    * @mixes SBIS3.CONTROLS.Data.Adapter.SbisFormatMixin
    * @public
    * @author Мальцев Алексей
    */
   var SbisTable = $ws.core.extend({}, [ITable, SbisFormatMixin], /** @lends SBIS3.CONTROLS.Data.Adapter.SbisTable.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Adapter.SbisTable',

      //region Public methods

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
            this._checkFieldIndex(at, true);
            this._data.d.splice(at, 0, record.d);
         }
      },

      at: function (index) {
         return this._data.d[index] ? {
            d: this._data.d[index],
            s: this._data.s
         } : undefined;
      },

      remove: function (at) {
         this._checkFieldIndex(at);
         this._data.d.splice(at, 1);
      },

      replace: function (record, at) {
         this._checkFieldIndex(at);
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

      merge: function(acceptor, donor){
         $ws.core.merge(
            this._data.d[acceptor],
            this._data.d[donor]
         );
         this.remove(donor);
      },

      copy: function(index){
         this._checkFieldIndex(index);
         var source = this._data.d[index],
            clone = $ws.core.clone(source);
         this._data.d.splice(index, 0, clone);
      },

      getFormat: function (name) {
         if (!this.has(name)) {
            throw new ReferenceError('Field "' + name + '" is not exists');
         }
         if (!this._format.hasOwnProperty(name)) {
            this._format[name] = new StringField({
               name: name
            });
         }
         return this._format[name].clone();
      },

      addField: function(format, at) {
         if (this.has(name)) {
            throw new Error('Field "' + name + '" already exists');
         }
         if (!format || !$ws.helpers.instanceOfModule(format, 'SBIS3.CONTROLS.Data.Format.Field')) {
            throw new TypeError('Format should be an instance of SBIS3.CONTROLS.Data.Format.Field');
         }
         if (at >= 0) {
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Adapter.JsonRecord::addField()', 'Argument "at" is not supported.');
         }
         this._format[format.getName()] = format;
         this.set(format.getName(), undefined);
      },

      removeField: function(name) {
         if (!this.has(name)) {
            throw new ReferenceError('Field "' + name + '" is not exists');
         }
         delete this._format[name];
         delete this._data[name];
      },

      removeFieldAt: function(index) {
         throw new Error('SBIS3.CONTROLS.Data.Adapter.JsonRecord::removeFieldAt() is not supported');
      }

      //endregion Public methods
   });

   return SbisTable;
});