/* global define */
define('js!WS.Data/Entity/InstantiableMixin', function () {
   'use strict';

   /**
    * Миксин, позволяющий генерировать уникальный (в рамках миксина) идентификатор для каждого экземпляра класса.
    * @mixin WS.Data/Entity/InstantiableMixin
    * @public
    * @author Мальцев Алексей
    */

   var InstantiableMixin = /**@lends WS.Data/Entity/InstantiableMixin.prototype  */{
      /**
       * @member {String} Префикс значений идентификатора
       */
      _instancePrefix: 'id-',

      /**
       * @member {String} Уникальный идентификатор
       */
      _instanceId: '',

      //region WS.Data/Entity/IInstantiable

      getInstanceId: function () {
         if (_instanceCounter >= _maxValue) {
            _instanceCounter = 0;
         }
         return this._instanceId || (this._instanceId = this._instancePrefix + _instanceCounter++);
      }

      //endregion WS.Data/Entity/IInstantiable
   };

   var _instanceCounter = 0,
      _maxValue = Number.MAX_SAFE_INTEGER || (Math.pow(2, 53) - 1);

   //Deprecated methods
   InstantiableMixin.getHash = InstantiableMixin.getInstanceId;

   return InstantiableMixin;
});
