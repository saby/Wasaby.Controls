/* global define */
define('js!WS.Data/Adapter/CowRecord', [
   'js!WS.Data/Entity/Abstract',
   'js!WS.Data/Adapter/IRecord',
   'js!WS.Data/Adapter/IDecorator',
   'js!WS.Data/Utils'
], function (
   Abstract,
   IRecord,
   IDecorator,
   Utils
) {
   'use strict';

   /**
    * Адаптер записи таблицы для работы в режиме Copy-on-write.
    * @class WS.Data/Adapter/CowRecord
    * @extends WS.Data/Entity/Abstract
    * @implements WS.Data/Adapter/IRecord
    * @implements WS.Data/Adapter/IDecorator
    * @author Мальцев Алексей
    */

   var CowRecord = Abstract.extend([IRecord, IDecorator], /** @lends WS.Data/Adapter/CowRecord.prototype */{
      _moduleName: 'WS.Data/Adapter/CowRecord',

      /**
       * @member {WS.Data/Adapter/IAdapter} Оригинальный адаптер
       */
      _original: null,

      /**
       * @member {WS.Data/Adapter/IRecord} Оригинальный адаптер записи
       */
      _originalRecord: null,

      /**
       * @member {Boolean} Сырые данные были скопированы
       */
      _copied: false,

      /**
       * Конструктор
       * @param {*} data Сырые данные
       * @param {WS.Data/Adapter/IAdapter} original Оригинальный адаптер
       */
      constructor: function $CowRecord(data, original) {
         CowRecord.superclass.constructor.call(this);
         this._original = original;
         this._originalRecord = original.forRecord(data);
      },

      //region WS.Data/Adapter/IRecord

      has: function (name) {
         return this._originalRecord.has(name);
      },

      get: function (name) {
         return this._originalRecord.get(name);
      },

      set: function (name, value) {
         this._copy();
         return this._originalRecord.set(name, value);
      },

      clear: function () {
         this._copy();
         return this._originalRecord.clear();
      },

      getData: function () {
         return this._originalRecord.getData();
      },

      getFields: function () {
         return this._originalRecord.getFields();
      },

      getFormat: function (name) {
         return this._originalRecord.getFormat(name);
      },

      getSharedFormat: function (name) {
         return this._originalRecord.getSharedFormat(name);
      },

      addField: function(format, at) {
         this._copy();
         return this._originalRecord.addField(format, at);
      },

      removeField: function(name) {
         this._copy();
         return this._originalRecord.removeField(name);
      },

      removeFieldAt: function(index) {
         this._copy();
         return this._originalRecord.removeFieldAt(index);
      },

      //endregion WS.Data/Adapter/IRecord

      //region WS.Data/Adapter/IDecorator

      getOriginal: function () {
         return this._originalRecord;
      },

      //endregion WS.Data/Adapter/IDecorator

      //region Protected methods

      _copy: function () {
         if (!this._copied) {
            var data = this._originalRecord.getData();
            this._originalRecord = this._original.forRecord(
               Utils.clone(
                  data
               )
            );
            //todo Костыль проюрасываем ссылку на s в скопрированные данные что бы сохранилась связь с рекордсетом
            if (data && data.s) {
               this._originalRecord.getData().s = data.s
            }
            this._copied = true;
         }
      }

      //endregion Protected methods
   });

   return CowRecord;
});
