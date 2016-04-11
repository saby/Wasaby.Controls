/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.SerializableMixin', function () {
   'use strict';

   /**
    * Миксин, позволяющий сериализовать объекты
    * @mixin SBIS3.CONTROLS.Data.SerializableMixin
    * @public
    * @author Мальцев Алексей
    */

   var SerializableMixin = /**@lends SBIS3.CONTROLS.Data.SerializableMixin.prototype */{
      /**
       * @member {Number} Уникальный номер инстанса
       */
      _instanceId: 0,

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
         instance = new this(data.state.$options);
         if (initializer) {
            initializer.call(instance);
         }
         return instance;
      },

      //endregion Public methods

      //region Protected methods

      /**
       * Возвращает всё, что нужно сложить в состояние объекта при сериализации, чтобы при десериализации вернуть его в это же состояние
       * @param {Object} state Cостояние
       * @returns {Object}
       * @protected
       */
      _getSerializableState: function(state) {
         state = state || {};
         state.$options = this._getOptions ? this._getOptions() : this._options
         return state;
      },

      /**
       * Проверяет сериализованное состояние перед созданием инстанса. Возвращает метод, востанавливающий состояние объекта после создания инстанса.
       * @param {Object} state Cостояние
       * @param {Object} initializer Метод, устанавливающий состояние объекта после десериализации
       * @returns {Function|undefined}
       * @protected
       */
      _setSerializableState: function(state, initializer) {
         state.$options = state.$options || {};
         initializer = initializer || function() {};
         return initializer;
      },

      /**
       * Возвращает уникальный номер инстанса
       * @returns {Number}
       * @protected
       */
      _getInstanceId: function() {
         return this._instanceId || (this._instanceId = ++_instanceCounter);
      }

      //endregion Protected methods
   };

   var _instanceCounter = 0;

   return SerializableMixin;
});
