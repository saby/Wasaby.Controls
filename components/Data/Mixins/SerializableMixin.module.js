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

      //region Public methods

      /**
       * Возвращает сериализованный экземпляр
       * @returns {Object}
       */
      toJSON: function() {
         if (!this._moduleName) {
            throw new Error('Module name is undefined');
         }
         var result = {
            $serialized$: 'inst',
            module: this._moduleName,
            id: this._getInstanceId(),
            state: this._getSerializableState()
         };
         return result;
      },

      /**
       * Конструирует экземпляр из сериализованного состояния
       * @param {Object} data Сериализованное состояние
       * @returns {Object}
       * @static
       */
      fromJSON: function(data) {
         var instance,
            initializer = this.prototype._setSerializableState(data.state);
         instance = new this(data.state._options);
         if (initializer) {
            initializer.call(instance);
         }
         return instance;
      },

      //endregion Public methods

      //region Protected methods

      /**
       * Возвращает всё, что нужно сложить в состояние объекта при сериализации, чтобы при десериализации вернуть его в это же состояние
       * @returns {Object}
       * @private
       */
      _getSerializableState: function() {
         return {
            _options: this._options
         };
      },

      /**
       * Проверяет сериализованное состояние перед созданием инстанса. Возвращает метод, востанавливающий состояние объекта после создания инстанса.
       * @returns {Function|undefined}
       * @private
       */
      _setSerializableState: function(state) {
         state._options = state._options || {};
         return function() {};
      },

      /**
       * Возвращает уникальный номер инстанса
       * @returns {Number}
       * @private
       */
      _getInstanceId: function() {
         return this._instanceId || (this._instanceId = ++_instanceCounter);
      }

      //endregion Protected methods
   };

   var _instanceCounter = 0;

   return SerializableMixin;
});
