/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Adapter.SbisFormatMixin', [
], function () {
   'use strict';

   /**
    * Миксин для работы с СБИС-форматом в адаптерах
    * @mixin SBIS3.CONTROLS.Data.Adapter.SbisFormatMixin
    * @public
    * @author Мальцев Алексей
    */

   var SbisFormatMixin = /** @lends SBIS3.CONTROLS.Data.Adapter.SbisFormatMixin.prototype */{
      $protected: {
         /**
          * @member {Object} Сырые данные
          */
         _data: null,

         /**
          * @member {Object<String, Number>} Название поля -> индекс в d
          */
         _fieldIndexes: null
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

      //region Public methods

      getData: function () {
         return this._data;
      },

      getEmpty: function () {
         return {
            d: [],
            s: $ws.core.clone(this._data.s || [])
         };
      },

      getFormat: function (name) {
         if (!this.has(name)) {
            throw new ReferenceError('Field "' + name + '" is not exists');
         }
         if (!this._format.hasOwnProperty(name)) {
            this._format[name] = this._buildFormat(name);
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

         if (at === undefined) {
            at = this._data.s.length - 1;
         }
         this._checkFieldIndex(at);

         this._format[format.getName()] = format;
         this._data.s.splice(at, 0, this._buildS(format));
         this._data.d.splice(at, 0, undefined);
         this._fieldIndexes = null;
      },

      removeField: function(name) {
         var index = this._getFieldIndex(name);
         if (index === -1) {
            throw new ReferenceError('Field "' + name + '" is not exists');
         }
         delete this._format[name];
         this._data.s.splice(index, 1);
         this._data.d.splice(index, 1);
         this._fieldIndexes = null;
      },

      removeFieldAt: function(index) {
         this._checkFieldIndex(index);
         var name = this._data.s[index].n;
         delete this._format[name];
         this._data.s.splice(index, 1);
         this._data.d.splice(index, 1);
         this._fieldIndexes = null;
      },

      //endregion Public methods

      //region Protected methods

      _getFieldIndex: function (name) {
         if (this._fieldIndexes === null) {
            this._fieldIndexes = {};
            for (var i = 0, count = this._data.s.length; i < count; i++) {
               this._fieldIndexes[this._data.s[i].n] = i;
            }
         }
         return this._fieldIndexes.hasOwnProperty(name) ? this._fieldIndexes[name] : -1;
      },

      _checkFieldIndex: function(index, appendMode) {
         var max = this._data.s.length;
         if (appendMode) {
            max++;
         }
         if (!(index >= 0 && index < max)) {
            throw new TypeError('Index is out of bounds.');
         }
      }

      //endregion Protected methods

   };

   return SbisFormatMixin;
});
