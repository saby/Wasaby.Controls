/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.SerializableMixin', [
   'js!SBIS3.CONTROLS.Data.Utils'
], function (Utils) {
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
         this._checkModuleName(true, true);

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
         instance = new this(data.state.$options);
         if (initializer) {
            initializer.call(instance);
         }
         return instance;
      },

      //endregion Public methods

      //region Protected methods

      /**
       * Добавляет в метод extend() модуля проверку на установку значения свойства _moduleName
       * @param {Function} module Модуль
       * @protected
       * @static
       */
      _checkExtender: function(module) {
         module.extend = module.extend.callBefore(function() {
            var extender = arguments[0];
            if (extender instanceof Array) {
               extender = arguments[1];
            }
            SerializableMixin._checkModuleName.call(extender || {});
         });
      },

      /**
       * Проверяет, что в прототипе указано имя модуля для requirejs, иначе не будет работать десериализация
       * @param {Boolean} critical Отсутствие имени модуля критично
       * @param {Boolean} isInstance Проверка вызвана на экземпляре класса (в противном случае - на прототипе)
       * @protected
       */
      _checkModuleName: function(critical, isInstance) {
         var proto = this;
         if (!proto._moduleName) {
            SerializableMixin._createModuleNameError('Property "_moduleName" with module name for requirejs is not defined in a prototype', critical);
         }
         //TODO: переделать на Object.getPrototypeOf(this), после перевода на $ws.single.simpleExtender::extend()
         if (isInstance) {
            if (!_protoSupported) {
               return;
            }
            proto = this.__proto__;
         }
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
       * @returns {Object}
       * @protected
       */
      _getSerializableState: function(state) {
         state = state || {};
         state.$options = this._getOptions ? this._getOptions() : {};
         //FIXME: отказаться от устаревших _options
         if (this._options) {
            $ws.core.merge(state.$options, this._options, {preferSource: true});
         }
         return state;
      },

      /**
       * Проверяет сериализованное состояние перед созданием инстанса. Возвращает метод, востанавливающий состояние объекта после создания инстанса.
       * @param {Object} state Cостояние
       * @returns {Function|undefined}
       * @protected
       */
      _setSerializableState: function(state) {
         state.$options = state.$options || {};
         return function() {};
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

   var _instanceCounter = 0,
      _protoSupported = typeof ({}).__proto__ === 'object';

   return SerializableMixin;
});
