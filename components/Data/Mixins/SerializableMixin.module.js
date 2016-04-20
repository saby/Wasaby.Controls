/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.SerializableMixin', [
], function () {
   'use strict';

   /**
    * Миксин, позволяющий сериализовать и десериализовать инастансы различных модулей.
    * Для корректной работы необходимо определить в прототипе каждого модуля свойство _moduleName, в котором прописать
    * имя модуля для requirejs (без плагина js!).
    * @example
    * <pre>
    * define('js!My.SubModule', ['js!My.SuperModule'], function (SuperModule) {
    *    'use strict';
    *
    *    var SubModule = SuperModule.extend({
    *      _moduleName: 'My.SubModule'
    *    });
    *
    *    return SubModule;
    * });
    * </pre>
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
         //TODO: переделать на Object.getPrototypeOf(this), после перевода на SBIS3.CONTROLS.Data.Core::extend()
         if (!this._moduleName) {
            throw new ReferenceError('Module name should be defined in a prototype');
         }
         if (_protoSupported && !this.__proto__.hasOwnProperty('_moduleName')) {
            throw new ReferenceError('Module name should be defined in a prototype of each sub module of SerializableMixin');
         }

         return {
            $serialized$: 'inst',
            module: this._moduleName,
            id: this._getInstanceId(),
            state: this._getSerializableState()
         };
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

   var _instanceCounter = 0,
      _protoSupported = typeof ({}).__proto__ === 'object';

   return SerializableMixin;
});
