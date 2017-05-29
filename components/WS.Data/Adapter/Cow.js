/* global define */
define('js!WS.Data/Adapter/Cow', [
   'js!WS.Data/Entity/Abstract',
   'js!WS.Data/Adapter/IAdapter',
   'js!WS.Data/Adapter/IDecorator',
   'js!WS.Data/Entity/SerializableMixin',
   'js!WS.Data/Adapter/CowTable',
   'js!WS.Data/Adapter/CowRecord',
   'js!WS.Data/Di'
], function (
   AbstractEntity,
   IAdapter,
   IDecorator,
   SerializableMixin,
   CowTable,
   CowRecord,
   Di
) {
   'use strict';

   /**
    * Адаптер для работы с даными в режиме Copy-on-write.
    * \|/         (__)
    *     `\------(oo)
    *       ||    (__)
    *       ||w--||     \|/
    *   \|/
    * @class WS.Data/Adapter/Cow
    * @extends WS.Data/Entity/Abstract
    * @implements WS.Data/Adapter/IAdapter
    * @implements WS.Data/Adapter/IDecorator
    * @mixes WS.Data/Entity/SerializableMixin
    * @author Мальцев Алексей
    */

   var Cow = AbstractEntity.extend([IAdapter, IDecorator, SerializableMixin], /** @lends WS.Data/Adapter/Cow.prototype */{
      _moduleName: 'WS.Data/Adapter/Cow',

      /**
       * @member {WS.Data/Adapter/IAdapter} Оригинальный адаптер
       */
      _original: null,

      /**
       * Конструктор
       * @param {WS.Data/Adapter/IAdapter} original Оригинальный адаптер
       */
      constructor: function $Cow(original) {
         Cow.superclass.constructor.call(this);
         this._original = original;
      },

      //region WS.Data/Adapter/IAdapter

      forTable: function (data) {
         return new CowTable(data, this._original);
      },

      forRecord: function (data) {
         return new CowRecord(data, this._original);
      },

      getKeyField: function (data) {
         return this._original.getKeyField(data);
      },

      getProperty: function (data, property) {
         return this._original.getProperty(data, property);
      },

      setProperty: function (data, property, value) {
         return this._original.setProperty(data, property, value);
      },

      serialize: function (data) {
         return this._original.serialize(data);
      },

      //endregion WS.Data/Adapter/IAdapter

      //region WS.Data/Adapter/IDecorator

      getOriginal: function () {
         return this._original;
      },

      //endregion WS.Data/Adapter/IDecorator

      //region WS.Data/Entity/SerializableMixin

      _getSerializableState: function(state) {
         state = SerializableMixin._getSerializableState.call(this, state);
         state._original = this._original;
         return state;
      },

      _setSerializableState: function(state) {
         return SerializableMixin._setSerializableState(state).callNext(function() {
            this._original = state._original;
         });
      }

      //endregion WS.Data/Entity/SerializableMixin
   });

   Di.register('adapter.cow', Cow);

   return Cow;
});

