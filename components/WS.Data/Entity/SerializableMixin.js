/* global define */
define('js!WS.Data/Entity/SerializableMixin', [
   'js!WS.Data/Utils'
], function (
   Utils
) {
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
    * @mixin WS.Data/Entity/SerializableMixin
    * @public
    * @author Мальцев Алексей
    */

   var SerializableMixin = /**@lends WS.Data/Entity/SerializableMixin.prototype */{
      /**
       * @member {Number} Уникальный номер инстанса
       */
      _instanceNumber: 0,

      //region Public methods

      /**
       * Возвращает сериализованный экземпляр класса
       * @return {Object}
       * @example
       * Сериализуем сущность:
       * <pre>
       *    var instance = new Entity(),
       *       data = instance.toJSON();//{$serialized$: 'inst', module: ...}
       * </pre>
       */
      toJSON: function() {
         this._checkModuleName(true);

         return {
            $serialized$: 'inst',
            module: this._moduleName,
            id: this._getInstanceId(),
            state: this._getSerializableState()
         };
      },

      /**
       * Конструирует экземпляр класса из сериализованного состояния
       * @param {Object} data Сериализованное состояние
       * @return {Object}
       * @static
       * @example
       * Сериализуем сущность:
       * <pre>
       *    //data = {$serialized$: 'inst', module: ...}
       *    var instance = Entity.prototype.fromJSON.call(Entity, data);
       *    instance instanceof Entity;//true
       * </pre>
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
       * Проверяет, что в прототипе указано имя модуля для requirejs, иначе не будет работать десериализация
       * @param {Boolean} critical Отсутствие имени модуля критично
       * @protected
       */
      _checkModuleName: function(critical) {
         var proto = this;
         if (!proto._moduleName) {
            SerializableMixin._createModuleNameError('Property "_moduleName" with module name for requirejs is not defined in a prototype', critical);
            return;
         }
         //TODO: переделать на Object.getPrototypeOf(this), после перевода на Core/core-simpleExtend::extend()
         if (!_protoSupported) {
            return;
         }

         proto = this.__proto__;
         if (!proto.hasOwnProperty('_moduleName')) {
            SerializableMixin._createModuleNameError('Property "_moduleName" with module name for requirejs should be defined in a prototype of each sub module of SerializableMixin', critical);
         }
      },

      /**
       * Создает ошибку
       * @param {String} str Сообщение об ошибке
       * @param {Boolean} critical Выбросить исключение либо предупредить
       * @protected
       * @static
       */
      _createModuleNameError: function(str, critical) {
         if (critical) {
            throw new ReferenceError(str);
         } else {
            Utils.logger.stack(str, 3);
         }
      },

      /**
       * Возвращает всё, что нужно сложить в состояние объекта при сериализации, чтобы при десериализации вернуть его в это же состояние
       * @param {Object} state Cостояние
       * @return {Object}
       * @protected
       */
      _getSerializableState: function(state) {
         state = state || {};
         state.$options = this._getOptions ? this._getOptions() : {};
         return state;
      },

      /**
       * Проверяет сериализованное состояние перед созданием инстанса. Возвращает метод, востанавливающий состояние объекта после создания инстанса.
       * @param {Object} state Cостояние
       * @return {Function|undefined}
       * @protected
       */
      _setSerializableState: function(state) {
         state.$options = state.$options || {};
         return function() {};
      },

      /**
       * Возвращает уникальный номер инстанса
       * @return {Number}
       * @protected
       */
      _getInstanceId: function() {
         return this._instanceNumber || (this._instanceNumber = ++_instanceCounter);
      }

      //endregion Protected methods
   };

   var _instanceCounter = 0,
      _protoSupported = typeof ({}).__proto__ === 'object';

   return SerializableMixin;
});
