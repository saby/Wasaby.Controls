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

   var SerializableMixin = /**@lends SBIS3.CONTROLS.Data.SerializableMixin.prototype */{
      $protected: {
         /**
          * @var {Number} Уникальный номер инстанса
          */
         _instanceId: 0
      },

      toJSON: function() {
         return {
            $serialized: true,
            module: this._moduleName,
            id: this._getInstanceId(),
            state: this._getSerializableState()
         };
      },

      fromJSON: function (data) {
         var Module = require('js!' + data.module),
            instance,
            initializer = Module._setSerializableState(data.state);
         instance = new Module(data.state._options);
         initializer.call(instance, data.id);
         return instance;
      },

      _getSerializableState: function() {
         return {
            _options: this._options
         };
      },

      _setSerializableState: function(state) {
         state._options = state._options || {};
         return function(instanceId) {
            this._instanceId = instanceId;
         };
      },

      _getInstanceId: function() {
         return this._instanceId || (this._instanceId = ++_instanceCounter);
      }
   };

   var _instanceCounter = 0;

   return SerializableMixin;
});
