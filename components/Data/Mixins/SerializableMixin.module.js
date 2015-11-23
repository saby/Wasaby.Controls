/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.SerializableMixin', [
], function () {
   'use strict';

   /**
    * Миксин, позволяющий сериализовать объекты
    * @mixin SBIS3.CONTROLS.Data.SerializableMixin
    * @public
    * @author Мальцев Алексей
    */

   var SerializableMixin = /**@lends SBIS3.CONTROLS.Data.SerializableMixin.prototype  */{
      $protected: {
         /**
          * @var {Number} Уникальный номер инстанса
          */
         _instanceId: 0
      },

      toJSON: function() {
         return {
            module: this._moduleName,
            instance: this._getInstanceId(),
            state: this._getSerializableState()
         };
      },

      _getSerializableState: function() {
         return {
            _options: this._options
         };
      },

      _getInstanceId: function() {
         return this._instanceId || (this._instanceId = ++_instanceCounter);
      }
   };

   var _instanceCounter = 0;

   return SerializableMixin;
});
