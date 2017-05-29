/* global define */
define('js!WS.Data/Adapter/SbisRecord', [
   'js!WS.Data/Entity/Abstract',
   'js!WS.Data/Adapter/IRecord',
   'js!WS.Data/Adapter/SbisFormatMixin'
], function (
   Abstract,
   IRecord,
   SbisFormatMixin
) {
   'use strict';

   /**
    * Адаптер для записи таблицы данных в формате СБиС.
    * Работает с данными, представленными в виде объекта ({_type: 'record', d: [], s: []}), где
    * <ul>
    *    <li>d - значения полей записи;</li>
    *    <li>s - описание полей записи.</li>
    * </ul>
    *
    * Создадим адаптер для записи:
    * <pre>
    *    var adapter = new SbisRecord({
    *       _type: 'record',
    *       d: [1, 'Test'],
    *       s: [
    *          {n: 'id', t: 'Число целое'},
    *          {n: 'title', t: 'Строка'}
    *       ]
    *    });
    *    adapter.get('title');//'Test'
    * </pre>
    * @class WS.Data/Adapter/SbisRecord
    * @extends WS.Data/Entity/Abstract
    * @implements WS.Data/Adapter/IRecord
    * @mixes WS.Data/Adapter/SbisFormatMixin
    * @public
    * @author Мальцев Алексей
    */
   var SbisRecord = Abstract.extend([IRecord, SbisFormatMixin], /** @lends WS.Data/Adapter/SbisRecord.prototype */{
      _moduleName: 'WS.Data/Adapter/SbisRecord',
      _type: 'record',

      /**
       * @member {String} Разделитель значений при сериализации сложных типов
       */
      _castSeparator: ',',

      /**
       * Конструктор
       * @param {*} data Сырые данные
       */
      constructor: function (data) {
         SbisRecord.superclass.constructor.call(this, data);
         SbisFormatMixin.constructor.call(this, data);
      },

      //region WS.Data/Adapter/SbisFormatMixin

      _buildD: function(at, value) {
         this._data.d.splice(at, 0, value);
      },

      _removeD: function(at) {
         this._data.d.splice(at, 1);
      },

      //endregion WS.Data/Adapter/SbisFormatMixin

      //region Public methods

      has: function (name) {
         return this._has(name);
      },

      get: function (name) {
         var index = this._getFieldIndex(name);
         return index >= 0 ?
            this._cast(this._data.s[index], this._data.d[index]) :
            undefined;
      },

      set: function (name, value) {
         var index = this._getFieldIndex(name);
         if (index < 0) {
            throw new ReferenceError(this._moduleName + '::set(): field "' + name + '" is not defined');
         }
         this._data.d[index] = this._uncast(this._data.s[index], value);
      },

      clear: function () {
         this._touchData();
         SbisFormatMixin.clear.call(this);
         this._data.s.length = 0;
      },

      //endregion Public methods

      //region Protected methods

      _cast: function (format, value) {
         switch (format && format.t) {
            case 'Идентификатор':
            case 'Иерархия':
               return value instanceof Array ?
                  (value[0] === null ? value[0] : value.join(this._castSeparator, value)) :
                  value;
            default:
               return value;
         }
      },

      _uncast: function (format, value) {
         switch (format && format.t) {
            case 'Идентификатор':
            case 'Иерархия':
               return typeof value === 'string' ?
                  value.split(this._castSeparator) :
                  [value];
            default:
               return value;
         }
      }

      //endregion Protected methods
   });

   return SbisRecord;
});
